$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$project = Split-Path $PSScriptRoot -Parent
$toolRoot = Join-Path $project '.tools'
New-Item -ItemType Directory -Path $toolRoot -Force | Out-Null
function Get-Archive($url, $name, $destination) {
  if (Test-Path -LiteralPath $destination) { return }
  $archive = Join-Path $toolRoot $name
  if (!(Test-Path -LiteralPath $archive)) { Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $archive }
  if (!(Test-Path -LiteralPath $destination)) { Expand-Archive -LiteralPath $archive -DestinationPath $destination }
}
$repo = Invoke-WebRequest -UseBasicParsing -Uri 'https://dl.google.com/android/repository/repository2-3.xml'
[xml]$xml = $repo.Content
$packages = $xml.SelectNodes('//*[local-name()="remotePackage"]')
foreach ($entry in @(@{Id='build-tools;35.0.0';Folder='build-tools'}, @{Id='platforms;android-35';Folder='platform'})) {
  $package = $packages | Where-Object { $_.path -eq $entry.Id } | Select-Object -First 1
  if (!$package) { throw "No se encuentra $($entry.Id) en el repositorio oficial de Android" }
  $archives = $package.SelectNodes('.//*[local-name()="archive"]')
  $chosen = $archives | Where-Object { !$_.SelectSingleNode('./*[local-name()="host-os"]') -or $_.SelectSingleNode('./*[local-name()="host-os"]').InnerText -eq 'windows' } | Select-Object -First 1
  $url = $chosen.SelectSingleNode('.//*[local-name()="complete"]/*[local-name()="url"]').InnerText
  Get-Archive ('https://dl.google.com/android/repository/' + $url) ($entry.Folder + '.zip') (Join-Path $toolRoot $entry.Folder)
  Write-Output "Disponible: $($entry.Id)"
}
Get-Archive 'https://aka.ms/download-jdk/microsoft-jdk-17-windows-x64.zip' 'jdk17.zip' (Join-Path $toolRoot 'jdk')
Write-Output 'Herramientas Android y JDK disponibles.'
