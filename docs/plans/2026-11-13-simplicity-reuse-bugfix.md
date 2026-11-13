# Plan — Code Simplicity Contract, reuse scan, class-level bug fixes

## 1. Identity and outcome

- **Level:** 2 (changes agent behavior in four core skills). **Status:** ACCEPTED. **Revision:** r3 (r2 folded plan-review F-01–F-07; r3 folds implementation-review wording fixes into §7.1 rules 8–9 and §7.2 §2 step 1 / §6 item 6).
- **Baseline:** `main` @ `1613709`, working tree clean except untracked `agentic-engineering-skills-audit.md`. 2026-11-13.
- **Problem:** The audit's goals 4–6 are unshipped. Agents get anti-overengineering guidance scattered and negative-framed, have no step that forces a search for existing code before writing new code, no anti-hardcode rule, no constraint on the *form* of a bug fix, and `review-change` has no finding types for any of these.
- **Outcome:** One 10-rule Code Simplicity Contract in `implement-change/SIMPLICITY.md`; `implement-change` applies it (reuse scan, reviewer-readable gate); `plan-change` shapes designs with it; `review-change` cites rule numbers with fixed default severities; `diagnose-bug` requires class-level fixes.
- **Decisions:** [docs/decisions/2026-11-13-simplicity-reuse-bugfix.md](../decisions/2026-11-13-simplicity-reuse-bugfix.md) (D-01–D-05, A-01–A-03).

## 2. Requirements and scope

- **R-01** Contract exists once, with stable rule numbers 1–10, ~250–330 words (D-02, D-03).
- **R-02** `implement-change` loads the contract before writing code, runs a reuse scan (rule 9), self-reviews against it including "fresh reviewer follows flow top-to-bottom", and reports reuse decisions.
- **R-03** `plan-change` §3 defaults new code to plain function/module; §5 checks reuse (A-01).
- **R-04** `review-change` axis B checks the contract with D-04 severities and rule citations; missed reuse names the existing symbol.
- **R-05** `diagnose-bug` requires the fix to cover the root-cause class, lists forbidden shapes, and applies D-05 regression rule.
- **R-06** Terse-chat firewall: code/names/comments/errors are never shortened to save tokens (rule 7), linked from `implement-change` §4.

**Preserve:** documentation-only boundaries in `plan-change`/`review-change`; skill names/dirs; `CORE_SKILLS`/`EXTRA_SKILLS`; `AGENTS.md` (untouched, 999 words); all existing tests unchanged; `review-change`'s "demonstrated cost" stance; "existing repository conventions win".

**Non-goals:** README, `AGENTS.md`, `engineering-copilot`, `ship-change`, `guided-implementation`, prose-content tests, reinstalling user-level skills (ask after), committing.

### OPEN QUESTIONS

None.

## 3. Current-system story

An agent implementing an L1 change loads `implement-change`. §3 tells it to keep one behavioral home and lists anti-patterns (god managers, speculative options, "DRY business knowledge"). §1 says to read the owner/callers but never says "search for an existing implementation before creating a symbol". §6 self-review asks "can an added file be removed" but not "can a fresh reviewer follow the flow". If the change is a bug fix, `diagnose-bug` makes it find a root cause, then allows any FIX — `if (amount === -1) return;` passes its own regression test. `review-change` axis B treats smells as prompts, has no rule list to cite, no missed-reuse type, and no too-particular-fix type.

## 4. Decisions

See decision log. Summary: D-01 scope goals 4–6; D-02 companion file; D-03 compressed 10 rules; D-04 IMPORTANT-by-default with evidence for rules 1/2/7/9/10-bugfix, else OPTIONAL; D-05 conditional sibling regression input. A-01 plain-function default for new code; A-02 no prose tests; A-03 inlined domain values OPTIONAL by default.

## 5. Proposed-system story

Same L1 change: `implement-change` §3 says "read SIMPLICITY.md before writing code". The agent reads 10 rules. Before adding `formatPrice`, rule 9 makes it search; it finds `src/money/format.ts#formatCurrency` and calls it, reporting "called `formatCurrency`". It names `0.19` as `VAT_RATE` (rule 10) unless the repo already has it in config. Self-review item 5 asks whether a fresh reviewer can follow the flow top-to-bottom (rule 2). In review, a reviewer finds a duplicated pricing calculation and writes `F-02 IMPORTANT · Standards · Simplicity rule 9` naming the existing symbol. For a bug "negative amount crashes", `diagnose-bug` forbids `amount === -1`, requires `amount < 0` (property), and a regression input such as `-0.01` that was not the trigger.

## 6. File and symbol map

