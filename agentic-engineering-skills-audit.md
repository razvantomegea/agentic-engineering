# Agentic Engineering — Skills Audit & Improvement Plan

**Repo audited:** `razvantomegea/agentic-engineering`
**Scope:** `AGENTS.md`, `README.md`, `bin/install.mjs`, `scripts/sync-user-skills.ps1`, and all 14 skills under `.agents/skills/`.
**Goals (from the request):** (1) decrease token usage, (2) increase output code quality & model understanding, (3) improve the AI's questioning so it captures full context from the user, (4) ensure the code and logic the agent writes is as simple and self-explanatory as possible — not over-engineered, not confusing, not complicated — so a human can review it and follow the flow, (5) have the agent actively search for existing code/logic reuse, avoid hardcoding and over-particular code, and have `review-change` detect violations of the simplicity + reuse rules, (6) in `diagnose-bug` specifically, ensure the fix addresses the general class of the bug — not a too-particular patch that only prevents the specific triggering case.

---

## 0. Headline finding

The framework's *philosophy* is excellent and its *phase boundaries* (documentation-only planning/review vs. execution) are rigorous and well-defended. The dominant problem is **prompt density, not prompt correctness**: several skills ship 1,000–2,500 words of generic engineering wisdom that the model already knows, and the same load-bearing rules are restated verbatim in 4–5 files. This both inflates token cost and dilutes the signal that actually changes behavior. A focused compression pass — keep the routing, the contracts, and the domain-specific guardrails; cut the encyclopedic tutorial content — will cut skill context ~40–55% with *higher* behavioral fidelity, because the model stops skimming.

Concrete numbers measured from the repo:

| File | Bytes | Words | Verdict |
|---|---|---|---|
| `review-change/SKILL.md` | 19,870 | 2,547 | Too long; high internal repetition |
| `engineering-copilot/SKILL.md` | 17,344 | 2,547 | Encyclopedic; ~60% generic knowledge |
| `plan-change/SKILL.md` | 13,018 | 1,823 | Dense but mixes planning + architecture opinions |
| `frontend-manual-practice/SKILL.md` | 12,467 | 1,956 | Reference material masquerading as a prompt |
| `implement-change/SKILL.md` | 11,265 | 1,533 | Solid; minor tightening |
| `plan-change/PLAN-TEMPLATE.md` | 11,001 | 1,512 | Good, keep |
| `plan-change/QUESTION-BANK.md` | 8,183 | 1,214 | Good, keep — this is the crown jewel |
| `guided-implementation/SKILL.md` | 7,464 | 1,105 | Overlap with `tutor-me` / `frontend-manual-practice` |
| `AGENTS.md` | 7,112 | 977 | Healthy, but restates boundary clause also in 4 skills |
| `ship-change/SKILL.md` | 4,937 | 704 | Orchestration, good |
| `architecture-picture/HTML-PAGE.md` | 4,834 | 651 | Good scaffold |
| `audit-agent-setup/SKILL.md` | 4,324 | 598 | Good |
| `frontend-interview-drill/SKILL.md` | 2,838 | 448 | Good, tight |
| `engineering-handoff/SKILL.md` | 2,730 | 422 | Good, tight |
| `tutor-me/SKILL.md` | 2,658 | 450 | Good, tight |
| `architecture-picture/SKILL.md` | 2,375 | 348 | Good |
| `explore-system/SKILL.md` | 1,115 | 166 | Exemplary tightness — model for the others |
| `diagnose-bug/SKILL.md` | 970 | 134 | Exemplary tightness — model for the others |

Total markdown across skills + docs: **~139 KB / ~18k words**. The two largest skills (`review-change`, `engineering-copilot`) alone are **37 KB / ~5k words** and contain the most compressible content.

`explore-system` (166 words) and `diagnose-bug` (134 words) prove the repo *can* write tight, high-signal skills. The goal is to pull the long ones toward that pole.

---

## Part A — Decrease token usage

### A1. De-duplicate the "documentation-only boundary" clause (highest ROI)

The same ~120-word paragraph explaining that planning/review are documentation-only and may only use narrow read-only shell fallbacks is **restated, with minor wording drift, in 5 places**:

- `AGENTS.md` (line 73, ~180 words)
- `README.md` (line 95, ~120 words)
- `ship-change/SKILL.md` (line 16, ~150 words)
- `plan-change/SKILL.md` (lines 19–22, ~250 words across two paragraphs)
- `plan-change/PLAN-TEMPLATE.md` (line 5, ~90 words)
- `plan-change/QUESTION-BANK.md` (line 5, ~70 words)
- `review-change/SKILL.md` (lines 20–27, ~250 words)

That is **~1,100 words of the same rule**, slightly differently phrased each time. The drift is itself a risk: a model reading three subtly different versions may infer the rule is softer or harder than intended.

**Fix:** define the boundary **once**, canonically, in `AGENTS.md` → "Verification" / a new short "Phase boundaries" section. Every skill that needs to reference it links instead of restating:

> Phase boundaries are defined in `AGENTS.md` (Verification). Summary: planning and review are documentation-only — read files/diffs and existing evidence, ask, write docs; never execute code/checks/scripts. Read-only shell fallback (`rg --files`, `git diff -- path`) only when file tools fail. Pass execution to a separate implement/verify phase.

Then in each skill replace the long paragraph with one sentence + a link. Estimated saving: **~700–900 words** across the repo, and a single source of truth so the rule can't drift.

### A2. `engineering-copilot` is an encyclopedia, not a router

At 2,547 words it is the largest skill and the one most likely to be loaded as a default ("If unsure which skill applies, start with `engineering-copilot`"). Yet its job is **routing**: classify the situation → name the next skill. Instead it carries 17 situation categories (A–Q), each with a generic engineering mini-lecture, plus 9 standalone sections ("Engineering Reasoning Framework", "AI Delegation Rules", "Understanding Gate", "Explain at the Right Abstraction Level", "Avoid AI-Induced Overengineering", "Context/Token Discipline", "Learning Mode", "Architecture Decision Heuristic", "Debugging Heuristic", "Complexity Control", "Working With Multiple Agents", "Final Principle").

