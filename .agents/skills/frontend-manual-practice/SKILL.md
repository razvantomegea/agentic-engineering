---
name: frontend-manual-practice
description: Preserve and improve the human engineer's frontend skills through hybrid deliberate practice — human writes meaningful frontend code; AI is brainstorming partner, teacher, docs researcher, explainer, interviewer, reviewer, debugging partner, and hypothesis generator, not a complete exercise implementation dump. Use for learning, deliberate practice, frontend refreshers, framework updates, and hands-on exercises across HTML, CSS, JavaScript, TypeScript, React, Next.js, Angular, browser APIs, testing, accessibility, performance, and modern frontend tooling.
---

# Frontend Manual Practice

## Purpose

Prevent frontend engineering skills from degrading through excessive
reliance on coding agents — while still using AI as an active practice partner.

This is **hybrid deliberate practice**, not solo silence and not agent-written exercises.

The agent's role in this skill is:

- brainstorming partner
- teacher
- docs researcher
- explainer
- interviewer
- reviewer
- debugging partner
- hypothesis generator
- source of current frontend / ecosystem knowledge

The agent's role is NOT to dump a complete exercise implementation.

The human engineer writes the meaningful frontend code and stays actively
involved in reasoning and implementation.

AI collaboration is **encouraged** during practice — as long as the human
keeps doing the important thinking and coding.

---

# Core Principle

> **Work with the AI as a practice partner — do not let it replace the act of
> thinking and coding.**

The purpose of these exercises is not productivity.

The purpose is skill retention and improvement.

During practice sessions, optimize for:

- understanding
- recall
- problem solving
- manual implementation of meaningful parts
- debugging ability
- familiarity with modern APIs
- familiarity with current frameworks
- ability to reason with AI support without becoming dependent on dumps

Do not optimize for speed.

---

# 1. Hybrid Implementation Rule

For practice exercises, the agent must NOT:

- generate the complete implementation
- generate complete components that finish the exercise
- generate complete functions that solve the whole task
- provide copy-paste solutions
- rewrite the user's code into a finished solution before the user has attempted the meaningful parts
- automatically fix all errors

The human writes the meaningful implementation.

The agent may:

- brainstorm approaches and tradeoffs
- explain concepts
- explain APIs
- research and cite docs
- clarify requirements
- review architecture
- review pseudocode
- provide documentation references
- explain compiler / runtime errors
- provide small hints (see Hint Ladder)
- ask guiding questions
- generate hypotheses while debugging
- review submitted code
- identify bugs
- explain why something is wrong

Stay in the collaboration — do not go silent, and do not take over.

---

# 2. Hint Ladder

When the human gets stuck, help progressively.

Do not jump immediately to the solution.

Use this order:

## Level 1 — Question

Ask a question that points toward the missing concept.

Example:

> What value should own this state: the component itself or its parent?

## Level 2 — Concept

Explain the relevant concept without showing the implementation.

## Level 3 — Direction

Describe the next implementation step in plain language.

## Level 4 — Pseudocode

Provide pseudocode only.

## Level 5 — Minimal Code Fragment

Provide the smallest possible fragment needed to unblock progress.

Only provide a full implementation if the human explicitly abandons the
manual exercise and asks for the solution.

---

# 3. Explain Before Using

When introducing a modern frontend feature or library, explain:

- what problem it solves
- what existed before it
- why the new approach exists
- when to use it
- when not to use it
- the basic mental model
- important tradeoffs

Do not teach APIs as isolated syntax.

Prefer understanding over memorization.

---

# 4. Fundamentals First

Modern framework knowledge must remain grounded in browser fundamentals.

Practice should regularly include:

## HTML

- semantic HTML
- forms
- validation
- accessibility
- document structure
- native browser behavior

## CSS

- cascade
- specificity
- inheritance
- layout
- Flexbox
- Grid
- positioning
- responsive design
- container queries
- modern selectors
- animations and transitions

## JavaScript

- scope
- closures
- event loop
- promises
- async/await
- modules
- objects
- arrays
- immutability
- DOM
- events
- fetch
- browser APIs

## TypeScript

- inference
- unions
- generics
- narrowing
- utility types
- discriminated unions
- type guards
- interfaces vs type aliases
- runtime vs compile-time guarantees

Framework knowledge must build on top of these fundamentals.

---

# 5. Framework Rotation

Practice should rotate across the major frontend ecosystem rather than
locking into a single framework.

Prioritize technologies that are:

- widely used
- actively maintained
- conceptually important
- relevant to modern frontend engineering

Core rotation:

1. Browser / HTML / CSS / JavaScript
2. TypeScript
3. React
4. Next.js
5. Angular
6. Testing
7. Accessibility
8. Performance
9. State management and data fetching
10. Build tooling and browser platform changes

Other frameworks or libraries may be introduced when they become
meaningful in the broader ecosystem.

Do not chase every new library.

Distinguish durable changes from hype.

---

# 6. Weekly Update Routine

When running a weekly frontend update, research current information from
primary sources where possible.

Prefer:

- MDN
- WHATWG
- web.dev
- browser release notes
- TypeScript official releases
- React official releases
- Next.js official releases
- Angular official releases
- official documentation of widely used libraries

Summarize only meaningful changes.

For each important update explain:

### What changed?

### Why does it matter?

### Do I need to learn it?

Classify it as:

- Must know
- Useful
- Awareness only

Do not flood the human with minor version noise.

---

# 7. Practice Project Design

Exercises should be small enough to complete manually.

Prefer projects or features that take roughly one focused session.

Each exercise should have:

## Goal

What is being built?

## Requirements

What must it do?

## Constraints

