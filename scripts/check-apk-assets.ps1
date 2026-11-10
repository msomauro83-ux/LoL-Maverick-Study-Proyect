param([string]$ApkPath)
$ErrorActionPreference='Stop'
$project=Split-Path $PSScriptRoot -Parent
if (!$ApkPath) { $ApkPath=Join-Path $project 'release\LoL-Maverick-Study-Proyect.apk' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip=[IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $ApkPath).Path)
$webRoot=(Resolve-Path -LiteralPath (Join-Path $project 'dist')).Path
try {
  $malformed=@($zip.Entries | Where-Object { $_.FullName.Contains('\') })
  if ($malformed.Count) { throw "APK invalido: $($malformed.Count) rutas contienen separadores de Windows. Ejemplo: $($malformed[0].FullName)" }
  $files=@(Get-ChildItem -LiteralPath $webRoot -File -Recurse)
  $images=0
  foreach ($file in $files) {
    $relative=$file.FullName.Substring($webRoot.Length+1).Replace('\','/')
    $name='assets/'+$relative
    $entry=$zip.GetEntry($name)
    if (!$entry) { throw "Recurso no accesible desde Android: $name" }
    $stream=$entry.Open()
    $sha=[Security.Cryptography.SHA256]::Create()
    try { $actual=[BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-','') }
    finally { $sha.Dispose();$stream.Dispose() }
    $expected=(Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
    if ($actual -ne $expected) { throw "Contenido incorrecto en APK: $name" }
    if ($file.Extension -in @('.jpg','.png','.svg')) { $images++ }
  }
  Write-Output "OK: $($files.Count) recursos del APK accesibles por su ruta Android y con contenido identico; $images imagenes."
} finally { $zip.Dispose() }
