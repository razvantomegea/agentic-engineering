# Planning interview coverage

Use this as a coverage guide, not a questionnaire to dump verbatim. Inspect the repository first, specialize questions to the actual change, and ask every relevant unresolved choice. There is no fixed question or round limit. Do not ask already answered questions or irrelevant hypotheticals to inflate the count.

Inspection is read-only and static. Planning writes documentation only and runs no code or shell commands. Questions about execution-dependent facts must request existing evidence or define an investigation for a separate implementation/verification phase; do not run that investigation during the interview.

## Question format and round discipline

For each question provide:

1. **ID and topic:** Q-01, with prerequisite question IDs if any.
2. **Scenario/evidence:** concrete actor, action, input, timing, and observed repository behavior (path + symbol), or clearly labeled unknown.
3. **Decision:** one explicit question about expected behavior or a tradeoff.
4. **Options:** viable choices, with a concrete consequence for each; allow another answer.
5. **Recommendation:** selected option, why it fits this system, and its cost.
6. **Impact:** requirement, file, API, state transition, test, or rollout step affected.

After each round, record answers and reasons, explain their consequences, update the draft, and expose newly unlocked questions. Track each item as answered, delegated-and-resolved, repository-verified, open, or not applicable with a reason. Keep open technical investigations separate from decisions awaiting the engineer. Do not treat suggestions as accepted answers.

Example (illustrative names; replace with inspected paths):

> **Q-07 — Retrying a save after a timeout.** The server may have saved the record even though the browser received no response. If the user presses Save again, should it retry the same operation or create a new one? A: reuse an operation ID, preventing duplicates but requiring server support. B: create a new operation, simpler but allowing duplicates. I recommend A if duplicate records are unacceptable. This determines the save contract, retry state in the feature owner, and a test that simulates a committed request with a lost response. Is duplicate prevention required, and should changing the form start a new operation?

## 1. Outcome, scope, and actors

- Who uses this capability, in which role, and what exact action starts it? What outcome solves their problem?
- What should happen in one concrete successful example, including visible output and persisted result?
- What is explicitly excluded? Which current behavior must remain unchanged?
- Which requirements are mandatory versus optional? What observable result makes each one accepted?
- Are there different rules for anonymous users, owners, administrators, or other roles?
- Are there constraints on delivery, supported platforms, dependencies, accessibility, or operating cost?

## 2. Domain rules and input/output examples

- What do ambiguous terms mean? What is the source of truth for each value?
- For each input, what type, format, range, unit, timezone, precision, default, and null/empty meaning apply?
- What happens at boundary values, with duplicates, whitespace, invalid combinations, or missing data?
- In what order do rules apply? When two rules conflict, which wins and why?
- Which concrete before/after examples distinguish the intended rule from plausible alternatives?
- Must rounding, ordering, filtering, or normalization happen before validation, storage, or display?

## 3. User journey and presentation

- What are the initial, loading, empty, success, validation-error, unavailable, and permission-denied states?
- What remains editable while work is in progress? What happens on repeated clicks or keyboard submission?
- What feedback appears, where, with what wording, and when does it disappear?
- On cancel, back, navigation, refresh, or reopening, which state survives and which is discarded?
- What keyboard/focus, screen-reader, responsive, localization, or offline behavior is required?
- Is the UI optimistic or confirmed by the server? On failure, what is restored and what can the user retry?

## 4. Behavioral home, state, and lifecycle

Inspect existing ownership before asking design questions. Present concrete options grounded in current code.

- Which existing feature owner should contain the rule, and why is extending it sufficient or insufficient?
- What is the smallest public API callers need? Which decisions remain private?
- Who owns each mutable value? What is derived rather than stored? Which invariants must always hold?
- When is an instance created, reused, reset, and disposed? What scope isolates users, tabs, requests, or feature instances?
- How do subscribers observe changes? For React, how are snapshot stability, subscription cleanup, and rerenders guaranteed?
- Which boundaries genuinely hide independent complexity? Can a proposed wrapper or file be omitted?

## 5. Contracts, persistence, and compatibility

- What exact request/response shapes and error variants cross each boundary? Which existing consumers must still work?
- Where are validation and authorization enforced? What can the client safely assume about the server?
- Which entity owns data? What constraints, nullability, uniqueness, and deletion rules apply?
- Are writes transactional? What remains after a partial write, and how is it repaired?
- Are schema changes, backfills, cache invalidation, or API version changes necessary? What deployment order preserves compatibility?
- How should existing records behave when newly required data is absent? Can older clients still read/write safely?

## 6. Timing, concurrency, and failure

- What if request A starts first but returns after request B? Which response is allowed to change state?
- What if the user changes input, navigates away, or switches account while work is pending?
- Which operations can overlap? Are they queued, cancelled, deduplicated, rejected, or allowed concurrently?
- What happens after timeout, cancellation, rate limiting, provider outage, malformed response, or partial success?
- Which errors are retryable? What retry count, delay, timeout, and idempotency scope apply?
- What recovery is automatic versus initiated by the user? What data or intent must survive a retry?

## 7. Security, privacy, performance, and operations

- Which trust boundaries and permissions apply to each action? What must fail for an unauthorized actor?
- Could input, logs, errors, analytics, or cached data expose sensitive values? What must be omitted or redacted?
- What are the expected data sizes, request rates, latency needs, and resource/cost limits? What evidence supports them?
- What logs, metrics, or visible signals distinguish success from failure without leaking data?
- Is rollout immediate or staged? Who enables the feature, and what signal triggers stopping or reverting?
- Can rollback restore code and data safely? Which effects are irreversible, and what recovery is required?

## 8. Verification and handoff

- What concrete fixtures and expected outputs demonstrate each requirement and invariant?
- Which failure and timing scenarios need automated checks? Which checks must exercise real boundaries rather than mocks?
- Which existing tests protect behavior that must remain unchanged?
- What commands, working directory, prerequisites, and expected outcomes let another implementer reproduce verification?
- If an external service or credential is unavailable, what can be checked locally and what remains unverified?
- What remaining decision would a new implementer otherwise have to make? Resolve it before marking the plan READY.

## Completion sweep

For every applicable topic, confirm there is a recorded answer, verified fact, or explicit delegated choice. Record meaningful exclusions with their reasons. Revisit affected topics after a changed answer. Stop when coverage is complete, not when a predetermined number of questions has been asked.
