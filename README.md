# Agentic Engineering

Minimal, vendor-neutral agent setup. Principle:

> **Agents may do the work, but the engineer retains ownership of the mental model.**

## Install

```bash
npx github:razvantomegea/agentic-engineering
```

Interactive choice: **user-level** (`~/.agents/skills`) or **this repo** (`AGENTS.md` + `.agents/skills`), or both.

```bash
npx github:razvantomegea/agentic-engineering --user
npx github:razvantomegea/agentic-engineering --repo .
npx github:razvantomegea/agentic-engineering --user --repo .
npx github:razvantomegea/agentic-engineering --repo . --with-extras
npx github:razvantomegea/agentic-engineering --user --compat
```

| Flag | Effect |
|------|--------|
| `--user` | Skills → `~/.agents/skills`; policy → `~/.codex/AGENTS.md` + `~/.claude/CLAUDE.md` |
| `--repo <path>` | Core skills → `<path>/.agents/skills`; policy → `<path>/AGENTS.md` |
| `--with-extras` | Also install optional skills into `--repo` (always included for `--user`) |
| `--compat` | Mirror skills for Claude Code (`.claude/skills`) and, for `--user`, Cursor Cloud (`~/.cursor/skills`) |

**Why `.agents` by default?** Cursor and Codex load `.agents/skills` / `~/.agents/skills`. Claude Code still expects `.claude/skills`; Cursor Cloud Agents sync only `~/.cursor/skills`. Use `--compat` when you need those.

Local clone (after editing skills):

```bash
node bin/install.mjs --user
# or
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sync-user-skills.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sync-user-skills.ps1 -Compat
```

## Always-on

`AGENTS.md` is the permanent policy: ownership, hard rules, discovery, verification, roles, complexity gates. Keep it short. Product facts stay in each repo's README and `docs/`. Hard-to-reverse decisions go in `docs/adr/`.

## On-demand skills

Canonical source in this repo: `.agents/skills/`.

### Hierarchy

```text
engineering-copilot      ← What situation am I in?
        ↓
specific workflow skill  ← How should I handle it?
        ↓
agent/tool               ← Who should do the work?
        ↓
engineering-handoff      ← Do I actually understand it?
```

### Core workflow (load when relevant)

| Skill | Role | Phase |
|-------|------|--------|
| `engineering-copilot` | any | Meta: classify situation, route, prevent overengineering |
| `explore-system` | Claude Opus | Map system; no implementation |
| `plan-change` | Claude Opus | Plan + engineer comprehension |
| `implement-change` | Cursor | Execute approved plan |
| `diagnose-bug` | Cursor | Evidence-based debugging |
| `review-change` | Codex | Fresh skeptical review |
| `engineering-handoff` | Claude/Cursor | Teach + quiz → ownership |
| `ship-change` | any | Orchestrate by complexity |
| `audit-agent-setup` | any | Audit/reset a repo's agent config |

### Optional extras (kept)

- `architecture-picture` — HTML architecture page before large structural change
- `frontend-interview-drill` — interview practice
- `tutor-me` — explain only; user writes and runs everything

## Complexity

- **L0** trivial → implement → verify
- **L1** normal → brief explore → implement → review if useful → short handoff
- **L2/L3** significant/architectural → full `ship-change` (+ ADR at L3)

Solo products: SPEC → BUILD → TEST → REVIEW → SHIP; full handoff only for auth, payments, security, infra, data loss, expensive APIs, business-critical logic.

## Roles

Claude Opus = Thinker · Cursor = Builder · Codex = Skeptic · Claude/Cursor = Teacher after review.
