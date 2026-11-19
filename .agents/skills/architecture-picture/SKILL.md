---
name: architecture-picture
description: >-
  Use for large architectural, new-module, cross-module, or L2/L3 data-model
  work before production code. Produces a visual HTML architecture page. Do not
  use for small/L0/L1 changes.
metadata:
  author: Razvan Tomgea
  version: "1.0.0"
  tags: [engineering, architecture, visualization]
---

# Architecture Picture

## Purpose

Give the human a shared visual mental model before large changes — so implementation writes less speculative code. Not a substitute for `plan-change`. If using Claude (house): **Opus 5.5**, effort **`high`** / **`xhigh`**; **Fable 5.2** for hardest/L3 architecture (blog).

Produce a self-contained HTML page that shows the big picture, architecture, flow, and modules for a planned change. The page is the shared mental model the human reviews before implementation.

**Skip** L0/L1 and other small/medium work — including small data-model changes. **Fire** only for large or architectural changes, new modules/subsystems, cross-module features, and L2/L3 data-model work. When both apply (e.g. a small data-model tweak), the skip rule wins: do not produce the page.

## Process

### 1. Classify

If the change is L0/L1, small/medium, or otherwise not large/architectural/module/cross-module/L2–L3 data-model work, skip this skill. Do not invent ceremony for trivial work.

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

## Prerequisites

- Change classified as large/architectural/new-module/cross-module/L2–L3 data-model.
- Domain docs or modules available to inspect.

## Limitations

- Do not use for L0/L1 or small work — skip wins when ambiguous.
- HTML stays in the OS temp directory; not repo content.
- Do not implement until the human confirms the picture (or gives L2/L3 approval).

## Troubleshooting

| Failure | Action |
|---------|--------|
| Change is actually small | Skip this skill; no page |
| Open command fails | Report absolute path; user opens manually |
| Picture wrong after ship | Update page and reopen only if shipped shape diverged |

## Examples

- **Use:** "Draw the architecture picture for the new billing module (L2)."
- **Do not use:** "Tweak button margin" / L0–L1 → skip; implement directly.
