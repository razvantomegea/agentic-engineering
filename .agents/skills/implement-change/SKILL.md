---
name: implement-change
description: >-
  Implement accepted engineering changes with one obvious behavioral home,
  cohesive modules, minimal indirection, efficient context and tool usage,
  concise high-signal updates, and evidence-backed verification. Use during
  implementation, not planning-only or review-only work.
---

# Implement Change — Correct Code, Minimum Waste

Produce correct, verifiable, human-readable software with the fewest necessary concepts. Follow the accepted plan and repository conventions. **Save tokens by removing repetition and irrelevant work, never by hiding uncertainty, skipping required checks, or making code cryptic.**

## 0. Operating contract

- **Plan is the contract.** For planned work, read the accepted plan and linked decisions **from disk** before editing. Do not implement from a chat summary. Compare its recorded baseline with current relevant files. For Level 2–3, confirm recorded plan review and acceptance. Trivial changes retain the direct implement/verify path.
- **Repository evidence wins over stale examples.** Confirm affected paths, symbols, dependencies, and contracts before editing. Illustrative pseudocode expresses intended behavior, not paste-ready code. Check exact proposed snippets against current APIs.
- **Preserve scope.** Do not silently change product behavior, public contracts, state ownership, error policy, or rollout. If a material decision is absent or contradicted, pause that step and return the exact gap to `plan-change`. Continue independent safe work if possible. Obtain required renewed review/acceptance for material revisions; routine mechanical adjustments do not require it.
- **Respect `AGENTS.md`.** Its security, dependency, execution, and change rules apply. Do not use token savings to bypass permissions or verification.
- **Implement; don't re-plan by default.** Make decisions already resolved by the plan. Ask only when a genuinely missing consequential choice blocks the affected step.

## 1. Efficient context acquisition

Use the smallest evidence set sufficient to implement safely:

1. Read the accepted plan, scoped requirements, and relevant decision records once. Extract a compact working map: **step, behavioral home, exact paths, contract/invariants, checks, unresolved risks**. Keep it internally; don't echo the entire plan.
2. Inspect the affected owner, direct callers, interfaces, existing tests, and necessary integration boundaries. Discover file names before opening unrelated directories. Search for exact symbols before broad text searches.
3. Prefer targeted file reads, relevant diff hunks, and bounded search results over whole-repository dumps. Batch independent reads when supported. Expand scope only when a dependency, failure path, or unexpected result justifies it.
4. Reuse facts already inspected in this task. Re-read only after edits, conflicting evidence, or a meaningful context gap. Do not repeatedly load the same instructions, logs, or long files.
5. Inspect tool errors and the smallest useful failing output first. Follow the evidence outward; don't repeatedly retry unchanged failing commands or guess at fixes.

**Never optimize away necessary context.** Read complete relevant functions or files when isolated snippets would hide control flow, side effects, or contracts. Do not conceal key evidence through aggressive truncation.

## 2. Small, coherent implementation loop

For each accepted plan step:

1. **Locate:** confirm the current code and precise edit point.
2. **Change:** implement the smallest coherent behavior, including required failure and edge cases.
3. **Check:** run the narrowest relevant authorized check that can reveal a mistake; inspect the result. Where checks must be deferred, record why.
4. **Update:** mark the completed plan step and actual evidence, as required by the workflow. Do not claim success from an unrun check.
5. **Continue:** advance only when the next dependency is understood. Escalate unexpected architecture, behavior, or contract changes to the plan rather than improvising.

Keep increments small enough to diagnose, but not so tiny that every line requires a check or a status message. Avoid speculative edit-test loops. If a check fails, establish the failure cause before making another change. Preserve existing tests; never weaken them to make an implementation pass.

## 3. One obvious behavioral home

- Keep feature rules, invariants, validation, state transitions, orchestration, and feature-specific failures close together when cohesive.
- Prefer an existing feature owner with a small public API. Introduce a class/service only when it gives real value through state, lifecycle, transactions, or orchestration; a function or module can be better.
- Keep local pure calculations as private helpers beside their feature. Don't spawn `Service -> Helper -> Utils -> Strategy` chains without distinct responsibilities.
- Every new file or boundary must repay its navigation cost through a real concern: domain responsibility, transport, persistence, lifecycle, presentation, or meaningful reuse.
- Avoid god managers, pass-through adapters, needless injection frameworks, redundant state, speculative options, and unrelated refactors.
- DRY business knowledge and invariants, not incidental syntax. Small local duplication can be clearer than shared coupling.
- Preserve clear names, readable branching, types, and useful comments. **Never compress production code or erase existing comments merely to save response tokens.**

