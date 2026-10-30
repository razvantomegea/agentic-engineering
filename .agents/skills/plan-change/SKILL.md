---
name: plan-change
description: >-
  Plan meaningful engineering changes using a human-centered, feature-oriented
  architecture: clear behavioral home, deep cohesive modules, minimum navigational
  complexity, explicit state ownership, and few necessary files. Use before
  nontrivial implementation or architectural changes. Produce a detailed,
  decision-complete implementation story with explicit questions, verified paths,
  code examples, ordered steps, and observable acceptance checks.
---

# Plan Change — One Obvious Home for the Feature

Your job is to make the feature understandable and changeable by another human **without a repo-wide treasure hunt**. Optimize for minimum conceptual and navigational complexity, not minimal line count or maximal reuse. Do not implement during this stage.

Write for a developer or agent with no conversation history: they should not need to invent product behavior, rediscover the design, or guess how the pieces connect. Load [QUESTION-BANK.md](QUESTION-BANK.md) before interviewing and [PLAN-TEMPLATE.md](PLAN-TEMPLATE.md) before drafting. Apply every relevant item and explain meaningful exclusions.

## Documentation-only boundary

Planning may inspect existing files, diffs, and previously recorded evidence, ask questions, and create or update planning documentation. It must not execute code: no tests, builds, linters, type checks, project/package scripts, application startup, snippets, probes, benchmarks, migrations, installers, or dependency installation. Do not delegate execution to another agent or tool during planning. Use file-reading/search tools for inspection and document-editing tools for writes; do not run shell commands or scripts to inspect, generate, or validate the plan.

Do not edit implementation, tests, configuration, or dependencies. Code examples and commands are inert text inside documentation for later implementation/verification. Verify references by static inspection only. When a fact requires execution to establish, document the exact investigation, expected evidence, and affected decision; mark the plan BLOCKED when that fact is required for readiness. Hand the investigation to a separately authorized implementation/verification phase and resume planning from its recorded evidence. Never execute it under the planning phase.

## 1. Discover the actual system

- Locate the user's entry point, state owner, business decisions, side effects, dependencies, and current tests.
- Trace **one representative user action** through the current system, using only the necessary files. Differentiate observed code from assumptions.
- Identify where a teammate would currently look to change one important feature rule. If the answer spans many files, explain *why*.

## 2. Resolve choices and preserve the planning contract

Use the complexity level from `AGENTS.md` / `ship-change`. Skip formal planning for Level 0 unless explicitly requested. Level 1 may use a smaller plan because fewer decisions apply, but must not omit necessary detail. An explicit request for exhaustive planning overrides brevity defaults at every level.

Start a living draft after discovery, then resolve material choices with the engineer in rounds before declaring it ready. The **frontier** contains questions whose prerequisites are settled. Discover repository facts yourself; present the current frontier together with recommendations, wait for answers, then address dependent questions. Ask as many detailed, explicit questions and follow-up rounds as needed; do not impose a total question limit. Group independent questions by topic. Small batches improve answerability, not reduce coverage. Finish when no material choices remain open and the engineer confirms shared understanding.

For each question, include a stable ID, the exact scenario and current evidence, the decision needed, viable options with consequences, a recommendation with reasons, and what the answer changes in the plan (behavior, path, contract, test, or rollout). Avoid vague prompts such as 'Any edge cases?' Ask about concrete inputs, timing, failures, and expected results. Separate repository facts to investigate from user choices. Do not ask the engineer to locate code you can inspect.

Record answers faithfully; a recommendation, silence, or unanswered question is not a human decision. Reconcile contradictory answers explicitly. If the user delegates choices, record the delegation and reasoned selections; do not label them user-confirmed. Continue independent discovery while blocked, but leave dependent steps unready. Never empty `OPEN QUESTIONS` by silently converting unresolved behavior into assumptions. Define a concrete discovery task and completion evidence for unknown technical facts.

- **Level 1:** keep decisions and their reasons inline in the plan's `DECISIONS` section.
- **Level 2–3:** record each round's questions, options, recommendation, human decisions and reasons in `docs/decisions/<YYYY-MM-DD>-<slug>.md` as they resolve. Maintain `GLOSSARY.md` for resolved domain terms, creating it lazily when needed. Record hard-to-reverse architectural tradeoffs in `docs/adr/`; Level 3 expects at least one ADR.
- Reuse the repository's existing glossary and decision/ADR locations. Link the records from the plan so review and handoff can recover the rationale without the chat.

Save the plan in the repository's existing plan location, otherwise `docs/plans/<YYYY-MM-DD>-<slug>.md`. Keep the plan, decisions, and question statuses synchronized after each round. For Level 2–3, verify the plan and required records exist on disk, all required sections are complete, and `OPEN QUESTIONS` is empty before requesting acceptance. Run `review-change` in plan mode and resolve BLOCKING and IMPORTANT findings first. For Level 1, self-check the same readiness criteria; independent review is optional unless requested.

Obtain acceptance before `implement-change` or `guided-implementation`; acceptance already given for the same direction counts. Record the accepted plan revision and scope. Material changes to accepted behavior, ownership, contracts, or rollout reopen affected decisions; routine implementation details do not require repeated approval.

## 3. Prefer one cohesive behavioral home

