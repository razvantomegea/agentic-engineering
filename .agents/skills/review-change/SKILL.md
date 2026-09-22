---
name: review-change
description: >-
  Independent skeptical review of a change — assume the implementation may be
  wrong; try to falsify it. Prefer issue/spec + diff without the full
  implementation conversation. Use after verification for Level 1+ work,
  especially before merge. Best with Codex. Categorize findings as BLOCKING,
  IMPORTANT, or OPTIONAL only — no numeric quality scores.
---

# Review Change

Best model: **Codex**

Receive the issue/spec + diff, preferably without the entire implementation conversation. Fresh eyes.

## Philosophy

```text
Assume the implementation may be wrong.
Do not defend the implementation.
Try to falsify it.
```

## Review axes

- Correctness
- Architecture
- Edge cases
- Race conditions
- State ownership
- Security
- Performance
- Error handling
- Tests
- Unnecessary complexity
- Repository conventions
- Scope creep

## Finding categories (only)

```text
BLOCKING
IMPORTANT
OPTIONAL
```

Do not use numeric ratings (e.g. 8.7/10). They are almost useless.

## Output

Group findings under BLOCKING / IMPORTANT / OPTIONAL. For each: what, where, why it matters, suggested direction (not a full rewrite unless necessary). End with a short verdict: safe to merge after X, or not yet.
