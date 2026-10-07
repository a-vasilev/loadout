# Working in this repo

This repo is a collection of agent skills, installed on other machines with
`npx skills` (Codex, Cursor, Claude Code) and as a Claude Code plugin named
`loadout`. Every skill must work in all three agents.

## Layout

- `skills/<name>/SKILL.md`: one folder per skill. Keep it flat, with no category subfolders.
- `skills/<name>/scripts/`, `skills/<name>/references/`: optional files the skill uses.
- `.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json`: the Claude Code plugin. Skills in `skills/` are picked up automatically, so don't list them here.
- `scripts/validate.mjs`: the repo check, which also runs in CI.

## Adding or changing a skill

1. Create `skills/<name>/SKILL.md`. `<name>` is lowercase letters, digits and hyphens.
2. Frontmatter uses only portable keys:
   ```yaml
   ---
   name: <name>            # must match the folder name
   description: <what it does>. Use when <the situations that should trigger it>.
   ---
   ```
   Don't use Claude-only keys such as `allowed-tools`, `model` or `disable-model-invocation`.
   The other agents ignore them, so the skill would behave differently per agent.
3. The description is what makes the agent pick the skill. Say what it does and when to use it, under 1024 characters.
4. Keep `SKILL.md` short. Move long reference material into `references/` and link to it with a relative path.
5. Write instructions that don't depend on one agent's tool names. Say "read the file" or "run `git diff`", not "use the Read tool".
6. Bundled scripts are bash or Python and must run on macOS and Linux.
7. Run `node scripts/validate.mjs` and `claude plugin validate .` before committing.

## Don't

- Add a `version` to `plugin.json`. Without it, every push to `main` counts as an update.
- Add a `CLAUDE.md` at the repo root. The repo root is also the plugin root, where it would be flagged by `claude plugin validate`. Claude's instructions live in `.claude/CLAUDE.md`.
