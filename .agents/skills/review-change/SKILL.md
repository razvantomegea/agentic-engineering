---
name: review-change
description: Independent, adversarial review of implementation plans before coding and actual changes after coding. Check decision completeness, executable steps, grounded paths and code examples, requirements coverage, correctness, and human maintainability. Use for plan-readiness review or implementation review.
---

# Review Change — Could a Human Own This?

Act as a skeptical reviewer, preferably in a fresh context. Verify facts in affected code and callers, not the author's explanations. Do not invent findings.

## Documentation-only boundary — both review modes

Review may inspect existing files, diffs, and supplied logs/results, ask questions, and write review documentation. It must not execute code: no tests, builds, linters, type checks, project/package scripts, application startup, snippets, probes, benchmarks, migrations, installers, or dependency installation. Do not delegate execution to another agent or tool during review. Use dedicated file-reading/search tools for inspection and document-editing tools for writes. If file tools fail or time out, use only narrow, read-only shell commands to list, read, or search files or inspect diffs (for example, `rg --files`, `rg -n`, `Get-Content`, or `git diff -- path/to/file`). Do not use shell scripts, pipelines, redirects, command substitution, or commands that write files, execute code, generate documentation, or validate the review.

Do not modify implementation, tests, configuration, or dependencies, even to reproduce or fix a finding. Suggested corrections and verification commands remain inert text in the review. Return fixes to implementation and missing runtime evidence to the separate verification phase. Review resumes from the resulting diff and recorded evidence. A request to fix findings requires an explicit transition out of review; it does not expand review's permissions.

Distinguish static conclusions from supplied execution evidence. Attribute supplied results to their source and revision; never claim the reviewer ran them. If runtime evidence is absent or stale, record the exact check needed and the resulting confidence/readiness limitation. All references below to checking or verifying mean static inspection or assessment of existing evidence, never execution.

## 0. Select the review mode

- **Plan mode:** review a proposed plan before implementation. Read the plan, linked decisions, relevant repository code, and `plan-change/PLAN-TEMPLATE.md` (the sibling skill's template). Do not require a code diff or report unimplemented planned changes as defects.
- **Implementation mode:** review the actual diff against requirements and the accepted plan, including recorded revisions/deviations. If no plan was required, use the request/spec and state that basis. Do not manufacture a missing-plan failure for trivial work.
- If both are requested, report separate verdicts. A ready plan is not evidence of a correct implementation. State missing access/context and its effect on confidence.

### Plan mode: can a new implementer execute this?

Mentally execute the steps in dependency order using only the plan and linked repository evidence:

1. Trace each requirement through decisions, narrative, edit locations, samples, steps, and acceptance checks. Identify contradictions, missing branches, vague expected outcomes, or scope expansion.
2. Verify existing paths, symbols, imports, APIs, and commands against the inspected baseline. Check new paths/APIs are marked proposed and connected to actual callers. Check the plan accounts for relevant current changes.
3. Follow one concrete normal action and each consequential failure/timing branch from trigger to observable result. Can the implementer determine exact inputs, outputs, state transitions, side effects, ordering, and recovery?
4. Check code examples: destination, signature, dependencies, central logic, caller wiring, and consistency with prose. Do ellipses, TODOs, invented APIs, or 'handle errors' conceal a decision? Are pseudocode and unexecuted exact code honestly labeled?
5. Inspect each implementation step for prerequisites, exact edits, rationale, preserved behavior, and observable completion evidence. Identify any product/design decision silently delegated to the builder.
6. Check state ownership, lifecycle, subscriptions, security, compatibility, migrations, rollout, and rollback where relevant. Apply the architecture checks below to the proposed design.
7. Check question/decision provenance: recommendations are not answers, delegated choices need actual delegation, and unresolved technical facts are still open. Verify required records exist and OPEN QUESTIONS is genuinely empty before a READY verdict.
8. Verify planned tests have concrete fixtures/assertions and cover important negative/regression cases. Distinguish checks already run from future verification.

Report **READY** or **NOT READY**, the reviewed revision, and evidence-backed findings using section/step IDs plus repository paths/symbols. Include the precise missing decision or question and smallest correction. BLOCKING/IMPORTANT gaps prevent READY; OPTIONAL suggestions do not. If evidence is inaccessible, say what cannot be validated rather than inventing a defect or giving unconditional readiness. Return material choices to `plan-change`; do not silently redesign the plan.

## 1. Behavior and correctness

In implementation mode, statically inspect requirements/invariants, realistic edge cases, errors, security, concurrency/races, stale responses, cleanup, performance where relevant, and test coverage. Compare the actual behavior to plan decisions and acceptance criteria; identify material unrecorded deviations. State which checks have supplied execution evidence, who/which phase ran them and at what revision, and which remain unverified. The reviewer executes none.

## 2. Architecture and human navigation

- **One obvious home:** Where does the core feature behavior live? Can a developer locate it without chasing unrelated files?
- **Trace the path:** Trace one normal action and one failure path. Count meaningful conceptual jumps rather than demanding an arbitrary file limit.
- **Cohesion:** Does the manager/service have one feature-oriented reason to change, or does it own unrelated concerns (god class)?
- **Depth:** Does its small interface hide meaningful complexity? Are helper/services just pass-through layers?
- **Fragmentation:** Are related decisions scattered among helpers, adapters, handlers, and state owners when they could remain private/co-located?
- **State correctness:** If a stateful owner is used, do its lifetime, update notification, cleanup, and source of truth work for the chosen language and framework?
- **Change amplification:** Would one routine change require edits in many unrelated locations?
- **DRY:** Are business rules duplicated? Equally, did superficial syntax similarity produce a coupling-heavy shared helper?
- **Abstraction justification:** Would removing a class, hook, file, interface or factory make the code more understandable without losing behavior?
- **Framework boundary:** Is domain logic unnecessarily coupled to framework details, or did an extra framework-independent layer add unjustified costs?

Do **not** automatically criticize a long cohesive module, local pure functions, non-OOP code, or an intentional duplicate. Report only concrete costs/risks. Do not prescribe a class if a simple module or hook is clearer.

## 3. Severity and evidence

- **BLOCKING:** correctness/security/data loss or architecture severe enough to compromise the change.
- **IMPORTANT:** likely future maintenance/debugging harm supported by concrete evidence.
- **OPTIONAL:** small quality improvement; omit subjective nitpicks.

In plan mode, BLOCKING also includes unresolved behavior/contracts or contradictions that prevent safe implementation; IMPORTANT includes missing integration, ordering, or verification detail that would force consequential guesswork. Do not block for formatting preferences or inapplicable template sections.

For each: path/line -> evidence -> actual cost/failure -> smallest useful correction.

## 4. Short output

1. Review mode, reviewed revision, and findings ordered by severity; include READY / NOT READY for plan mode.
2. **Human navigation verdict:** primary behavioral home and path through the feature; identify unjustified jumps.
3. **Cohesion verdict:** deep feature module vs fragmented helpers vs god object.
4. **Simplify:** precise candidate merge/removal if genuinely beneficial, otherwise 'none'.
5. Verification status and residual risks.

Write review documentation only. No invented scores, no generic lectures.
