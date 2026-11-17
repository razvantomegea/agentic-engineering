# Plan — Execution-ready plans, "verify, don't guess", leaner always-on policy

**Level 2** (changes agent behavior in the core skills, `AGENTS.md`, and the installer) · **Status:** READY r2 (the r1 plan review was NOT READY; findings F-01–F-06 are folded in, see the end) · **Baseline:** `main` @ `cf4b319`, clean, 2026-11-17 · **Records:** `docs/plans/2026-11-17-execution-ready-plans.md`, `docs/decisions/2026-11-17-execution-ready-plans.md`. These are written in S-00, right after approval, because Claude Code plan mode only allows writing this file. That departs from the `plan-change` rule that records exist on disk before acceptance (F-06).

## Context

You want planning docs that make execution mechanical, with shorter skills and fewer hallucinations, and you pasted an external blueprint (lean `AGENTS.md`, a plan schema, anti-hallucination rules). Most of that blueprint already exists here: `PLAN-TEMPLATE.md` goes further than the proposed "planning-spec", `implement-change/SIMPLICITY.md` already covers anti-hallucination rules 2–4, and `AGENTS.md` already has triage.

Five real gaps remain:

1. **Plan edits are located by description, not by verbatim anchor**, so the implementer still has to guess where each edit goes.
2. **Nothing requires checking a third-party API against the installed version.** This is the most common way agents invent an API.
3. **The 11-section template states the same facts in up to six places**, so the implementer reads everything and has to reconcile differences.
4. **About 500 words of UI-mockup rules load for every plan**, including backend plans.
5. **`AGENTS.md` sits at 999 of its 1,000-word cap**, so no guard can be added. On top of that, Claude Code user-level installs never see it.

**Also, the installed skills are stale:** `~/.claude/skills` and `~/.agents/skills` are dated 2026-10-19, so none of the 2026-11-13 improvements are active.

The intended outcome: a two-part plan whose execution half is enough on its own; one "verify, don't guess" rule enforced while planning, implementing and reviewing; shorter always-on and planning text; and a fresh install.

# Part A — Why

## 1. Outcome, scope, and risks

**Requirements**

- **R-01** `PLAN-TEMPLATE.md` defines a two-part plan:
  - Part A (Why): §1 outcome/scope/risks, §2 before→after, §3 decisions + OPEN QUESTIONS, §4 contracts.
  - Part B (Do): §5 baseline/preflight, §6 steps, §7 verification matrix, §8 stop conditions.
  - Each fact has one ID (`R/D/C/S`) and is cited by ID everywhere else.
  - Target length is about 1,200 words, down from 1,751.
- **R-02** Contracts are exact. Every edit has a verbatim anchor that must match exactly once. Function bodies may be pseudocode only if every branch is listed.
- **R-03** "Verify, don't guess" applies in four places:
  - `AGENTS.md` hard rule.
  - `plan-change` discovery and readiness.
  - `implement-change` preflight and contract.
  - `review-change` checks in both plan and implementation mode.
  - Third-party APIs cite the installed version and where the signature was read.
- **R-04** The UI visual specification lives in a new `plan-change/UI-SPEC.md`, loaded only when there is a design reference. Content is moved verbatim.
- **R-05** `AGENTS.md` shrinks from 999 to about 725 words. Sections that skills already own become one-line pointers. Triage, the levels table, the Phase boundary and the hard rules stay. The test cap drops from 1,000 to 800.
- **R-06** For user installs, the generated `~/.claude/CLAUDE.md` imports `@~/.agents/AGENTS.md` instead of carrying its own partial copy of the policy.
- **R-07** No checks are silenced to make code pass: no new `any`, no ignore/disable comments, no skipped tests. This becomes an `AGENTS.md` hard rule, an `implement-change` rule, and a `review-change` check.

**Preserve**

- Skill names and directories.
- `CORE_SKILLS` / `EXTRA_SKILLS`.
- The no-execution ("Documentation-only boundary") paragraphs in `plan-change` and `review-change`, word for word.
- Simplicity rule numbers 1–10.
- The `AGENTS.md` heading names that skills refer to: "Phase boundary", "Request triage", "Complexity gates".
- `AGENTS.md` line 1 stays `# AGENTS.md`, and line 3 stays the pointer line (`rewriteAgentsMd` replaces `lines[2]`).
- All descriptions start with `Use ` and are at most 200 characters.
- Existing tests keep passing.

**Non-goals**

- No `.agents/docs/` folder (A-01).
- No changes to `engineering-copilot`, `guided-implementation`, `engineering-handoff`, the frontend skills, or `tutor-me`.
- Older saved plans are not migrated.
- No tests that check skill prose wording.
- No commit unless you ask.

**Risks**

- In a repo that has its own `AGENTS.md`, Claude Code loads both the repo copy and the imported user copy, about 725 extra words per turn. Accepted under D-04.
- `@~` on Windows is the documented forward-slash form, but the docs don't say how path separators are handled. If V-07 fails, that is a stop condition (see the fallback in §8).
- Reinstall overwrites `~/.claude/CLAUDE.md`. It does this today too, and the current file is fully generated.
- Everything is local, reversible markdown/JS. Rollback is `git revert` plus a reinstall.

## 2. Before → after

**Example:** Claude Opus plans an L2 change in a product repo, then Cursor implements it.

**Before**

