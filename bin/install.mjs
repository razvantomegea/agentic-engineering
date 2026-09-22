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
  'diagnose-bug',
  'review-change',
  'engineering-handoff',
  'ship-change',
  'audit-agent-setup',
];

const EXTRA_SKILLS = [
  'architecture-picture',
  'frontend-interview-drill',
  'tutor-me',
];

function usage() {
  console.log(`Usage: agentic-engineering [options]

Install agentic engineering skills and AGENTS.md.

Options:
  --user              Install to ~/.agents/skills + ~/.agents/AGENTS.md (+ Codex/Claude policy)
  --repo <path>       Install to <path>/AGENTS.md and <path>/.agents/skills
  --with-extras       Include optional skills in --repo installs (always on for --user)
  --compat            Also mirror skills for Claude Code and Cursor Cloud sync
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

function copyDir(src, dest) {
  ensureDir(path.dirname(dest));
  rmrf(dest);
  fs.cpSync(src, dest, { recursive: true });
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

function rewriteAgentsMd(content, mode, { home, skillsHint }) {
  const normalized = content.replace(/^\uFEFF/, '');
  const lines = normalized.split(/\r?\n/);
  if (lines.length < 3 || lines[0] !== '# AGENTS.md') {
    return normalized;
  }

  let pointer;
  if (mode === 'repo') {
    pointer =
      'Installed from [agentic-engineering](https://github.com/razvantomegea/agentic-engineering). ' +
      'Load on-demand skills from `.agents/skills/`. ' +
      'A product repo\'s README and `docs/` win for local facts. ' +
      'Re-install: `npx github:razvantomegea/agentic-engineering --repo .`';
  } else {
    pointer =
      'User-level install from [agentic-engineering](https://github.com/razvantomegea/agentic-engineering). ' +
      `Skills: \`${skillsHint}\`. ` +
      `Policy: \`${path.join(home, '.agents', 'AGENTS.md')}\` (also \`${path.join(home, '.codex', 'AGENTS.md')}\`, \`${path.join(home, '.claude', 'CLAUDE.md')}\`). ` +
      'Product README and `docs/` win for local facts. ' +
      'Re-install: `npx github:razvantomegea/agentic-engineering --user`';
  }

  lines[2] = pointer;
  return lines.join('\n');
}

function writeText(filePath, text) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, text, 'utf8');
  console.log(`Wrote ${filePath}`);
}

function writeClaudeMd(home, skillsHint) {
  const agentsPath = path.join(home, '.agents', 'AGENTS.md');
  const body = `# CLAUDE.md

User-level always-on for Claude Code. Canonical policy: \`${agentsPath}\` (also \`${path.join(home, '.codex', 'AGENTS.md')}\`; install via \`npx github:razvantomegea/agentic-engineering --user\`).

## Principle

Agents may do the work, but I must retain ownership of the mental model.

I am allowed not to write the code.
I am not allowed not to understand the system.

When I'm confused, don't immediately solve the problem for me. First help me build the smallest mental model necessary to reason about it.

## Roles

- Claude Opus: exploration, architecture, planning (\`explore-system\`, \`plan-change\`)
- Cursor: implementation and debugging (\`implement-change\`, \`diagnose-bug\`)
- Codex: independent review (\`review-change\`)
- After ship: \`engineering-handoff\` (explain, then quiz)

## Skills

On-demand under \`${skillsHint}\` (and \`${path.join(home, '.claude', 'skills')}\` if installed with \`--compat\`). If unsure which skill applies, start with \`engineering-copilot\`. Prefer \`ship-change\` for meaningful work. Do not load every skill into context.

## Hard rules

- No secrets / \`.env\` reads
- No destructive git/data/auth/migration/architecture changes unless explicitly requested
- Prefer repository inspection over assumption dumps
- Never claim verification that was not run
- Do not interrupt trivial (L0) changes with full process

Product repo README / \`docs/\` / \`docs/adr/\` win for local facts.
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
  }

  const agentsBody = rewriteAgentsMd(readCanonicalAgents(), 'user', {
    home,
    skillsHint: agentsSkills,
  });
  writeText(path.join(home, '.agents', 'AGENTS.md'), agentsBody);
  writeText(path.join(home, '.codex', 'AGENTS.md'), agentsBody);
  writeClaudeMd(home, agentsSkills);

  if (!compat) {
    console.log(
      'Note: Claude Code and Cursor Cloud sync need vendor skill dirs. Re-run with --compat if needed.',
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
  }

  const agentsBody = rewriteAgentsMd(readCanonicalAgents(), 'repo', {
    home: homeDir(),
    skillsHint: '.agents/skills',
  });
  writeText(path.join(resolved, 'AGENTS.md'), agentsBody);

  if (!compat) {
    console.log(
      'Note: Claude Code does not load .agents/skills. Re-run with --compat to also write .claude/skills.',
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
