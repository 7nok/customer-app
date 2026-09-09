#!/usr/bin/env node
/**
 * Export designs A, B, and C into one GitHub Pages folder:
 *   dist/index.html   splash → last-chosen variant (default A)
 *   dist/a/           style A  (baseUrl /customer-app/a)
 *   dist/b/           style B
 *   dist/c/           style C
 *
 * A is copied from this working tree (the A-lineage product + preview scripts).
 * B/C are archived from their design-source refs so those branches stay intact.
 */
import { execFileSync, execSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { injectSwitcherIntoDist } from './inject-switcher.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const WORK = join(ROOT, '.preview-work');
const DIST = join(ROOT, 'dist');
const PREVIEW = join(ROOT, 'preview');
const PAGES_PREFIX = '/customer-app';

const VARIANT_REFS = {
  a: (process.env.PREVIEW_REF_A || 'WORKTREE').split(',').map((value) => value.trim()),
  b: (process.env.PREVIEW_REF_B || 'origin/cursor/dock-first-paint-b-5301,origin/cursor/daily-drivin-hero-b-5301,origin/B')
    .split(',')
    .map((value) => value.trim()),
  c: (process.env.PREVIEW_REF_C || 'origin/cursor/dock-first-paint-c-5301,origin/cursor/daily-drivin-hero-c-5301,origin/C')
    .split(',')
    .map((value) => value.trim()),
};

const SKIP_COPY = new Set(['.git', '.preview-work', 'dist', 'node_modules', '.expo', 'web-build']);

function log(message) {
  console.log(`[assemble-preview] ${message}`);
}

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

function gitOk(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

function resolveRef(candidates) {
  for (const candidate of candidates) {
    if (candidate === 'WORKTREE') {
      return { kind: 'worktree', ref: 'WORKTREE' };
    }
    if (gitOk(['rev-parse', '--verify', candidate])) {
      return { kind: 'git', ref: candidate, sha: gitOk(['rev-parse', candidate]) };
    }
  }
  throw new Error(`None of these refs exist: ${candidates.join(', ')}`);
}

function emptyDir(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

function copyWorktree(dest) {
  emptyDir(dest);
  // Cannot fs.cpSync(ROOT → ROOT/.preview-work/…) — Node rejects copy-into-self.
  const excludes = [...SKIP_COPY].flatMap((name) => ['--exclude', name]);
  execFileSync('rsync', ['-a', '--delete', ...excludes, `${ROOT}/`, `${dest}/`]);
}

function archiveRef(ref, dest) {
  emptyDir(dest);
  execSync(`git archive ${JSON.stringify(ref)} | tar -x -C ${JSON.stringify(dest)}`, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: '/bin/bash',
  });
}

function patchBaseUrl(appJsonPath, variant) {
  const app = JSON.parse(readFileSync(appJsonPath, 'utf8'));
  app.expo = app.expo ?? {};
  app.expo.experiments = app.expo.experiments ?? {};
  app.expo.experiments.baseUrl = `${PAGES_PREFIX}/${variant}`;
  writeFileSync(appJsonPath, `${JSON.stringify(app, null, 2)}\n`);
}

function lockHash(dir) {
  const lock = join(dir, 'package-lock.json');
  if (!existsSync(lock)) {
    return '';
  }
  return createHash('sha256').update(readFileSync(lock)).digest('hex');
}

function seedCacheFromRoot() {
  const hash = lockHash(ROOT);
  if (hash && existsSync(join(ROOT, 'node_modules'))) {
    return { hash, dir: ROOT };
  }
  return { hash: '', dir: '' };
}

function ensureNodeModules(dir, cache) {
  const hash = lockHash(dir);
  const destModules = join(dir, 'node_modules');
  if (hash && cache.hash === hash && cache.dir && existsSync(join(cache.dir, 'node_modules'))) {
    rmSync(destModules, { recursive: true, force: true });
    try {
      symlinkSync(join(cache.dir, 'node_modules'), destModules, 'dir');
    } catch {
      cpSync(join(cache.dir, 'node_modules'), destModules, { recursive: true });
    }
    log(`Reused node_modules from ${relative(ROOT, cache.dir)} (${hash.slice(0, 8)}…)`);
    return;
  }
  run('npm', ['ci'], dir);
  cache.hash = hash;
  cache.dir = dir;
}

function exportVariant(variant, source) {
  const dest = join(WORK, variant);
  if (source.kind === 'worktree') {
    log(`A ← working tree`);
    copyWorktree(dest);
  } else {
    log(`${variant.toUpperCase()} ← ${source.ref} (${source.sha.slice(0, 7)})`);
    archiveRef(source.ref, dest);
  }

  if (!existsSync(join(dest, 'app.json'))) {
    throw new Error(`Variant ${variant} is missing app.json`);
  }

  patchBaseUrl(join(dest, 'app.json'), variant);
  return dest;
}

function pagesExtras(variantDist) {
  writeFileSync(join(variantDist, '.nojekyll'), '');
  const index = join(variantDist, 'index.html');
  if (existsSync(index)) {
    cpSync(index, join(variantDist, '404.html'));
  }
}

function copyPreviewRoot() {
  for (const name of ['index.html', 'preview-switcher.js', 'preview-switcher.css']) {
    const from = join(PREVIEW, name);
    if (!existsSync(from)) {
      throw new Error(`Missing ${from}`);
    }
    cpSync(from, join(DIST, name));
  }
  cpSync(join(DIST, 'index.html'), join(DIST, '404.html'));
  writeFileSync(join(DIST, '.nojekyll'), '');
}

function writeSources(resolved) {
  const payload = {
    prefix: PAGES_PREFIX,
    builtAt: new Date().toISOString(),
    variants: resolved,
  };
  writeFileSync(join(DIST, 'preview-sources.json'), `${JSON.stringify(payload, null, 2)}\n`);
}

function main() {
  const typecheck = process.argv.includes('--typecheck');
  mkdirSync(WORK, { recursive: true });
  emptyDir(DIST);

  const resolved = {};
  const cache = seedCacheFromRoot();

  for (const variant of ['a', 'b', 'c']) {
    const source = resolveRef(VARIANT_REFS[variant]);
    resolved[variant] = {
      ref: source.ref,
      sha: source.sha || gitOk(['rev-parse', 'HEAD']) || 'worktree',
    };
    const dir = exportVariant(variant, source);
    ensureNodeModules(dir, cache);
    if (typecheck) {
      log(`Typecheck ${variant}`);
      run('npm', ['run', 'typecheck'], dir);
    }
    log(`Export ${variant} with baseUrl ${PAGES_PREFIX}/${variant}`);
    run('npx', ['expo', 'export', '--platform', 'web', '--output-dir', 'dist'], dir);

    const variantDist = join(DIST, variant);
    rmSync(variantDist, { recursive: true, force: true });
    mkdirSync(dirname(variantDist), { recursive: true });
    cpSync(join(dir, 'dist'), variantDist, { recursive: true });
    pagesExtras(variantDist);
    const htmlCount = injectSwitcherIntoDist(variantDist);
    log(`Injected switcher into ${htmlCount} HTML files for ${variant}`);
  }

  copyPreviewRoot();
  writeSources(resolved);
  log(`Assembled ${DIST}`);
  log(JSON.stringify(resolved, null, 2));
}

main();
