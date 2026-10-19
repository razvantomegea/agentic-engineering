---
name: engineering-handoff
description: Make the responsible engineer genuinely understand, navigate, explain and debug a change using one behavioral home, a short feature flow, module responsibilities, invariants, failure paths, and an interactive ownership quiz.
---

# Engineering Handoff — Build My Mental Map

The engineer must be able to **find and understand the feature later without reopening the AI chat**. Explain real implementation from code, not an invented architectural narrative. Do not teach syntax or enumerate every line.

## 1. Give a compact system map

Explain briefly:

1. **Why:** what problem was solved.
2. **Where to start:** the ONE file/module to open first for the feature's business logic; if multiple are required, explain why and whether it is an avoidable design problem.
3. **Normal flow:** a user action as `UI -> hook/adapter (if any) -> manager/feature module -> API/effect -> result`; include only existing boundaries.
4. **Responsibility map:** what the primary module owns, what it deliberately *does not* own, and what few other files are essential.
5. **State ownership:** the source of truth, React update mechanism if relevant, lifecycle and async behavior.
6. **Why this shape:** why logic was co-located or separated; what unnecessary layers were avoided (only if grounded).
7. **Invariants and failure paths:** a few real examples; identify the first file/log/test to inspect.
8. **Evidence:** which tests/checks actually ran and what remains unverified.

The key question is **"If requirement X changes tomorrow, where do I go, and why?"**

## 2. Active recall — don't just lecture

Ask 3–5 short, concrete questions and **wait for the engineer to answer**:

- If you had to change the core business rule, which file would you open first?
- Walk through what happens from user action to visible result.
- Where is the source of truth, and how does the UI learn about changes?
- What does the manager/service hide, and what would justify splitting it?
- If [real failure scenario] happens, where would you start debugging and what evidence would you collect?

Judge architectural understanding, not recitation of file names or TypeScript syntax. Correct misunderstandings, teach only the gap, then allow another short quiz if needed. Never declare ownership passed before answers.

## 3. End with a durable micro-map

After adequate answers, summarize in at most 8 short lines:

`Feature -> behavioral home -> public API -> state owner -> external dependency -> verification -> first debugging location`.

For trivial local changes, skip this process. For substantial architectural work, include a compact before/after map. Don't force a formal doc where it isn't useful.
