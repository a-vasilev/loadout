#!/usr/bin/env node
// Checks that every skill in skills/ is installable by `npx skills` and the
// Claude Code plugin, and that the plugin manifests are valid JSON.
// Usage: node scripts/validate.mjs

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const errors = [];
const fail = (msg) => errors.push(msg);

// Keys understood by Claude Code, Codex and Cursor alike.
const PORTABLE_KEYS = new Set(["name", "description", "license", "metadata"]);
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function readJson(rel) {
  const path = join(root, rel);
  if (!existsSync(path)) return fail(`${rel}: missing`);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    fail(`${rel}: invalid JSON (${e.message})`);
  }
}

// Minimal frontmatter parser: top-level `key: value` pairs, plus folded (>)
// and literal (|) block scalars. Indented lines belong to the previous key.
function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return null;
  const data = {};
  let key = null;
  let block = null;
  for (const line of match[1].split(/\r?\n/)) {
    const top = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (top) {
      key = top[1];
      const value = top[2].trim();
      block = /^[>|][-+]?$/.test(value) ? [] : null;
      data[key] = block ? "" : value.replace(/^(["'])(.*)\1$/, "$2");
    } else if (key && block && line.trim()) {
      block.push(line.trim());
      data[key] = block.join(" ");
    }
  }
  return data;
}

// --- Plugin manifests ---
const marketplace = readJson(".claude-plugin/marketplace.json");
const plugin = readJson(".claude-plugin/plugin.json");

if (marketplace) {
  if (!marketplace.name) fail("marketplace.json: missing name");
  if (!marketplace.owner?.name) fail("marketplace.json: missing owner.name");
  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
    fail("marketplace.json: plugins must be a non-empty array");
  } else if (plugin && !marketplace.plugins.some((p) => p.name === plugin.name)) {
    fail(`marketplace.json: no plugin entry named "${plugin.name}"`);
  }
}
if (plugin) {
  if (!plugin.name || !NAME_RE.test(plugin.name)) {
    fail("plugin.json: name must be kebab-case");
  }
  if (plugin.version) {
    console.warn("plugin.json: `version` is set; users only get updates when you bump it");
  }
}

// --- Skills ---
const skillsDir = join(root, "skills");
const skillDirs = existsSync(skillsDir)
  ? readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory())
  : [];
if (skillDirs.length === 0) fail("skills/: no skills found");

const seen = new Set();
for (const dir of skillDirs) {
  const rel = `skills/${dir}/SKILL.md`;
  const path = join(skillsDir, dir, "SKILL.md");
  if (!existsSync(path)) {
    fail(`${rel}: missing`);
    continue;
  }
  const fm = parseFrontmatter(readFileSync(path, "utf8"));
  if (!fm) {
    fail(`${rel}: missing YAML frontmatter`);
    continue;
  }
  if (!fm.name) fail(`${rel}: missing name`);
  else if (!NAME_RE.test(fm.name) || fm.name.length > 64) {
    fail(`${rel}: name "${fm.name}" must be lowercase letters, digits and hyphens, max 64 chars`);
  } else if (fm.name !== dir) {
    fail(`${rel}: name "${fm.name}" must match folder name "${dir}"`);
  }
  if (seen.has(fm.name)) fail(`${rel}: duplicate skill name "${fm.name}"`);
  seen.add(fm.name);

  if (!fm.description) fail(`${rel}: missing description`);
  else if (fm.description.length > 1024) fail(`${rel}: description over 1024 chars`);

  for (const key of Object.keys(fm)) {
    if (!PORTABLE_KEYS.has(key)) {
      fail(`${rel}: frontmatter key "${key}" isn't portable across Claude Code, Codex and Cursor`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${skillDirs.length} skill(s) and plugin manifests are valid`);
