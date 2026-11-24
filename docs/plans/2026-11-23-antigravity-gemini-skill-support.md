# Implementation plan — Antigravity and Gemini skill and policy support

Level: L2 · Status: ACCEPTED · Revision: 2 · Baseline: `acee6eabe3dccd4569f8ec11988c3a5a4a7f6f34` (branch `feat/antigravity-gemini-skill-support`, 2026-11-24)
Decisions: [docs/decisions/2026-11-23-antigravity-gemini-skill-support.md](../decisions/2026-11-23-antigravity-gemini-skill-support.md)

# Part A — Why

## 1. Outcome, scope, and risks

Add support for Google Antigravity and Gemini CLI when syncing skills and writing policy files via `bin/install.mjs`. Revision 2 incorporates root-cause verification against Antigravity 2.0 (`~/.gemini/config/skills/`) and installed `@google/gemini-cli@0.70.0` (`SkillManager` native `.agents/skills` loading + `FileCommandLoader` `.gemini/commands/*.toml` slash-command registration).

### Requirements

- **R-01**: When `bin/install.mjs --user --compat` is executed, skills are mirrored to `~/.gemini/config/skills` (Antigravity 2.0 global skills root) in addition to `~/.claude/skills` and `~/.cursor/skills`, and `.toml` slash-command wrappers are written to `~/.gemini/commands/<name>.toml` (Gemini CLI `/` menu). Duplicate `~/.gemini/skills` copies are not written.
- **R-02**: When `bin/install.mjs --user` is executed (with or without `--compat`), `~/.gemini/GEMINI.md` is written with the rewritten user policy (mirroring `~/.agents/AGENTS.md` and `~/.codex/AGENTS.md`).
- **R-03**: When `bin/install.mjs --repo <path> --compat` is executed, skills are mirrored to `<path>/.claude/skills`, `.toml` slash-command wrappers are written to `<path>/.gemini/commands/<name>.toml`, and `<path>/GEMINI.md` is written with the rewritten repo policy. Duplicate `<path>/.gemini/skills` copies are not written.
- **R-04**: When `--compat` is omitted, the CLI note informs the user that Claude Code, Cursor Cloud sync, Antigravity global skills, and Gemini CLI `/` commands need `--compat`.
- **R-05**: `usage()` and `-h` / `--help` output documents Antigravity and Gemini CLI under `--compat`.
- **R-06**: `README.md` and `AGENTS.md` document `~/.gemini/config/skills`, `.gemini/commands/*.toml`, and `GEMINI.md` while keeping `AGENTS.md` $\le 800$ words.
- **R-07**: Integration tests in `test/install.test.mjs` verify `~/.gemini/config/skills`, `~/.gemini/commands/<skill>.toml`, `<repo>/.gemini/commands/<skill>.toml`, `GEMINI.md`, and the absence of duplicate `.gemini/skills`.

### Preserve

- Default `--user` and `--repo` behavior without `--compat` installs skills only to canonical `.agents` roots (which Codex, Cursor, workspace Antigravity, and Gemini CLI `SkillManager` read natively).
- Existing `--compat` mirroring for Claude Code and Cursor remains intact.
- Zero runtime dependencies in `package.json`.
- Word count of `AGENTS.md` stays $\le 800$ words.

### Non-goals

- Modifying skill instructions inside `.agents/skills/`.
- Generating Antigravity plugin manifests (`plugin.json`).

### Constraints and Risks

- Constraints: Cross-platform paths, valid TOML v1 basic strings (`{ description, prompt }`) without `!{`, `@{`, or `{{args}}` injection triggers, zero external dependencies.
- Risks: Local reversible file generation only.

## 2. Before → after

