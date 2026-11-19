---
name: explore-system
description: >-
  Use when starting meaningful work, entering unfamiliar code, or before
  plan-change. Maps entry points, state, logic, and blast radius without
  writing code. Do not use to implement or refactor.
metadata:
  author: Razvan Tomgea
  version: "1.0.0"
  tags: engineering, exploration, discovery
---

# Explore System

## Purpose

Map what already exists so later work writes **less new code** and reuses the right home. If using Claude: **Opus 5.5**, effort **`high`** / **`xhigh`**. No implementation.

Purpose: prevent coding before understanding what is already there.

## Questions to answer

- What is the entry point?
- Where does state live?
- Where is business logic?
- Where does data come from?
- What calls what?
- What existing pattern solves similar problems?
- What are the relevant boundaries?
- What might this change break?
- What can we reuse or extend instead of creating?

## Critical rule

**No implementation during exploration.** Do not refactor "while looking."

## Output format

```text
SYSTEM MAP

Entry:
...

Flow:
A → B → C → D

State/data ownership:
...

Relevant files:
...

Existing conventions:
...

Reuse candidates:
...

Important invariants:
...

Unknowns:
...

Likely change surface:
...
```

Prefer repository inspection over assumptions: cite `path#symbol` for each entry, and list anything you did not see in code under Unknowns. Keep the map compact and high-signal.

## Prerequisites

- Repo access; a change intent or unfamiliar area to map.

## Limitations

- Read/inspect only — no production edits, no speculative cleanups.
- Do not expand into full `plan-change` unless asked or complexity requires it.

## Troubleshooting

| Failure | Action |
|---------|--------|
| Cannot find owner | Widen search along call/data paths; record Unknowns |
| Urge to "quick fix" | Stop; finish the map; then route via `ship-change` / `plan-change` |
| Map too large | Narrow to one user action and its blast radius |

## Examples

- **Use:** "Map how checkout calculates tax before we change it."
- **Do not use:** "Fix the tax bug now" without mapping → still explore first if unfamiliar; coding → `implement-change` / `diagnose-bug`.