The irony: the skill titled "Context / Token Discipline" contains the line *"Do not read unrelated parts of the repository without reason"* while itself being the largest unrelated context dump in the repo.

Most of this content is **general engineering knowledge the model already has** (what invariants are, what race conditions are, "prefer reversible decisions", "measure before optimizing", "don't refactor without a reason"). Restating it costs tokens without changing behavior — the model doesn't need to be *told* what a race condition is to handle one well.

**Fix:** collapse `engineering-copilot` to a **routing table + 2–3 load-bearing rules**. Keep:

- The routing hierarchy diagram (lines 48–56) — load-bearing.
- A compact situation → skill table (A–Q compressed to one row each, ~1 line per row).
- The 5–7 rules that are genuinely *this repo's* stance and not generic: "match pace to comprehension", "surface meaningful changes not every edit", "no process for L0", "quiz instead of re-explaining", "context is scarce — load skills on demand".
- Move the encyclopedic domain checklists (K security, L data model, M API design, N async, O third-party) into **`plan-change/QUESTION-BANK.md`**, where they're already covered and where they're actually *used*. They don't belong in a router.

Target: **~600–800 words** (from 2,547). The router should be the cheapest skill to load, not the most expensive.

### A3. `frontend-manual-practice` ships a reference textbook

1,956 words, 15 sections. Sections 4 ("Fundamentals First"), 5 ("Framework Rotation"), 14 ("Keep Current Without Chasing Hype"), and 15 ("Suggested Six-Week Rotation") are **curriculum content**, not prompt instructions. The model knows what closures, Flexbox, and discriminated unions are. Listing them ("scope, closures, event loop, promises, async/await, modules, objects, arrays…") burns ~600 words to no behavioral effect — no model reads "closures" in a list and then handles closures better.

