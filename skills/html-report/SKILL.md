---
name: html-report
description: Present a document as a single HTML page opened in the browser, instead of long markdown in chat. Use for plans, specs, implementation designs, summaries, findings writeups, reports, comparisons, and sets of UI mockups. Not for HTML that ships as part of an app or product.
---

# HTML report

Write the answer as one HTML page, open it, and keep the chat reply short.

## Steps

1. Write the page to `<short-kebab-title>.html` in the system temp directory (`${TMPDIR:-/tmp}` on macOS and Linux, `$env:TEMP` on Windows), following Formatting.
2. Open it: `open <path>` on macOS, `xdg-open <path>` on Linux, `Start-Process <path>` in PowerShell on Windows (`start "" <path>` from cmd or Git Bash).
3. Reply in chat with the path and the bottom line in two or three sentences.

## Formatting

- **Self-contained**: one file with inline CSS. The only external load is Mermaid from a CDN, and only when the page has diagrams.
- **Layout**: responsive viewport and no fixed-width layout
- **Theme**: dark only. Pure black background (`#000`), white text, grey for secondary text and borders. One accent color, used rarely: links and the single most important highlight.
- **Spec, not landing page**: dense and readable. Start with the title and a short summary of the conclusion, then plain headings, short paragraphs, tables and lists. A narrow reading column, system fonts, small headings, tight spacing.
- **Plain voice**: factual, declarative sentences with no marketing words. Use commas, colons or parentheses where an em dash would go; no em dashes.
- **Scripts**: inline, and only when interactivity helps the presentation (tabs, toggles, sortable tables). A static page needs none.
- **UI mockups**: build them in HTML and CSS inside the page. Label them A, B, C, and lay them out side by side at the same size, each with its label and a one-line description, so the differences show at a glance.
