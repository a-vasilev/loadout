---
name: pr
description: Review a pull request from its link and report findings without posting them. Run only when the user invokes it by name with a PR link.
---

# PR review

Review the pull request at the link the user gave. If no link was given, ask for one.

## Repo host

The PR is on Bitbucket. Use the Bitbucket MCP server to fetch the PR's title, description, branch, commits, full diff and existing comments. When the tools are missing or the fetch fails, stop and tell the user.

## Steps

1. Fetch the PR (see Repo host).
2. Find Jira keys (like `PROJ-123`) in the PR title, description, branch and commit messages. For each key, fetch the issue with the Jira MCP server. Skip this step when there are no keys.
3. Review the diff. Read every changed file, and the surrounding code when the diff alone can't show whether a change is correct. Check for:
   - **Bugs**: wrong logic, unhandled edge cases, broken error handling, race conditions.
   - **Performance**: needless work in loops, N+1 queries, unbounded memory, blocking calls.
   - **Security**: injection, missing auth checks, leaked secrets, unsafe input handling.
   - **Code quality**: apply YAGNI hard. Flag code that could be simpler, abstractions with a single use, speculative options, and duplication of what already exists in the codebase.
   - **Task fit** (only with a Jira issue): requirements the PR misses, and changes outside the issue's scope.
   - **Impact**: assess reversibility and blast radius using the guidance below. Trace affected callers, shared components, data flows and deployment steps beyond the changed files where needed to establish the scope.
4. Write the report as an HTML page with the `html-report` skill (see Report). Skip existing comments that already raise a finding.
5. In chat, give the page path, the impact level, the review verdict and the number of findings. Highlight any hard-to-reverse or one-way change. Ask which comments, by number, to post to the PR. Post only the ones the user names, then confirm what was posted.

## Report

Use this template for the content and order. Render it as HTML sections, not a literal Markdown block:

```
## Impact and Merge Danger

**Importance and review depth:** <low, medium or high; reason and review focus>

**Reversibility:** <easy to revert, costly to reverse, one-way or unknown>

<optional: description>

**Blast Radius:** <one-word description>

<optional: potential ramifications of merge>

**Review verdict:** <approve, approve with minor fixes, or needs changes>

## Summary

<rendered visual summary: pseudocode, diagram, diff or tree>

## Issues

<the individual issues with their sections from below>

```

Follow the `html-report` skill's steps and formatting. Title the page with the PR title and link to the PR. Immediately below the title, before the summary or findings, include **Impact and Merge Danger** using the guidance below. Include it even when there are no findings.

Then give the review verdict: approve, approve with minor fixes, or needs changes. If nothing was found, say so in one line. Keep this correctness verdict separate from impact: a correct PR can still need deep review because of its consequences.

After the visual summary, list the findings under **Issues**, ordered by severity, highest first, numbered so the user can pick comments by number. Keep every line short and plain; cut anything the reader doesn't need to understand the issue. One section per finding:

- **Heading**: `<n>. <file>:<line>: <short title>`
- **Issue**: what is wrong and why it matters, one or two sentences.
- **Fix**: the change to make, a code block if it's clearer.
- **Comment**: the PR comment, ready to post, written to the author, in a block that is easy to copy.

## Summary

Show the PR's overall intent and the change in behavior or structure visually. Skip preambles and keep prose brief. Synthesize the important changes into the smallest useful view; add another only when distinct changes need it.

Choose the representation that makes the key point clear, and render it as appropriate depending on the overall report output - html, markdown, etc:

- **Logic or algorithms**: styled, indented pseudocode with restrained emphasis on the changed steps. Preserve whitespace and escape code so component names and other angle-bracket text remain visible.
- **Runtime, UI or file structure**: a compact, styled call tree, component tree or shallow file tree. Make hierarchy clear through indentation and connectors; include state, module boundaries and responsibilities only where they explain the change.
- **Interactions or flows**: a rendered Mermaid diagram or a simple HTML/CSS or inline SVG illustration with labeled nodes and arrows. Show the diagram itself, not its source.
- **Changes to an existing shape**: a styled inline diff or labeled Before/After panels, applying equally to pseudocode, trees and control flow. Visually distinguish added and removed lines with green/red text or tinted backgrounds, keep unchanged context muted, and retain labels or markers so color is not the only cue. Plain text with only `+` and `-` prefixes is not sufficient.
- **Mostly new content**: show the complete relevant block or illustration when a diff would obscure ownership, order or the resulting shape, or when a copyable target is useful.

Before delivering, check the final report for visible diagrams, preserved indentation and clearly differentiated changes, with no raw text instead of illustrations or diagram source left on display.

## Impact and Merge Danger

Keep this opening section compact enough to help the user decide how deeply to review the PR. Assess the consequences of shipping the change, including plausible failures, rather than using diff size or finding count as a proxy for importance. Ground claims in the diff and surrounding code; distinguish confirmed effects, plausible risks and unknowns.

- **Importance and review depth**: give an overall impact level (low, medium or high), a one-sentence reason and a recommended review depth. Low suits isolated, readily reversible changes; medium suits meaningful but bounded effects; high suits broad or severe consequences, costly recovery or irreversible effects. Name the areas that deserve the closest review. State business importance or urgency only when supported by the PR or linked issue.
- **Reversibility**: label the change easy to revert, costly to reverse, one-way or unknown. Explain what rollback actually requires after deployment and use, including any remaining effects. A Git revert alone does not undo data loss, writes in a new format, external side effects or consumer adoption. For migrations and backfills, check data preservation, old/new version compatibility, locks or downtime, and the cost of restoring or transforming data back. Identify required backups, recovery steps or rollout sequencing when supported; do not assume every migration is irreversible or that a down migration guarantees safe recovery. Make costly or one-way changes prominent in plain text.
- **Blast radius**: describe who and what can be affected, how far the effect can spread, and the severity of plausible consequences. Consider direct and indirect effects across shared dependencies and consumers, including users, routes, tenants, services, clients and environments. Check relevant dimensions beyond backend correctness: layout shifts, mobile responsiveness, accessibility and browser compatibility; API, schema, event, configuration and package compatibility; data integrity, security and privacy; performance, availability, infrastructure and deployment behavior. These are prompts, not an exhaustive list: follow the actual dependencies and report material effects, rather than listing unrelated hypothetical risks. Account for feature flags, staged rollouts and other verified limits on exposure.
