$ErrorActionPreference='Stop'
$project=$PSScriptRoot
$node=Get-Command node -ErrorAction SilentlyContinue
if ($node) { $runtime=$node.Source } else {
  $runtime=Join-Path $env:LOCALAPPDATA 'Programs\Microsoft VS Code\Code.exe'
  if (!(Test-Path -LiteralPath $runtime)) { throw 'Instala Node.js para abrir el servidor local, o abre dist/index.html directamente.' }
  $env:ELECTRON_RUN_AS_NODE='1'
}
$ready=$false
try { $ready=(Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4173' -TimeoutSec 1).StatusCode -eq 200 } catch {}
if (!$ready) { Start-Process -FilePath $runtime -ArgumentList 'scripts/serve.mjs' -WorkingDirectory $project -WindowStyle Hidden | Out-Null; Start-Sleep -Seconds 1 }
Start-Process 'http://127.0.0.1:4173'