A meaningful feature should have **one obvious place to inspect for its central behavior and invariants**. Prefer an existing feature service/manager/module; when a class meaningfully groups behavior, lifecycle, or state, a framework-agnostic `FeatureManager` or `FeatureService` is a good default.

Preferred conceptual shape when the feature warrants separation:

`React component (presentation) -> thin hook/adapter (reactivity/lifecycle) -> feature manager/service (behavior/state transitions/orchestration) -> external APIs/infrastructure`

This is a **responsibility map**, not a mandate to create four files/layers. A small feature may reasonably live in one component or one hook. Do not wrap a single function in a class only to comply with this policy.

### Meaning of "single responsibility"

A cohesive service can own multiple methods, helpers, validations, state transitions and edge cases **for one feature or one reason to change**. Single responsibility does NOT mean one function per file, one class per operation, or a constellation of pure utility functions.

- Keep small pure calculations next to their feature when they are local implementation details, including as private functions/methods.
- Extract a separate module only for a **real independent reason to change**: substantive reusable domain knowledge, a separate subsystem, meaningful external boundary, or a file whose internal complexity genuinely impedes comprehension.
- Never automatically create `utils/`, `helpers/`, `factories/`, `strategies/`, `selectors/`, or forwarding service layers.
- Prefer composition over large god managers. A manager owns one cohesive feature; do not make it own unrelated business domains, all I/O, rendering, or application-wide state.
- Prefer an explicit, small public API. Internals and algorithms should remain private.

## 4. React/framework boundary

Domain logic should not depend on React where avoiding that dependency is straightforward. UI components render and emit intentions; hooks adapt the React lifecycle/state mechanism. **Do not duplicate the same mutable source of truth** in both a manager and a hook. For an external stateful manager, explicitly plan a supported subscription/invalidation mechanism (for example `useSyncExternalStore` with stable snapshots) and instance lifetime/cleanup. For simple local UI state, ordinary React state may be simpler than a manager.

## 5. Challenge design complexity

Answer:

1. **Behavioral home:** Which ONE module would I open first to understand or modify this feature?
2. **Human navigation:** Which other files are genuinely necessary to understand the normal flow? Can any be removed/merged?
3. **Public API:** What are the few operations a caller must understand?
4. **Ownership:** Who owns state, business rules, side effects, and failure handling?
5. **Change amplification:** Can a foreseeable requirement change be made mainly in one place?
6. **Tradeoff:** Is extracting a helper truly better than keeping a private pure function beside its caller?
7. **Scope:** Are we introducing a reusable abstraction without proven shared business meaning?
8. **Comprehension:** Could a teammate explain the feature after inspecting the owner and at most a few directly relevant files (where practical)?

## 6. Write the implementation story

Use [PLAN-TEMPLATE.md](PLAN-TEMPLATE.md). Be explicit and detailed; do not replace the plan with a summary, checklist of vague intentions, or a list of filenames.

- Explain **why** the change exists, **where** behavior lives today and will live next, **who** owns each responsibility, **what** changes, **how** data and control move, and **when** operations and failures occur.
- Tell the before/after story using concrete values. Follow the trigger through each relevant caller, rule, state transition, side effect, and visible outcome. Include realistic failure and timing branches.
- Ground existing paths, symbols, imports, signatures, and commands in inspected files. Mark new paths and proposed APIs explicitly. Cite the inspected revision and stable symbols; line numbers alone go stale.
- Include code samples for changed contracts, core decision logic, integration points, and important tests. Name the destination path and symbol for every sample. Explain its role and how it connects to adjacent steps.
- Label snippets as exact proposed code or illustrative pseudocode. Exact code must agree with inspected APIs/imports; state whether it has been executed. Pseudocode must still specify every material branch, input, output, error, and side effect. Do not hide important behavior behind ellipses, TODOs, or 'handle errors.'
- Break work into dependency-ordered steps with specific edits, prerequisites, rationale, sample logic, verification commands and expected results. Each step must be executable without inventing design decisions.
- Map requirement IDs to decisions, steps, and checks. Include negative cases, invariants, and relevant regression behavior.
- Prefer detailed explanations of the actual change over generic tutorials or duplicated repository contents. A 30-second overview is an orientation aid, never a substitute for the complete plan.

If an alternative requires more layers/files, justify the additional concepts with concrete benefits. Do not invent a layer count quota or imaginary future extensibility.

## 7. Readiness gate

Before handoff, simulate implementing the plan using only its contents and linked repository evidence. Identify every place a new implementer would have to ask 'which file?', 'what value?', 'what happens on failure?', or 'how do I know this worked?' Resolve each material gap.

A plan is READY only when:
- Relevant questions are answered or explicitly delegated and resolved; `OPEN QUESTIONS` is empty.
- Existing references are verified; proposed additions are labeled; no unresolved technical fact is required to implement.
- Requirements, narrative, file map, contracts, code samples, ordered steps, and verification agree.
- Every step has sufficient logic and observable completion evidence; deployment/rollback details are present when applicable.
- Required plan review findings are resolved and records are available on disk (check using file inspection, not command execution).

Otherwise mark it DRAFT or BLOCKED, name missing decisions/evidence, and continue discovery or questioning. Never claim that plan review, example code, or planned tests prove the implementation works.
