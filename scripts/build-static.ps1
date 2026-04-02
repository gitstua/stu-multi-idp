Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot

& (Join-Path $PSScriptRoot "sync-vendor.ps1")

$distPath = Join-Path $repoRoot "dist"
if (Test-Path $distPath) {
  $oldDistPath = Join-Path $repoRoot ("dist.__old__." + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())
  Move-Item -LiteralPath $distPath -Destination $oldDistPath -Force
  try {
    Remove-Item -LiteralPath $oldDistPath -Recurse -Force -ErrorAction SilentlyContinue
  } catch {
    # Best-effort cleanup only; keep build path unblocked.
  }
}

$distAuthPath = Join-Path $distPath "src/auth"
$distStorePath = Join-Path $distPath "src/store"
$distMsalBrowserPath = Join-Path $distPath "vendor/@azure/msal-browser"
$distMsalCommonPath = Join-Path $distPath "vendor/@azure/msal-common"
$distMsalCommonBrowserPath = Join-Path $distMsalCommonPath "dist-browser"

New-Item -ItemType Directory -Force -Path $distAuthPath | Out-Null
New-Item -ItemType Directory -Force -Path $distStorePath | Out-Null
New-Item -ItemType Directory -Force -Path $distMsalBrowserPath | Out-Null
New-Item -ItemType Directory -Force -Path $distMsalCommonPath | Out-Null
New-Item -ItemType Directory -Force -Path $distMsalCommonBrowserPath | Out-Null

Copy-Item -Force (Join-Path $repoRoot "index.html") (Join-Path $distPath "index.html")
Copy-Item -Force (Join-Path $repoRoot "src/main.js") (Join-Path $distPath "src/main.js")
Copy-Item -Force (Join-Path $repoRoot "src/style.css") (Join-Path $distPath "src/style.css")
Copy-Item -Force (Join-Path $repoRoot "src/app-config.js") (Join-Path $distPath "src/app-config.js")
Copy-Item -Force (Join-Path $repoRoot "src/auth/config.js") (Join-Path $distPath "src/auth/config.js")
Copy-Item -Force (Join-Path $repoRoot "src/auth/service.js") (Join-Path $distPath "src/auth/service.js")
Copy-Item -Force (Join-Path $repoRoot "src/auth/msalClients.js") (Join-Path $distPath "src/auth/msalClients.js")
Copy-Item -Force (Join-Path $repoRoot "src/store/auth.js") (Join-Path $distPath "src/store/auth.js")

Copy-Item -Recurse -Force (Join-Path $repoRoot "vendor/@azure/msal-browser/dist") $distMsalBrowserPath
Copy-Item -Recurse -Force (Join-Path $repoRoot "vendor/@azure/msal-common/dist") $distMsalCommonPath
Copy-Item -Recurse -Force (Join-Path $repoRoot "vendor/@azure/msal-common/dist-browser") $distMsalCommonPath
