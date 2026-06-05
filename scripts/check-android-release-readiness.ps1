$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$appJsonPath = Join-Path $root "app.json"
$easJsonPath = Join-Path $root "eas.json"
$gradlePropertiesPath = Join-Path $root "android\gradle.properties"

if (-not (Test-Path $appJsonPath)) {
  throw "app.json not found."
}

if (-not (Test-Path $easJsonPath)) {
  throw "eas.json not found."
}

if (-not (Test-Path $gradlePropertiesPath)) {
  throw "android/gradle.properties not found."
}

$appJson = Get-Content -Raw $appJsonPath | ConvertFrom-Json
$easJson = Get-Content -Raw $easJsonPath | ConvertFrom-Json
$gradlePropertiesLines = Get-Content $gradlePropertiesPath

function Get-GradlePropertyValue {
  param(
    [string]$Name
  )

  $line = $gradlePropertiesLines | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
  if (-not $line) {
    return $null
  }

  return $line.Substring($Name.Length + 1).Trim()
}

$expoPackage = $appJson.expo.android.package
$gradleApplicationId = Get-GradlePropertyValue -Name "WINWIN_ANDROID_APPLICATION_ID"
$gradleVersionCode = Get-GradlePropertyValue -Name "WINWIN_ANDROID_VERSION_CODE"
$gradleVersionName = Get-GradlePropertyValue -Name "WINWIN_ANDROID_VERSION_NAME"
$apiBaseUrl = $env:EXPO_PUBLIC_API_BASE_URL

Write-Host "Checking Android release metadata..." -ForegroundColor Cyan

if ([string]::IsNullOrWhiteSpace($expoPackage)) {
  throw "app.json expo.android.package is empty."
}

if ([string]::IsNullOrWhiteSpace($gradleApplicationId)) {
  throw "WINWIN_ANDROID_APPLICATION_ID is missing in android/gradle.properties."
}

if ($expoPackage -ne $gradleApplicationId) {
  throw "Android package mismatch: app.json=$expoPackage, gradle.properties=$gradleApplicationId"
}

if ([string]::IsNullOrWhiteSpace($gradleVersionCode) -or -not ($gradleVersionCode -as [int])) {
  throw "WINWIN_ANDROID_VERSION_CODE must be a positive integer."
}

if ([int]$gradleVersionCode -lt 1) {
  throw "WINWIN_ANDROID_VERSION_CODE must be >= 1."
}

if ([string]::IsNullOrWhiteSpace($gradleVersionName)) {
  throw "WINWIN_ANDROID_VERSION_NAME is missing in android/gradle.properties."
}

if (-not $easJson.build.production) {
  throw "eas.json build.production profile is missing."
}

if (-not $easJson.submit.production) {
  throw "eas.json submit.production profile is missing."
}

if ([string]::IsNullOrWhiteSpace($apiBaseUrl)) {
  Write-Warning "EXPO_PUBLIC_API_BASE_URL is not set in the current shell. Production build should set it before EAS build."
}

if ($gradleApplicationId -like "com.zentropy_dev.*") {
  Write-Warning "Current Android package is still '$gradleApplicationId'. Confirm this is the final Play Store package name before first upload."
}

Write-Host "Android release metadata passed." -ForegroundColor Green
Write-Host ""
Write-Host "Android release snapshot" -ForegroundColor Yellow
Write-Host "  applicationId: $gradleApplicationId"
Write-Host "  versionCode: $gradleVersionCode"
Write-Host "  versionName: $gradleVersionName"
Write-Host "  eas build profile: production"
Write-Host "  eas submit profile: production"
