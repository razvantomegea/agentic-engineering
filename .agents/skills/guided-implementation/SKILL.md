---
name: guided-implementation
description: Guide the human through an implementation plan one small coherent step at a time while the human writes the code. Human writes the implementation, AI provides optimized guidance to accelerate understanding and reduce friction.
---

# Guided Implementation

Use when an implementation plan already exists and the human wants to write the code with the agent as wingman.

## When to Use

```text
plan-change → guided-implementation → human writes ↔ agent guides/reviews → … → review-change / engineering-handoff
```

- **`implement-change`** — agent writes the code
- **`guided-implementation`** — plan already exists (designed together); agent actively guides, may show snippets, review, debug, and rethink the plan with the human while the human types the implementation
- **`tutor-me`** — strict learning mode; agent keeps hands off
- **`frontend-manual-practice`** — deliberate frontend practice, not shipping a planned feature

Do **not** implement the complete feature unless explicitly asked.

## Role

Guide through the plan. Human writes implementation.

Agent may: explain what/why, which files, answer questions, teach concepts, hints, pseudocode, small illustrative snippets, review, diagnose, reconsider the plan together.

## Workflow

One small coherent step at a time. Optimize for human understanding and implementation speed.

For each step:

1. **State the goal** - What user/business value this step delivers
2. **Identify files** - Which file(s) and where in each file
3. **Explain context** - Relevant existing code, patterns, conventions
4. **Clarify requirements** - Exactly what needs to be implemented
5. **Provide scaffold** - Minimal starting code, interface, or structure (available when needed, not mandatory)
6. **Human implements** - Human writes the code
7. **Review and continue** - Review, answer questions, diagnose, update plan

## Rules

- Do not dump multiple steps at once, except when batching related trivial steps (see Acceleration Techniques)
- Do not generate entire files or complete features by default
- Provide **just enough** scaffold to start, not complete solutions
- A coherent change may involve multiple files (not exactly one file per step)
- Do not blindly follow the original plan — discuss better approaches and update the plan
- Explanations proportional to difficulty; brief for trivial; teach enough for unfamiliar/important concepts

## Optimized Guidance Techniques

To accelerate implementation while preserving human understanding:

### 1. Smart Scaffolding
Provide starting structure without giving the solution (use when human needs help starting):
- File location and imports
- Function/interface signatures
- Type definitions
- Empty method bodies with comments
- Test file structure (as explanation, not implementation)

### 2. Context-Rich Hints
Instead of generic guidance, provide specific hints:
- "Look at how we handled similar cases in `existing-file.ts:42`"
- "The pattern from the last feature applies here"
- "Remember the invariant we discussed: X must always be true"

### 3. Progressive Disclosure
Reveal information progressively based on human progress. Start minimal, add detail only when needed:
```
Level 1: Goal + file location
Level 2: Interface/type signature (if needed)
Level 3: Pseudocode outline (if needed)
Level 4: Key implementation detail (if stuck)
Level 5: Minimal working fragment (last resort)
```

### 4. Illustrative Templates
Provide reusable patterns that human can adapt (labeled as illustrative examples):
```typescript
// Illustrative template: API call with retry pattern
// (adapt to your specific use case)
const result = await apiClient.fetchWithRetry(url, {
  // TODO: Add your specific retry configuration
});
// TODO: Handle result according to your requirements
```

### 5. Error Prevention
Anticipate and warn about common mistakes:
- "Remember to handle the null case here"
- "Don't forget to update the cache"
- "This needs to be atomic - consider a transaction"

### 6. Just-in-Time Teaching
Explain concepts when they're immediately relevant:
- When human encounters a pattern: "This is the Repository pattern - it separates data access from business logic"
- When human makes a mistake: "That approach could cause race conditions because..."

## Hint Ladder (When Human is Stuck)

Use this progression - only escalate when necessary:

1. **Question** - "What should own this state: the parent or this component?"
2. **Concept** - "This is a pure function - same input always produces same output"
3. **Direction** - "You need to add error handling for the network request"
4. **Pseudocode** -
   ```
   if user is authenticated:
     fetch user data
     transform data
     return result
   else:
     return error
   ```
5. **Minimal Fragment** - Smallest possible code to unblock (rare)

## Understanding Verification

After human implements each meaningful step, verify understanding:

**For non-trivial changes, ask 1-2 targeted questions:**
- "What does this code do?"
- "When would this fail?"
- "What invariant does this maintain?"

**For meaningful work, ensure human can explain:**
- The behavior being implemented
- Where the code fits in the system
- What could go wrong

**For Level 0 (trivial) work, skip formal verification** - keep it lightweight

## Completion Criteria (Implementation Phase)

A step is complete when:

1. Code is written and compiles
2. Human understands what was implemented
3. Tests pass for this increment (if applicable)
4. Plan is updated if understanding changed

*Note: Full verification, review-change, and engineering-handoff happen in subsequent steps as appropriate for the complexity level.*

## Acceleration Techniques

To make the process faster while maintaining understanding:

### 1. Batch Small Steps
Group related trivial steps together:
```
"Steps 3-5 are similar - here are the file locations and requirements. Implement all three, then we'll review together."
```

### 2. Prepare Guidance
When waiting for human to implement step A, prepare guidance for step B:
```
"While you implement the service, I'll identify the pattern we should use for the next step."
```

### 3. Environment Awareness
Use knowledge of the codebase to provide better guidance:
- "This should follow the pattern from `utils/validation.ts`"
- "We use the `Result` type for error handling in this project"
- "Remember our convention: always validate at the boundary"

### 4. Pre-Validation
Catch issues before human implements:
- "Heads up: you'll need to handle the case where X is null"
- "This function should be pure - no side effects"
- "Don't forget the security check here"

## Integration with Other Skills

This skill fits into the broader workflow:

```text
engineering-copilot (classify)
    ↓
explore-system (understand)
    ↓
plan-change (design)
    ↓
guided-implementation (human implements with AI guidance)
    ↓
review-change (independent review if useful for Level 1+)
    ↓
engineering-handoff (ownership transfer for Level 1+, short for trivial work)
```

For **Level 0 (trivial)** work: guided-implementation → verify (no formal review/handoff needed)

## Principle

We already have the plan. Guide me through building it efficiently while I remain the person writing and understanding the code.

Optimize for: understanding + speed + quality

The human must be able to explain what they built and why it works.