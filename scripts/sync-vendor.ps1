Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$msalBrowserSource = Join-Path $repoRoot "node_modules/@azure/msal-browser/dist"
$msalCommonSource = Join-Path $repoRoot "node_modules/@azure/msal-common/dist"
$msalCommonBrowserSource = Join-Path $repoRoot "node_modules/@azure/msal-common/dist-browser"
$msalBrowserTarget = Join-Path $repoRoot "vendor/@azure/msal-browser"
$msalCommonTarget = Join-Path $repoRoot "vendor/@azure/msal-common"

if (-not (Test-Path $msalBrowserSource)) {
  throw "Missing source path: $msalBrowserSource. Run npm install first."
}

if (-not (Test-Path $msalCommonSource)) {
  throw "Missing source path: $msalCommonSource. Run npm install first."
}

if (-not (Test-Path $msalCommonBrowserSource)) {
  throw "Missing source path: $msalCommonBrowserSource. Run npm install first."
}

New-Item -ItemType Directory -Force -Path $msalBrowserTarget | Out-Null
New-Item -ItemType Directory -Force -Path $msalCommonTarget | Out-Null

Copy-Item -Recurse -Force $msalBrowserSource -Destination $msalBrowserTarget
Copy-Item -Recurse -Force $msalCommonSource -Destination $msalCommonTarget
Copy-Item -Recurse -Force $msalCommonBrowserSource -Destination $msalCommonTarget
