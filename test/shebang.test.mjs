import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bin = path.join(root, 'bin', 'install.mjs');

test('installer bin starts with a shebang npm can exec', () => {
  const bytes = fs.readFileSync(bin);
  assert.equal(bytes[0], 0x23, 'leading UTF-8 BOM makes the shebang interpreter unresolvable');
  assert.equal(bytes[1], 0x21);
  assert.ok(bytes.subarray(0, 19).toString('utf8').startsWith('#!/usr/bin/env node'));

  const destDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agentic-shebang-'));
  const dest = path.join(destDir, 'install.mjs');
  fs.copyFileSync(bin, dest);
  fs.chmodSync(dest, 0o755);

  const result = spawnSync(dest, ['--help'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || String(result.error));
  assert.match(result.stdout, /Usage: agentic-engineering/);
  assert.doesNotMatch(result.stdout, /Synced /);
});
