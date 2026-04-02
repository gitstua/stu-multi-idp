Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$msalBrowserSource = Join-Path $repoRoot "node_modules/@azure/msal-browser/dist"
$msalCommonSource = Join-Path $repoRoot "node_modules/@azure/msal-common/dist"
$msalBrowserTarget = Join-Path $repoRoot "vendor/@azure/msal-browser"
$msalCommonTarget = Join-Path $repoRoot "vendor/@azure/msal-common"
$msalBrowserDistTarget = Join-Path $msalBrowserTarget "dist"
$msalCommonDistTarget = Join-Path $msalCommonTarget "dist"

if (-not (Test-Path $msalBrowserSource)) {
  throw "Missing source path: $msalBrowserSource. Run npm install first."
}

if (-not (Test-Path $msalCommonSource)) {
  throw "Missing source path: $msalCommonSource. Run npm install first."
}

New-Item -ItemType Directory -Force -Path $msalBrowserTarget | Out-Null
New-Item -ItemType Directory -Force -Path $msalCommonTarget | Out-Null

if (Test-Path $msalBrowserDistTarget) {
  Remove-Item -LiteralPath $msalBrowserDistTarget -Recurse -Force
}

if (Test-Path $msalCommonDistTarget) {
  Remove-Item -LiteralPath $msalCommonDistTarget -Recurse -Force
}

Copy-Item -Recurse -Force $msalBrowserSource -Destination $msalBrowserTarget
Copy-Item -Recurse -Force $msalCommonSource -Destination $msalCommonTarget
