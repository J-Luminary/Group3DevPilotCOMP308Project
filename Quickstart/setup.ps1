$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

Write-Host ""
Write-Host "=== DevPilot Setup ===" -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host ""

if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "winget is not installed on this machine." -ForegroundColor Red
    Write-Host "Open the Microsoft Store, search for 'App Installer', install it, then re-run setup.bat." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

function Refresh-Path {
    $machine = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    $user = [System.Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = "$machine;$user"
}

function Ensure-Tool {
    param(
        [string]$command,
        [string]$wingetId,
        [string]$displayName
    )
    if (Get-Command $command -ErrorAction SilentlyContinue) {
        Write-Host "[ok] $displayName already installed" -ForegroundColor Green
        return
    }
    Write-Host "[install] $displayName (this may take a few minutes)" -ForegroundColor Yellow
    try {
        winget install --id $wingetId --silent --accept-source-agreements --accept-package-agreements --disable-interactivity
    } catch {
        Write-Host "[warn] winget install for $displayName returned an error but may have succeeded. Continuing." -ForegroundColor Yellow
    }
    Refresh-Path
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        Write-Host "[fail] $displayName install did not complete. Re-run setup.bat or install manually from the vendor site." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[ok] $displayName installed" -ForegroundColor Green
}

Ensure-Tool -command "node" -wingetId "OpenJS.NodeJS.LTS" -displayName "Node.js LTS"
Ensure-Tool -command "git" -wingetId "Git.Git" -displayName "Git"
Ensure-Tool -command "mongod" -wingetId "MongoDB.Server" -displayName "MongoDB Community"

# mongo installs as a windows service; make sure it is started
$svc = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($svc) {
    if ($svc.Status -ne "Running") {
        Write-Host "[mongo] starting service..." -ForegroundColor Yellow
        try {
            Start-Service -Name MongoDB
            Write-Host "[ok] MongoDB service running" -ForegroundColor Green
        } catch {
            Write-Host "[warn] could not start MongoDB service automatically. Open an admin PowerShell and run: Start-Service MongoDB" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[ok] MongoDB service running" -ForegroundColor Green
    }
} else {
    Write-Host "[warn] MongoDB service not found. If mongod is on PATH you can still run it manually." -ForegroundColor Yellow
}

# verify .env exists at project root
$envPath = Join-Path $ProjectRoot ".env"
if (-not (Test-Path $envPath)) {
    Write-Host ""
    Write-Host "[!] .env not found at $envPath" -ForegroundColor Red
    Write-Host "    1. Ask Jordan in team chat for the .env contents" -ForegroundColor Yellow
    Write-Host "    2. Create a new file at the PROJECT ROOT called exactly .env" -ForegroundColor Yellow
    Write-Host "    3. Paste the values and save" -ForegroundColor Yellow
    Write-Host "    4. Re-run Quickstart\setup.bat" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[ok] .env file present" -ForegroundColor Green

Write-Host ""
Write-Host "[install] project dependencies (7 subprojects, takes a few minutes)..." -ForegroundColor Yellow
npm run install:all
if ($LASTEXITCODE -ne 0) {
    Write-Host "[fail] npm install:all exited with code $LASTEXITCODE" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "=== Setup complete! ===" -ForegroundColor Green
Write-Host "Next step: double-click Quickstart\launch.bat to start the app." -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to close this window"
