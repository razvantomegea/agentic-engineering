---
name: explore-system
description: >-
  Use when starting meaningful work, entering unfamiliar code, or before
  plan-change. Maps entry points, state, logic, data sources, call graph,
  patterns, and blast radius. No implementation.
---

# Explore System

Best model: **Claude Opus**

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

## Critical rule

**No implementation during exploration.**

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

Important invariants:
...

Unknowns:
...

Likely change surface:
...
```

Prefer repository inspection over assumptions. Keep the map compact and high-signal.
