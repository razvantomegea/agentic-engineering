# Implementation plan — Antigravity and Gemini skill and policy support

Level: L2 · Status: ACCEPTED · Revision: 1 · Baseline: `acee6eabe3dccd4569f8ec11988c3a5a4a7f6f34` (branch `main`, clean, 2026-11-23)
Decisions: [docs/decisions/2026-11-23-antigravity-gemini-skill-support.md](../decisions/2026-11-23-antigravity-gemini-skill-support.md)

# Part A — Why

## 1. Outcome, scope, and risks

Add support for Google Antigravity and Gemini CLI when copying skills and writing policy files via `bin/install.mjs`. When an engineer runs `agentic-engineering` with `--compat`, skills will be mirrored to Antigravity and Gemini CLI standard directories alongside Claude Code and Cursor Cloud sync, and user/repo policy files (`GEMINI.md`) will be created to ensure policy compliance across these agent tools.

### Requirements

- **R-01**: When `bin/install.mjs --user --compat` is executed, skills are mirrored to both `~/.gemini/antigravity/skills` and `~/.gemini/skills`, in addition to `~/.claude/skills` and `~/.cursor/skills`.
- **R-02**: When `bin/install.mjs --user` is executed (with or without `--compat`), a policy file `~/.gemini/GEMINI.md` is written with the rewritten user policy (mirroring `~/.agents/AGENTS.md` and `~/.codex/AGENTS.md`).
- **R-03**: When `bin/install.mjs --repo <path> --compat` is executed, skills are mirrored to `<path>/.gemini/skills` in addition to `<path>/.claude/skills`, and `<path>/GEMINI.md` is written with the rewritten repo policy (mirroring `<path>/AGENTS.md`).
- **R-04**: When `--compat` is omitted, the non-compat notification message informs the user that Claude Code, Cursor Cloud sync, Antigravity, and Gemini CLI require vendor skill directories, and suggests re-running with `--compat`.
- **R-05**: `usage()` and `-h` / `--help` output documents Antigravity and Gemini CLI in the `--compat` flag description.
- **R-06**: `README.md` and `AGENTS.md` are updated to document the Antigravity and Gemini CLI paths and `--compat` behavior without exceeding the 800-word limit in `AGENTS.md`.
- **R-07**: Integration tests in `test/install.test.mjs` test and verify the `--user --compat` and `--repo --compat` mirroring for Antigravity and Gemini directories and `GEMINI.md`.

### Preserve

- Default `--user` and `--repo` behavior without `--compat` must continue to install only to canonical `.agents` roots (plus Codex and Claude policy stubs).
- Existing `--compat` mirroring for Claude Code and Cursor must remain intact.
- Zero runtime dependencies in `package.json`.
- Word count of `AGENTS.md` must stay $\le 800$ words.

### Non-goals

- Inventing or modifying individual skill content inside `.agents/skills/`.
- Generating Antigravity plugin manifest bundles (`plugin.json`).
- Modifying package manager scripts or publishing to npm.

### Constraints and Risks

- Constraints: Cross-platform paths (Windows `USERPROFILE` vs POSIX `HOME`), atomic directory staging via `renameWithRetry`, zero external dependencies.
- Risks: Transient filesystem lock on Windows during directory sync (mitigated by existing retry mechanism). Local reversible change; no migration or data backfill required.

## 2. Before → after

### Normal path

- **Before:** Running `agentic-engineering --user --compat` copies skills to `~/.agents/skills`, `~/.claude/skills`, `~/.cursor/skills`, and writes policy to `~/.agents/AGENTS.md`, `~/.codex/AGENTS.md`, and `~/.claude/CLAUDE.md`. Antigravity and Gemini CLI global skill paths (`~/.gemini/antigravity/skills`, `~/.gemini/skills`) and `~/.gemini/GEMINI.md` are not created.
- **After:** Running `agentic-engineering --user --compat` copies skills to `~/.agents/skills`, `~/.claude/skills`, `~/.cursor/skills`, `~/.gemini/antigravity/skills`, and `~/.gemini/skills`, and writes policy to `~/.agents/AGENTS.md`, `~/.codex/AGENTS.md`, `~/.claude/CLAUDE.md`, and `~/.gemini/GEMINI.md`. Running `agentic-engineering --repo . --compat` copies skills to `.agents/skills`, `.claude/skills`, and `.gemini/skills`, and writes both `AGENTS.md` and `GEMINI.md`.

### Failure paths

- **Staged copy failure:** If writing to `~/.gemini/antigravity/skills` or `~/.gemini/skills` fails mid-transfer, `copyDir` rolls back via `.install-tmp` and `.install-old` and preserves the previous destination.
- **Permission failure:** If parent directory creation fails, `ensureDir` throws a standard `NodeJS.ErrnoException`, cleanly terminating execution with exit code 1.

