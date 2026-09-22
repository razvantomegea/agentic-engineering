---
name: explore-system
description: >-
  Map an unfamiliar or target subsystem before coding — entry points, state,
  business logic, data sources, call graph, patterns, boundaries, and blast
  radius. Use when starting meaningful work, entering unfamiliar code, or
  before plan-change. Best with Claude Opus. No implementation during exploration.
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
