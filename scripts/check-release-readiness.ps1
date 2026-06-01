$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$backendUrl = if ($env:WINWIN_BACKEND_URL) { $env:WINWIN_BACKEND_URL } else { "http://localhost:8080" }
$healthUrl = "$backendUrl/api/health"

Write-Host "Checking frontend type safety..." -ForegroundColor Cyan
Push-Location $root
try {
  .\node_modules\.bin\tsc.cmd --noEmit | Out-Null
  Write-Host "Frontend typecheck passed." -ForegroundColor Green
} finally {
  Pop-Location
}

Write-Host "Checking backend test suite..." -ForegroundColor Cyan
Push-Location (Join-Path $root "backend")
try {
  .\mvnw.cmd test | Out-Null
  Write-Host "Backend tests passed." -ForegroundColor Green
} finally {
  Pop-Location
}

Write-Host "Checking backend health endpoint..." -ForegroundColor Cyan
$health = Invoke-RestMethod -Uri $healthUrl -Method Get

if ($health.service -ne "winwin-backend") {
  throw "Unexpected health service value: $($health.service)"
}

if (-not $health.uploadDirectoryReady) {
  throw "Upload directory is not ready: $($health.uploadDirectory)"
}

Write-Host "Health endpoint passed." -ForegroundColor Green
Write-Host ""
Write-Host "Release readiness snapshot" -ForegroundColor Yellow
Write-Host "  status: $($health.status)"
Write-Host "  environment: $($health.environment)"
Write-Host "  uploadDirectory: $($health.uploadDirectory)"
Write-Host ""
Write-Host "Manual QA still required:" -ForegroundColor Yellow
Write-Host "  1. customer signup/login -> chat -> image -> desired schedules"
Write-Host "  2. partner signup/login -> consultation list -> booking request -> close"
Write-Host "  3. confirm uploaded images are still visible after app restart"
