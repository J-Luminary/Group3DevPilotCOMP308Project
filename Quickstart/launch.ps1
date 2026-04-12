$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

Write-Host ""
Write-Host "=== DevPilot Launch ===" -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host ""

# quick sanity check
if (-not (Test-Path (Join-Path $ProjectRoot ".env"))) {
    Write-Host "[!] .env not found. Run Quickstart\setup.bat first, or create .env manually." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path (Join-Path $ProjectRoot "node_modules"))) {
    Write-Host "[!] node_modules missing. Run Quickstart\setup.bat first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# make sure mongo is up
$svc = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($svc -and $svc.Status -ne "Running") {
    Write-Host "[mongo] service is stopped, starting..." -ForegroundColor Yellow
    try {
        Start-Service -Name MongoDB
        Write-Host "[ok] MongoDB started" -ForegroundColor Green
    } catch {
        Write-Host "[warn] could not start MongoDB automatically. Run 'Start-Service MongoDB' from an admin PowerShell." -ForegroundColor Yellow
    }
} elseif ($svc) {
    Write-Host "[ok] MongoDB already running" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting 7 processes (4 backend + 3 frontend). First boot takes ~15 seconds." -ForegroundColor Cyan
Write-Host "When you see '[gateway] running on http://localhost:4000/graphql', open http://localhost:3000 in your browser." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop everything." -ForegroundColor Cyan
Write-Host ""

npm run start