1. Claude runs the stale 2026-10-19 `plan-change` from `~/.claude/skills/plan-change/SKILL.md`, the only file in that folder. It sees neither `QUESTION-BANK.md` nor `PLAN-TEMPLATE.md`, and only the generated `~/.claude/CLAUDE.md` (Principle, Roles, Hard rules). It sees no triage, no Phase boundary, and no rule against guessing.
2. With the current repo skills, it would fill 11 sections. Requirements are restated in the stories, the file map, the steps and the matrix. Steps locate edits as "edit locations" (`PLAN-TEMPLATE.md` §8). A library call is written from memory: the template's "Verify referenced existing symbols/APIs" says nothing about versions.
3. Cursor reads the whole plan, works out where each change goes, and calls `lib.foo(opts)`, a signature from the library's previous major version.
4. Type check fails. Cursor patches it, possibly with a cast. Nothing forbids silencing a check except the rule about tests.

**After**

1. Claude loads the reinstalled `plan-change` and, through the `CLAUDE.md` import, the full `AGENTS.md`, including "Verify, don't guess".
2. During discovery it records `path#symbol` for each fact and reads `lib`'s installed version from the lockfile and its signature from `node_modules/lib/dist/index.d.ts`.
3. It writes Part A, then Part B. Each step has a file, an anchor (fixed-string count → 1), an operation, the exact edit or a `C-` reference, and a check. `UI-SPEC.md` is not loaded because there is no mockup.
4. Plan-mode review checks the anchors and the API citation.
5. Cursor runs the preflight. An anchor that misses, or an unexpected version, stops it before any edit. Otherwise it applies the steps in order. It can't silence a check, so a type error goes back as a stop condition instead of a cast.

**Failure path:** if the baseline moves after acceptance, a preflight anchor count becomes 0 or 2. The implementer stops and replans the affected steps; nothing is edited.

**Behavioral home:**

- `plan-change/PLAN-TEMPLATE.md` defines what a plan is.
- `implement-change/SKILL.md` §0–§2 defines how a plan is executed.
- `AGENTS.md` "Hard rules" holds the always-on guard.

## 3. Decisions

| ID | Question | Choice | Rationale / tradeoff | Provenance |
|---|---|---|---|---|
| D-01 | Plan shape | Two-part plan (Why / Do), each fact once by ID | The implementer reads only Part B plus the IDs it cites; less drift. Cost: a full rewrite of the template | You chose this, 2026-11-17 |
| D-02 | Code exactness | Exact contracts and verbatim anchors; branch-complete pseudocode allowed for function bodies | Makes the plan decision-complete without turning it into a full diff. Cost: anchors go stale if the baseline moves, which the preflight catches | You chose this, 2026-11-17 |
| D-03 | `AGENTS.md` | Trim (999 → ~725) and add "verify, don't guess" plus "don't silence checks" | The always-on guard against invented APIs; duplicated sections become pointers to the skills | You chose this, 2026-11-17 |
| D-04 | Claude policy | Generated `CLAUDE.md` imports `@~/.agents/AGENTS.md` | One canonical policy, no drift. Cost: about +475 words per Claude turn, and double-loading in repos with their own `AGENTS.md` | You chose this, 2026-11-17 |

**Assumptions** (stated before round 1, not contested; accepting this plan confirms them):

- **A-01** No `.agents/docs/`: `bin/install.mjs` copies only the named skill folders and `AGENTS.md`. Frontend and backend guides belong in product repos.
- **A-02** The UI specification moves to `plan-change/UI-SPEC.md`, word for word.
- **A-03** "Length" means shorter skills and plans.
- **A-04** The `AGENTS.md` test cap drops from 1,000 to 800 to keep the gain.
- **A-05** No prose-wording tests (as in the 2026-11-13 A-02).

### OPEN QUESTIONS

None.

## 4. Contracts

### C-01 — new full text of `.agents/skills/plan-change/PLAN-TEMPLATE.md` (1,250 words)

```markdown
# Implementation plan template

A plan has two parts. **Part A — Why** lets the engineer and the reviewer understand and challenge the change. **Part B — Do** is the execution spec: the implementer reads Part B, Part A §1, and the IDs Part B cites, and decides nothing beyond syntax. Fill every relevant section with repository-grounded content; mark an inapplicable section with a one-line reason. A small change gets short sections, not missing ones.

Planning and plan review are documentation-only (see [SKILL.md](SKILL.md)). Code, commands, and tests in a plan are inert text for later phases.

## Writing rules

- **State each fact once.** Give it an ID — requirement `R-01`, decision `D-01`, contract `C-01`, step `S-01` — and cite the ID elsewhere instead of restating it.
- **Ground every reference.** Name each existing path, symbol, command, and config key as inspected at the baseline. For a third-party API, cite the package, its installed version (lockfile or manifest), and where you read the signature (the installed type definitions or that version's docs). Mark everything new as `new`. A fact you could not verify is an OPEN QUESTION, or a preflight check (§5) when only execution can settle it and the plan states what happens if it fails; if the design depends on it, the plan is BLOCKED. Never a silent assumption.
- **Exact where it binds.** Contracts (§4) and anchors (§5) are exact. A function body may be pseudocode that lists every branch, value, and failure outcome. No TODOs, ellipses, or "handle errors" in material behavior.
- **UI with a design reference** (mockup, screenshot, brand): also follow [UI-SPEC.md](UI-SPEC.md).

## Header

Title · level · status (DRAFT / BLOCKED / READY / ACCEPTED) · revision · baseline (branch, commit, relevant uncommitted changes, date) · links to the decision log, glossary entries, and ADRs. READY means complete and plan-reviewed; ACCEPTED also records the engineer's acceptance of a named revision.

# Part A — Why

## 1. Outcome, scope, and risks

- Problem, affected actor, trigger, and desired result in two to four sentences.
- Requirements `R-01…`: exact behavior with observable acceptance criteria and a representative input → output.
- **Preserve:** behavior and contracts that must not change.
- Non-goals, and the constraints the change touches (security, data, compatibility, performance, cost).
- Risks and rollout: irreversible effects, deployment order, migration or backfill, flags, rollback and data recovery, residual risk. For a local reversible change, one line saying why none is needed. Rollout actions are steps in §6.

## 2. Before → after

One concrete example, traced twice with real values.

- **Before:** entry point → each meaningful hop (`path#symbol`, responsibility, state change, side effect) → outcome, and why it fails the requirement. Separate observed code from inference.
- **After:** the same example through the new flow: who calls which operation, which rule selects the branch, when state changes and side effects run, and what the user or system observes.
- **Failure paths:** one short trace per material failure, cancellation, retry, or concurrency case, with exact recovery behavior.
- **Behavioral home:** the one module to open first, its public operations, and the few other files a reader needs.

