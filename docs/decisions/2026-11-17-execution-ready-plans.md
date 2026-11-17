# Decision log — Execution-ready plans, "verify, don't guess", leaner always-on policy

Date: 2026-11-17 · Plan: [docs/plans/2026-11-17-execution-ready-plans.md](../plans/2026-11-17-execution-ready-plans.md)

## 3. Decisions

| ID | Question | Choice | Rationale / tradeoff | Provenance |
|---|---|---|---|---|
| D-01 | Plan shape | Two-part plan (Why / Do), each fact once by ID | The implementer reads only Part B plus the IDs it cites; less drift. Cost: a full rewrite of the template | You chose this, 2026-11-17 |
| D-02 | Code exactness | Exact contracts and verbatim anchors; branch-complete pseudocode allowed for function bodies | Makes the plan decision-complete without turning it into a full diff. Cost: anchors go stale if the baseline moves, which the preflight catches | You chose this, 2026-11-17 |
| D-03 | `AGENTS.md` | Trim (999 → ~725) and add "verify, don't guess" plus "don't silence checks" | The always-on guard against invented APIs; duplicated sections become pointers to the skills | You chose this, 2026-11-17 |
| D-04 | Claude policy | Generated `CLAUDE.md` imports `@~/.agents/AGENTS.md` | One canonical policy, no drift. Cost: about +475 words per Claude turn, and double-loading in repos with their own `AGENTS.md` | You chose this, 2026-11-17 |

**Assumptions** (stated before round 1, not contested; accepting this plan confirms them):

- **A-01** No `.agents/docs/`: `bin/install.mjs` copies only the named skill folders and `AGENTS.md`. Frontend and backend guides belong in product repos.
- **A-02** The UI specification moves to `plan-change/UI-SPEC.md`, word for word.
- **A-03** "Length" means shorter skills and plans.
- **A-04** The `AGENTS.md` test cap drops from 1,000 to 800 to keep the gain.
- **A-05** No prose-wording tests (as in the 2026-11-13 A-02).

### How each pasted recommendation was handled

| Recommendation | Disposition |
|---|---|
| Lean `AGENTS.md` router (<50 lines) | Modified → D-03 (trim to about 725 words; triage, levels and Phase boundary stay always-on) |
| `.agents/docs/*.md` progressive disclosure | Rejected → A-01 (installer doesn't ship it; product guides belong in product repos). Applied inside the skill instead → `UI-SPEC.md` (R-04) |
| `planning-spec.md` schema | Already covered by `PLAN-TEMPLATE.md`; restructured → D-01/D-02 |
| Anti-hallucination: no phantom imports | Added → R-03 |
| Strict typing / no `any` | Generalized → R-07 (no check silencing in any language) |
| Minimalist simplicity | Already covered → `SIMPLICITY.md` rules 1, 3, 8 |
| Self-correction loop | Already covered → `implement-change` §2 and `diagnose-bug`; preflight adds a record of pre-existing failures |
| Never `@import` at launch | Overridden for one file by D-04: `AGENTS.md` is always-on policy by design |

### Findings

- The installed copies under `~/.agents/skills` and `~/.claude/skills` are dated 2026-10-19 and are refreshed by S-12.
