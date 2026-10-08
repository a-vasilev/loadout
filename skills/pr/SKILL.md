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
4. Write the report as an HTML page with the `html-report` skill (see Report). Skip existing comments that already raise a finding.
5. In chat, give the page path, the verdict and the number of findings. Ask which comments, by number, to post to the PR. Post only the ones the user names, then confirm what was posted.

## Report

Follow the `html-report` skill's steps and formatting. Title the page with the PR title and link to the PR. Open with the verdict: approve, approve with minor fixes, or needs changes. If nothing was found, say so in one line.

Then list the findings, ordered by severity, highest first, numbered so the user can pick comments by number. Keep every line short and plain; cut anything the reader doesn't need to understand the issue. One section per finding:

- **Heading**: `<n>. <file>:<line>: <short title>`
- **Issue**: what is wrong and why it matters, one or two sentences.
- **Fix**: the change to make, a code block if it's clearer.
- **Comment**: the PR comment, ready to post, written to the author, in a block that is easy to copy.
