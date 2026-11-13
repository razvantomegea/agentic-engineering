# Frontend Manual Practice — Curriculum

Companion to [SKILL.md](SKILL.md). Read when designing an exercise, weekly update, or rotation. Not required for every hint/review turn.

## Fundamentals First

Modern framework knowledge must remain grounded in browser fundamentals.

### HTML

- semantic HTML
- forms
- validation
- accessibility
- document structure
- native browser behavior

### CSS

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

### JavaScript

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

### TypeScript

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

## Framework Rotation

Practice should rotate across the major frontend ecosystem rather than locking into a single framework.

Prioritize technologies that are widely used, actively maintained, conceptually important, and relevant to modern frontend engineering.

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

Other frameworks or libraries may be introduced when they become meaningful in the broader ecosystem.

Do not chase every new library. Distinguish durable changes from hype.

## Prefer Small Complete Apps

Practice should favor small applications that expose multiple frontend concepts rather than isolated algorithm exercises.

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

Keep scope intentionally small. The purpose is learning, not product completeness.

## Progressive Reimplementation

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

This is especially useful for maintaining understanding beneath framework abstractions.

## Keep Current Without Chasing Hype

Frontend changes rapidly. The goal is not to learn every new framework.

### Level 1 — Platform

Always understand developments in HTML, CSS, JavaScript, browser APIs, web standards.

### Level 2 — Language

Maintain strong TypeScript knowledge.

### Level 3 — Dominant Frameworks

Maintain practical familiarity with React, Next.js, Angular.

### Level 4 — Important Ecosystem Tools

Track major changes in testing, build tooling, state management, data fetching, styling, performance tooling.

### Level 5 — Emerging Technology

Learn only when it demonstrates meaningful adoption or introduces an important new idea.

Do not confuse novelty with importance.

## Suggested Six-Week Rotation

### Week 1 — Web Platform

Build something mostly with semantic HTML, modern CSS, browser APIs, minimal JavaScript.

### Week 2 — TypeScript

Build a small application emphasizing type modeling, unions, generics, narrowing, API boundaries.

### Week 3 — React

Focus on rendering, state, effects, composition, transitions, forms, data flow.

### Week 4 — Next.js

Focus on server/client boundaries, routing, rendering, caching, data fetching, mutations, deployment model.

### Week 5 — Angular

Focus on components, dependency injection, signals, templates, forms, services, routing.

### Week 6 — Engineering Quality

Focus on testing, accessibility, performance, browser debugging, network behavior, profiling.

Then repeat the cycle using different applications and newer ecosystem features.
