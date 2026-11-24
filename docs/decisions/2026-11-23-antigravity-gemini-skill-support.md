# Decision log — Antigravity and Gemini skill and policy support

Date: 2026-11-23 · Plan: [docs/plans/2026-11-23-antigravity-gemini-skill-support.md](../plans/2026-11-23-antigravity-gemini-skill-support.md)

## Decisions

| ID | Question | Choice | Rationale / tradeoff | Provenance |
|---|---|---|---|---|
| D-01 | Trigger flag for skill copying | Bundle under `--compat`: for `--user --compat`, sync skills to `~/.gemini/antigravity/skills` and `~/.gemini/skills`; for `--repo --compat`, sync to `.gemini/skills` | Keeps the default install clean and vendor-neutral (`~/.agents` and `.agents`), matching the existing `--compat` pattern for Claude Code and Cursor. Tradeoff: requires passing `--compat` to mirror to Antigravity and Gemini CLI | User confirmed via structured question tool, 2026-11-23 |
| D-02 | Policy file generation (`GEMINI.md`) | Write `~/.gemini/GEMINI.md` on `--user` (always mirroring `AGENTS.md` policy); for `--repo`, write `GEMINI.md` only when `--repo --compat` is passed | Antigravity natively discovers `AGENTS.md` in repos, but Gemini CLI looks for `GEMINI.md`. Writing `~/.gemini/GEMINI.md` globally gives both tools immediate access to the policy, matching Codex (`~/.codex/AGENTS.md`) and Claude (`~/.claude/CLAUDE.md`) | User confirmed via structured question tool, 2026-11-23 |
| D-03 | Technology and dependencies | Pure Node built-ins (`node:fs`, `node:path`), zero new dependencies | Preserves repository simplicity contract and zero-runtime-dependency invariant | Repository constraint |

### Assumptions

- **A-01** `bin/install.mjs` handles directory creation recursively via `ensureDir` / `syncSkills`, so missing `~/.gemini` subfolders are created safely.
- **A-02** Antigravity and Gemini CLI read markdown files natively without requiring conversion of `SKILL.md` frontmatter or body.
- **A-03** `AGENTS.md` word count must stay $\le 800$ words per `test/skills.test.mjs`.