### Behavioral home

- Primary module: `bin/install.mjs`. Functions: `installUser`, `installRepo`, `rewriteAgentsMd`, `usage`.

## 3. Decisions

See [docs/decisions/2026-11-23-antigravity-gemini-skill-support.md](../decisions/2026-11-23-antigravity-gemini-skill-support.md):
- **D-01**: Bundle Antigravity & Gemini skill mirroring under `--compat`.
- **D-02**: Policy files: always write `~/.gemini/GEMINI.md` on `--user`; write `<repo>/GEMINI.md` on `--repo --compat`.
- **D-03**: Zero external dependencies.

### OPEN QUESTIONS

None.

## 4. Contracts

### C-01: User install vendor sync contract (`bin/install.mjs#installUser`)

```javascript
  if (compat) {
    syncSkills(names, path.join(home, '.claude', 'skills'));
    syncSkills(names, path.join(home, '.cursor', 'skills'));
    syncSkills(names, path.join(home, '.gemini', 'antigravity', 'skills'));
    syncSkills(names, path.join(home, '.gemini', 'skills'));
  }

  const agentsBody = rewriteAgentsMd(readCanonicalAgents(), 'user', {
    home,
    skillsHint: agentsSkills,
  });
  writeText(path.join(home, '.agents', 'AGENTS.md'), agentsBody);
  writeText(path.join(home, '.codex', 'AGENTS.md'), agentsBody);
  writeText(path.join(home, '.gemini', 'GEMINI.md'), agentsBody);
  writeClaudeMd(home, agentsSkills);

  if (!compat) {
    console.log(
      'Note: Claude Code, Cursor Cloud sync, Antigravity, and Gemini CLI need vendor skill dirs. Re-run with --compat if needed.',
    );
  }
```

### C-02: Repo install vendor sync contract (`bin/install.mjs#installRepo`)

```javascript
  if (compat) {
    syncSkills(names, path.join(resolved, '.claude', 'skills'));
    syncSkills(names, path.join(resolved, '.gemini', 'skills'));
  }

  const agentsBody = rewriteAgentsMd(readCanonicalAgents(), 'repo', {
    home: homeDir(),
    skillsHint: '.agents/skills',
  });
  writeText(path.join(resolved, 'AGENTS.md'), agentsBody);
  if (compat) {
    writeText(path.join(resolved, 'GEMINI.md'), agentsBody);
  }

  if (!compat) {
    console.log(
      'Note: Claude Code and Gemini CLI do not load .agents/skills by default. Re-run with --compat to mirror them.',
    );
  }
```

### C-03: User policy header pointer (`bin/install.mjs#rewriteAgentsMd`)

```javascript
      `Policy: \`${path.join(home, '.agents', 'AGENTS.md')}\` (also \`${path.join(home, '.codex', 'AGENTS.md')}\`, \`${path.join(home, '.claude', 'CLAUDE.md')}\`, \`${path.join(home, '.gemini', 'GEMINI.md')}\`). ` +
```

### C-04: CLI Usage description (`bin/install.mjs#usage`)

```text
  --compat            Also mirror skills for Claude Code, Cursor Cloud, Antigravity, and Gemini CLI
```

# Part B — Do

## 5. Baseline and preflight

- **Baseline commit:** `acee6eabe3dccd4569f8ec11988c3a5a4a7f6f34`
- **Anchors:**
  1. `bin/install.mjs`: `'  --compat            Also mirror skills for Claude Code and Cursor Cloud sync'` (count check: 1)
  2. `bin/install.mjs`: `'      `Policy: \`${path.join(home, \'.agents\', \'AGENTS.md\')}\` (also \`${path.join(home, \'.codex\', \'AGENTS.md\')}\`, \`${path.join(home, \'.claude\', \'CLAUDE.md\')}\`). ` +'` (count check: 1)
  3. `bin/install.mjs`: `'    syncSkills(names, path.join(home, \'.cursor\', \'skills\'));'` (count check: 1)
  4. `bin/install.mjs`: `'  writeClaudeMd(home, agentsSkills);'` (count check: 1)
  5. `bin/install.mjs`: `'    syncSkills(names, path.join(resolved, \'.claude\', \'skills\'));'` (count check: 1)
  6. `bin/install.mjs`: `'  writeText(path.join(resolved, \'AGENTS.md\'), agentsBody);'` (count check: 1)
  7. `README.md`: `'| `--compat` | Mirror skills for Claude Code (`.claude/skills`) and, for `--user`, Cursor Cloud (`~/.cursor/skills`) |'` (count check: 1)
  8. `AGENTS.md`: `'Use `--compat` for Claude Code / Cursor Cloud skill mirrors.'` (count check: 1)