| Path | Kind | Anchor | Change | Req |
|---|---|---|---|---|
| `.agents/skills/implement-change/SIMPLICITY.md` | new | — | Contract text (§7.1) | R-01, R-06 |
| `.agents/skills/implement-change/SKILL.md` | edit | §2 step 1, §3, §4 last bullet, §6, §7 | §7.2 | R-02, R-06 |
| `.agents/skills/plan-change/SKILL.md` | edit | §3 para 1 + "Do not wrap…" sentence, §5 item 7 | §7.3 | R-03 |
| `.agents/skills/review-change/SKILL.md` | edit | §2B, §5 item 5, §6 severities | §7.4 | R-04 |
| `.agents/skills/diagnose-bug/SKILL.md` | edit | new section after Critical rule; Completion | §7.5 | R-05 |

New file justification: four skills need the same numbered rules; inlining in any one SKILL.md forces the others to load it whole (D-02).

## 7. Exact proposed text (documentation; not executed)

### 7.1 New `.agents/skills/implement-change/SIMPLICITY.md`

```markdown
# Code Simplicity Contract

Applies to code agents write, plan, and review. Existing repository conventions win; apply these where the repo has no pattern. Rule numbers are stable — `review-change` cites them.

1. **Simplest correct form first.** Plain function or module before a class; a class/service only when state, lifecycle, transactions, or real multi-method cohesion earns it. No speculative structure or options.
2. **Optimize for the reviewer.** Someone who has not seen this conversation can follow the normal flow top-to-bottom from the diff without guessing intent; each hop to another file is a call whose behavior is clear from its name and signature.
3. **Explicit over clever.** Flat, linear control flow. No one-liners that hide branching, surprising overloads, meta-programming, or custom DSLs where plain code works; avoid deep nesting.
4. **Names carry meaning; comments explain why.** Spell names out (`header`, not `hdr`) unless the abbreviation is a repo or language idiom (`i`, `err`, `id`, Go's `ctx`). No comments that restate the code.
5. **One behavior per function.** The name tells you what it does.
6. **Local reasoning.** A function is understandable from its inputs and body; no hidden state or action at a distance.
7. **Readability over tokens.** Never shorten code, names, comments, or error messages to save output. Terse is for chat only.
8. **Extract a module or layer only for a real reason** — a real second caller or an independent reason to change, not "future reuse". A private, well-named function that lets the caller read top-to-bottom is fine (rules 2, 5). No forwarding layers that add a hop without behavior.
9. **Reuse before creating.** Before adding a non-trivial function, type, constant, or helper, search the repo for one that already does the same thing for the same reason. Call it, or extend it in place when in scope and its existing callers keep their behavior. Similar-looking code with a different reason to change is not a match. Report the decision: "called `X`", "extended `X`", or "new — searched <paths>".
10. **Generalize concrete duplication only; don't hardcode.** DRY business knowledge, not incidental syntax. When a real second instance exists, parameterize only the part that varies — never for hypothetical cases. Name domain-meaningful values (rates, limits, IDs, URLs) and reuse existing config, env, theme, or constants instead of inlining them; naming a value is not extraction. Literals with no domain meaning (`0`, a sentinel) stay inline. A bug fix handles every input sharing the root cause, not only the value that triggered it.
```

### 7.2 `.agents/skills/implement-change/SKILL.md`

**§2 step 1** — replace `1. **Locate** — confirm code and edit point.` with `1. **Locate** — confirm code and edit point; before adding a non-trivial function, type, or constant, run the reuse scan (SIMPLICITY rule 9).`

**§3** — replace the block from `Existing repository conventions win; apply this guidance where no pattern exists.` through `- DRY business knowledge, not incidental syntax. **Never compress production code or erase comments merely to save response tokens.**` with:

```markdown
Existing repository conventions win; apply this guidance where no pattern exists. Before writing code, read [SIMPLICITY.md](SIMPLICITY.md) — the Code Simplicity Contract `review-change` enforces, including the reuse scan (rule 9).

- Keep feature rules, invariants, validation, transitions, orchestration, and feature-specific failures close when cohesive.
- Prefer extending an existing owner with a small public API; new code starts in the simplest form (rule 1).
- Keep local pure calculations as private helpers. Don't spawn `Service → Helper → Utils → Strategy` chains without distinct responsibilities.
- Every new file must repay navigation cost through a real concern.
- Avoid god managers, pass-through adapters, and unrelated refactors. Never compress production code or erase comments to save response tokens (rule 7).
```

**§4** last bullet — replace `- Durable artifacts (code, tests, commits, handoff docs) stay professionally readable even when chat is terse.` with `- Durable artifacts (code, tests, commits, handoff docs) stay at full readability even when chat is terse (SIMPLICITY rule 7).`