A diagram may supplement the traces; it never replaces paths and symbols.

## 3. Decisions

Per decision `D-01…`: question IDs, viable alternatives, choice, rationale, tradeoff, affected `R`/`S` IDs, and provenance (user-confirmed, delegated, or repository constraint). For L2–L3, link the decision log.

### OPEN QUESTIONS

Unresolved user choices and investigations, with impact and how each will be resolved. Write `None` only when empty. Nothing is deferred to the implementer.

## 4. Contracts

Per contract `C-01…`, exact text in the repository's language and conventions, labeled with its destination path:

- New or changed public signatures, types, schemas, request/response and error shapes, events, config keys, and exact documentation or configuration text.
- State: owner, source of truth, initial value, allowed transitions, lifetime, observation, and cleanup.
- Rule order, invariants, idempotency and concurrency rules, authorization, persistence and compatibility constraints.

# Part B — Do

## 5. Baseline and preflight

The implementer runs these before the first edit; any failure is a stop condition (§8).

- **Baseline:** the branch and commit the plan was written against.
- **Anchors:** for each edit in §6, the file and an anchor — a symbol, or a short snippet copied verbatim from the baseline file — that must match exactly once, with a fixed-string count check, for example `git grep --no-index -F -c -e '<anchor>' -- <path>` → `<path>:1`. Single-quote the anchor so backticks and `$` stay literal.
- **Commands:** each verification command exists in the repository's scripts or tooling.
- **Dependencies:** each existing third-party API the plan uses, with its expected installed version; each package the plan adds, with its pinned version and the step that adds it.
- **Pre-existing failures:** run the §7 commands once and record what already fails, so new failures are attributable.

## 6. Steps

Ordered by real dependencies. Per step:

| Field | Content |
|---|---|
| `S-01 · R/D/C IDs` | Purpose in one line |
| Prerequisites | Earlier step IDs, data, or configuration; `none` when true |
| File | Path, and new / edit / move / delete |
| Anchor | From §5, or `new file` |
| Operation | Insert before/after, replace, delete, or create |
| Edit | Exact code or text, a `C-` reference, or branch-complete pseudocode |
| Preserve | What this step must not change |
| Check | Exact command and working directory, or manual actions → expected result, including one negative or regression case |

No step such as "implement the service", "wire up the UI", or "add tests" without the actual rules, call sites, and assertions. Split steps that need unrelated decisions. The smallest meaningful check per step is enough; not every mechanical edit needs a new test.

## 7. Verification matrix

| R / invariant | Scenario and fixture | Expected | Test path or manual procedure | Command (cwd) | Step |
|---|---|---|---|---|---|

Cover the normal path, meaningful boundary and failure cases, applicable race or lifecycle cases, and preserved behavior. Use concrete assertions, not "works correctly". Say which boundaries are real and which are test doubles. Planned checks are not evidence; record execution evidence from other phases with its source and revision.

## 8. Stop conditions

The implementer stops and returns to planning when:

- an anchor matches zero or several times, or the baseline moved under a touched file;
- a cited symbol, command, or existing dependency version differs from the plan;
- a step needs a product, contract, ownership, failure-policy, or rollout decision the plan does not make;
- a check fails for a reason the plan did not anticipate and the cause is not a local slip.

Routine syntax and mechanical details are the implementer's call. Record any deviation against its step ID.

## Example step (illustrative; replace with verified paths)

> **S-03 · R-02, D-01, C-02** — round each cart line before summing.
> Prerequisites: S-02. File: `src/cart/pricing.ts` (edit). Anchor: `export function totalFor(` → 1 match. Operation: replace the function body; signature per C-02.
> Edit (branch-complete pseudocode): empty cart → `0`; each line → `qty * unitPrice` rounded to cents (D-02); sum the lines; apply the D-03 discount after summing; a negative result → `0`.
> Preserve: the `totalFor` signature and its callers in `src/cart/CartView.tsx`.
> Check: `npm test -- pricing` from the repository root → passes, including the new case "two lines of 0.333 total 0.66, not 0.67".
```

### C-02 — composition of new `.agents/skills/plan-change/UI-SPEC.md` (moved text, unchanged wording)

```markdown
# UI visual specification

Load when the change has a design, mockup, screenshot, or brand reference. A reference image is a source, not a spec. Planning stays documentation-only (see [SKILL.md](SKILL.md)).

## Interview questions

{BLOCK Q: baseline QUESTION-BANK.md lines 63–73 verbatim — from "Open and read every reference yourself before asking; ask only what the images cannot answer." through "- How will each built screen be compared with its reference, and who approves the difference?"}

## Plan content

Put the visual specification in Part A §4 (Contracts) and its acceptance checks in Part B §7 (Verification matrix). Before any step, inspect every reference (open the images; do not assume from filenames) and write down what a builder cannot guess:

{BLOCK T: baseline PLAN-TEMPLATE.md lines 79–86 verbatim — the eight bullets from "- Reference inventory: each file, the screen it shows, and which wins on conflict." through "- Acceptance: a side-by-side comparison of each built screen with its reference, plus computed-style checks for the tokens, listed in the verification matrix."}
```

### C-03 — new full text of `AGENTS.md` (about 725 words; line 3 unchanged)

```markdown
# AGENTS.md

