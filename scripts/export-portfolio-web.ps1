$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

Push-Location $root
try {
  $env:EXPO_PUBLIC_API_BASE_URL = "/api-proxy"
  $env:EXPO_PUBLIC_ENABLE_DEV_ROLE_SWITCH = "false"
  $env:EXPO_PUBLIC_ENABLE_DEV_FALLBACK_DATA = "false"

  .\node_modules\.bin\expo.cmd export -p web
} finally {
  Pop-Location
}
