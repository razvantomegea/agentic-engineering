import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(repoRoot, '.agents', 'skills');
const installPath = path.join(repoRoot, 'bin', 'install.mjs');
const agentsPath = path.join(repoRoot, 'AGENTS.md');

const SKILL_WORD_CAP = 1800;
const AGENTS_WORD_CAP = 1000;

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function listSkillDirs() {
  return fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n') && !raw.startsWith('---\r\n')) {
    return { ok: false, error: 'missing opening ---' };
  }
  const end = raw.indexOf('\n---', 4);
  if (end === -1) {
    return { ok: false, error: 'missing closing ---' };
  }
  const block = raw.slice(4, end).replace(/\r\n/g, '\n');
  const fields = {};
  const lines = block.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!m) {
      i += 1;
      continue;
    }
    const key = m[1];
    const rest = m[2];
    if (rest === '>-' || rest === '|' || rest === '>' || rest === '|-') {
      const parts = [];
      i += 1;
      while (i < lines.length && (/^  /.test(lines[i]) || lines[i] === '')) {
        parts.push(lines[i].replace(/^  /, ''));
        i += 1;
      }
      fields[key] = parts.join(' ').replace(/\s+/g, ' ').trim();
      continue;
    }
    if (
      (rest.startsWith('"') && rest.endsWith('"')) ||
      (rest.startsWith("'") && rest.endsWith("'"))
    ) {
      fields[key] = rest.slice(1, -1);
    } else {
      fields[key] = rest.trim();
      fields[`__${key}_unquoted`] = true;
      fields[`__${key}_raw`] = rest;
    }
    i += 1;
  }
  return { ok: true, fields, body: raw.slice(end + 4) };
}

function walkMarkdown(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMarkdown(full));
    } else if (entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

test('every skill has valid frontmatter with matching name', () => {
  for (const name of listSkillDirs()) {
    const skillPath = path.join(skillsRoot, name, 'SKILL.md');
    assert.equal(fs.existsSync(skillPath), true, `missing ${skillPath}`);
    const raw = fs.readFileSync(skillPath, 'utf8');
    const parsed = parseFrontmatter(raw);
    assert.equal(parsed.ok, true, `${name}: ${parsed.error}`);
    assert.equal(parsed.fields.name, name, `${name}: name must equal directory`);
  }
});

test('skill descriptions are trigger-first, <=200 chars, YAML-safe', () => {
  for (const name of listSkillDirs()) {
    const raw = fs.readFileSync(path.join(skillsRoot, name, 'SKILL.md'), 'utf8');
    const parsed = parseFrontmatter(raw);
    assert.equal(parsed.ok, true, `${name}: ${parsed.error}`);
    const desc = parsed.fields.description;
    assert.ok(desc, `${name}: missing description`);
    assert.ok(desc.startsWith('Use '), `${name}: description must start with "Use "`);
    assert.ok(
      desc.length <= 200,
      `${name}: description is ${desc.length} chars (max 200)`,
    );
    if (parsed.fields.__description_unquoted) {
      const rawVal = parsed.fields.__description_raw;
      assert.ok(
        !rawVal.includes(': ') && !/ #/.test(rawVal),
        `${name}: unquoted description must not contain ": " or " #"`,
      );
    }
  }
});

test('relative markdown links in skills resolve on disk', () => {
  const linkRe = /\]\(([^)]+)\)/g;
  for (const file of walkMarkdown(skillsRoot)) {
    const text = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = linkRe.exec(text)) !== null) {
      const target = match[1];
      if (/^(https?:|mailto:|#)/i.test(target)) continue;
      const clean = target.split('#')[0];
      if (!clean) continue;
      const resolved = path.resolve(path.dirname(file), clean);
      assert.equal(
        fs.existsSync(resolved),
        true,
        `broken link in ${path.relative(repoRoot, file)}: ${target}`,
      );
    }
  }
});

test('every skill directory is listed in CORE_SKILLS or EXTRA_SKILLS', () => {
  const installSrc = fs.readFileSync(installPath, 'utf8');
  for (const name of listSkillDirs()) {
    assert.ok(
      installSrc.includes(`'${name}'`),
      `${name} missing from bin/install.mjs skill lists`,
    );
  }
});

test('SKILL.md word counts stay under cap', () => {
  for (const name of listSkillDirs()) {
    const text = fs.readFileSync(path.join(skillsRoot, name, 'SKILL.md'), 'utf8');
    const words = wordCount(text);
    assert.ok(
      words <= SKILL_WORD_CAP,
      `${name}/SKILL.md has ${words} words (max ${SKILL_WORD_CAP})`,
    );
  }
});

test('AGENTS.md word count stays under cap', () => {
  const text = fs.readFileSync(agentsPath, 'utf8');
  const words = wordCount(text);
  assert.ok(words <= AGENTS_WORD_CAP, `AGENTS.md has ${words} words (max ${AGENTS_WORD_CAP})`);
});