Canonical source: this repository (`agentic-engineering`). Install with `npx github:razvantomegea/agentic-engineering` (`--user` → `~/.agents/skills` + `~/.agents/AGENTS.md` + Codex/Claude policy; `--repo .` → `.agents/skills`). Use `--compat` for Claude Code / Cursor Cloud skill mirrors. Local shim: `scripts/sync-user-skills.ps1`. A product repo's README and `docs/` win for local facts.

## Objective

Build reliable software quickly while the engineer keeps ownership. Agents may do most of the work; significant changes must stay explainable by the engineer responsible for them.

> **I am allowed not to write the code.**
> **I am not allowed not to understand the system.**
>
> **When I'm confused, don't immediately solve the problem for me. First help me build the smallest mental model necessary to reason about it.**

## Hard rules

- Stay in the requested scope.
- Do not print secrets or read `.env` files.
- Do not delete data, force-push, or change auth, migrations, or architecture unless the request explicitly includes that.
- Do not add dependencies unless required and explained.
- Do not change a test or silence a check (`any`, ignore/disable comments, skipped tests) to make an implementation pass.
- Do not run package-manager or project scripts unless the request asks for that command (or verification requires it). Otherwise name the command and wait.
- **Verify, don't guess.** Confirm every path, symbol, command, config key, and third-party API in the repository or in the installed package version before relying on it. If you cannot confirm it, say so; never invent it.

## Request triage (first reply to non-trivial work)

1. State a level guess (L0–L3) and the one-line reason.
2. Check five slots: outcome (observable "done"), scope (in/out), behavior that must not change, constraints the change plausibly touches (security, data, compat, perf, cost), verification.
3. Slot inferable and change reversible: state the assumption in one line and proceed. Answer changes the design and cannot be safely assumed: ask.
4. Ask one batched round. Each question: concrete scenario, options with consequences, recommendation first; use the host's structured question tool when available. Never ask "any edge cases?"
5. L2–L3 build → `ship-change` (`plan-change` for further questions). Review → `review-change`. Investigate → `explore-system`.

## Change discipline

Inspect the relevant code, patterns, and boundaries first; reuse existing abstractions; justify any new architecture by why existing patterns fall short. Make the smallest coherent change; code follows the Code Simplicity Contract (`implement-change/SIMPLICITY.md`). Trivial changes proceed directly.

Meaningful changes: EXPLORE → PLAN → IMPLEMENT → VERIFY → REVIEW → EXPLAIN. At L2–L3, PLAN is `plan-change`: question rounds, a saved two-part plan, plan-mode `review-change`, then acceptance. Explicit requests for exhaustive planning override brevity defaults. Failures go through `diagnose-bug`, not repeated speculative edits. Hard-to-reverse decisions get an ADR in `docs/adr/`.

## Verification

### Phase boundary

Planning and review are documentation-only: inspect files, diffs, and existing evidence; ask questions; write docs. They never execute code, modify implementation, tests, or configuration, or delegate execution. If file tools fail, narrow read-only shell commands may list, read, or search files and inspect diffs. Checks run in a separate implementation/verification phase that supplies its results. Missing runtime evidence is a limitation, not permission to run code.

Never claim completion without running the relevant available checks (type check, lint, tests, build, integration/E2E). State what was actually verified.

## Complexity gates

| Level | Examples | Workflow |
|-------|----------|----------|
| 0 trivial | copy, CSS tweak, rename, obvious one-liner | implement → verify |
| 1 normal | small feature, isolated bug, API glue | brief explore → inline plan → implement → verify → review if useful → short handoff |
| 2 significant | new feature, auth, payments, data model, complex async, large refactor | full `ship-change` |
| 3 architectural | new service/boundary, framework migration, platform | full `ship-change` + ADR |

Solo products: SPEC → BUILD → TEST → AI REVIEW → SHIP. Full handoff only for auth, payments, security, infrastructure, database architecture, data-loss risk, expensive APIs, or business-critical logic.

## Roles and context

Claude Opus — Thinker (explore, plan). Cursor — Builder (implement, debug). Codex — Skeptic (review). Claude/Cursor — Teacher (handoff). Load skills on demand (`engineering-copilot` when unsure which applies); skip unrelated reads.

## Ownership gate

