---
name: architecture-picture
description: >-
  Use when planning or implementing a large architectural change, new module,
  cross-module feature, L2/L3 work, or data-model change — before production
  code. Produces a visual HTML architecture page.
---

# Architecture Picture

Produce a self-contained HTML page that shows the big picture, architecture, flow, and modules for a planned change. The page is the shared mental model the human reviews before implementation.

Skip L0/L1 and small/medium work. Fire for large or architectural changes, new modules/subsystems, cross-module features, data-model changes, and L2/L3 work.

## Process

### 1. Classify

If the change is not large/architectural/module/big-feature, skip this skill. Do not invent ceremony for trivial work.

### 2. Explore

Read existing domain docs when present (`CONTEXT.md`, `/docs/context.md`, ADRs) and the modules this change touches. Use domain names from those docs — not invented labels. Prefer vocabulary: **module**, **interface**, **flow**, **seam**.

### 3. Write the page

Follow [HTML-PAGE.md](HTML-PAGE.md). Visual first; sparse prose. Diagrams carry the meaning.

Write a self-contained HTML file to the OS temp directory so nothing lands in the repo. Resolve the temp dir from `$TMPDIR`, falling back to `/tmp` (or `%TEMP%` on Windows), and write to `<tmpdir>/architecture-picture-<timestamp>.html` so each run gets a fresh file.

### 4. Open it

Open for the user — `xdg-open <path>` on Linux, `open <path>` on macOS, `start <path>` on Windows — and tell them the absolute path.

### 5. Stop for feedback

Ask whether the picture is right. Do not implement until the human confirms (or gives an existing L2/L3 approval phrase such as `Approved` / `Implement`).

The architecture picture *is* the human feedback checkpoint for large/architectural work.

### 6. After implementation

If what shipped diverged from the picture, update the page and reopen it. Otherwise leave the page alone.

## Out of scope

- Not a Cursor canvas.
- Do not commit the HTML into the repository.
