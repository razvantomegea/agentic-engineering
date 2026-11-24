# AGENTS.md

Canonical source: this repository (`agentic-engineering`). Install with `npx github:razvantomegea/agentic-engineering` (`--user` → `~/.agents/skills` + `~/.agents/AGENTS.md` + vendor policy; `--repo .` → `.agents/skills`). Use `--compat` for vendor skill mirrors (Claude, Cursor, Antigravity, Gemini). Local shim: `scripts/sync-user-skills.ps1`. A product repo's README and `docs/` win for local facts.

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

Inspect the relevant code, patterns, and boundaries first; reuse existing abstractions; justify any new architecture by why existing patterns fall short. Prefer not writing code: the smallest readable change a human can own. Code follows the Code Simplicity Contract (`implement-change/SIMPLICITY.md`). Trivial changes proceed directly.

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

If using Claude — house ladder: explore/plan/review → **Opus 5.5** **`high`** / **`xhigh`**; implement → **Sonnet 5.5** **`medium`**; single-file / single-file context → **Haiku 5.5** **`low`** / **`medium`**. Raise effort before switching models; **Fable 5.2** when Opus at `high` still falls short (hardest/L3). Blog baseline: start most work Opus 5.5 `medium`; well-scoped coding → Sonnet; Haiku → short prompts, classification/routing, search-read subagents. Always name effort with the model. Claude — Thinker (explore, plan). Cursor — Builder (implement, debug). Codex — Skeptic (review). Claude/Cursor — Teacher (handoff). Load skills on demand (`engineering-copilot` when unsure which applies); skip unrelated reads.

## Ownership gate

A meaningful change is complete only after `engineering-handoff`: the engineer can explain its problem, behavioral home, flow, decisions, invariants, failure modes, and verification, and has passed the quiz. Reading an explanation is not ownership.
