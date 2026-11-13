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
