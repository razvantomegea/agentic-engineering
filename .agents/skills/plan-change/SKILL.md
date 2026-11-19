---
name: plan-change
description: >-
  Use before nontrivial (L2-L3 or requested) implementation. Interviews in
  rounds, then writes a two-part plan favoring least code and one behavioral
  home. Do not use to write production code.
metadata:
  author: Razvan Tomgea
  version: "1.0.0"
  tags: engineering, planning, design
---

# Plan Change — One Obvious Home for the Feature

## Purpose

Design the smallest readable shape a human can own: one behavioral home, reuse before create, no speculative layers ([SIMPLICITY.md](../implement-change/SIMPLICITY.md)). Prefer plans that delete or merge files over ones that add them. If using Claude (house): **Opus 5.5**, effort **`high`** / **`xhigh`** (blog hard-architecture default: Fable 5.2 — use when Opus at `high` still falls short).

Make the feature understandable and changeable by another human **without a repo-wide treasure hunt**. Optimize for minimum conceptual and navigational complexity. Do not implement during this stage.

Write for a developer or agent with no conversation history. Load [QUESTION-BANK.md](QUESTION-BANK.md) before interviewing, [PLAN-TEMPLATE.md](PLAN-TEMPLATE.md) before drafting, and [UI-SPEC.md](UI-SPEC.md) when the change has a design, mockup, screenshot, or brand reference. Apply every relevant item and explain meaningful exclusions.

## Documentation-only boundary

Planning is documentation-only (see `AGENTS.md` Phase boundary): inspect files/diffs and existing evidence, ask questions, write docs — never execute code, checks, scripts, or installs. Do not edit implementation, tests, configuration, or dependencies. Snippets and commands are inert text for later phases. If a required fact needs execution, mark the plan BLOCKED, define the investigation, and resume from recorded evidence.

## 1. Discover the actual system

- Locate the user's entry point, state owner, business decisions, side effects, dependencies, and current tests.
- Trace **one representative user action** through the current system, using only the necessary files. Differentiate observed code from assumptions.
- Identify where a teammate would currently look to change one important feature rule. If the answer spans many files, explain *why*.
- Record where each fact came from (`path#symbol` at the baseline commit). For a third-party API, read the installed version from the lockfile or manifest and the signature from the installed type definitions or that version's docs; never plan against a remembered API. A fact only execution can settle becomes a Part B preflight check when the plan already says what happens if it fails; if the design depends on it, mark the plan BLOCKED.

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

A meaningful feature should have **one obvious place** for its central behavior and invariants. Prefer extending an existing owner — search for one first ([SIMPLICITY.md](../implement-change/SIMPLICITY.md) rule 9). New code starts as a plain function or module; a class/service must earn its place through state, lifecycle, transactions, or real multi-method cohesion (rule 1). Existing repository conventions win; apply this guidance where no pattern exists.

Preferred shape when separation helps:

`entry point → adapter if needed → feature owner → external boundary`

This is a responsibility map, not a mandate for four files. A small feature may live in one handler, function, or component.

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
7. **Reuse:** Does the plan call or extend existing code with the same meaning instead of duplicating it, avoid reuse without proven shared meaning, and generalize only where a real second instance exists (rules 9–10)?
8. **Comprehension:** Could a teammate explain the feature from the owner plus a few direct files?
9. **Least code:** Does this plan write less than the alternatives while staying correct and human-readable? Reject speculative files.

## 6. Write the plan

Follow [PLAN-TEMPLATE.md](PLAN-TEMPLATE.md): Part A (why) for the engineer and reviewer, Part B (do) for the implementer. Write Part B so an implementer with no conversation history finishes every step without choosing anything beyond syntax: exact contracts, one verbatim anchor per edit, one check per step. Do not replace the plan with a vague checklist.

If an alternative needs more layers/files, justify with concrete benefits — default to the design that writes less code.

## 7. Readiness gate

Simulate implementing from Part B and Part A §1 alone. Resolve every material "which file / which anchor / what value / what on failure / how do I know?"

READY only when: `OPEN QUESTIONS` empty (or delegated and resolved); every existing path, symbol, anchor, and command grounded in the baseline; every third-party API cited with its installed version and source; Part A and Part B agree; every step has a check; required plan-review findings resolved on disk.

Otherwise DRAFT or BLOCKED. Never claim plan review or planned tests prove the implementation works.

## Prerequisites

- Complexity level from `AGENTS.md` / `ship-change`; repository access for discovery.
- For UI work: design/mockup references available when fidelity matters.

## Limitations

- Documentation only — never execute checks, edit production code, or install dependencies.
- Do not empty `OPEN QUESTIONS` by silent assumptions.
- L0 stays out of formal planning unless explicitly requested.

## Troubleshooting

| Failure | Action |
|---------|--------|
| Fact needs execution | BLOCKED only when the design depends on it; otherwise Part B preflight when failure action is already defined. Record investigation; resume from evidence. |
| OPEN QUESTIONS stuck | Frontier only; recommend; wait — never invent product answers |
| Design grows layers | Challenge §5; prefer merge/reuse; cite SIMPLICITY rules 1, 8–9 |
| Plan rejected in review | Resolve BLOCKING/IMPORTANT; re-save before acceptance |

## Examples

- **Use:** "Plan the billing webhook retry feature (L2)."
- **Do not use:** "Just implement it" without a plan when L2+ → route via `ship-change`; agent coding → `implement-change`.