- **Before (Rev 1 defect):** `--user --compat` wrote `~/.gemini/antigravity/skills` (ignored by Antigravity 2.0, which migrated to `~/.gemini/config/skills`) and `~/.gemini/skills` (causing 14 `Skill conflict detected` warnings in Gemini CLI 0.70.0 while still not registering `/<skill>` in Gemini CLI's `/` menu).
- **After (Rev 2):** `--user --compat` writes `~/.gemini/config/skills/<name>/SKILL.md` for Antigravity global discovery and `~/.gemini/commands/<name>.toml` so `/<skill>` appears in Gemini CLI's `/` menu while `SkillManager` loads `~/.agents/skills` cleanly without conflicts. `--repo --compat` writes `<repo>/.gemini/commands/<name>.toml` and `<repo>/GEMINI.md`.
- **Behavioral home:** `bin/install.mjs` (`installUser`, `installRepo`, `syncGeminiCommands`, `readSkillDescription`).

## 3. Decisions

See [docs/decisions/2026-11-23-antigravity-gemini-skill-support.md](../decisions/2026-11-23-antigravity-gemini-skill-support.md) (`D-01`–`D-04`).

### OPEN QUESTIONS

None.

## 4. Contracts

### C-01: Gemini CLI TOML command file (`<commandsRoot>/<name>.toml`)

```toml
description = "<frontmatter description>"
prompt = "Activate and follow the `<name>` skill (call `activate_skill` with `name: \"<name>\"`, or read `<skillsHint>/<name>/SKILL.md`) for this request."
```

- Validated against `@google/gemini-cli@0.70.0` `TomlCommandDefSchema` (`{ prompt: string, description?: string }`).
- Contains no `{{args}}`, `!{`, or `@{` triggers so Gemini CLI attaches `DefaultArgumentProcessor` (appending user arguments after `\n\n` when supplied).

### C-02: `installUser` & `installRepo` `--compat` targets

- `installUser({ compat: true })`:
  - `~/.claude/skills`
  - `~/.cursor/skills`
  - `~/.gemini/config/skills`
  - `~/.gemini/commands/<name>.toml`
- `installRepo(repoPath, { compat: true })`:
  - `<repo>/.claude/skills`
  - `<repo>/.gemini/commands/<name>.toml`
  - `<repo>/GEMINI.md`

# Part B — Do

## 5. Baseline and preflight

- Branch: `feat/antigravity-gemini-skill-support`
- Commands: `npm test` (`node --test test/install.test.mjs test/skills.test.mjs`)

## 6. Steps

- **S-01 (`R-01`–`R-05`, `C-01`, `C-02`)**: Edit `bin/install.mjs` to add `readSkillDescription` and `syncGeminiCommands`, switch Antigravity user sync target to `~/.gemini/config/skills`, replace duplicate `.gemini/skills` syncs with `syncGeminiCommands` in `installUser` and `installRepo`, and update non-compat hints.
- **S-02 (`R-07`)**: Update compat tests in `test/install.test.mjs` to assert `~/.gemini/config/skills`, `~/.gemini/commands/ship-change.toml`, `<project>/.gemini/commands/ship-change.toml`, valid TOML `description`/`prompt` fields, and absence of `.gemini/skills`.
- **S-03 (`R-06`)**: Update `README.md` `--compat` documentation to reflect `~/.gemini/config/skills` and `.gemini/commands/*.toml`.

## 7. Verification matrix

| R / invariant | Scenario | Expected | Command |
|---|---|---|---|
| R-01, R-02, R-07 | `--user --compat` in isolated `HOME` | `~/.gemini/config/skills/ship-change/SKILL.md`, `~/.gemini/commands/ship-change.toml`, and `~/.gemini/GEMINI.md` exist; `~/.gemini/skills` does not exist; `gemini skills list` reports 14 enabled skills with zero conflict warnings | `node --test --test-name-pattern="compat" test/install.test.mjs` + Gemini CLI smoke check |
| R-03, R-07 | `--repo <dir> --compat` | `<dir>/.gemini/commands/ship-change.toml` and `<dir>/GEMINI.md` exist; `<dir>/.gemini/skills` does not exist | `node --test --test-name-pattern="compat" test/install.test.mjs` |
| R-06 | Skill & policy lint | All 6 checks pass, `AGENTS.md` $\le 800$ words | `node --test test/skills.test.mjs` |

## 8. Stop conditions

Stop if generated `.toml` files fail `@google/gemini-cli`'s TOML parser, if `gemini skills list` emits conflict warnings, or if `AGENTS.md` exceeds 800 words.