### Framework integration

Keep adapters focused on UI, transport, scheduling, or lifecycle. Give mutable state one explicit owner and a reliable observation/cleanup mechanism. In React, hooks may own UI state; external state owners require correct subscriptions and stable snapshots. Put storage/external API boundaries where they make behavior clear, without inventing layers.

## 4. Token-efficient communication (Caveman-inspired)

**Technical substance stays; ceremony goes.** Applies to chat/tool reporting, not code quality or durable documentation.

- **Answer/result first.** State material outcome, blocker, decision, or failure before explanation. Prefer direct sentences and established technical terms; avoid filler and repeated recaps.
- **Speak on phase changes, blockers, meaningful discoveries, and outcomes.** One short update before a substantial multi-step operation; don't narrate routine file reads, edits, or each tool call. Follow any host-required progress or safety updates.
- **Use the smallest sufficient payload.** In chat, show changed lines plus a little context when useful. Don't paste whole files, lengthy logs, or the accepted plan unless requested. Link exact paths and point to decisive errors. Never abbreviate code, commands, paths, names, numerical values, or error messages ambiguously.
- **Keep state concise.** For long tasks or context transitions, write a short factual checkpoint: completed plan steps, files changed, decisions, checks with revision/results, current blocker, next step. Don't regenerate a large narrative or claim an unsaved checkpoint exists.
- **Avoid duplicate reports.** Keep detailed reasoning in the plan/decision record when required; in chat report only new decisions, deviations, and actionable evidence. Do not restate unchanged context in each update.
- **Full sentences when precision matters.** Preserve negations, ordering, preconditions, security warnings, irreversible-action explanations, and questions. No forced caveman grammar, invented abbreviations, or unexplained shorthand.
- **Durable artifacts remain readable.** Code, comments, tests, commit/PR text, and handoff documentation must meet normal professional standards, even if chat updates are terse.

## 5. Risk-based verification, not shortcut verification

Use targeted checks during each increment and the **relevant complete verification** before declaring done. Prefer established repository commands; follow `AGENTS.md` execution permissions. If execution isn't authorized, list exact checks for the authorized verification phase instead of implying they ran.

- **Trivial/local:** focused test or static/type/lint check as applicable.
- **Behavioral/stateful:** relevant unit/integration tests plus negative cases, state transitions, and regression behavior.
- **Cross-boundary/high-risk:** security, concurrency, persistence, payment, migration, external API, or public contract checks; appropriate integration/E2E, build, and broader regression checks.

Avoid rerunning an unchanged broad suite after every local edit unless required by risk. Re-run affected checks after corrections. Run broader checks at meaningful integration points and before completion as appropriate. Never skip a necessary check solely to reduce tokens or runtime.

For each important invariant, establish what evidence supports it: test result, type/static analysis, code inspection, or separately produced formal proof. Never call static reasoning a mathematical proof. Attribute tests or logs to the phase and code revision that produced them; stale evidence is not a pass for the new change. If a check cannot run, state the reason, impact, and exact outstanding command/scenario.

## 6. Mandatory self-review before handoff

Inspect the final diff and check:

1. **Behavior:** Does the result match the accepted spec, including critical invariants, negative cases, failure paths, and recorded deviations?
2. **Navigation:** Is there one obvious primary behavioral home and a short trace from entry point to external boundary?
3. **Cohesion:** Are related decisions needlessly fragmented, or is one owner absorbing unrelated domains?
4. **State:** Are source of truth, lifetime, notifications, concurrency, and cleanup correct where applicable?
5. **Simplicity:** Could an added file, wrapper, option, variable, or indirection be removed without losing clarity or behavior?
6. **Scope:** Were unrelated files and architectural boundaries left intact? Do names and code match repo conventions?
7. **Verification:** Which relevant checks passed at this revision, failed, or were not run? Are required regression scenarios covered?

Fix concrete defects, not aesthetic preferences. Preserve any required independent `review-change` phase; this self-review does not replace it.

## 7. Concise, evidence-backed completion

End with a compact report:

- **Changed:** primary behavioral home and one-line normal flow; other changed files only when their purposes aren't obvious.
- **Why:** material design choices or deviations from the accepted plan, not routine syntax.
- **Verified:** exact checks and results; clearly distinguish checks performed here from supplied evidence.
- **Remaining:** known risks, blockers, and checks not run, with reasons.

Update plan-step status and required records. `engineering-handoff` consolidates the system explanation and tests human ownership after review; it does not justify withholding important explanations during implementation.
