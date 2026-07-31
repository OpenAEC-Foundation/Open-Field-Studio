# Capture screenshots of the running dev server via headless Edge (Chromium).
# Requires dev server on http://localhost:3042 and Microsoft Edge on Windows.
# Usage:  pwsh scripts/screenshot.ps1
# Output: docs/screenshots/*.png

# msedge writes debug lines to stderr — treat as non-fatal.
$ErrorActionPreference = 'Continue'
$outDir = Join-Path (Split-Path $PSScriptRoot -Parent) 'docs\screenshots'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe" }
if (-not (Test-Path $edge)) { throw "Microsoft Edge not found." }

$base = 'http://localhost:3042'
$size = '1440,900'

$shots = @(
  @{ file = '01-project.png';     url = "$base/screenshot-seed.html?state=project&tab=project" },
  @{ file = '02-koppelingen.png'; url = "$base/screenshot-seed.html?state=connectors&tab=koppelingen" },
  @{ file = '03-inspectie.png';   url = "$base/screenshot-seed.html?state=project&tab=inspectie" },
  @{ file = '04-oplevering.png';  url = "$base/screenshot-seed.html?state=project&tab=oplevering" },
  @{ file = '05-dashboard.png';   url = "$base/screenshot-seed.html?state=project&tab=dashboard" },
  @{ file = '06-export.png';      url = "$base/screenshot-seed.html?state=project&tab=export" }
)

foreach ($s in $shots) {
  $out = Join-Path $outDir $s.file
  Write-Host "Capturing $($s.file)..."
  # Redirect stderr to $null via cmd shim so PowerShell's error-strictness doesn't trip
  # on msedge's noisy debug output. We still surface missing PNGs below.
  cmd /c "`"$edge`" --headless=new --disable-gpu --hide-scrollbars --window-size=$size --virtual-time-budget=8000 `"--screenshot=$out`" `"$($s.url)`" 2>nul"
  Start-Sleep -Milliseconds 300
  if (-not (Test-Path $out)) { Write-Warning "Missing: $out" }
}

Write-Host "`nDone. Files in $outDir`:"
Get-ChildItem $outDir -Filter *.png | Select-Object Name, Length | Format-Table