**§6** — replace item 5 and renumber 6→7, 7→8:

```markdown
5. **Simplicity** — can an added file/wrapper/option be removed without loss? Can someone who has not seen this conversation follow the normal flow top-to-bottom from the diff without guessing intent (rule 2)? If not, simplify before handoff.
6. **Reuse** — each non-trivial new symbol searched for an existing equivalent (rule 9); no domain values inlined that the repo already externalizes (rule 10)?
7. **Scope** — unrelated files/boundaries intact; names match conventions?
8. **Verification** — which checks passed/failed/not run at this revision?
```

**§7** — insert after the `**Why:**` bullet: `- **Reuse:** for non-trivial new symbols, called/extended existing vs created new and where you searched (rule 9).`

### 7.3 `.agents/skills/plan-change/SKILL.md`

**§3 para 1** — replace `Prefer an existing feature service/manager/module. Existing repository conventions win; apply this guidance where no pattern exists.` with `Prefer extending an existing owner — search for one first ([SIMPLICITY.md](../implement-change/SIMPLICITY.md) rule 9). New code starts as a plain function or module; a class/service must earn its place through state, lifecycle, transactions, or real multi-method cohesion (rule 1). Existing repository conventions win; apply this guidance where no pattern exists.`

**§3 para 3** — replace `This is a responsibility map, not a mandate for four files. A small feature may live in one handler or component. Do not wrap a single function in a class only to comply.` with `This is a responsibility map, not a mandate for four files. A small feature may live in one handler, function, or component.`

**§5 item 7** — replace `7. **Scope:** Are we introducing reuse without proven shared meaning?` with `7. **Reuse:** Does the plan call or extend existing code with the same meaning instead of duplicating it, avoid reuse without proven shared meaning, and generalize only where a real second instance exists (rules 9–10)?`

### 7.4 `.agents/skills/review-change/SKILL.md`

**§2B** — append after the existing paragraph:

```markdown
Check code and planned code against the Code Simplicity Contract ([SIMPLICITY.md](../implement-change/SIMPLICITY.md)) and cite the rule (`F-04 IMPORTANT · Standards · Simplicity rule 2`). A finding must name the location, the rule, and where a fresh reader stalls or what breaks; taste alone is not a finding. Default severities:

- **IMPORTANT:** speculative structure (rule 1); normal flow not followable top-to-bottom from the diff (rule 2); code or names shortened to save tokens (rule 7); **missed reuse** of business or non-trivial logic that already exists with the same meaning — name the existing symbol/path (rule 9); a bug fix that handles only the triggering value, not the root-cause class (rule 10 — tag Spec when you can name a sibling input that still fails).
- **OPTIONAL:** everything else in the contract (rules 3–6, 8, rule 10 outside bug fixes, incidental-syntax duplication, inlined values); raise to IMPORTANT only with a demonstrated comprehension or correctness cost.
```

**§6 severities** — replace `**IMPORTANT** (substantial gap likely to cause defects)` with `**IMPORTANT** (substantial gap likely to cause defects, or a §2B Simplicity default)`.

**§5 item 5** — replace `5. Assess maintainability from demonstrated costs.` with `5. Assess maintainability and the Simplicity Contract from demonstrated costs.`

### 7.5 `.agents/skills/diagnose-bug/SKILL.md`

Insert after the `## Critical rule` paragraph:

```markdown
## Fix the class, not the case

- The fix must handle every input that shares the root cause. A guard tests the property that is wrong (`amount < 0`, `index >= length`), never only the value that failed (`amount === -1`) unless that value is the whole class.
- Forbidden: a special-case branch for one input when the root cause is shared logic; suppressing the error for that case; a null check at the one crashing call site when the value can be null everywhere.
- Regression test: when the root cause is shared logic, include at least one input from the same class that was not the original trigger. When the class genuinely has one case (wrong config key, single race window), say why in one line.
- If covering the class needs changes outside the requested scope, report it instead of widening silently.
- A too-particular fix is a hardcoded patch ([SIMPLICITY.md](../implement-change/SIMPLICITY.md) rule 10).
```

**Completion** — replace `State root cause, fix, regression coverage, and what remains unverified.` with `State root cause, fix and why it covers the whole class, regression coverage, and what remains unverified.`

## 8. Ordered steps

