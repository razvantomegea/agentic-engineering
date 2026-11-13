# Decisions — Skill compression, request triage, and skill lint

**Date:** 2026-11-13  
**Plan:** [docs/plans/2026-11-13-skill-compression.md](../plans/2026-11-13-skill-compression.md)  
**Audit input:** [agentic-engineering-skills-audit.md](../../agentic-engineering-skills-audit.md)

## User-confirmed decisions

### D-01 — Level 1 uses an inline plan

**Choice:** brief explore → 5–10 line chat plan (behavioral home, files/symbols, steps, checks, assumptions) → implement → verify → review if useful → short handoff. A saved `plan-change` plan only when requested or the change grows to L2.

**Why:** Removes the AGENTS.md/README vs ship-change/copilot contradiction. Saved plans for every L1 change burn tokens without proportional quality gain.

### D-02 — First-turn triage lives in AGENTS.md

**Choice:** ~100-word "Request triage" section in always-on `AGENTS.md`. Cost offset by trimming AGENTS.md duplication.

**Why:** A skill only loads on demand and won't reliably run on the first message. Always-on triage fixes vague-request → silent-assumption failure.

### D-03 — frontend-manual-practice curriculum moves out

**Choice:** Move fundamentals lists, rotation, example apps, progressive reimplementation, keep-current hierarchy, and six-week plan to `frontend-manual-practice/CURRICULUM.md`. Skill keeps behavioral rules; load curriculum when designing a session/rotation.

### D-04 — Hint ladder deduped inline (no `_shared/`)

**Choice:** Merge Progressive Disclosure into Hint Ladder inside `guided-implementation` / `frontend-manual-practice`. No shared file.

**Why:** Installer only copies named skill directories; `_shared/` would never ship. Ladder ~60 words — a separate read costs more than it saves.

## Audit disposition (static review)

| Item | Disposition |
|------|-------------|
| A2, A7, A8, B5, B7, C6, E2, E4 | Accepted as written |
| A1 documentation-only boundary | Modified: keep ~60-word copy in plan-change + review-change (Claude CLAUDE.md omits the rule) |
| A3 curriculum | D-03 |
| A4 review-change companion | Modified: fold violation trace into finding format |
| A5 shared HINT-LADDER | Modified: tutor-me has no ladder; D-04 |
| A6 descriptions | Strengthened: trigger-first, ≤200 chars (host truncates) |
| B1 code-architecture skill | Modified: one conventions-precedence line, no new skill |
| B2 terse communication | Minor: one before/after example |
| B3 evidence ledger | Partly present; add UNKNOWN-not-terminal + required at L2–L3 |
| B6 disable-model-invocation | Keep (Cursor honors it) |
| C1–C5 triage | D-02 in AGENTS.md |
| E1 `_shared/`, E3 `_INDEX.md`, new architecture skill | Rejected |

### New findings (N-1–N-5)

- **N-1:** `frontend-interview-drill` description has unquoted `: ` → invalid YAML.
- **N-2:** Level 1 contradiction → D-01.
- **N-3:** plan-change SKILL repeats QUESTION-BANK / PLAN-TEMPLATE content.
- **N-4:** AGENTS.md "Understanding requirement" ⊆ Ownership gate.
- **N-5:** architecture-picture uses G0–G3 instead of L0–L3.

### Out of scope

- Stale `c:\Projects\AGENTS.md` duplicate (~1k words/turn).
- `--repo` overwrites product-repo `AGENTS.md`.
