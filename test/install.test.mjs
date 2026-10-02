import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function copyPackage(dest) {
  fs.cpSync(path.join(repoRoot, 'bin'), path.join(dest, 'bin'), { recursive: true });
  fs.cpSync(path.join(repoRoot, 'AGENTS.md'), path.join(dest, 'AGENTS.md'));
  fs.cpSync(path.join(repoRoot, 'package.json'), path.join(dest, 'package.json'));
  fs.cpSync(path.join(repoRoot, '.agents'), path.join(dest, '.agents'), { recursive: true });
}

function runInstall(pkg, args, { home } = {}) {
  const env = { ...process.env };
  if (home) {
    env.HOME = home;
    env.USERPROFILE = home;
  }
  return spawnSync(process.execPath, [path.join(pkg, 'bin', 'install.mjs'), ...args], {
    cwd: pkg,
    env,
    encoding: 'utf8',
  });
}

test('installing into the package root keeps skill sources', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ae-self-'));
  try {
    const pkg = path.join(root, 'pkg');
    copyPackage(pkg);
    const skill = path.join(pkg, '.agents', 'skills', 'engineering-copilot', 'SKILL.md');
    fs.appendFileSync(skill, '\nLOCAL_EDIT_DO_NOT_LOSE\n');

    const result = runInstall(pkg, ['--repo', pkg]);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const body = fs.readFileSync(skill, 'utf8');
    assert.match(body, /LOCAL_EDIT_DO_NOT_LOSE/);
    assert.equal(
      fs.existsSync(path.join(pkg, '.agents', 'skills', 'ship-change', 'SKILL.md')),
      true,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('user install through a symlinked skills tree does not delete package skills', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ae-link-'));
  try {
    const pkg = path.join(root, 'pkg');
    const home = path.join(root, 'home');
    copyPackage(pkg);
    fs.mkdirSync(home);
    fs.symlinkSync(path.join(pkg, '.agents'), path.join(home, '.agents'));
    const skill = path.join(pkg, '.agents', 'skills', 'engineering-copilot', 'SKILL.md');
    fs.appendFileSync(skill, '\nLOCAL_EDIT_DO_NOT_LOSE\n');

    const result = runInstall(pkg, ['--user'], { home });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(fs.readFileSync(skill, 'utf8'), /LOCAL_EDIT_DO_NOT_LOSE/);
    assert.equal(fs.existsSync(path.join(home, '.codex', 'AGENTS.md')), true);
    assert.equal(fs.existsSync(path.join(home, '.claude', 'CLAUDE.md')), true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('repo install replaces a different tree and keeps package sources', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ae-repo-'));
  try {
    const pkg = path.join(root, 'pkg');
    const project = path.join(root, 'project');
    copyPackage(pkg);
    const sourceSkill = path.join(pkg, '.agents', 'skills', 'diagnose-bug', 'SKILL.md');
    fs.appendFileSync(sourceSkill, '\nSOURCE_MARKER\n');

    const destSkillDir = path.join(project, '.agents', 'skills', 'diagnose-bug');
    fs.mkdirSync(destSkillDir, { recursive: true });
    fs.writeFileSync(path.join(destSkillDir, 'SKILL.md'), 'OLD_CONTENT\n');
    fs.writeFileSync(path.join(destSkillDir, 'LOCAL_ONLY.md'), 'precious\n');
    fs.mkdirSync(path.join(project, '.agents', 'skills', 'custom-skill'), { recursive: true });
    fs.writeFileSync(path.join(project, '.agents', 'skills', 'custom-skill', 'KEEP.md'), 'keep\n');

    const result = runInstall(pkg, ['--repo', project]);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(fs.readFileSync(sourceSkill, 'utf8'), /SOURCE_MARKER/);
    const installed = fs.readFileSync(path.join(destSkillDir, 'SKILL.md'), 'utf8');
    assert.match(installed, /SOURCE_MARKER/);
    assert.equal(fs.existsSync(path.join(destSkillDir, 'LOCAL_ONLY.md')), false);
    assert.equal(
      fs.readFileSync(path.join(project, '.agents', 'skills', 'custom-skill', 'KEEP.md'), 'utf8'),
      'keep\n',
    );
    assert.equal(fs.existsSync(path.join(project, 'AGENTS.md')), true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('a failed skill copy leaves the existing destination in place', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ae-fail-'));
  const locked = [];
  try {
    const pkg = path.join(root, 'pkg');
    const project = path.join(root, 'project');
    copyPackage(pkg);
    const blocked = path.join(pkg, '.agents', 'skills', 'engineering-copilot', 'SKILL.md');
    fs.chmodSync(blocked, 0);
    locked.push(blocked);

    const destSkillDir = path.join(project, '.agents', 'skills', 'engineering-copilot');
    fs.mkdirSync(destSkillDir, { recursive: true });
    fs.writeFileSync(path.join(destSkillDir, 'PRECIOUS.md'), 'do-not-lose\n');

    const result = runInstall(pkg, ['--repo', project]);

    assert.notEqual(result.status, 0);
    assert.equal(fs.readFileSync(path.join(destSkillDir, 'PRECIOUS.md'), 'utf8'), 'do-not-lose\n');
    assert.equal(
      fs.existsSync(path.join(destSkillDir, '..', '.engineering-copilot.install-tmp')),
      false,
    );
  } finally {
    for (const file of locked) {
      fs.chmodSync(file, 0o644);
    }
    fs.rmSync(root, { recursive: true, force: true });
  }
});
