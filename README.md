# loadout

My personal agent skills for **Claude Code**, **Codex** and **Cursor**.

## Install

### Claude Code (plugin)

```
/plugin marketplace add a-vasilev/loadout
/plugin install loadout@loadout
```

Skills are namespaced, so they appear as `/loadout:<skill>`. Updates come in
through `/plugin marketplace update loadout`, or automatically if you turn on
auto-update for the marketplace in `/plugin`.

### Codex, Cursor (and Claude Code without the plugin)

```bash
# See what's available
npx skills add a-vasilev/loadout --list

# Install everything for your user, for all three agents
npx skills add a-vasilev/loadout -g -a codex -a cursor -a claude-code

# Install a single skill
npx skills add a-vasilev/loadout -g -s commit-message

# Pull updates later
npx skills update
```

Drop `-g` to install into the current project instead of your user folder.

| Agent | Project path | Global path |
|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `.agents/skills/` | `~/.codex/skills/` |
| Cursor | `.agents/skills/` | `~/.cursor/skills/` |

## Skills

| Skill | What it does |
|---|---|
| [`commit-message`](skills/commit-message/SKILL.md) | Writes a Conventional Commits message for the staged changes |

## Adding a skill

See [AGENTS.md](AGENTS.md) for the conventions. In short: create
`skills/<name>/SKILL.md` with `name` and `description` frontmatter, then run:

```bash
node scripts/validate.mjs
claude plugin validate .
```

CI runs the same checks on every push.
