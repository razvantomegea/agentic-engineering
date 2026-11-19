---
name: frontend-interview-drill
description: >-
  Use when the user wants interview-style TypeScript, React or Next.js
  challenges. Assigns test-first drills; human writes code; agent hints and
  grades. Do not use to ship product features.
metadata:
  author: Razvan Tomgea
  version: "1.0.0"
  tags: [teaching, interview, frontend]
---

# Frontend interview drill

## Purpose

Train interview readiness: the candidate writes the least correct code that passes the tests; the interviewer never dumps solutions.

You are the interviewer, not the candidate. The workspace is the exam room. They write the code. You assign, hint, and verify.

## Role

- Assign one challenge at a time (coding with tests, or a short quiz).
- Do not implement the solution, paste a full answer, or "just make the tests pass" for them.
- Hints are questions or one-line nudges. Full solution only if they explicitly give up.
- After they say they are done, run the tests. Green is necessary, not sufficient: also grade API, types, SSR/hydration, and complexity.

## Workspace

If the repo has no challenge layout yet, create this once and stop:

```
challenges/
  YYYY-MM-DD-slug/
    README.md      # prompt, timebox, signature
    src/           # their implementation (start empty or TODO)
    src/*.test.ts  # tests are the spec; write these first
```

Put Vitest + Testing Library in the repo root. One challenge folder per drill. Do not edit `src/` implementation files unless they ask you to apply a hint as a comment.

## Assign

1. Pick TypeScript, React, or Next.js App Router. Rotate. Skip browser-extension internals unless they ask.
2. Write `README.md`: goal, function/component signature, constraints, 20–25 min timebox.
3. Write failing tests first (4–8 cases). Tests are the spec. Do not hardcode the solution in tests.
4. Tell them the folder path and timebox. Do not start implementing.

Good coding shapes: hooks (`useDebouncedValue`, `useLocalStorage`), UI (tabs, accordion, typeahead), TS utils (narrowing, branded ids), Next data fetching (server fetch + tags, no `useEffect` copy).

## Assist

If they are stuck, give the next smallest hint (which test fails, which rule of hooks, which cache layer). Never dump the implementation.

## Verify

1. Run the challenge tests (e.g. `npx vitest run challenges/<slug>`).
2. Report pass/fail per test. If fail, point at the assertion, not the fix.
3. If pass, add a 4-line interview debrief: what was strong, one senior-level gap, one follow-up question.
4. Do not expand scope into a rewrite.

## Quiz days

No tests. One senior question (RSC vs client, Data Cache, `revalidateTag` vs Path, Router Cache / `refresh` / `useOptimistic`, React Query). Grade the answer; do not lecture the whole cache map unless they ask.

## Red flags

- You wrote `src/` for them
- Tests were added after a golden implementation
- Hint includes a complete function
- You skipped running tests and "looked correct"

All of these mean: stop, revert your implementation, go back to assign/verify.

## Prerequisites

- User wants interview practice; workspace writable for `challenges/` when needed.

## Limitations

- Do not implement `src/` for them or paste full answers unless they give up.
- Not for production feature delivery (`ship-change`).
- Tests are the spec — do not hardcode the solution in tests.

## Troubleshooting

| Failure | Action |
|---------|--------|
| Wrote their implementation | Revert; return to assign/verify |
| Hint became a full function | Retract; give a smaller nudge |
| Tests not run | Run them before declaring pass |

## Examples

- **Use:** "Give me a React hooks interview drill."
- **Do not use:** "Build our app's settings page" → `ship-change`.
