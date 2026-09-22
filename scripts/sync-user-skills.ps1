# Sync agents-workflows skills + AGENTS.md to user-level Cursor, Claude, Codex.
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sync-user-skills.ps1

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$SkillsSrc = Join-Path $Root '.agents\skills'

$Skills = @(
  'engineering-copilot',
  'explore-system',
  'plan-change',
  'implement-change',
  'diagnose-bug',
  'review-change',
  'engineering-handoff',
  'ship-change',
  'audit-agent-setup',
  'architecture-picture',
  'frontend-interview-drill',
  'tutor-me'
)

$Targets = @(
  (Join-Path $env:USERPROFILE '.cursor\skills'),
  (Join-Path $env:USERPROFILE '.claude\skills'),
  (Join-Path $env:USERPROFILE '.codex\skills')
)

foreach ($Name in $Skills) {
  $src = Join-Path $SkillsSrc $Name
  if (-not (Test-Path $src)) {
    Write-Warning "Missing skill source: $src"
    continue
  }
  foreach ($destRoot in $Targets) {
    New-Item -ItemType Directory -Force -Path $destRoot | Out-Null
    $dest = Join-Path $destRoot $Name
    if (Test-Path $dest) {
      Remove-Item -Recurse -Force $dest
    }
    Copy-Item -Recurse -Force $src $dest
    Write-Host "Synced $Name -> $dest"
  }
}

$AgentsSrc = Join-Path $Root 'AGENTS.md'
Copy-Item -Force $AgentsSrc 'C:\Projects\AGENTS.md'
Write-Host 'Synced AGENTS.md -> C:\Projects\AGENTS.md'

$CodexAgents = Join-Path $env:USERPROFILE '.codex\AGENTS.md'
Copy-Item -Force $AgentsSrc $CodexAgents
Write-Host "Synced AGENTS.md -> $CodexAgents"

$ClaudeMd = Join-Path $env:USERPROFILE '.claude\CLAUDE.md'
@'
# CLAUDE.md

User-level always-on for Claude Code. Canonical policy: `C:\Projects\agents-workflows\AGENTS.md` (also `C:\Projects\AGENTS.md`, `%USERPROFILE%\.codex\AGENTS.md`).

## Principle

Agents may do the work, but I must retain ownership of the mental model.

I am allowed not to write the code.
I am not allowed not to understand the system.

When I'm confused, don't immediately solve the problem for me. First help me build the smallest mental model necessary to reason about it.

## Roles

- Claude Opus: exploration, architecture, planning (`explore-system`, `plan-change`)
- Cursor: implementation and debugging (`implement-change`, `diagnose-bug`)
- Codex: independent review (`review-change`)
- After ship: `engineering-handoff` (explain, then quiz)

## Skills

On-demand under `~/.claude/skills/`. If unsure which skill applies, start with `engineering-copilot`. Prefer `ship-change` for meaningful work. Do not load every skill into context.

## Hard rules

- No secrets / `.env` reads
- No destructive git/data/auth/migration/architecture changes unless explicitly requested
- Prefer repository inspection over assumption dumps
- Never claim verification that was not run
- Do not interrupt trivial (L0) changes with full process

Product repo README / `docs/` / `docs/adr/` win for local facts.
'@ | Set-Content -Path $ClaudeMd -Encoding utf8
Write-Host "Wrote $ClaudeMd"
Write-Host 'Done.'