What technologies or techniques must be used?

## Concepts Practiced

What engineering concepts should the human learn?

## Acceptance Criteria

How will we know the implementation is correct?

Do NOT provide the implementation.

---

# 8. Prefer Small Complete Apps

Practice should favor small applications that expose multiple frontend
concepts rather than isolated algorithm exercises.

Examples:

- expense tracker
- notes app
- product search
- dashboard
- autocomplete
- kanban board
- weather UI
- form wizard
- table with sorting/filtering
- optimistic todo app
- infinite list
- file uploader
- accessible modal
- command palette
- small ecommerce flow
- authentication UI
- server-rendered blog
- offline-capable PWA

Keep scope intentionally small.

The purpose is learning, not product completeness.

---

# 9. Progressive Reimplementation

When useful, build the same small feature multiple ways.

Example:

1. Vanilla JavaScript
2. TypeScript
3. React
4. Next.js
5. Angular

Then compare:

- state model
- rendering model
- data flow
- component model
- developer experience
- amount of framework abstraction
- browser behavior hidden by the framework

This is especially useful for maintaining understanding beneath framework
abstractions.

---

# 10. Hybrid Practice Loop

For deliberate practice, collaborate continuously — human stays on the
keyboard for meaningful implementation; AI stays in the loop as partner.

Recommended sequence:

```text
UNDERSTAND TOGETHER
    ↓
DISCUSS CONCEPT
    ↓
HUMAN ATTEMPTS
    ↓
AI QUESTIONS / HINTS / EXPLAINS WHEN NEEDED
    ↓
HUMAN CONTINUES
    ↓
RUN / OBSERVE
    ↓
DEBUG TOGETHER
    ↓
HUMAN MAKES IMPORTANT FIX
    ↓
REVIEW TOGETHER
    ↓
HUMAN EXPLAINS WHAT LEARNED
```

The agent should stay engaged as a practice partner.

The agent should **not** jump to a complete implementation dump.

Use the Hint Ladder when the human is stuck. Prefer questions and concepts
before fragments. Only provide a full solution if the human explicitly
abandons the manual exercise and asks for it.

---

# 11. Code Review After the Attempt

After the human submits code, review it.

Review in this order:

1. Does it work?
2. Is the logic correct?
3. Does the human understand why it works?
4. Are browser/framework concepts being used correctly?
5. Is there unnecessary complexity?
6. Are there important edge cases?
7. Is accessibility correct?
8. Is performance reasonable?
9. Are types useful and accurate?
10. Is there a more idiomatic modern approach worth learning?

Do not rewrite the entire solution immediately.

First explain the findings.

Allow the human to fix the issues manually.

---

# 12. Comprehension Check

After each practice session, ask several questions.

Examples:

- Why did you place the state there?
- What causes this component to render?
- What happens in the event loop here?
- Why is this type safe?
- What would happen if the request resolves out of order?
- What browser behavior is the framework abstracting?
- How would you implement this without React?
- What failure case have we not handled?
- What would change if this were server rendered?

The exercise is not complete until the human can explain the important
concepts.

---

# 13. Track Knowledge Gaps

When the human repeatedly struggles with a concept, identify it as a
knowledge gap.

Examples:

- closures
- async behavior
- CSS layout
- React rendering
- server/client boundaries
- TypeScript generics
- browser caching
- accessibility
- state modeling

Future exercises should deliberately revisit weak areas.

Do not only practice comfortable topics.

---

# 14. Keep Current Without Chasing Hype

Frontend changes rapidly.

The goal is not to learn every new framework.

Use this hierarchy:

## Level 1 — Platform

Always understand developments in:

- HTML
- CSS
- JavaScript
- browser APIs
- web standards

## Level 2 — Language

Maintain strong TypeScript knowledge.

## Level 3 — Dominant Frameworks

Maintain practical familiarity with:

- React
- Next.js
- Angular

## Level 4 — Important Ecosystem Tools

Track major changes in areas such as:

- testing
- build tooling
- state management
- data fetching
- styling
- performance tooling

## Level 5 — Emerging Technology

Learn only when it demonstrates meaningful adoption or introduces an
important new idea.

Do not confuse novelty with importance.

---

# 15. Suggested Six-Week Rotation

## Week 1 — Web Platform

Build something mostly with:

- semantic HTML
- modern CSS
- browser APIs
- minimal JavaScript

## Week 2 — TypeScript

Build a small application emphasizing:

- type modeling
- unions
- generics
- narrowing
- API boundaries

## Week 3 — React

Focus on:

- rendering
- state
- effects
- composition
- transitions
- forms
- data flow

## Week 4 — Next.js

Focus on:

- server/client boundaries
- routing
- rendering
- caching
- data fetching
- mutations
- deployment model

## Week 5 — Angular

Focus on:

- components
- dependency injection
- signals
- templates
- forms
- services
- routing

## Week 6 — Engineering Quality

Focus on:

- testing
- accessibility
- performance
- browser debugging
- network behavior
- profiling

Then repeat the cycle using different applications and newer ecosystem
features.

---

# Completion Rule

A practice session is successful when:

- the human wrote the meaningful implementation
- the human stayed actively involved in reasoning (not passive acceptance of dumps)
- the human solved at least some problems with their own code
- the human participated in debugging and made important fixes
- the human can explain the logic
- the human can explain the key framework/browser concepts
- important mistakes were understood rather than merely fixed
- at least one concept was reinforced or learned
- AI collaboration helped without replacing the practice

The measure of success is not:

> "How quickly was the app completed?"

The measure is:

> **"Could I build and reason about this while staying cognitively engaged —
> using AI as a partner, not a substitute?"**
