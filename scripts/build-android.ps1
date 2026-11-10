$ErrorActionPreference='Stop'
$project=Split-Path $PSScriptRoot -Parent
$tools=Join-Path $project '.tools'
$build=Join-Path $project 'build'
$release=Join-Path $project 'release'
$jdk=(Get-ChildItem -LiteralPath (Join-Path $tools 'jdk') -Directory | Select-Object -First 1).FullName
$bt=(Get-ChildItem -LiteralPath (Join-Path $tools 'build-tools') -Directory | Select-Object -First 1).FullName
$platform=(Get-ChildItem -LiteralPath (Join-Path $tools 'platform') -Directory | Select-Object -First 1).FullName
if (!$jdk -or !$bt -or !$platform) { throw 'Ejecuta scripts/download-android-tools.ps1 antes de compilar.' }
foreach ($dir in @($build,$release,(Join-Path $build 'classes'),(Join-Path $build 'dex'))) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
function Run-Checked($exe, $arguments) {
  & $exe @arguments
  if ($LASTEXITCODE -ne 0) { throw "Fallo al ejecutar $exe (codigo $LASTEXITCODE)" }
}
$aapt=Join-Path $bt 'aapt2.exe'
$androidJar=Join-Path $platform 'android.jar'
$compiled=Join-Path $build 'resources.zip'
$unsigned=Join-Path $build 'unsigned.apk'
$aligned=Join-Path $build 'aligned.apk'
$apk=Join-Path $release 'LoL-Maverick-Study-Proyect.apk'
Run-Checked $aapt @('compile','--dir',(Join-Path $project 'android\res'),'-o',$compiled)
Run-Checked $aapt @('link','-o',$unsigned,'-I',$androidJar,'--manifest',(Join-Path $project 'android\AndroidManifest.xml'),'-A',(Join-Path $project 'dist'),$compiled,'--auto-add-overlay')
$sources=@(Get-ChildItem -LiteralPath (Join-Path $project 'android\src') -Recurse -Filter '*.java' | ForEach-Object FullName)
Run-Checked (Join-Path $jdk 'bin\javac.exe') (@('-encoding','UTF-8','-source','8','-target','8','-classpath',$androidJar,'-d',(Join-Path $build 'classes'))+$sources)
$classesJar=Join-Path $build 'classes.jar'
Run-Checked (Join-Path $jdk 'bin\jar.exe') @('cf',$classesJar,'-C',(Join-Path $build 'classes'),'.')
Run-Checked (Join-Path $jdk 'bin\java.exe') @('-cp',(Join-Path $bt 'lib\d8.jar'),'com.android.tools.r8.D8','--min-api','26','--lib',$androidJar,'--output',(Join-Path $build 'dex'),$classesJar)
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$zip=[System.IO.Compression.ZipFile]::Open($unsigned,[System.IO.Compression.ZipArchiveMode]::Update)
try {
  # AAPT2 on Windows can place backslashes inside nested asset ZIP names.
  # Android's AssetManager and WebView resolve slash-separated asset paths.
  foreach ($entry in @($zip.Entries)) {
    if (!$entry.FullName.Contains('\')) { continue }
    $normalized=$entry.FullName.Replace('\','/')
    if ($zip.GetEntry($normalized)) { throw "Ruta duplicada al normalizar: $normalized" }
    $replacement=$zip.CreateEntry($normalized,[System.IO.Compression.CompressionLevel]::Optimal)
    $replacement.LastWriteTime=$entry.LastWriteTime
    $source=$entry.Open()
    $target=$replacement.Open()
    try { $source.CopyTo($target) } finally { $source.Dispose();$target.Dispose() }
    $entry.Delete()
  }
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip,(Join-Path $build 'dex\classes.dex'),'classes.dex',[System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
} finally { $zip.Dispose() }
& (Join-Path $PSScriptRoot 'check-apk-assets.ps1') -ApkPath $unsigned
Run-Checked (Join-Path $bt 'zipalign.exe') @('-f','-p','4',$unsigned,$aligned)
$keystore=Join-Path $tools 'maverick-development.keystore'
if (!(Test-Path -LiteralPath $keystore)) {
  Run-Checked (Join-Path $jdk 'bin\keytool.exe') @('-genkeypair','-keystore',$keystore,'-storepass','android','-keypass','android','-alias','maverick-dev','-dname','CN=Maverick Study Development','-keyalg','RSA','-keysize','2048','-validity','3650','-noprompt')
}
Run-Checked (Join-Path $jdk 'bin\java.exe') @('-jar',(Join-Path $bt 'lib\apksigner.jar'),'sign','--ks',$keystore,'--ks-pass','pass:android','--key-pass','pass:android','--ks-key-alias','maverick-dev','--out',$apk,$aligned)
Run-Checked (Join-Path $jdk 'bin\java.exe') @('-jar',(Join-Path $bt 'lib\apksigner.jar'),'verify','--verbose',$apk)
& (Join-Path $PSScriptRoot 'check-apk-assets.ps1') -ApkPath $apk
Run-Checked (Join-Path $bt 'aapt.exe') @('dump','badging',$apk)
Get-Item -LiteralPath $apk | Select-Object FullName,Length
