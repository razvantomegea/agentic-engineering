# Decisions — Code Simplicity Contract, reuse, and class-level bug fixes

**Date:** 2026-11-13  
**Plan:** [docs/plans/2026-11-13-simplicity-reuse-bugfix.md](../plans/2026-11-13-simplicity-reuse-bugfix.md)  
**Audit input:** [agentic-engineering-skills-audit.md](../../agentic-engineering-skills-audit.md) — Parts B2, B3 (reuse), B4 (goals 4–6)  
**Prior change:** [2026-11-13-skill-compression.md](2026-11-13-skill-compression.md) (Parts A, C, E, B1, B3-ledger, B5–B7 — shipped in `6dbf1f0`, `1613709`)

## Round 1 (user-confirmed)

### D-01 (Q-01) — Scope is goals 4–6 only

**Choice:** Implement only the unshipped audit sections B2, B3-reuse, B4. Earlier dispositions stand (no `_shared/`, no `_INDEX.md`, no separate `code-architecture` skill).

### D-02 (Q-02) — Contract lives in `implement-change/SIMPLICITY.md`

**Choice:** One companion file under `implement-change`, linked from `implement-change`, `plan-change`, `review-change`, `diagnose-bug`.

**Alternatives:** inline in `implement-change/SKILL.md` (other skills would load ~900 extra words); `AGENTS.md` (999/1000-word test cap; paid every turn in every repo).

**Why:** One home for the rule numbers reviewers cite; read only when a skill needs it. All four linking skills are in `CORE_SKILLS`, so `../implement-change/SIMPLICITY.md` always resolves after install.

### D-03 (Q-03) — Compressed contract

**Choice:** 10 numbered rules (~300 words) with the audit's three checklists (readability killers, anti-hardcode, forbidden fix shapes) folded in as concrete examples. Forbidden bug-fix shapes stay in `diagnose-bug`, where the temptation occurs.

### D-04 (Q-04) — Review severity: IMPORTANT by default, evidence required

**Choice:** IMPORTANT by default for rule 1 (speculative structure), rule 2 (flow not followable top-to-bottom), rule 7 (compressed for tokens), missed reuse of business/non-trivial logic (rule 9), and a fix that handles only the triggering case (rule 10). Every finding must cite rule number, exact location, and where a fresh reader stalls or what breaks. Taste alone is not a finding. All other rules default OPTIONAL unless a concrete cost is shown.

**Why:** Makes the contract enforceable without abandoning review-change's "demonstrated cost, no criticism quota" stance.

### D-05 (Q-05) — Class-level regression input is conditional

**Choice:** Required when the root cause is logic shared by other inputs. When the class genuinely has one case (wrong config key, single race window), state why in one line.

**Why:** Avoids contrived tests while still catching symptomatic patches.

## Assumptions stated before round 1 (not contested)

- **A-01:** `plan-change` keeps "extend an existing owner first"; for new code the default becomes plain function/module (rule 1).
- **A-02:** No new tests asserting skill prose wording. Existing link/word-cap tests cover the new file.
- **A-03:** Inlined domain values (rule 10, non-bug-fix) default OPTIONAL — Q-04's IMPORTANT list did not include them.
