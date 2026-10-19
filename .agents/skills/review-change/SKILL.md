---
name: review-change
description: Independent, adversarial review of correctness and human maintainability, focusing on one obvious feature-logic owner, narrow interfaces, class/service cohesion, minimal navigation, change amplification, React reactivity, and meaningful tests.
---

# Review Change — Could a Human Own This?

Act as a skeptical reviewer using the spec and actual diff, preferably in a fresh context. Verify facts in affected code and callers, not the implementation agent's explanations. Do not invent findings.

## 1. Behavior and correctness

Check requirements/invariants, realistic edge cases, errors, security, concurrency/races, stale responses, cleanup, performance where relevant, and tests. State exactly which checks were run or not run.

## 2. Architecture and human navigation

- **One obvious home:** Where does the core feature behavior live? Can a developer locate it without chasing unrelated files?
- **Trace the path:** Trace one normal action and one failure path. Count meaningful conceptual jumps rather than demanding an arbitrary file limit.
- **Cohesion:** Does the manager/service have one feature-oriented reason to change, or does it own unrelated concerns (god class)?
- **Depth:** Does its small interface hide meaningful complexity? Are helper/services just pass-through layers?
- **Fragmentation:** Are related decisions scattered among hooks, utility files, selectors, reducers, effects, and components when they could remain private/co-located?
- **React correctness:** If using a stateful class, does subscription/instance lifetime/cleanup work, and are snapshots and sources of truth correct?
- **Change amplification:** Would one routine change require edits in many unrelated locations?
- **DRY:** Are business rules duplicated? Equally, did superficial syntax similarity produce a coupling-heavy shared helper?
- **Abstraction justification:** Would removing a class, hook, file, interface or factory make the code more understandable without losing behavior?
- **Framework agnosticism:** Is framework-independent domain logic unnecessarily coupled to React, or did framework-independent layering add unjustified costs?

Do **not** automatically criticize a long cohesive module, local pure functions, non-OOP code, or an intentional duplicate. Report only concrete costs/risks. Do not prescribe a class if a simple module or hook is clearer.

## 3. Severity and evidence

- **BLOCKING:** correctness/security/data loss or architecture severe enough to compromise the change.
- **IMPORTANT:** likely future maintenance/debugging harm supported by concrete evidence.
- **OPTIONAL:** small quality improvement; omit subjective nitpicks.

For each: path/line -> evidence -> actual cost/failure -> smallest useful correction.

## 4. Short output

1. Findings ordered by severity.
2. **Human navigation verdict:** primary behavioral home and path through the feature; identify unjustified jumps.
3. **Cohesion verdict:** deep feature module vs fragmented helpers vs god object.
4. **Simplify:** precise candidate merge/removal if genuinely beneficial, otherwise 'none'.
5. Verification status and residual risks.

Do not modify code unless asked. No invented scores, no generic lectures.