**Fix:** keep the *behavioral* rules (don't dump solutions, hint ladder, comprehension check, completion rule) — those change output. Cut or externalize:

- Section 4 fundamentals lists → one line: "ground framework work in browser fundamentals; if the human shows a gap (closures, event loop, CSS cascade), teach just-in-time."
- Section 15 six-week rotation → move to a separate `ROTATION.md` the human reads, not the model prompt, or delete (it's a curriculum suggestion, not a behavioral instruction).
- Section 14 hype hierarchy → collapse to "distinguish durable platform changes from hype; don't chase every library."

Target: **~700–900 words** (from 1,956). The remaining skill is purely about *how the agent behaves during practice*, which is what actually matters.

### A4. `review-change` repeats its own structure three times

2,547 words. The same axis structure (Spec / Standards / Evidence) is described in section 2 (the axes), section 4 (plan mode applies them), and section 5 (implementation mode applies them), plus a findings format defined in section 6 and re-summarized in section 7. The evidence labels (PROVEN / TESTED / STATICALLY SUPPORTED / VIOLATED / UNKNOWN) are excellent and should be **defined once** and referenced by name thereafter.

**Fix:**

- Define axes + evidence labels **once** in section 2.
- Sections 4 and 5 become short: "apply the three axes to (the plan | the diff); trace requirements to decisions/code; attempt concrete counterexamples; attribute evidence with the labels above."
- Move the elaborate "for each suspected violation, provide a concrete trace: 1. Preconditions… 2. Trigger… 3. Code path…" into a short `REVIEW-FINDING-TEMPLATE.md` companion (like `PLAN-TEMPLATE.md`), so the main skill stays scannable.

Target: **~1,200–1,400 words** (from 2,547) with *no* loss of rigor — rigor lives in the template, brevity lives in the skill.

### A5. Three skills overlap on "don't dump the solution; use a hint ladder"

`guided-implementation` (1,105 w), `tutor-me` (450 w), and `frontend-manual-practice` (1,956 w) all define a near-identical **Hint Ladder** (Question → Concept → Direction → Pseudocode → Minimal Fragment) and the same "don't write the code for them" boundary. `guided-implementation` and `frontend-manual-practice` also share "Smart Scaffolding", "Progressive Disclosure", "Just-in-Time Teaching", "Error Prevention".

**Fix:** extract one shared `HINT-LADDER.md` (or a small `shared/` snippet) under `.agents/skills/` and have each skill reference it: *"Follow the shared hint ladder (see `HINT-LADDER.md`)."* Each skill then keeps only what's *unique* to its mode:

- `guided-implementation`: the plan-step loop, batching trivial steps, environment-aware hints.
- `tutor-me`: the hard boundary (never edit/run) + "stop tutoring" exit phrase.
- `frontend-manual-practice`: the frontend-specific rotation and review order.

Saving: ~400–600 words and, more importantly, one canonical ladder so the three can't drift out of sync.

### A6. Frontmatter `description` fields are overlong

Several `description:` YAML strings are multi-sentence paragraphs (e.g. `plan-change`'s is ~60 words, `review-change`'s ~45, `frontend-manual-practice`'s ~70). These are loaded into the skill *index* every session for routing — they should be one tight trigger sentence, because the full detail lives in the body.

**Fix:** rewrite each `description` as *"Use when [trigger]. [Best agent]. [One-line output]."* Example for `plan-change`:

> Before: *"Plan meaningful engineering changes using a human-centered, feature-oriented architecture: clear behavioral home, deep cohesive modules, minimum navigational complexity, explicit state ownership, and few necessary files. Use before nontrivial implementation or architectural changes. Produce a detailed, decision-complete implementation story with explicit questions, verified paths, code examples, ordered steps, and observable acceptance checks."*
> After: *"Use before nontrivial implementation or architecture changes. Produces a decision-complete implementation story: questions, file/symbol map, code samples, ordered steps, acceptance checks. Best with Claude Opus. Documentation-only — no execution."*

Trigger clarity goes up; index token cost goes down. Apply to all 14.

### A7. `AGENTS.md` complexity table appears 3 times

The L0/L1/L2/L3 table is in `AGENTS.md` (lines 129–134), `ship-change/SKILL.md` (lines 22–27), and `engineering-copilot/SKILL.md` (categories A–D each restate the workflow). One canonical table in `AGENTS.md`; `ship-change` links; `engineering-copilot` links. ~150 words saved plus no drift risk.

### A8. Drop the README "Roles" restatement

`README.md` lines 93–97 restate the planning/review documentation-only boundary *and* the Claude/Cursor/Codex roles that `AGENTS.md` already covers. README is for humans browsing GitHub; it can keep a 2-line pointer and drop the ~120-word duplication.

**Combined Part A estimate:** ~3,500–4,500 words removable (~25–30% of total skill prose) with zero loss of load-bearing rules, because the cuts are (a) verbatim duplicates, (b) generic knowledge the model has, or (c) curriculum content that doesn't affect generation.

---

## Part B — Increase output code quality & model understanding

### B1. `plan-change` mixes planning methodology with architectural opinion — split the concern

`plan-change/SKILL.md` section 3 ("Prefer one cohesive behavioral home") and section 5 ("Challenge design complexity") bake a strong *architectural* stance (one `FeatureManager`, no `utils/`, composition over god managers, `useSyncExternalStore`) into the *planning* skill. This is unusual: most planning skills say "decide what to build and where"; this one prescribes a specific structural shape.

This has two costs:

1. **Token cost in the wrong phase** — architectural guidance is most useful *during implementation*, but `implement-change` only gets a compressed version of it. The detailed reasoning lives in `plan-change`, which the implementer may not reload.
2. **Prescriptive drift** — "Never automatically create `utils/`, `helpers/`, `factories/`…" is a hard stance that may be wrong for some repos (a repo that *already* has a `utils/` convention would be told to avoid it). Skills should respect existing repo patterns above generic architectural taste.

**Fix:** extract the architectural philosophy into a dedicated, short `code-architecture.md` skill (or a `ARCHITECTURE.md` reference) loaded by *both* `plan-change` (when deciding where behavior lives) and `implement-change` (when shaping the code). Make it explicitly **subordinate to existing repo conventions**: "Follow the repo's existing structural patterns; this guidance applies where the repo has no established pattern." That removes the prescriptive-over-repo risk and gives the implementer the same vocabulary the planner used.

### B2. `implement-change` §4 "Caveman-inspired communication" is risky without examples

The section instructs terse, "answer-first", "smallest sufficient payload" chat updates, citing a third-party "Caveman" style. This is good intent (cut ceremony) but **dangerous without a concrete before/after**, because "terse" is exactly the failure mode that hides uncertainty and skips safety context — the very thing the rest of the repo fights. A model told to "be terse" may abbreviate a destructive-operation warning or a security precondition.

**Fix:** add one explicit before/after pair showing what *stays* terse (routine progress) vs. what *must* stay full (security, irreversible actions, negations, ordering). Make the rule: *"Terse for status; full sentences for anything irreversible, security-relevant, or load-bearing for a merge decision."* This is currently stated, but a concrete example would anchor it far better than prose.

### B3. `review-change` evidence labels are the repo's best idea — promote them

The `PROVEN / TESTED / STATICALLY SUPPORTED / VIOLATED / UNKNOWN` ledger is genuinely valuable and more rigorous than most review prompts. But it's buried at section 2C of a 2,547-word skill, and nothing *requires* the reviewer to actually produce the ledger for critical invariants — it says "create a lightweight evidence ledger for *critical* requirements."

**Fix:**

1. Make the ledger a **required output artifact** for any Level 2–3 review (a named section in the output contract, section 7).
2. Add a one-line instruction that `UNKNOWN` is **not an acceptable terminal state** for a critical invariant — it must either be resolved by a verification phase or explicitly accepted by the engineer. This closes the "the model says UNKNOWN and moves on" loophole.
3. Reference the same labels from `implement-change` §5 (which already talks about evidence attribution) so verification evidence and review evidence use one vocabulary.

### B4. No skill explicitly handles "the user gave a one-line vague request"

The repo has rich planning *once you're in `plan-change`*, but nothing governs the **first turn** when a user says "add auth" or "fix the login bug" or "make it faster". `engineering-copilot` routes by situation *type* but assumes the request is already articulated. In practice the model often proceeds on assumptions, which is exactly what the repo's "Requirements are unclear → KNOWN/ASSUMED/UNKNOWN" section (copilot §Q) warns against — but that section is buried at line 528 of a 920-line file.

This connects directly to **Goal C** (improve questioning). See Part C.

### B5. `diagnose-bug` is exemplary but missing a "when to stop investigating" gate

At 134 words it's a model of tightness. Its loop (OBSERVATION → … → REGRESSION TEST) is right. The one gap: no instruction on **when the loop has run long enough without a root cause** — the repo elsewhere warns against "repeated speculative edits", but `diagnose-bug` itself doesn't say "after N evidence-gathering cycles without a confirmed root cause, stop and report the open hypotheses to the engineer rather than continuing to patch speculatively." That's a quality gate worth one sentence.

### B6. `tutor-me` has `disable-model-invocation: true` — verify vendor support

The frontmatter `disable-model-invocation: true` is not a universally recognized skill field (Cursor/Codex/Claude each have their own mechanism). If a vendor ignores it, the "never edit/run" boundary relies on the prose alone. Low priority, but worth either (a) documenting which vendor(s) honor it, or (b) removing it to avoid false confidence.

### B7. `architecture-picture` references a `codebase-design` skill that isn't in this repo

`SKILL.md` lines 22, 132 conditionally use a `codebase-design` glossary ("if available, use its glossary…"). Since that skill isn't shipped here, every invocation hits the fallback branch. Either vendor a minimal glossary inline, or drop the conditional to avoid the model hunting for a skill that isn't there (a small token/latency cost each time).

---

## Part B2 — Simplicity & readability of the code the agent writes (Goal 4)

The user's added requirement: the code and its algorithm/logic must be **as simple and self-explanatory as possible — not over-engineered, not confusing, not complicated — so a human can review it and follow the flow.**

This is the repo's **most under-served goal**, not because the repo ignores it, but because its anti-overengineering guidance is *scattered across five skills, framed negatively, and partly self-contradictory*.

### What's already there (good, but distributed)

- `implement-change` §3 lists anti-patterns (god managers, pass-through adapters, needless injection, speculative options) and "DRY business knowledge, not incidental syntax."
- `implement-change` §6 self-review has a "Simplicity" check and a "Navigation" check.
- `engineering-copilot` has an "Avoid AI-Induced Overengineering" warning-sign list + "Can this be simpler?"
- `plan-change` §5 "Challenge design complexity" asks "could a teammate explain the feature after inspecting the owner and a few files?"
- `review-change` standards axis covers "scope and simplicity" and treats code smells as investigation prompts.
- `audit-agent-setup` Step 3 removes generic "write clean code" instructions.

### B2-1. No single, positive, reviewer-optimized contract

Everything above is framed as *"avoid X"* or *"could this be simpler?"*. There is nowhere a positive, top-priority statement of the form the user just gave: **optimize for a human reviewer following the flow**. Negative guidance produces "not too bad" code; a positive default produces deliberately readable code.

### B2-2. `plan-change` §3 biases toward classes — contradicts "as simple as possible"

The skill names "a framework-agnostic `FeatureManager` or `FeatureService` is a good default." It hedges later ("a small feature may reasonably live in one handler, function, or component"; "do not wrap a single function in a class only to comply"), but the **named default is a class**, and models anchor on named defaults. For the user's goal the simplest correct structure is usually a **plain function or module**; a class/service is *more* structure that must earn its place through state, lifecycle, transactions, or genuine multi-method cohesion.

**Fix:** flip the default in `plan-change` §3 (and mirror in `implement-change` §3):
> *Start with the simplest structure that holds the behavior — a plain function or module. Introduce a class/service only when state, lifecycle, transactions, or real multi-method cohesion justifies it. Never wrap a single function in a class to satisfy a structural rule.*

### B2-3. The "Caveman" terse-chat rule can leak into code

`implement-change` §4 pushes terse chat updates. The skill is careful to say "Never compress production code or erase existing comments merely to save response tokens" and "durable artifacts remain readable" — but the overall terse ethos ("smallest sufficient payload", "don't paste whole files") creates pressure toward compact code and short names. The firewall exists in prose but isn't stated as a hard rule.

**Fix:** state the firewall explicitly:
> *Terse applies to chat/status only. Code, comments, tests, and commit text stay at full professional readability — names spelled out, normal formatting, no abbreviation of identifiers, values, or error messages. If cutting tokens would make a reviewer pause, don't cut.*

### B2-4. No "reviewer-readable flow" pass/fail gate

`implement-change` §6 asks "Navigation: one obvious primary behavioral home and a short trace?" — that's about *locating* code, not *reading* it. The user's criterion is stronger: a reviewer should **follow the normal flow top-to-bottom from the diff alone**.

**Fix:** add to `implement-change` §6 self-review:
> *Reviewer-readable: could an engineer who hasn't seen this conversation read the normal flow top-to-bottom from the diff and follow it without jumping to other files or guessing intent? If not, simplify before handoff.*

And to `review-change` standards axis: treat "normal flow not readable top-to-bottom from the diff" as an **IMPORTANT** finding (not OPTIONAL), because it directly blocks human review — which is the user's stated standard.

### B2-5. No explicit list of the readability killers

The repo says "avoid unnecessary complexity" generically. A concrete list changes behavior more than the abstraction:

- clever one-liners that hide branching
- implicit overloads / surprising operator behavior
- magic numbers and unexplained values
- deep nesting and early-return mazes
- "look at me" abstractions (custom DSLs, meta-programming) where plain code would do
- forwarding/pass-through layers that add a hop without behavior
- abbreviated identifiers (`ctx`, `hdr`, `proc`) where the spelled-out name costs nothing

Add this list to the Code Simplicity Contract. None of it is novel engineering knowledge, but **stating it in the skill makes it a reviewable constraint** rather than a vibe.

### B2-6. The fix — one canonical Code Simplicity Contract (~120 words)

Put it in the new `code-architecture.md` (from B1) or in `AGENTS.md`, loaded by both `plan-change` and `implement-change`, and referenced by `review-change`. Eight rules:

1. **Simplest correct form first.** Plain function/module before class; class only when state, lifecycle, or real cohesion earns it. No speculative structure.
2. **Optimize for the reviewer, not the author.** A reviewer who hasn't seen this chat should follow the normal flow top-to-bottom without context jumps. If they can't, simplify.
3. **Explicit over clever.** Flat, linear control flow. No surprising overloads, magic values, implicit behavior, or "elegant" one-liners that hide branching.
4. **Names carry meaning; comments explain *why*.** No generated comments restating the code. Spell names out; don't abbreviate identifiers.
5. **One behavior per unit.** Read the name → know what it does.
6. **Local reasoning.** Each function understandable from its inputs and body alone.
7. **Readability over tokens.** Never compress code, names, or comments to save output tokens. Terse is for chat only.
8. **Extract only with a real second caller or a real independent reason to change** — not "for future reuse."

Rules 1, 2, 7 directly answer the user's requirement. Rules 3–6, 8 are the concrete guardrails that make "simple" enforceable in review.

---

## Part B3 — Reuse, measured generalization, and review enforcement (Goal 5)

The user's added requirement has three parts: (a) `review-change` must *detect* when the Code Simplicity Contract (B2) is violated; (b) the agent must *search for code/logic reuse* before writing new; (c) write *generic, non-hardcoded* code, not too particular.

Part (c) needs a deliberate reconciliation, because **"write generic code" directly tensions with the repo's anti-speculative-generality stance and with Goal 4.** The repo (correctly) says: "DRY business knowledge, not incidental syntax"; "extract only for a real independent reason to change"; "no speculative extensibility"; B2-8 above says "extract only with a real second caller." Blindly telling the agent to "write generic code" would reopen the door to exactly the over-engineering Goal 4 forbids.

The synthesis: **generalize concrete duplication and reuse existing code aggressively; never generalize for hypothetical future cases.** The test is "is there a real second instance or an existing repo mechanism *right now*?" — not "might there be one later."

### B3-1. `review-change` must explicitly detect Code Simplicity Contract violations

Today `review-change`'s standards axis covers "scope and simplicity" generically and treats code smells as "prompts to investigate". It does **not** map to the 8 specific rules of the Code Simplicity Contract (B2-6), and "hard to review" is currently framed as OPTIONAL-tier ("worthwhile, low-risk refinement"). That lets simplicity violations slip through as nitpicks.

**Fix:** add an explicit **Simplicity Contract** sub-check to the standards axis that walks the 8 rules and assigns severity:
- Violations of **rule 1** (speculative structure / class-for-one-function), **rule 2** (normal flow not readable top-to-bottom), **rule 7** (code/names compressed to save tokens) → **IMPORTANT** — these block review/merge because they defeat human review.
- Violations of **rules 3–6, 8** → **OPTIONAL** unless they cause a concrete comprehension or correctness cost; do not fabricate findings from aesthetic preference.
- Each finding cites the exact rule number violated (e.g. `F-04 IMPORTANT · Standards · Simplicity rule 2`), so the contract becomes an auditable checklist, not a vibe.

### B3-2. Mandatory reuse scan before writing new code

`AGENTS.md` says "reuse existing abstractions where appropriate" and "prefer discovering information from the repository over assumptions", but `implement-change` has **no explicit step** that says: before creating a new function/module/constant/abstraction, search the repo for code that already does this. In practice the model frequently writes a fresh implementation next to an existing one that does the same thing.

**Fix:** add a **reuse scan** as a named step in `implement-change` §1 (context acquisition), run before each new symbol is created:
- Search the repo (symbols, types, helpers, existing patterns, sibling features) for code that already implements the needed logic.
- If a correct, genuine-fit existing implementation exists → **call it**; do not duplicate.
- If the existing code is almost-right but needs one parameter → **extend it in place** (when the change is in scope) rather than forking.
- If no existing fit → create new, and **record the reuse decision** in the completion report ("called existing `X`" / "extended `X`" / "created new — no existing fit, searched <paths>").

This is cheap and high-value: it directly cuts duplication and forces the model to look before writing.

### B3-3. `review-change` must flag missed reuse

Add a dedicated finding type to the standards axis: **Missed reuse** — duplicated logic or near-duplicate blocks that already exist elsewhere in the repo.
- **IMPORTANT** when the duplication is of *business logic* or non-trivial algorithmic logic (the repo's "DRY business knowledge" rule).
- **OPTIONAL** for incidental syntax duplication (the repo explicitly allows small local duplication when shared coupling would be worse).
- Each finding names the **existing symbol/path** the author should have called, so the fix is actionable, not just "deduplicate."

This closes the loop: B3-2 makes the implementer search; B3-3 makes the reviewer catch it when the implementer didn't.

### B3-4. Measured generalization — the reconciliation rule (load-bearing)

State this once, canonically, in the `code-architecture.md` / Code Simplicity Contract, so the skills never contradict:

> **Generalize concrete duplication; reuse existing code aggressively; never generalize for hypothetical future cases.** The test: *is there a real second instance, or an existing repo mechanism, right now?* If yes → reuse/generalize. If no → keep it specific. Specific one-off code is simpler and more reviewable than speculative generic code.

Concretely:
- **Generalize when there is a concrete second instance** of the same business rule/logic (Rule-of-Three is the conservative threshold; Rule-of-Two is fine when the duplication is unambiguously the same logic). Extract the shared logic with a parameter for the *actually varying* part — one parameter, not a generic framework.
- **Do NOT generalize for hypothetical future reuse.** A single-use abstraction is over-engineering and violates Goal 4 / B2-8. The repo's "extract only with a real second caller" stands unchanged.
- **Extract magic values that carry domain meaning** (rates, limits, thresholds, IDs, repeated business-semantic strings) into named constants or the repo's existing config mechanism — this is *naming*, not abstraction, and is always good.
- **Do NOT build a config system or parameterization layer for a single one-off value.** That is the speculative generality Goal 4 forbids.
- **Never hardcode values the repo already externalizes** (env vars, existing config keys, existing constants). Reuse the existing mechanism.
- **Hardcoding is acceptable** for genuinely one-off literals with no domain meaning (a loop start of `0`, a sentinel). Forcing those into config is over-engineering.

This gives the user exactly what they want — no duplicated logic, no magic domain values, no re-invention of existing code — without opening the door to speculative frameworks that would violate Goal 4.

### B3-5. The anti-hardcode checklist (concrete, reviewable)

Mirror the readability-killers list (B2-5) with a concrete anti-hardcode list, so "not too particular / not hardcoded" becomes an enforceable review target:

- magic numbers or strings with domain meaning, not extracted to a named constant or existing config
- near-duplicate functions/blocks differing only in a value, not parameterized
- logic that duplicates an existing repo utility/helper/constant
- values that should come from existing config/env/constants but are inlined
- behavior hardcoded to a specific case when the repo already has a general mechanism for it (e.g., a hardcoded API URL when the repo has an API-base config; a hardcoded color when the repo has a theme token)
- case-specific branching that could be a single parameterized path without added abstraction

Each item is detectable in review and points to a concrete fix (extract constant / call existing X / parameterize the varying value). None of them require speculative generality.

### B3-6. Where this lands in the contract

Add two rules to the Code Simplicity Contract (extending B2-6's eight):

9. **Reuse before creating.** Search the repo for existing code that does this before writing new; call or extend it. Record the reuse decision.
10. **Generalize concrete duplication only; never generalize for hypothetical reuse.** Parameterize the actually-varying part; extract domain-meaningful magic values; do not build abstractions or config layers for single one-off cases.

Rules 9–10 are the operational form of the user's "search for reuse / write generic not hardcoded" instruction, reconciled with Goal 4. `review-change` (B3-1, B3-3) enforces both.

---

## Part B4 — Bug-fix generality in `diagnose-bug` (Goal 6)

The user's specific concern: when fixing a bug, the fix must address the **general class** of failure, not patch only the specific case that triggered the symptom. "Avoid fixing in a too particular way to prevent only that specific case."

This is the bug-fix-specific form of B3's anti-hardcode rule, and it is the **most dangerous place for it**, because:

1. **A too-particular fix passes the regression test you wrote from the bug report** — the test uses the same triggering input, so a symptomatic patch *looks verified*.
2. **The underlying bug remains for every other input in the same equivalence class** → silent recurrence on the next slightly-different input.
3. **It violates the spirit of `diagnose-bug`'s own ROOT CAUSE step** — the skill ensures you *find* the root cause, but nothing constrains the *form* of the fix, so a model can correctly identify the root cause and then write a fix that only handles the one triggering value.

### What `diagnose-bug` already does well

- The loop separates ROOT CAUSE from FIX.
- Critical rule: no production change until evidence supports a plausible root cause.
- Completion requires stating root cause, fix, regression coverage, and unverified gaps.

### The gap

Nothing in the skill says the **fix must handle the class, not the case**. A fix like `if (amount === -1) return;` for a "negative amount crashes" bug, or `if (email === 'bad@example.com') ...` for a parse bug, satisfies the loop on paper while leaving the class broken. `diagnose-bug` is the skill where the temptation is strongest (a failing case is staring at you) and where the existing tightness leaves the most room for this one additional rule.

### B4-1. Add a "fix generality" gate to the FIX step

Before accepting a fix, require the fixer to answer:
- Does the fix address every input/condition sharing the root cause, or only the triggering value?
- If the fix is a guard, does it test the **property** that's wrong (`amount < 0`, `!isValidEmail(x)`, `index >= length`) or the **specific value** that triggered (`amount === -1`, `email === 'that string'`, `length === 3`)?
- Can you name another input in the same class that would have failed before and passes after the fix? If you can't, the fix is too particular.

### B4-2. Regression test must cover the class, not just the case

The REGRESSION TEST step must include **at least one input in the same equivalence class that was NOT the original trigger**. A regression test that only re-runs the original failing input cannot distinguish a root-cause fix from a symptomatic patch. This is the single highest-value addition: it mechanically catches the too-particular fix that the FIX-step gate is meant to prevent.

### B4-3. Forbidden fix shapes (concrete, reviewable)

Mirror B3-5's anti-hardcode list with bug-fix-specific shapes:

- a guard checking the exact triggering value (`=== <the value that failed>`) instead of the property that's wrong
- a special-case branch for one input when the root cause is in shared logic
- a fix that passes the reported test but leaves a sibling input in the same class still broken
- suppressing/ignoring the error for the specific case instead of fixing the handling
- "add a null check at the one call site that crashed" when the root cause is that the value can be null throughout

### B4-4. `review-change` must flag too-particular fixes

Add to `review-change`: a fix that addresses only the triggering case and not the root-cause class is an **IMPORTANT** finding — it is a latent bug, because the class remains broken. This is the bug-fix instance of B3-1's Simplicity-Contract check. Specifically: "fix hardcodes the triggering value / passes the reported test but not the equivalence class → require a class-level fix + a class-level regression input."

### B4-5. Where this lands in the skill

`diagnose-bug` is currently 134 words and exemplary in tightness — keep it tight. Target ~210 words. Add:

- One line under FIX: *"Fix the class, not the case — the fix must handle every input sharing the root cause, not just the triggering value. A guard must test the property that's wrong, not the specific value that failed."*
- One line under REGRESSION TEST: *"Include at least one input in the same equivalence class that was NOT the original trigger; a fix that only re-passes the original case may be a symptomatic patch."*
- The first three bullets of B4-3 as a short forbidden-shapes list.
- A reference to Code Simplicity Contract rule 10 (don't hardcode) — a too-particular fix *is* a hardcoded patch.

This is the bug-fix capstone on B2/B3: the same anti-particular principle, applied at the moment the temptation is strongest.

---

## Part C — Improve the AI's questioning for full context

This is where the repo is **strongest in design but weakest in activation**. The `plan-change` QUESTION-BANK is excellent (8 well-structured topic clusters, a strict per-question format, round discipline). The problem is that this rigor is gated behind reaching `plan-change`, which only happens for "meaningful" L2–L3 work. For the common case — a vague or underspecified first message — there is no lightweight, always-on questioning protocol. The result: the model either asks too little (proceeds on assumptions) or asks too much (dumps the full 1214-word question bank at an L1 change).

### C1. Add a first-turn "context triage" protocol (the biggest single improvement available)

Create a short, always-available questioning protocol — either a new tiny skill `triage-request` (~150 words) or a section in `engineering-copilot`'s router. It governs the **first reply** to any non-trivial request and runs *before* skill routing:

> **First-turn triage** — before routing or implementing, classify the request against these five slots and ask only for the slots that are genuinely missing:
> 1. **Outcome** — what observable result defines "done"? (if missing → ask for one concrete success example)
> 2. **Scope** — what is explicitly in and out? (if missing → ask one boundary question)
> 3. **Existing behavior** — what must not change? (if missing → ask what currently happens)
> 4. **Constraints** — time, compat, perf, security, data? (only ask the ones the change plausibly touches)
> 5. **Verification** — how will we know? (if missing → ask what check would prove it)
>
> Rules: ask at most **one batched round** of the missing slots, with concrete options/recommendations per question (never bare "any requirements?"). If the change is L0–L1 and most slots are inferable, ask zero questions and proceed, stating assumptions. Never block a trivial change with triage.

This gives the model an explicit, bounded, high-signal questioning behavior for *every* request, not just heavy planning. It directly serves the user's Goal C.

### C2. Fix the "no bare open questions" rule — it's stated but not enforced with examples

`QUESTION-BANK.md` line 3 says "do not ask already answered questions or irrelevant hypotheticals", and `plan-change` §2 forbids "vague prompts such as 'Any edge cases?'". Good. But the skills don't show what a *good* vs *bad* question looks like in the *router* and *triage* contexts, only inside `plan-change`. A model that hasn't loaded `plan-change` won't have seen the example.

**Fix:** lift the one canonical good-question example (the `Q-07 Retrying a save after a timeout` block in QUESTION-BANK.md line 22) up to the triage protocol or `engineering-copilot`, so it's visible at routing time. The example is what actually teaches the format; the rule alone doesn't.

### C3. Make the per-question format a shared contract

The 6-part question format (ID/topic, scenario/evidence, decision, options+consequences, recommendation, impact) is defined in `QUESTION-BANK.md` and `plan-change`. It should be the **single questioning contract** referenced from the triage protocol too, so the model uses the same disciplined format whether it's asking 1 question (triage) or 15 (full planning). Currently a first-turn question has no format constraint at all.

### C4. Add an explicit "state assumptions before proceeding" instruction

`engineering-copilot` §Q says "when implementation can safely proceed with a reversible assumption, state the assumption explicitly." This is the right behavior for the 80% case where the model shouldn't block to ask. But it's buried. Promote it to the triage protocol:

> If a missing slot is safely inferable and the change is reversible, **state the assumption in one line and proceed** — do not ask. Only ask when the answer changes the design and cannot be safely assumed.

This prevents both failure modes: over-asking (annoying) and silent assumption (dangerous).

### C5. Add a "complexity guess + confirm" step to triage

The repo's L0/L1/L2/L3 levels drive everything, but the *model* assigns the level implicitly. Make it explicit in triage:

> State your complexity guess (L0–L3) in one phrase with the one-sentence reason. If L0/L1 and reversible, proceed. If L2/L3, route to `ship-change` / `plan-change` and say so.

This lets the user correct a mis-levelled guess early ("no, this is L2, not L1 — it touches auth") instead of discovering the mismatch after implementation.

### C6. The QUESTION-BANK is great — extend its coverage, don't rewrite it

`QUESTION-BANK.md` is the best artifact in the repo. Two small additions would make it cover more real situations:

- **Observability/telemetry** — section 7 mentions logs/metrics briefly but no dedicated question about "what signal tells us this is working in production?" For L2–L3 work this is often the question that gets missed.
- **Cost/quota** — section 7 mentions "operating cost" once; for third-party API / payments / data-heavy features, a dedicated cost/quota question ("what is the expected call volume and per-unit cost ceiling?") prevents silent overruns.

---

## Part D — Skill-by-skill specific fixes (quick reference)

| Skill | Words now | Target | Key action |
|---|---|---|---|
| `engineering-copilot` | 2,547 | ~700 | Collapse to routing table + 5 rules; move domain checklists to QUESTION-BANK |
| `frontend-manual-practice` | 1,956 | ~800 | Cut curriculum/reference sections; keep behavioral rules + review order |
| `review-change` | 2,547 | ~1,400 | Define axes/labels once; move finding-trace template to companion file; add Simplicity-Contract + missed-reuse finding types (B3-1, B3-3) |
| `plan-change` | 1,823 | ~1,200 | Extract architecture opinions to shared `code-architecture.md`; keep planning contract |
| `implement-change` | 1,533 | ~1,300 | Add terse-comms before/after; reviewer-readable gate (B2-4); terse/code firewall (B2-3); **mandatory reuse scan step (B3-2)** |
| `guided-implementation` | 1,105 | ~700 | Extract shared hint ladder; keep plan-step loop + batching |
| `audit-agent-setup` | 598 | 598 | Fine as-is |
| `ship-change` | 704 | ~500 | Link complexity table + boundary clause instead of restating |
| `architecture-picture` | 348 + 651 | unchanged | Resolve the `codebase-design` conditional (B7) |
| `frontend-interview-drill` | 448 | 448 | Fine as-is |
| `engineering-handoff` | 422 | 422 | Exemplary |
| `tutor-me` | 450 | 450 | Verify `disable-model-invocation` vendor support (B6) |
| `explore-system` | 166 | 166 | Exemplary — use as the template for the long ones |
| `diagnose-bug` | 134 | ~210 | Add the stop-investigating gate (B5) + the fix-generality gate, class-level regression requirement, and forbidden-fix-shapes list (B4) |
| **NEW** `triage-request` | — | ~150 | First-turn questioning protocol (C1) — the single highest-value addition |
| **NEW** shared `HINT-LADDER.md` | — | ~120 | De-duplicate guided/tutor/practice ladders (A5) |
| **NEW** `code-architecture.md` | — | ~600 | Extracted architectural guidance (B1) + Code Simplicity Contract 10 rules (B2-6 + B3-6) + the reuse/generalization reconciliation (B3-4) |

---

## Part E — Cross-cutting / structural improvements

### E1. Establish one canonical "shared rules" location

Several rules are load-bearing and referenced everywhere: phase boundaries, complexity levels, the question format, the hint ladder, evidence labels. Today they're restated per-skill. Create a small `.agents/skills/_shared/` (or `AGENTS.md` sections) holding each canonical rule once; skills link with one sentence. This is the single change that makes A1, A5, A7, C3 all fall out naturally and prevents future drift.

### E2. The installer should validate skill frontmatter

`bin/install.mjs` copies skills verbatim. Consider a cheap pre-publish check (in `test/`) that asserts: every `SKILL.md` has `name` + a `description` under N words; no skill body exceeds a soft cap (e.g. 1,500 words) without a companion reference file. This turns "keep skills tight" from a hope into a regression test, and matches the repo's own `audit-agent-setup` philosophy ("avoid overlapping skills", "keep each skill focused").

### E3. Add a skill index file the model can read cheaply

Today the model discovers skills by directory listing or by `AGENTS.md`/`README.md` tables. A single `_INDEX.md` with one line per skill (`name — trigger — best agent — output`) would let the router load ~14 lines instead of scanning frontmatter across 14 files. This is the cheapest token win available and directly improves routing accuracy.

### E4. Make `engineering-copilot`'s "When I ask 'what should I do?'" block the *first* thing in the skill

That block (lines 830–845: SITUATION / RISKS / RECOMMENDED APPROACH / WHY / NEXT ACTION) is the most useful behavioral instruction in the whole skill for the "user asks what to do next" case. It's currently at line 830. Move it to the top; it's the skill's actual job.

### E5. Tests cover the installer, not the skills

`test/install.test.mjs` and `test/shebang.test.mjs` are good and cover the install edge cases (self-install, symlinks, failed-copy safety). There's no test that the *skills themselves* are well-formed (frontmatter present, descriptions bounded, no skill over a size cap, no duplicate names). See E2.

---

## Part F — Prioritized action list

If you do only five things, in order:

1. **(C1) Add `triage-request` — the first-turn questioning protocol.** Highest value for Goal C. ~150 words, always-on, fixes the "vague request → silent assumptions" failure mode the repo currently has. Include the complexity-guess-confirm step (C5) and the "state assumptions and proceed" rule (C4).

2. **(A1) De-duplicate the documentation-only boundary clause** into one canonical `AGENTS.md` location; replace the 5 restatements with one-sentence links. ~800 words saved, drift risk removed.

3. **(A2) Compress `engineering-copilot` from 2,547 → ~700 words.** Keep routing table + 5 rules + the "what should I do?" block (moved to top). Move the 17 category checklists into QUESTION-BANK. This is the single biggest token cut and the skill loaded most often.

4. **(B3) Promote the evidence ledger** (PROVEN/TESTED/STATICALLY SUPPORTED/VIOLATED/UNKNOWN) to a required output for L2–L3 reviews, and forbid UNKNOWN as a terminal state for critical invariants. Best quality lever in the repo, currently underused.

5. **(A4 + E1) Extract `review-change`'s finding-trace template into a companion file** and establish `_shared/` for the boundary clause, complexity table, question format, hint ladder, and evidence labels. This makes the next 5 rounds of edits cheaper and prevents drift from recurring.

6. **(B2) Add the Code Simplicity Contract + reviewer-readable gate.** Write the 8-rule contract once (in the new `code-architecture.md` or `AGENTS.md`), flip `plan-change`'s "FeatureManager default" to "plain function first, class only when it earns it" (B2-2), firewall the terse-chat rule from code (B2-3), add the "fresh reviewer can follow the flow top-to-bottom" self-review gate (B2-4), and make unreadable flow an **IMPORTANT** review finding. Directly serves Goal 4.

7. **(B3) Add the reuse scan + measured-generalization rule + review enforcement.** Add a mandatory reuse-scan step to `implement-change` (B3-2), add **Simplicity-Contract** and **missed-reuse** finding types to `review-change` mapped to the contract rules (B3-1, B3-3), and write the one-line reconciliation clause — *generalize concrete duplication aggressively; never generalize for hypothetical future cases* (B3-4) — plus the anti-hardcode checklist (B3-5). Extends the contract to 10 rules (B3-6). Directly serves Goal 5 while preserving Goal 4.

8. **(B4) Add the bug-fix generality gate to `diagnose-bug`.** Add one line to the FIX step ("fix the class, not the case — a guard must test the property that's wrong, not the specific value that failed"), require a class-level regression input that was NOT the original trigger (B4-2), add the forbidden-fix-shapes list (B4-3), and make a too-particular fix an **IMPORTANT** `review-change` finding (B4-4). Keeps the skill tight (~210 words). Directly serves Goal 6 and is the bug-fix capstone on B2/B3.

After those eight, the remaining items (A3, A5, A6, B1, B5–B7, C2–C6, E2–E5) are iterative tightening — each small, none blocking.

---

## Part G — One concrete before/after to anchor the style

`explore-system/SKILL.md` is the gold standard in this repo. Contrast its tightness with how `engineering-copilot` handles the same "what do I do" question:

**Today (`engineering-copilot`, lines 830–845, ~120 words):**
> # When I Ask "What Should I Do?"
> Do not immediately prescribe implementation.
> Respond with: SITUATION / RISKS / RECOMMENDED APPROACH / WHY / NEXT ACTION
> Keep it practical.
> If multiple approaches are genuinely reasonable, explain the tradeoff rather than pretending one is universally correct.

**Compressed (~40 words, same behavior):**
> # "What should I do?" — answer with: SITUATION → RISKS → RECOMMENDED APPROACH → WHY → NEXT ACTION. Don't prescribe implementation first. If two approaches are genuinely reasonable, give the tradeoff, not a fake universal answer.

That 3x compression is representative of what's available across `engineering-copilot`, `frontend-manual-practice`, and the duplicated clauses in `review-change` / `ship-change` / `plan-change`. The behavioral instruction is identical; only the word count changes.

---

## Summary

- **Token usage:** ~25–30% of all skill prose is removable (duplicated clauses, generic engineering knowledge, curriculum lists). The two largest skills are the main offenders; `explore-system` and `diagnose-bug` show the target tightness.
- **Code quality & understanding:** the phase-boundary rigor and evidence labels are the repo's best assets — promote them, don't rewrite them. The main quality risks are (a) `plan-change`'s prescriptive architecture overriding repo conventions, (b) `implement-change`'s "terse" rule without a safety anchor example, and (c) no first-turn questioning protocol, so rigor only activates at L2–L3.
- **Questioning for full context:** add the `triage-request` protocol (5 bounded slots, one batched round, state-and-proceed for safe assumptions, complexity-guess-confirm). Lift the good-question example up from QUESTION-BANK to where the router sees it. Make the 6-part question format the single shared contract.
- **Simplicity & readability of generated code:** the repo has anti-overengineering guidance scattered across 5 skills but no single, positive, reviewer-optimized contract, and `plan-change`'s "FeatureManager default" biases toward classes. Add one 8-rule Code Simplicity Contract (simplest correct form first; optimize for the reviewer; explicit over clever; names carry meaning; one behavior per unit; local reasoning; readability over tokens; extract only with a real second caller), flip the structural default to "plain function first", firewall the terse-chat rule from code, and make "a fresh reviewer can't follow the flow" an IMPORTANT review finding.
- **Reuse & measured generalization (review-enforced):** add a mandatory reuse-scan step to `implement-change` (search the repo before writing new), add **Simplicity-Contract** and **missed-reuse** finding types to `review-change` so violations are detected (mapped to the contract rules, with severity), and write the one-line reconciliation that resolves the tension with Goal 4: *generalize concrete duplication and reuse existing code aggressively; never generalize for hypothetical future cases.* Extend the contract with rules 9 (reuse before creating) and 10 (generalize concrete duplication only). Anti-hardcode checklist makes "not too particular" an enforceable review target rather than a vibe.
- **Bug-fix generality in `diagnose-bug`:** the skill ensures you find the root cause but never constrains the *form* of the fix, so a too-particular patch (`if amount === -1`) can pass the regression test while the equivalence class stays broken. Add a fix-generality gate (fix the class, not the case; a guard tests the property, not the triggering value), require a class-level regression input that was NOT the original trigger, add a forbidden-fix-shapes list, and make a too-particular fix an **IMPORTANT** review finding. Keeps the skill tight (~210 words).

The repo's bones are strong. The work is compression, de-duplication, one missing piece (first-turn triage), and three reconciled defaults (simplicity-first structure; reuse-and-measured-generalization over both duplication and speculative generality; class-level bug fixes over symptomatic patches) — not a redesign.