- **S-01** Create `SIMPLICITY.md` (§7.1). Prereq: none. Done when file matches §7.1.
- **S-02** Edit `implement-change/SKILL.md` (§7.2). Prereq: S-01 (link target). Preserve §0–1, §2 except step 1, and §5 text.
- **S-03** Edit `plan-change/SKILL.md` (§7.3). Preserve documentation-only boundary paragraph verbatim.
- **S-04** Edit `review-change/SKILL.md` (§7.4). Preserve §0 boundary paragraph and existing §2B sentence verbatim.
- **S-05** Edit `diagnose-bug/SKILL.md` (§7.5). Preserve loop block, Critical rule, Stop gate.
- **S-06** Verify (§9).

## 9. Verification and acceptance matrix

| Req / invariant | Check | Expected | Command (repo root) | Step |
|---|---|---|---|---|
| Links resolve (new file + 4 links) | existing link test | pass | `npm test` | S-06 |
| Frontmatter/descriptions unchanged & valid | existing tests | pass | `npm test` | S-06 |
| Word caps (SKILL ≤1800, AGENTS ≤1000) | existing tests | pass | `npm test` | S-06 |
| Installer tests unaffected | `install.test.mjs` | pass | `npm test` | S-06 |
| Boundaries preserved | `rg -n "Documentation-only boundary" .agents/skills` | plan-change + review-change hits unchanged | `rg` | S-06 |
| Single contract home | `rg -il "simplicity rule\|SIMPLICITY.md\|Code Simplicity Contract" .agents/skills` | exactly: new file + 4 planned skills | `rg` | S-06 |
| Old duplicated bullets gone | `rg -n "Introduce a class/service only\|Do not wrap a single function" .agents/skills` | no matches | `rg` | S-06 |
| Word deltas | `rg -o "\S+" --count-matches` on 5 files | net ≈ +400–550 words on L2 path | `rg` | S-06 |
| Behavior (manual) | fresh chat: ask for a bug fix to a negative-amount crash | agent proposes property guard + sibling regression input | manual, not automated | after acceptance |
| Behavior (manual) | fresh chat review of a diff that correctly calls an existing helper in another file | no rule-2 finding | manual | after acceptance |
| Behavior (manual) | fresh chat with two similar formatters that have different rules | agent keeps them separate and says why (rule 9 "same reason") | manual | after acceptance |

Planned checks are not evidence until run in the implementation phase.

## 10. Rollout and risks

Local, reversible markdown edits; no rollout. Installed user-level copies under `~/.agents`, `~/.cursor`, `~/.claude` stay stale until `node bin/install.mjs --user --compat` — run only with explicit approval.

**Risks:** (1) Rule 4 "spell names out" could fight language idioms — mitigated by "unless repo or language idiom" and "conventions win". (2) IMPORTANT defaults could inflate findings — mitigated by evidence requirement. (3) Token goal regresses slightly (+~400–550 words on L2 path); accepted for goals 4–6.

## 11. Readiness and handoff

Start at S-01; read §7 only. Replan if any anchor text in §7 no longer matches the file (baseline drift). Plan review result and acceptance recorded below.

### Plan review

- **r1:** NOT READY (independent fresh-context review, static only). IMPORTANT: F-01 rule 2 "without jumping files" conflicted with rule 9 and plan-change §3; F-02 rule 9 lacked a same-meaning condition and r1 removed the false-reuse guard. OPTIONAL: F-03 reuse scan not in §2 loop; F-04 D-04 "everything else OPTIONAL" unstated; F-05 `ctx` example vs Go idiom; F-06 rule 8/10 and rule 5 wording; F-07 diagnose guard stricter than D-05 + silent scope widening. All anchors verified verbatim once; install/test constraints hold.
- **r2:** all seven folded in (§7.1 rules 2, 4, 5, 8, 9, 10; §7.2 §2 step 1 and §6 item 5; §7.3 item 7; §7.4 bullets + §6 severity line; §7.5 guard + scope line; §9 checks). Re-review of changed sections: **READY**; F-01–F-07 resolved, new anchors verified once. Optional N-01 (S-02 preserve note) and N-02 (§10 rule-4 note) fixed in r2.

### Acceptance

r2 accepted by the engineer on 2026-11-13. r3 wording fixes (implementation-review F-01, F-02) accepted by the engineer on 2026-11-13.

### Implementation review

Independent fresh-context review, static: **STATIC REVIEW COMPLETE**, no BLOCKING/IMPORTANT. Diff matched §7 verbatim. OPTIONAL F-01: rule 8 read literally forbade single-use private helpers that rules 2/3/5 want → r3 scopes it to modules/layers. OPTIONAL F-02: reuse-scan threshold inconsistent ("every symbol" vs "non-trivial") → r3 adds "non-trivial" to rule 9, §2 step 1, §6 item 6. Manual behavior checks in §9 remain pending.
