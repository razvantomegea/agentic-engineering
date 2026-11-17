# UI visual specification

Load when the change has a design, mockup, screenshot, or brand reference. A reference image is a source, not a spec. Planning stays documentation-only (see [SKILL.md](SKILL.md)).

## Interview questions

Open and read every reference yourself before asking; ask only what the images cannot answer.

- Which reference wins when files disagree, and which parts of a mockup are placeholders?
- What font family, size, weight, case, and tracking apply to each text role, including navigation, body, buttons, forms, and footer? Is one family used everywhere?
- What are the colours, surfaces, spacing, grid, and image aspect ratios? Are they measured from the design file or estimated?
- What does each shared region (header, footer, banners, bands) contain, in what order, and where does each icon or link go?
- What is deliberately absent (titles over video, extra buttons)?
- Which strings appear in the design, in which language, and does the planned copy differ from them?
- Which design elements have no planned feature (icons, search, notifications)? Build, hide, or defer?
- What are the small-screen layouts and overlay or contrast rules when no mockup exists?
- How will each built screen be compared with its reference, and who approves the difference?

## Plan content

Put the visual specification in Part A §4 (Contracts) and its acceptance checks in Part B §7 (Verification matrix). Before any step, inspect every reference (open the images; do not assume from filenames) and write down what a builder cannot guess:

- Reference inventory: each file, the screen it shows, and which wins on conflict. Mark mockup placeholders (red labels, grey boxes, lorem text) as "never rendered".
- Tokens: font family for every text role (nav, body, buttons, forms, footer, not just headings), size, weight, case, tracking, line-height; colours and surfaces; spacing, gutters, grid columns and gaps; image aspect ratios; button styles and where each is used. Mark values read by eye as estimates and name how and when they are measured (design file, devtools).
- Every shared region (header, footer, banners, bands): content, order, icons and their destinations, active and hover state.
- Per-screen table: sections in order, with text case, copy, button style, image role, alignment and what is deliberately absent (for example "no site title over the video").
- Copy and language of every visible string, including footers and labels that differ from the plan's wording.
- Responsive rules for sizes with no mockup, and how text stays readable over imagery (overlay, contrast).
- Elements the design shows that the product does not support (icons without a destination, features not planned): record as OPEN QUESTIONS, not as silent omissions or inventions.
- Acceptance: a side-by-side comparison of each built screen with its reference, plus computed-style checks for the tokens, listed in the verification matrix.