A meaningful change is complete only after `engineering-handoff`: the engineer can explain its problem, behavioral home, flow, decisions, invariants, failure modes, and verification, and has passed the quiz. Reading an explanation is not ownership.
```

### C-04 — new `writeClaudeMd` in `bin/install.mjs` (exact)

```js
function writeClaudeMd(home, skillsHint) {
  const body = `# CLAUDE.md

User-level always-on for Claude Code, written by \`npx github:razvantomegea/agentic-engineering --user\`. Skills: \`${skillsHint}\` (and \`${path.join(home, '.claude', 'skills')}\` with \`--compat\`). The policy below is imported from \`~/.agents/AGENTS.md\`; change it in the agentic-engineering repository and reinstall, not here.

@~/.agents/AGENTS.md
`;
  writeText(path.join(home, '.claude', 'CLAUDE.md'), body);
}
```

The import line has no backticks around it, because imports inside code spans are ignored. Imports in user-scope `CLAUDE.md` load without an approval dialog (source: code.claude.com/docs/en/memory, "Import additional files").

### C-05 — `docs/decisions/2026-11-17-execution-ready-plans.md` content

- Title and date.
- A link to the plan.
- §3 of this plan copied verbatim (D-01–D-04, A-01–A-05).
- How each pasted recommendation was handled:

| Recommendation | Disposition |
|---|---|
| Lean `AGENTS.md` router (<50 lines) | Modified → D-03 (trim to about 725 words; triage, levels and Phase boundary stay always-on) |
| `.agents/docs/*.md` progressive disclosure | Rejected → A-01 (installer doesn't ship it; product guides belong in product repos). Applied inside the skill instead → `UI-SPEC.md` (R-04) |
| `planning-spec.md` schema | Already covered by `PLAN-TEMPLATE.md`; restructured → D-01/D-02 |
| Anti-hallucination: no phantom imports | Added → R-03 |
| Strict typing / no `any` | Generalized → R-07 (no check silencing in any language) |
| Minimalist simplicity | Already covered → `SIMPLICITY.md` rules 1, 3, 8 |
| Self-correction loop | Already covered → `implement-change` §2 and `diagnose-bug`; preflight adds a record of pre-existing failures |
| Never `@import` at launch | Overridden for one file by D-04: `AGENTS.md` is always-on policy by design |

- Finding: the installed copies are dated 2026-10-19 and are refreshed by S-12.

# Part B — Do

## 5. Baseline and preflight

- **Baseline:** `main` @ `cf4b319`. Run `git status --short`; the expected output is empty, except for `docs/` files created in S-00.
- **Commands:**
  - `npm test` (`package.json` `scripts.test` = `node --test test/install.test.mjs test/skills.test.mjs`).
  - `git` 2.47 and `node` 18 or later.
  - `rg` is **not** installed in PowerShell on this machine, so every search below uses `git grep --no-index`.
- **Dependencies:** none (the installer uses only Node built-ins).
- **Pre-existing failures:** run `npm test` once before S-01 and record the result. The expected result is all pass.
- **Anchors:**
  - Check each one in PowerShell with `git grep --no-index -F -c -e '<anchor>' -- <file>`. The expected output is `<file>:1`; no output means 0 matches.
  - Use single quotes, which keep backticks and `$` literal. A25 contains `'`, so pass it in double quotes; it has no `$` or backtick.
  - A dry run on 2026-11-17 at `cf4b319` returned `:1` for all of A1–A31.

| ID | File | Anchor (verbatim) |
|---|---|---|
| A1 | `.agents/skills/plan-change/QUESTION-BANK.md` | `### Visual fidelity (when a design, mockup, screenshot, or brand exists)` |
| A2 | same | `- How will each built screen be compared with its reference, and who approves the difference?` |
| A3 | `.agents/skills/plan-change/PLAN-TEMPLATE.md` | `- Reference inventory: each file, the screen it shows, and which wins on conflict.` |
| A4 | same | `plus computed-style checks for the tokens, listed in the verification matrix.` |
| A5 | `.agents/skills/plan-change/SKILL.md` | `rounds, then writes a decision-complete plan: file/symbol map, code samples,` |
| A6 | same | `before interviewing and [PLAN-TEMPLATE.md](PLAN-TEMPLATE.md) before drafting.` |
| A7 | same | `- Identify where a teammate would currently look to change one important feature rule.` |
| A8 | same | `## 6. Write the implementation story` |
| A9 | same | `## 7. Readiness gate` |
| A10 | `.agents/skills/implement-change/SKILL.md` | `- **Plan is the contract.**` |
| A11 | same | `- **Repository evidence wins over stale examples.**` |
| A12 | same | `1. Read the plan (inline or on disk), scoped requirements, and relevant decisions once.` |
| A13 | same | `4. **Update** — mark step and evidence; never claim success from an unrun check.` |
| A14 | same | `Never weaken tests to make an implementation pass.` |
| A15 | `.agents/skills/review-change/SKILL.md` | ``and `../plan-change/PLAN-TEMPLATE.md`. Do not require an implementation diff.`` |
| A16 | same | `2. Verify existing paths/APIs against baseline; label proposed ones.` |
| A17 | same | `5. Steps must be dependency-ordered and actionable without inventing product decisions.` |
| A18 | same | ``(see `PLAN-TEMPLATE.md` §7 UI work)`` |
| A19 | same | `1. Compare scoped diff to requirements, plan, decisions, standards; call out unapproved deviations.` |
| A20 | `.agents/skills/explore-system/SKILL.md` | `Prefer repository inspection over assumptions. Keep the map compact and high-signal.` |
| A21 | `.agents/skills/ship-change/SKILL.md` | `Save the implementation story, code samples, file/symbol map, ordered steps, and acceptance matrix;` |
| A22 | same | ``5. use `implement-change` with the accepted plan path/revision, linked decisions, step order, and verification commands.`` |
| A23 | `test/skills.test.mjs` | `const AGENTS_WORD_CAP = 1000;` |
| A24 | `bin/install.mjs` | `function writeClaudeMd(home, skillsHint) {` |
| A25 | `test/install.test.mjs` | `    assert.equal(fs.existsSync(path.join(home, '.claude', 'CLAUDE.md')), true);` |
| A26 | `README.md` | ``(+ `~/.codex/AGENTS.md`, `~/.claude/CLAUDE.md`) |`` |
| A27 | same | ``ownership, hard rules, **request triage**, discovery, verification (phase boundary), roles, complexity gates.`` |
| A28 | same | `Detailed questions + implementation story, paths, code samples, ordered steps, acceptance checks` |
| A29 | same | ``Planning uses `.agents/skills/plan-change/QUESTION-BANK.md` and `PLAN-TEMPLATE.md`.`` |
| A30 | `.agents/skills/plan-change/SKILL.md` | `If an alternative needs more layers/files, justify with concrete benefits.` |
| A31 | `.agents/skills/ship-change/SKILL.md` | `If evidence invalidates` |

## 6. Steps

**S-00 · records**

- **Files:** `docs/plans/2026-11-17-execution-ready-plans.md` (new) = this plan, copied verbatim. `docs/decisions/2026-11-17-execution-ready-plans.md` (new) = C-05.
- **Check:** both files exist. `docs/` is not in `package.json` `files`, so neither ships.

**S-01 · R-04, C-02 · create `UI-SPEC.md` (before S-02/S-03 remove the source blocks)**

- **Prerequisite:** preflight passed.
- **File:** `.agents/skills/plan-change/UI-SPEC.md` (new).
- **Edit:** C-02. Copy BLOCK Q from QUESTION-BANK lines 63–73 (anchors A1/A2 bracket it) and BLOCK T from PLAN-TEMPLATE lines 79–86 (A3/A4), both word for word.
- **Check:** `git grep --no-index -F -c -e 'Reference inventory' -e 'who approves the difference' -- .agents/skills/plan-change/UI-SPEC.md` → `.agents/skills/plan-change/UI-SPEC.md:2`.

**S-02 · R-01, R-02, D-01, D-02, C-01 · rewrite `PLAN-TEMPLATE.md`**

- **Prerequisite:** S-01.
- **Operation:** replace the whole file with C-01.
- **Preserve:** the file name; it is linked from `plan-change/SKILL.md` and named in `review-change` and `README.md`.
- **Check:** `git grep --no-index -c -e '^# Part [AB]' -- .agents/skills/plan-change/PLAN-TEMPLATE.md` → `…PLAN-TEMPLATE.md:2`; `git grep --no-index -F -c -e 'Reference inventory' -- .agents/skills/plan-change/PLAN-TEMPLATE.md` → no output.

**S-03 · R-04 · `QUESTION-BANK.md`**

- **Prerequisite:** S-01.
- **Operation:** replace everything from the anchor A1 line through the anchor A2 line (inclusive) with:

  ```markdown
  ### Visual fidelity

  When a design, mockup, screenshot, or brand reference exists, also use the questions in [UI-SPEC.md](UI-SPEC.md).
  ```

- **Preserve:** the following `## 4. Behavioral home, state, and lifecycle` section.
- **Check:** `git grep --no-index -F -c -e 'Reference inventory' -e 'font family' -- .agents/skills/plan-change/QUESTION-BANK.md` → no output.

**S-04 · R-01, R-03 · `plan-change/SKILL.md`**

Five edits:

1. **A5 block** (description, lines 4–6): replace with

   ```yaml
     Use before nontrivial (L2-L3 or requested) implementation. Interviews in
     rounds, then writes a two-part plan: why (decisions, contracts) and do
     (anchored steps, checks). Documentation only.
   ```

   The description is 189 characters.

2. **A6 sentence:** replace

   > Load [QUESTION-BANK.md](QUESTION-BANK.md) before interviewing and [PLAN-TEMPLATE.md](PLAN-TEMPLATE.md) before drafting.

   with

   > Load [QUESTION-BANK.md](QUESTION-BANK.md) before interviewing, [PLAN-TEMPLATE.md](PLAN-TEMPLATE.md) before drafting, and [UI-SPEC.md](UI-SPEC.md) when the change has a design, mockup, screenshot, or brand reference.

3. **Insert after the A7 line:**

   > - Record where each fact came from (`path#symbol` at the baseline commit). For a third-party API, read the installed version from the lockfile or manifest and the signature from the installed type definitions or that version's docs; never plan against a remembered API. A fact only execution can settle becomes a Part B preflight check when the plan already says what happens if it fails; if the design depends on it, mark the plan BLOCKED.

4. **Replace §6** (from the A8 heading through the A30 line, inclusive) with:

   ```markdown
   ## 6. Write the plan

   Follow [PLAN-TEMPLATE.md](PLAN-TEMPLATE.md): Part A (why) for the engineer and reviewer, Part B (do) for the implementer. Write Part B so an implementer with no conversation history finishes every step without choosing anything beyond syntax: exact contracts, one verbatim anchor per edit, one check per step. Do not replace the plan with a vague checklist.

   If an alternative needs more layers/files, justify with concrete benefits.
   ```

5. **Replace §7** (from the A9 heading to the end of the file) with:

   ```markdown
   ## 7. Readiness gate

   Simulate implementing from Part B and Part A §1 alone. Resolve every material "which file / which anchor / what value / what on failure / how do I know?"

   READY only when: `OPEN QUESTIONS` empty (or delegated and resolved); every existing path, symbol, anchor, and command grounded in the baseline; every third-party API cited with its installed version and source; Part A and Part B agree; every step has a check; required plan-review findings resolved on disk.

   Otherwise DRAFT or BLOCKED. Never claim plan review or planned tests prove the implementation works.
   ```

- **Preserve:** the `## Documentation-only boundary` paragraph word for word, §2–§5, and the L1 inline-plan rule.
- **Check:** `npm test` passes the description and link tests.

**S-05 · R-03, R-07 · `implement-change/SKILL.md`**

Five edits:

1. **Replace the A10 bullet** (whole line) with:

   > - **Plan is the contract.** For **L1**, the agreed **inline plan** in chat is the contract. For **L2–L3**, read the accepted plan **from disk** — not from a chat summary — and confirm its recorded review and acceptance. Execute its Part B (Do) with Part A §1 (scope, preserve, risks) in view; read the rest of Part A only for the IDs a step cites. Trivial L0 retains implement → verify.

2. **Replace the A11 bullet** (whole line) with:

   > - **Verify, don't guess.** Confirm paths, symbols, dependencies, and contracts before editing. Import only modules the repository or its manifest already provides, and call third-party APIs only as their installed version defines them. Pseudocode is intent, not paste-ready code. If the repository contradicts the plan, follow the plan's stop conditions.

3. **Replace the A12 item** (whole line) with:

   > 1. Read the plan (inline or on disk) once. For a saved plan, run its preflight (Part B §5) before the first edit: anchors match once, commands exist, dependency versions match, pre-existing failures recorded. Extract a compact working map: **step, behavioral home, paths, contract/invariants, checks, risks**. Don't echo the entire plan.

4. **A13:** replace `mark step and evidence;` with `mark step, evidence, and any deviation against its step ID;`.

5. **A14:** replace `Never weaken tests to make an implementation pass.` with

   > Never weaken tests or silence checks (`any`, unchecked casts, ignore/disable comments, skipped tests) to make an implementation pass; fix the cause or report it.

- **Preserve:** §3–§7 and the SIMPLICITY links.
- **Check:** `npm test` (links and word cap).

**S-06 · R-03, R-04, R-07 · `review-change/SKILL.md`**

Five edits:

1. **A15:** replace with

   > and `../plan-change/PLAN-TEMPLATE.md` (plus `../plan-change/UI-SPEC.md` for UI work). Do not require an implementation diff.

2. **A16:** replace with

   > 2. Verify every existing path, symbol, and command against the baseline, and that each anchor matches its file exactly once; third-party APIs must cite the installed version and where the signature was read. A wrong or unverifiable reference is IMPORTANT · Spec.

3. **A17:** replace with

   > 5. Part B, with Part A §1 and the IDs it cites, must be executable alone: dependency-ordered steps, each with anchor, edit, and check, leaving no decision beyond syntax to the implementer.

4. **A18:** replace with `(see `../plan-change/UI-SPEC.md`)`.

5. **A19:** replace with

   > 1. Compare scoped diff to requirements, plan, decisions, standards; call out unapproved deviations, imports or APIs absent from the repository or installed packages, and silenced checks (new `any`, ignore/disable comments, skipped or weakened tests).

- **Preserve:** the §0 boundary paragraph word for word, §2B, and the severities.
- **Check:** `npm test`.

**S-07 · R-01, R-03 · `explore-system` and `ship-change`**

1. **A20:** replace with

   > Prefer repository inspection over assumptions: cite `path#symbol` for each entry, and list anything you did not see in code under Unknowns. Keep the map compact and high-signal.

2. **A21:** replace with

   > Save the two-part plan (Part A why: scope, before/after, decisions, contracts; Part B do: preflight, anchored steps, verification, stop conditions);

3. **A22:** replace with

   > 5. use `implement-change` with the accepted plan path/revision; it runs Part B's preflight, then the steps in order.

   Then, in the same item, replace `If evidence invalidates` (anchor A31) with `If a stop condition fires or evidence invalidates`.

- **Check:** `npm test`.

**S-08 · R-05, R-07, D-03, A-04 · `AGENTS.md` and the cap**

- **Edits:** replace the whole of `AGENTS.md` with C-03. In `test/skills.test.mjs`, change A23 to `const AGENTS_WORD_CAP = 800;`.
- **Preserve:** line 1 `# AGENTS.md`, line 3 (the pointer, byte-identical), and the headings "Hard rules", "Request triage (first reply to non-trivial work)", "Phase boundary", and "Complexity gates".
- **Check:** `npm test` passes "AGENTS.md word count stays under cap" (expected about 725). As a negative check, the old file would fail at 999 > 800.

**S-09 · R-06, D-04, C-04 · installer and test**

- **Edit 1:** in `bin/install.mjs`, replace the whole `writeClaudeMd` function (from A24 through its closing `}`, including the now-unused `agentsPath` constant) with C-04.
- **Edit 2:** in `test/install.test.mjs`, insert these lines after the A25 line:

  ```js
      const claudeMd = fs.readFileSync(path.join(home, '.claude', 'CLAUDE.md'), 'utf8');
      assert.match(claudeMd, /^@~\/\.agents\/AGENTS\.md$/m);
  ```

- **Preserve:** `installUser` still calls `writeClaudeMd(home, agentsSkills)`, and `.codex/AGENTS.md` is still written.
- **Check:** `npm test`. The "user install through a symlinked skills tree" test passes. As a negative check, reverting Edit 1 makes the new assertion fail.

**S-10 · README**

| Anchor | Replace with |
|---|---|
| A26 | ``(+ `~/.codex/AGENTS.md`; `~/.claude/CLAUDE.md` imports it) |`` |
| A27 | ``ownership, hard rules (including **verify, don't guess**), **request triage**, change discipline, phase boundary, complexity gates, roles.`` |
| A28 | `Detailed questions + two-part plan: why (decisions, contracts) and do (preflight, anchored steps, checks)` |
| A29 | ``Planning uses `.agents/skills/plan-change/QUESTION-BANK.md` and `PLAN-TEMPLATE.md` (plus `UI-SPEC.md` for design references).`` |

- **Check:** `git grep --no-index -F -n -e 'implementation story' -- README.md` → no output.

**S-11 · verify:** run the whole §7 matrix (V-01 to V-06) and report results with evidence labels.

**S-12 · reinstall (needs your explicit approval at that time)**

- **Prerequisite:** S-11 green.
- **Command:** `node bin/install.mjs --user --compat` from the repository root.
- **What it rewrites:** `~/.agents/skills`, `~/.claude/skills`, `~/.cursor/skills`, `~/.agents/AGENTS.md`, `~/.codex/AGENTS.md`, `~/.claude/CLAUDE.md`.
- **Check:** V-07 to V-09.

## 7. Verification matrix

| ID | Requirement / invariant | Scenario | Expected | Command or procedure (cwd = repo root) | Step |
|---|---|---|---|---|---|
| V-01 | All | Full suite | 12 tests pass (6 install, 6 skills) | `npm test` | S-11 |
| V-02 | R-01, R-04 | Stale vocabulary gone (at the baseline this lists 8 hits in 5 files, so the check can fail) | no output | `git grep --no-index -n -F -e 'implementation story' -e 'file/symbol map' -e '§7 UI work' -e 'Readiness and handoff' -- .agents AGENTS.md README.md` | S-11 |
| V-03 | R-04 | One UI home | `Reference inventory` only in `UI-SPEC.md`; `UI-SPEC` counted in `plan-change` SKILL, PLAN-TEMPLATE, QUESTION-BANK, `review-change` (2), README | `git grep --no-index -n -F -e 'Reference inventory' -- .agents` and `git grep --no-index -c -F -e 'UI-SPEC' -- .agents README.md` | S-11 |
| V-04 | Preserve | No-execution paragraphs intact | 2 hits (`plan-change` `## Documentation-only boundary`, `review-change` `## 0. Documentation-only boundary`); the diff shows no change to either paragraph | `git grep --no-index -n -F -e 'Documentation-only boundary' -- .agents/skills` and `git diff cf4b319 -- .agents/skills/plan-change/SKILL.md .agents/skills/review-change/SKILL.md` | S-11 |
| V-05 | R-01, R-05 | Length | PLAN-TEMPLATE ≈1,250 (was 1,751); `AGENTS.md` 725 (was 999); QUESTION-BANK ≈1,305 (was 1,470); non-UI planning load (SKILL + QB + TEMPLATE) ≈3,680 (was 4,247) | `node -e "for (const f of process.argv.slice(1)) console.log(require('fs').readFileSync(f, 'utf8').split(/\s+/).filter(Boolean).length, f)" .agents/skills/plan-change/PLAN-TEMPLATE.md AGENTS.md .agents/skills/plan-change/QUESTION-BANK.md .agents/skills/plan-change/SKILL.md` | S-11 |
| V-06 | R-03, R-07 | Guard present everywhere | counts in `AGENTS.md`, `plan-change` SKILL, PLAN-TEMPLATE, `implement-change`, `review-change` (the baseline has only `plan-change` SKILL:1, from "silence is not a human decision") | `git grep --no-index -c -F -e 'installed version' -e "Verify, don't guess" -e 'silence' -- AGENTS.md .agents/skills` | S-11 |
| V-07 | R-06 | Claude loads the policy | In a fresh Claude Code session in a folder with no `AGENTS.md`/`CLAUDE.md` (e.g. `%TEMP%\ae-check`), asking "quote your 'Verify, don't guess' rule" returns the C-03 text; `/memory` lists `~/.claude/CLAUDE.md` | manual | S-12 |
| V-08 | R-01, R-02 | Planning behavior | In a product repo, a small L2 request to `plan-change` yields Part A/B, each step with an anchor and a check, and any library API cited with its installed version | manual | S-12 |
| V-09 | R-03 | Stop condition | Give `implement-change` a plan with one deliberately wrong anchor: it stops at preflight without editing and reports the anchor | manual | S-12 |

Planned checks are not evidence until they run in the implementation phase.

## 8. Stop conditions

- Any A1–A31 anchor count is not 1, or `git status` shows unexpected changes to a touched file.
- `npm test` fails before S-01 (a pre-existing failure). Report it and do not continue.
- **V-07 fails** (the import doesn't load on Windows). Do not improvise. The fallback is an absolute forward-slash import (`@C:/Users/<user>/.agents/AGENTS.md`, generated from `home` with `/` separators); C-04 and the S-09 test are revised and re-reviewed first.
- Any step needs wording that this plan does not give.

## Plan review

**r1 — NOT READY** (independent `review-change` in plan mode, fresh context, static only).

- **What held up:**
  - A1–A29 each match once, and the line ranges are correct.
  - S-01 runs before S-02/S-03 delete the text it copies.
  - The C-01 cross-references are consistent, and no other file refers to old template sections or removed `AGENTS.md` headings.
  - The description is 189 characters. C-03 is 725 words, under the 800 cap.
  - C-04 is valid JS, and the S-09 regex matches.
  - `AGENTS.md` line 1 and line 3 are preserved.
- **Findings:**
  - **F-01 IMPORTANT:** `rg` is missing, and anchors that start with `-` or contain backticks break the shell checks.
  - **F-02 IMPORTANT:** V-02/V-06 used `\|` (a literal pipe), so they passed or failed falsely. V-04 missed the `## 0.` heading. R-07 had no check.
  - **F-03 IMPORTANT:** "Part B plus cited IDs" leaves out Part A §1 Preserve and risks, which have no IDs.
  - **F-04 OPTIONAL:** the template's preflight-vs-BLOCKED wording was looser than the skill's.
  - **F-05 OPTIONAL:** a plan that adds a package would stop at preflight.
  - **F-06 OPTIONAL:** records are written after acceptance.

**r2 — how each finding was handled:**

- **F-01:**
  - Every check now uses `git grep --no-index -F -c -e '<anchor>' -- <file>` with single quotes (PowerShell-safe).
  - C-01 §5 teaches that form.
  - A30/A31 were added.
  - **Execution evidence (dry run, this session, `cf4b319`): all A1–A31 returned `<file>:1`.**
- **F-02:**
  - V-02/V-03/V-06 use repeated `-e` terms. V-04's pattern is `Documentation-only boundary`. V-06 adds `silence` for R-07.
  - **Dry run at the baseline:** V-02 lists the 8 stale hits (so it can fail), V-04 gives 2 hits, V-06 gives only `plan-change` SKILL:1.
- **F-03:** C-01, S-04 edit 5, S-05 edit 1 and S-06 edit 3 now say Part B **plus Part A §1** plus the cited IDs.
- **F-04:** fixed in the C-01 writing rule.
- **F-05:** C-01 §5 separates existing packages (installed version) from new ones (pinned version plus the step that adds them). §8 stops only when an existing version differs.
- **F-06:** recorded as a header deviation; S-00 runs first after approval.

The fixes were checked by re-running the commands; the changed sections were not independently re-reviewed. C-01 is now 1,250 words.