- **Pre-existing failures:** Two environment-specific test issues on Windows unprivileged sandbox (symlink permissions on tmp dir and chmod 0 read check); all other 10 unit tests pass.

## 6. Steps

### S-01 · R-01, R-02, R-04, R-05, C-01, C-03, C-04
- **Prerequisites:** None
- **File:** `bin/install.mjs` (edit)
- **Anchor:** `'  --compat            Also mirror skills for Claude Code and Cursor Cloud sync'`
- **Operation:** Replace usage text with C-04.
- **Anchor:** Anchor 2 in `rewriteAgentsMd`.
- **Operation:** Replace policy line with C-03.
- **Anchor:** Anchor 3 in `installUser`.
- **Operation:** Insert Antigravity and Gemini skill sync calls per C-01.
- **Anchor:** Anchor 4 in `installUser`.
- **Operation:** Write `~/.gemini/GEMINI.md` and update non-compat notice per C-01.
- **Check:** `node bin/install.mjs --help` outputs updated description.

### S-02 · R-03, C-02
- **Prerequisites:** S-01
- **File:** `bin/install.mjs` (edit)
- **Anchor:** Anchor 5 in `installRepo`.
- **Operation:** Insert `.gemini/skills` sync per C-02.
- **Anchor:** Anchor 6 in `installRepo`.
- **Operation:** Write `GEMINI.md` when `compat` is true and update notice per C-02.
- **Check:** `node -e "import('./bin/install.mjs')"` runs without syntax errors.

### S-03 · R-07
- **Prerequisites:** S-01, S-02
- **File:** `test/install.test.mjs` (edit)
- **Anchor:** `test('a briefly locked destination is retried and installed'`
- **Operation:** Add two new tests:
  1. `user install with --compat mirrors to claude, cursor, antigravity, and gemini`
  2. `repo install with --compat mirrors to claude and gemini, writing GEMINI.md`
- **Check:** `node --test test/install.test.mjs` runs the new tests and passes.

### S-04 · R-06
- **Prerequisites:** S-01, S-02
- **File:** `README.md` (edit)
- **Anchor:** `| `--compat` | Mirror skills for Claude Code (`.claude/skills`) and, for `--user`, Cursor Cloud (`~/.cursor/skills`) |`
- **Operation:** Update table row and explanatory text to document `.gemini/antigravity/skills`, `.gemini/skills`, and `GEMINI.md`.
- **Check:** `git diff README.md` shows clean documentation addition.

### S-05 · R-06
- **Prerequisites:** S-01
- **File:** `AGENTS.md` (edit)
- **Anchor:** `Use `--compat` for Claude Code / Cursor Cloud skill mirrors.`
- **Operation:** Update line 3 concisely while staying $\le 800$ words.
- **Check:** `node -e "const w = require('fs').readFileSync('AGENTS.md', 'utf8').split(/\s+/).filter(Boolean).length; console.log(w); assert(w <= 800)"` passes.

## 7. Verification matrix

| R / invariant | Scenario and fixture | Expected | Test path or manual procedure | Command (cwd) | Step |
|---|---|---|---|---|---|
| R-01, R-02 | User install with `--compat` in temp root | `.gemini/antigravity/skills`, `.gemini/skills`, and `.gemini/GEMINI.md` exist and match sources | Automated unit test | `node --test test/install.test.mjs` | S-03 |
| R-03 | Repo install with `--compat` in temp root | `.gemini/skills`, `.claude/skills`, `.agents/skills`, `AGENTS.md`, and `GEMINI.md` exist | Automated unit test | `node --test test/install.test.mjs` | S-03 |
| R-04, R-05 | CLI help invocation | Help text includes Antigravity and Gemini CLI | CLI check | `node bin/install.mjs --help` | S-01 |
| R-06 | AGENTS.md word cap constraint | Word count $\le 800$ | Automated test | `node --test test/skills.test.mjs` | S-05 |
| Preserve | Existing non-compat install leaves vendor dirs untouched | Temp home has no `.gemini/antigravity` or `.gemini/skills` without `--compat` | Automated unit test | `node --test test/install.test.mjs` | S-03 |

## 8. Stop conditions

The implementer stops and returns to planning if:
- Any preflight anchor check does not return count 1.
- Writing to `.gemini/antigravity/skills` or `.gemini/skills` produces file collision or unexpected directory structure.
- `AGENTS.md` word count exceeds 800 words after edits.
