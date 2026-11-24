# Decision log — Antigravity and Gemini skill and policy support

Date: 2026-11-24 (updated from 2026-11-23) · Plan: [docs/plans/2026-11-23-antigravity-gemini-skill-support.md](../plans/2026-11-23-antigravity-gemini-skill-support.md)

## Decisions

| ID | Question | Choice | Rationale / tradeoff | Provenance |
|---|---|---|---|---|
| D-01 | Trigger flag for vendor compatibility | Bundle under `--compat`: for `--user --compat`, sync skills to `~/.gemini/config/skills` (Antigravity) and generate `~/.gemini/commands/<skill>.toml` (Gemini CLI `/` slash commands); for `--repo --compat`, generate `<repo>/.gemini/commands/<skill>.toml` | Keeps default installs clean and vendor-neutral (`~/.agents` and `.agents`). Verified against Antigravity 2.0 (`~/.gemini/config/skills/<name>/SKILL.md`) and `@google/gemini-cli@0.70.0` | User confirmed, 2026-11-23 & 2026-11-24 |
| D-02 | Policy file generation (`GEMINI.md`) | Write `~/.gemini/GEMINI.md` on `--user` (always mirroring `AGENTS.md` policy); for `--repo`, write `GEMINI.md` only when `--repo --compat` is passed | Antigravity natively discovers `AGENTS.md` in repos, while Gemini CLI reads `GEMINI.md`. Writing `~/.gemini/GEMINI.md` globally gives both tools immediate access to the policy | User confirmed, 2026-11-23 |
| D-03 | Technology and dependencies | Pure Node built-ins (`node:fs`, `node:path`), zero new dependencies | Preserves repository simplicity contract and zero-runtime-dependency invariant | Repository constraint |
| D-04 | Gemini CLI skill discovery vs `/` slash commands | Do not duplicate `SKILL.md` into `.gemini/skills`; generate `.gemini/commands/<skill>.toml` wrappers instead | `@google/gemini-cli@0.70.0` `SkillManager` already loads `~/.agents/skills` and `.agents/skills` natively (duplicating `.gemini/skills` emits 14 `Skill conflict detected` warnings), while `CommandService` only exposes `/` slash commands from `.gemini/commands/*.toml` (`FileCommandLoader`) | Diagnosed & user confirmed, 2026-11-24 |

### Assumptions & Findings

- **A-01** `bin/install.mjs` creates parent directories recursively via `ensureDir`.
- **A-02** `AGENTS.md` word count must stay $\le 800$ words per `test/skills.test.mjs`.
- **F-01** Antigravity 2.0 migrated global customizations from legacy `~/.gemini/antigravity/` to `~/.gemini/config/`, discovering global skills at `~/.gemini/config/skills/<name>/SKILL.md` (verified in built-in `agy-customizations`, `migrate-workflows`, and `plugin` docs).
- **F-02** `@google/gemini-cli@0.70.0` `FileCommandLoader` validates `.toml` command files against `{ prompt: string, description?: string }` and uses `DefaultArgumentProcessor` when `{{args}}`, `!{`, and `@{` are absent.
