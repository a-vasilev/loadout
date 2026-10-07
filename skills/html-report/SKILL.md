---
name: html-report
description: Present a report or plan as a styled HTML page opened in the browser, instead of long markdown in chat. Use when the answer is a report, design or implementation plan, proposal, comparison of options, investigation or review summary, or any answer with several sections, tables or diagrams; also when the user asks for an HTML report.
---

# HTML report

Write the answer as a single HTML page built from [`assets/template.html`](assets/template.html), open it, and keep the chat reply short. Short answers stay in chat.

## Steps

1. Read the template. It holds the shared styling and one example of every component.
2. Write the page to `${TMPDIR:-/tmp}/<short-kebab-title>.html`:
   - Fill `{{TITLE}}`, `{{DATE}}` (today) and `{{CONTEXT}}` (repo, ticket or status, e.g. "Draft").
   - Keep the `<style>` block exactly as in the template, and style everything with its classes, so every report looks the same.
   - Replace the example content and delete the components you don't use. Delete the Mermaid script when there are no diagrams.
3. Open the file: `open <path>` on macOS, `xdg-open <path>` on Linux.
4. Reply in chat with the file path and the bottom line in two or three sentences.

## Writing the page

- **Bottom line up front**: the `summary` block comes first and states the conclusion or decision.
- Pick the component by the shape of the content:
  - Ordered work: `ol.steps`.
  - Alternatives: `.cards`, marking the recommended one `.chosen`.
  - Anything with rows and attributes (risks, files, findings): a table.
  - Flows, sequences, architecture: a Mermaid diagram.
  - Status or severity: `.badge` with `ok`, `warn` or `bad`.
  - What the reader must not miss: `.callout` (`note`, `warn`, `risk`). Use at most a few per page.
  - Supporting detail most readers skip: `<details>`.
- Keep prose short: one idea per paragraph, plain words, no filler.
