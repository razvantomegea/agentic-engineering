#!/usr/bin/env node
/**
 * Install agentic-engineering skills + AGENTS.md.
 *
 *   npx github:razvantomegea/agentic-engineering
 *   npx github:razvantomegea/agentic-engineering --user
 *   npx github:razvantomegea/agentic-engineering --repo .
 *   npx github:razvantomegea/agentic-engineering --user --compat
 *   node bin/install.mjs --user --with-extras
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const SKILLS_SRC = path.join(PACKAGE_ROOT, '.agents', 'skills');
const AGENTS_SRC = path.join(PACKAGE_ROOT, 'AGENTS.md');

const CORE_SKILLS = [
  'engineering-copilot',
  'explore-system',
  'plan-change',
  'implement-change',
  'guided-implementation',
  'diagnose-bug',
  'review-change',
  'engineering-handoff',
  'ship-change',
  'audit-agent-setup',
];

const EXTRA_SKILLS = [
  'architecture-picture',
  'frontend-interview-drill',
  'frontend-manual-practice',
  'tutor-me',
];

function usage() {
  console.log(`Usage: agentic-engineering [options]

Install agentic engineering skills and AGENTS.md.

Options:
  --user              Install to ~/.agents/skills + ~/.agents/AGENTS.md (+ Codex/Claude policy)
  --repo <path>       Install to <path>/AGENTS.md and <path>/.agents/skills
  --with-extras       Include optional skills in --repo installs (always on for --user)
  --compat            Also write Claude/Cursor/Antigravity skill mirrors and Gemini CLI /commands
  -h, --help          Show this help

With no --user/--repo, prompts interactively.

Examples:
  npx github:razvantomegea/agentic-engineering
  npx github:razvantomegea/agentic-engineering --user
  npx github:razvantomegea/agentic-engineering --repo .
  npx github:razvantomegea/agentic-engineering --user --compat
`);
}

function parseArgs(argv) {
  const opts = {
    user: false,
    repo: null,
    withExtras: false,
    compat: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--user') {
      opts.user = true;
    } else if (arg === '--repo') {
      const next = argv[++i];
      if (!next || next.startsWith('-')) {
        throw new Error('--repo requires a path');
      }
      opts.repo = next;
    } else if (arg === '--with-extras') {
      opts.withExtras = true;
    } else if (arg === '--compat') {
      opts.compat = true;
    } else if (arg === '-h' || arg === '--help') {
      opts.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return opts;
}

function homeDir() {
  return os.homedir();
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function rmrf(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function isSamePath(src, dest) {
  if (path.resolve(src) === path.resolve(dest)) return true;
  try {
    const left = fs.statSync(src);
    const right = fs.statSync(dest);
    // ino is 0 on some Windows volumes; do not treat that as identity.
    if (left.ino !== 0 && left.dev === right.dev && left.ino === right.ino) {
      return true;
    }
    return fs.realpathSync(src) === fs.realpathSync(dest);
  } catch {
    return false;
  }
}

const RETRYABLE_RENAME_CODES = new Set(['EPERM', 'EACCES', 'EBUSY']);
const RENAME_ATTEMPTS = 5;

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// On Windows, file watchers (e.g. Cursor indexing ~/.cursor/skills), indexers,
// and antivirus can hold a directory briefly and make rename fail transiently.
function renameWithRetry(from, to) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      fs.renameSync(from, to);
      return;
    } catch (err) {
      if (attempt >= RENAME_ATTEMPTS || !RETRYABLE_RENAME_CODES.has(err.code)) {
        throw err;
      }
      sleepSync(attempt * 100);
    }
  }
}

function copyDir(src, dest) {
  // Installing onto the source tree (this package as --repo, or a skills
  // directory symlinked back at the package) must not delete src first.
  if (isSamePath(src, dest)) return;

  const parent = path.dirname(dest);
  ensureDir(parent);
  const tmp = path.join(parent, `.${path.basename(dest)}.install-tmp`);
  const previous = path.join(parent, `.${path.basename(dest)}.install-old`);
  rmrf(tmp);
  rmrf(previous);
  try {
    fs.cpSync(src, tmp, { recursive: true });
  } catch (err) {
    rmrf(tmp);
    throw err;
  }

  // The existing copy is moved aside, not deleted, until the new one is in place.
  const hadDest = fs.lstatSync(dest, { throwIfNoEntry: false }) !== undefined;
  if (hadDest) {
    try {
      renameWithRetry(dest, previous);
    } catch (err) {
      rmrf(tmp);
      throw err;
    }
  }

  try {
    renameWithRetry(tmp, dest);
  } catch (err) {
    rmrf(tmp);
    if (hadDest) {
      try {
        renameWithRetry(previous, dest);
      } catch {
        err.message += ` (previous copy left at ${previous})`;
      }
    }
    throw err;
  }

  if (hadDest) {
    try {
      rmrf(previous);
    } catch {
      console.warn(`Could not remove ${previous}; delete it manually.`);
    }
  }
}

function syncSkill(name, destSkillsRoot) {
  const src = path.join(SKILLS_SRC, name);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing skill source: ${src}`);
  }
  const dest = path.join(destSkillsRoot, name);
  copyDir(src, dest);
  console.log(`Synced ${name} -> ${dest}`);
}

function syncSkills(names, destSkillsRoot) {
  ensureDir(destSkillsRoot);
  for (const name of names) {
    syncSkill(name, destSkillsRoot);
  }
}

function readCanonicalAgents() {
  if (!fs.existsSync(AGENTS_SRC)) {
    throw new Error(`Missing AGENTS.md at ${AGENTS_SRC}`);
  }
  return fs.readFileSync(AGENTS_SRC, 'utf8');
}

function rewriteAgentsMd(content, mode, { home, skillsHint, compat = false, withExtras = false }) {
  const normalized = content.replace(/^\uFEFF/, '');
  const lines = normalized.split(/\r?\n/);
  if (lines.length < 3 || lines[0] !== '# AGENTS.md') {
    return normalized;
  }

  let pointer;
  if (mode === 'repo') {
    const flags = ['--repo .'];
    if (withExtras) flags.push('--with-extras');
    if (compat) flags.push('--compat');
    pointer =
      'Installed from [agentic-engineering](https://github.com/razvantomegea/agentic-engineering). ' +
      'Load on-demand skills from `.agents/skills/`. ' +
      'A product repo\'s README and `docs/` win for local facts. ' +
      `Re-install: \`npx github:razvantomegea/agentic-engineering ${flags.join(' ')}\``;
  } else {
    const reinstallCmd = compat
      ? 'npx github:razvantomegea/agentic-engineering --user --compat'
      : 'npx github:razvantomegea/agentic-engineering --user';
    pointer =
      'User-level install from [agentic-engineering](https://github.com/razvantomegea/agentic-engineering). ' +
      `Skills: \`${skillsHint}\`. ` +
      `Policy: \`${path.join(home, '.agents', 'AGENTS.md')}\` (also \`${path.join(home, '.codex', 'AGENTS.md')}\`, \`${path.join(home, '.claude', 'CLAUDE.md')}\`, \`${path.join(home, '.gemini', 'GEMINI.md')}\`). ` +
      'Product README and `docs/` win for local facts. ' +
      `Re-install: \`${reinstallCmd}\``;
  }

  lines[2] = pointer;
  return lines.join('\n');
}

function writeText(filePath, text) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, text, 'utf8');
  console.log(`Wrote ${filePath}`);
}

function readSkillDescription(name) {
  const skillPath = path.join(SKILLS_SRC, name, 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    throw new Error(`Missing skill file: ${skillPath}`);
  }
  const raw = fs.readFileSync(skillPath, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const end = raw.indexOf('\n---', 4);
  if (!raw.startsWith('---\n') || end === -1) {
    return `Invoke the ${name} skill.`;
  }
  const lines = raw.slice(4, end).split('\n');
  for (let i = 0; i < lines.length; i++) {
    const match = /^description:\s*(.*)$/.exec(lines[i]);
    if (!match) continue;
    const rest = match[1].trim();
    if (rest === '>-' || rest === '>' || rest === '|' || rest === '|-') {
      const parts = [];
      for (let j = i + 1; j < lines.length && (/^  /.test(lines[j]) || lines[j] === ''); j++) {
        parts.push(lines[j].replace(/^  /, ''));
      }
      const joined = parts.join(' ').replace(/\s+/g, ' ').trim();
      if (joined) return joined;
    } else if (
      rest.length >= 2 &&
      ((rest.startsWith('"') && rest.endsWith('"')) ||
        (rest.startsWith("'") && rest.endsWith("'")))
    ) {
      return rest.slice(1, -1);
    } else if (rest) {
      return rest;
    }
  }
  return `Invoke the ${name} skill.`;
}

function syncGeminiCommands(names, destCommandsRoot, skillsHint, { posixPaths = false } = {}) {
  ensureDir(destCommandsRoot);
  const joinSkillPath = posixPaths ? path.posix.join : path.join;
  for (const name of names) {
    const description = readSkillDescription(name);
    const skillPath = joinSkillPath(skillsHint, name, 'SKILL.md');
    const prompt =
      `Activate and follow the \`${name}\` skill ` +
      `(call \`activate_skill\` with \`name: "${name}"\`, or read \`${skillPath}\`) ` +
      'for this request.';
    const body = `description = ${JSON.stringify(description)}\nprompt = ${JSON.stringify(prompt)}\n`;
    writeText(path.join(destCommandsRoot, `${name}.toml`), body);
  }
}

function writeClaudeMd(home, skillsHint, { compat = false } = {}) {
  const installCmd = compat
    ? 'npx github:razvantomegea/agentic-engineering --user --compat'
    : 'npx github:razvantomegea/agentic-engineering --user';
  const body = `# CLAUDE.md

User-level always-on for Claude Code, written by \`${installCmd}\`. Skills: \`${skillsHint}\` (and \`${path.join(home, '.claude', 'skills')}\` with \`--compat\`). The policy below is imported from \`~/.agents/AGENTS.md\`; change it in the agentic-engineering repository and reinstall, not here.

@~/.agents/AGENTS.md
`;
  writeText(path.join(home, '.claude', 'CLAUDE.md'), body);
}

function installUser({ withExtras, compat }) {
  const home = homeDir();
  const agentsSkills = path.join(home, '.agents', 'skills');
  const names = [...CORE_SKILLS, ...EXTRA_SKILLS];

  syncSkills(names, agentsSkills);

  if (compat) {
    syncSkills(names, path.join(home, '.claude', 'skills'));
    syncSkills(names, path.join(home, '.cursor', 'skills'));
    syncSkills(names, path.join(home, '.gemini', 'config', 'skills'));
    syncGeminiCommands(names, path.join(home, '.gemini', 'commands'), agentsSkills);
  }

  const agentsBody = rewriteAgentsMd(readCanonicalAgents(), 'user', {
    home,
    skillsHint: agentsSkills,
    compat,
  });
  writeText(path.join(home, '.agents', 'AGENTS.md'), agentsBody);
  writeText(path.join(home, '.codex', 'AGENTS.md'), agentsBody);
  writeText(path.join(home, '.gemini', 'GEMINI.md'), agentsBody);
  writeClaudeMd(home, agentsSkills, { compat });

  if (!compat) {
    console.log(
      'Note: Claude Code, Cursor Cloud sync, Antigravity global skills, and Gemini CLI /commands need --compat.',
    );
  }
}

function installRepo(repoPath, { withExtras, compat }) {
  const resolved = path.resolve(repoPath);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    throw new Error(`--repo path is not a directory: ${resolved}`);
  }

  const names = withExtras ? [...CORE_SKILLS, ...EXTRA_SKILLS] : [...CORE_SKILLS];
  const agentsSkills = path.join(resolved, '.agents', 'skills');
  syncSkills(names, agentsSkills);

  if (compat) {
    syncSkills(names, path.join(resolved, '.claude', 'skills'));
    syncGeminiCommands(names, path.join(resolved, '.gemini', 'commands'), '.agents/skills', {
      posixPaths: true,
    });
  }

  const agentsBody = rewriteAgentsMd(readCanonicalAgents(), 'repo', {
    home: homeDir(),
    skillsHint: '.agents/skills',
    compat,
    withExtras,
  });
  writeText(path.join(resolved, 'AGENTS.md'), agentsBody);
  if (compat) {
    writeText(path.join(resolved, 'GEMINI.md'), agentsBody);
  }

  if (!compat) {
    console.log(
      'Note: Claude Code skills and Gemini CLI /commands need --compat.',
    );
  }
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function promptTargets() {
  console.log(`Install agentic workflows where?
  1) User-level  (~/.agents/skills + ~/.agents/AGENTS.md + Codex/Claude policy)
  2) This repo   (./AGENTS.md + ./.agents/skills)
  3) Both
`);
  const choice = await ask('Choice [1/2/3]: ');
  if (choice === '1') {
    return { user: true, repo: null };
  }
  if (choice === '2') {
    return { user: false, repo: process.cwd() };
  }
  if (choice === '3') {
    return { user: true, repo: process.cwd() };
  }
  throw new Error('Invalid choice. Enter 1, 2, or 3.');
}

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    usage();
    process.exit(1);
  }

  if (opts.help) {
    usage();
    return;
  }

  let { user, repo, withExtras, compat } = opts;

  if (!user && !repo) {
    if (!process.stdin.isTTY) {
      console.error('No --user/--repo and stdin is not a TTY. Pass flags explicitly.');
      usage();
      process.exit(1);
    }
    try {
      const chosen = await promptTargets();
      user = chosen.user;
      repo = chosen.repo;
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }

  try {
    if (user) {
      installUser({ withExtras, compat });
    }
    if (repo) {
      installRepo(repo, { withExtras, compat });
    }
    console.log('Done.');
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

main();
