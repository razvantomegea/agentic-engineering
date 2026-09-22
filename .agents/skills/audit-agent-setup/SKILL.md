---
name: audit-agent-setup
description: >-
  Audit and redesign a repository's AI-agent configuration toward a minimal
  high-signal setup. Use when resetting agent instructions, reducing token
  waste, or cleaning AGENTS.md / rules / skills. Audits first; proposes
  structure; does not modify files until the user explicitly approves.
---

# Audit Agent Setup

Reset this repository's AI-agent configuration toward a minimal, high-signal setup.

Your goal is NOT to add more instructions. Your goal is to reduce context, remove redundancy, and leave a small agentic engineering system that helps ship quickly while preserving human understanding and ownership.

## Step 1 — Audit

Inspect all repository-level AI instructions and skills, including where present:

- AGENTS.md
- CLAUDE.md
- .cursorrules
- .cursor/rules/
- .cursor/skills/
- .claude/
- skills/
- prompts/
- AI-related docs
- agent-specific instructions
- duplicated coding conventions

Also identify inherited/global instructions if they are visible from this environment.

For every instruction or skill, classify it as:

1. ESSENTIAL — repository-specific information agents genuinely need frequently.
2. ON-DEMAND — useful, but should be a skill loaded only when relevant.
3. REDUNDANT — already obvious from the codebase, tooling, formatter, linter, tests, or another instruction.
4. STALE — no longer accurately reflects the repository.
5. LOW-VALUE — costs context/tokens without meaningfully improving output.

Do not modify anything yet.

Show a concise audit.

## Step 2 — Design the minimal replacement

Target architecture:

- `AGENTS.md` — minimal repository map and non-negotiable rules only
- `docs/architecture/` — durable architecture when necessary
- `docs/adr/` — important architectural decisions only
- skills — small task-specific workflows loaded on demand

Permanent AGENTS.md must NOT become a knowledge dump. Prefer references and discoverability. Agents should inspect the repository when information can be reliably discovered.

Canonical workflow skills (user-level or `.agents/skills/`): `explore-system`, `plan-change`, `implement-change`, `diagnose-bug`, `review-change`, `engineering-handoff`, `ship-change`.

## Step 3 — Preserve only what matters

Preserve:

- commands that cannot be easily discovered
- unusual architectural boundaries
- critical invariants
- important security rules
- dangerous operations
- required verification commands
- conventions that differ from ecosystem defaults

Remove generic instructions such as:

- write clean code
- use good variable names
- follow best practices
- avoid bugs
- write maintainable code
- generic TypeScript/React advice

unless this repository has a specific non-standard interpretation.

## Step 4 — Optimize for the workflow

Tool roles:

- Claude Opus: architecture, brainstorming, exploration, planning
- Cursor: implementation and debugging
- Codex: independent review and verification

Workflow for meaningful changes:

EXPLORE → UNDERSTAND → PLAN → IMPLEMENT → VERIFY → INDEPENDENT REVIEW → EXPLAIN → OWNERSHIP GATE → MERGE

Prevent blindly accepting implementation the engineer does not understand. Do NOT interrupt trivial changes with unnecessary process. Use judgment based on complexity and risk.

## Step 5 — Token/context discipline

- Keep persistent instructions short.
- Prefer progressive disclosure.
- Load skills only when relevant.
- Do not automatically include large architecture documents.
- Do not repeatedly restate repository information already in context.
- Do not create giant all-purpose skills.
- Avoid overlapping skills.
- Prefer repository inspection over static documentation when inspection is cheap and reliable.
- Keep each skill focused on one phase or responsibility.

## Step 6 — Proposed output

After the audit, propose:

1. The new AGENTS.md
2. Files that should be deleted
3. Files that should be shortened
4. Information that should move into docs
5. Skills worth keeping
6. Skills worth removing
7. Missing skills required for the workflow above

**Do NOT modify files until the user explicitly approves the proposed structure.**

Goals: high throughput, low token waste, strong engineering ownership, continuous learning, minimal process overhead.
