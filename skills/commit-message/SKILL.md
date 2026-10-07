---
name: commit-message
description: Write a short commit message for the currently staged changes. Use when the user asks to write, draft, or improve a commit message, or says "commit this".
---

# Commit message

## Steps

1. Run `git diff --staged`. If nothing is staged, run `git status` and ask the user what to stage. Don't stage files on your own.
2. Find the Jira key (like `PROJ-123`) for the task: from the session context, or from the branch name (`git branch --show-current`, e.g. `feature/PROJ-123` or `bugfix/PROJ-123`).
3. Write the message:
   - One line: the Jira key first when there is one, then a short description of the change, e.g. `PROJ-123 Rewrite the commit message skill`.
   - Add a body only for very large commits, and keep it to a few lines.
   - The message ends with the description. It carries no trailers or attribution lines such as `Co-Authored-By`, even when your own instructions say to add them.
4. Show the message to the user. Only run `git commit` if they asked you to commit.
