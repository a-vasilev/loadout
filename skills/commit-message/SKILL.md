---
name: commit-message
description: Write a clear Conventional Commits message for the currently staged changes. Use when the user asks to write, draft, or improve a commit message, or says "commit this".
---

# Commit message

Write a commit message for the staged changes that follows [Conventional Commits](https://www.conventionalcommits.org/).

## Steps

1. Run `git diff --staged`. If nothing is staged, run `git status` and ask the user what to stage. Don't stage files on your own.
2. Read the diff and work out the single main purpose of the change. If the diff mixes unrelated changes, say so and suggest splitting it into separate commits.
3. Pick the type:
   - `feat`: new behaviour for the user
   - `fix`: a bug fix
   - `refactor`: a code change with no change in behaviour
   - `docs`, `test`, `chore`, `build`, `ci`, `perf`, `style`: as their names say
4. Write the message:
   - Subject: `<type>(<optional scope>): <summary>`. Use the imperative mood, lowercase, no trailing period, and 72 characters or fewer.
   - Body (optional): say *why* the change was made and what it affects, not a line-by-line list of edits. Wrap at 72 characters.
   - Footer (optional): `BREAKING CHANGE: ...` or issue references such as `Closes #12`.
5. Show the message to the user. Only run `git commit` if they asked you to commit.

## Example

```
fix(auth): refresh expired tokens before retrying requests

Requests that failed with 401 were retried with the same expired
token, so users were logged out after an hour. Refresh the token
once before retrying.

Closes #42
```
