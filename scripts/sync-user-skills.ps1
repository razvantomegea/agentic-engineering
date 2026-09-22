# Shim: sync user-level skills via the Node installer (.agents-first).
# Usage:
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sync-user-skills.ps1
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sync-user-skills.ps1 -Compat
# Prefer: npx github:razvantomegea/agentic-engineering --user

param(
  [switch]$Compat
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Install = Join-Path $Root 'bin\install.mjs'

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error 'Node.js (>=18) is required. Install Node, then re-run, or use: npx github:razvantomegea/agentic-engineering --user'
}

$argsList = @($Install, '--user')
if ($Compat) {
  $argsList += '--compat'
}

& node @argsList
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
