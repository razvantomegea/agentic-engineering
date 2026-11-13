---
name: plan-change
description: >-
  Use before nontrivial (L2-L3 or requested) implementation. Interviews in
  rounds, then writes a decision-complete plan: file/symbol map, code samples,
  ordered steps, checks. Documentation only.
---

# Plan Change — One Obvious Home for the Feature

Make the feature understandable and changeable by another human **without a repo-wide treasure hunt**. Optimize for minimum conceptual and navigational complexity. Do not implement during this stage.

Write for a developer or agent with no conversation history. Load [QUESTION-BANK.md](QUESTION-BANK.md) before interviewing and [PLAN-TEMPLATE.md](PLAN-TEMPLATE.md) before drafting. Apply every relevant item and explain meaningful exclusions.

## Documentation-only boundary

Planning is documentation-only (see `AGENTS.md` Phase boundary): inspect files/diffs and existing evidence, ask questions, write docs — never execute code, checks, scripts, or installs. Do not edit implementation, tests, configuration, or dependencies. Snippets and commands are inert text for later phases. If a required fact needs execution, mark the plan BLOCKED, define the investigation, and resume from recorded evidence.

## 1. Discover the actual system

- Locate the user's entry point, state owner, business decisions, side effects, dependencies, and current tests.
- Trace **one representative user action** through the current system, using only the necessary files. Differentiate observed code from assumptions.
- Identify where a teammate would currently look to change one important feature rule. If the answer spans many files, explain *why*.

## 2. Resolve choices and preserve the planning contract

Use the complexity level from `AGENTS.md` / `ship-change`.

- **Level 0:** skip formal planning unless explicitly requested.
- **Level 1:** default is an **inline plan** in chat (5–10 lines: behavioral home, files/symbols, steps, checks, assumptions) — not a saved `docs/plans/` file. Save a full plan only when the engineer requests exhaustive planning or the change grows to L2. Explicit requests for exhaustive planning override brevity defaults at every level.
- **Level 2–3:** full saved plan + decision records + plan-mode `review-change` before acceptance.

After discovery and **before round 1**, play back in at most 5 lines: goal, scope, preserved behavior, and KNOWN / ASSUMED / UNKNOWN. Ask the engineer to confirm or correct.

Start a living draft after discovery, then resolve material choices in rounds. The **frontier** contains questions whose prerequisites are settled. Discover repository facts yourself; present the frontier with recommendations; wait for answers; then unlock dependents. Ask as many detailed rounds as needed. Group independent questions by topic. Finish when no material choices remain open and the engineer confirms shared understanding.

Use the question format and round discipline in [QUESTION-BANK.md](QUESTION-BANK.md). Do not ask the engineer to locate code you can inspect. Record answers faithfully; a recommendation or silence is not a human decision. Never empty `OPEN QUESTIONS` by silently converting unresolved behavior into assumptions.

- **Level 1 (when a saved plan is used):** keep decisions inline in the plan's `DECISIONS` section.
- **Level 2–3:** record rounds in `docs/decisions/<YYYY-MM-DD>-<slug>.md`; maintain `GLOSSARY.md` lazily; hard-to-reverse tradeoffs in `docs/adr/` (Level 3 expects ≥1 ADR). Link records from the plan.

Save under the repo's plan location, else `docs/plans/<YYYY-MM-DD>-<slug>.md`. For L2–3, verify plan + records on disk, sections complete, and `OPEN QUESTIONS` empty before acceptance. Run `review-change` in plan mode; resolve BLOCKING and IMPORTANT first.

Obtain acceptance before `implement-change` or `guided-implementation`. Material changes to accepted behavior, ownership, contracts, or rollout reopen affected decisions.

## 3. Prefer one cohesive behavioral home

A meaningful feature should have **one obvious place** for its central behavior and invariants. Prefer an existing feature service/manager/module. Existing repository conventions win; apply this guidance where no pattern exists.

Preferred shape when separation helps:

`entry point → adapter if needed → feature owner → external boundary`

This is a responsibility map, not a mandate for four files. A small feature may live in one handler or component. Do not wrap a single function in a class only to comply.

A cohesive owner may hold multiple methods, validations, transitions, and edge cases **for one feature**. Extract a separate module only for a real independent reason to change. Never automatically create `utils/`, `helpers/`, `factories/`, `strategies/`, `selectors/`, or forwarding layers. Prefer composition over god managers; keep a small public API.

## 4. Framework boundary, when applicable

Keep domain logic independent of a framework where that simplifies the design. Adapters translate lifecycle/transport/presentation without duplicating mutable state. When a feature owner holds state, plan lifetime, observation, and cleanup (`useSyncExternalStore` when needed; simple local UI state may need no manager).

## 5. Challenge design complexity

1. **Behavioral home:** Which ONE module would I open first?
2. **Human navigation:** Which other files are genuinely necessary? Can any be merged?
3. **Public API:** What few operations must a caller understand?
4. **Ownership:** Who owns state, rules, side effects, failure handling?
5. **Change amplification:** Can a foreseeable requirement change mainly in one place?
6. **Tradeoff:** Is extracting a helper better than a private function beside its caller?
7. **Scope:** Are we introducing reuse without proven shared meaning?
8. **Comprehension:** Could a teammate explain the feature from the owner plus a few direct files?

## 6. Write the implementation story

Follow [PLAN-TEMPLATE.md](PLAN-TEMPLATE.md). Be explicit; do not replace the plan with a vague checklist.

- Tell the before/after story with concrete values through callers, rules, state, side effects, and failure/timing branches.
- Ground existing paths/symbols in inspected files; mark proposed ones; cite revision and stable symbols.
- Include destination-labeled code samples for contracts, core logic, integration, and important tests. Label exact proposed code vs illustrative pseudocode; no consequential TODOs or ellipses.

If an alternative needs more layers/files, justify with concrete benefits.

## 7. Readiness gate

Simulate implementing from the plan alone. Resolve every material "which file / what value / what on failure / how do I know?"

READY only when: `OPEN QUESTIONS` empty (or delegated and resolved); references verified; requirements, narrative, map, contracts, samples, steps, and verification agree; every step has completion evidence; required plan-review findings resolved on disk.

Otherwise DRAFT or BLOCKED. Never claim plan review or planned tests prove the implementation works.
