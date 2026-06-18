#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// ── 0. Load .env so we can inject EXPO_PUBLIC_* values into the page ───────
function loadEnv() {
  const envFile = path.join(ROOT, '.env');
  const result = {};
  if (!fs.existsSync(envFile)) return result;
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*(EXPO_PUBLIC_\w+)\s*=\s*(.+)\s*$/);
    if (m) result[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return result;
}
const publicEnv = loadEnv();
const envScript = Object.entries(publicEnv)
  .map(([k, v]) => `process.env[${JSON.stringify(k)}]=${JSON.stringify(v)};`)
  .join('');
if (Object.keys(publicEnv).length) {
  console.log('Env vars baked in:', Object.keys(publicEnv).join(', '));
} else {
  console.log('No .env file found — deploying without Supabase (guest mode only)');
}

// ── 1. Find the main bundle ────────────────────────────────────────────────
const jsDir = path.join(DIST, '_expo', 'static', 'js', 'web');
const bundles = fs.readdirSync(jsDir).filter(f => f.startsWith('AppEntry'));
if (!bundles.length) throw new Error('No AppEntry bundle found in dist/_expo/static/js/web/');
const bundleFile = path.join(jsDir, bundles[0]);
console.log('Bundle:', bundles[0], `(${(fs.statSync(bundleFile).size / 1024).toFixed(0)} kB)`);

let js = fs.readFileSync(bundleFile, 'utf8');

// ── 2. Patch asset URLs so they resolve relative to the page ──────────────
// GitHub Pages serves from /Smartspend/ so absolute /assets/... paths break.
js = js.replace(/httpServerLocation:"\/assets\/assets"/g, 'httpServerLocation:"assets/assets"');
js = js.replace(/httpServerLocation:"\/assets"/g,         'httpServerLocation:"assets"');

// ── 3. Build self-contained index.html ────────────────────────────────────
const html = `<!DOCTYPE html><html lang="en"><head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/>
  <meta http-equiv="Cache-Control" content="no-cache,no-store,must-revalidate"/>
  <meta name="theme-color" content="#1B6E3A"/>
  <meta name="description" content="Grow strong money habits every day"/>
  <title>SmartSpend</title>
  <link rel="shortcut icon" href="favicon.ico"/>
  <style>html,body{height:100%;margin:0;padding:0;}body{overflow:hidden;background:#1B6E3A;}#root{display:flex;height:100%;flex:1;}</style>
  <script>
    // Unregister any stale service workers and clear caches on every load
    if('serviceWorker'in navigator){
      navigator.serviceWorker.getRegistrations().then(r=>r.forEach(x=>x.unregister()));
      caches.keys().then(k=>k.forEach(x=>caches.delete(x)));
    }
    // Inject public env vars so process.env.EXPO_PUBLIC_* resolves at runtime
    var process=window.process=window.process||{};
    process.env=process.env||{};
    ${envScript}
  </script>
</head><body>
<div id="root"></div>
<script>${js}</script>
</body></html>`;

// ── 4. Write to a temp deploy directory ───────────────────────────────────
const DEPLOY = path.join(ROOT, '.deploy-tmp');
if (fs.existsSync(DEPLOY)) fs.rmSync(DEPLOY, { recursive: true });
fs.mkdirSync(DEPLOY);

fs.writeFileSync(path.join(DEPLOY, 'index.html'), html);
console.log('index.html written:', `(${(Buffer.byteLength(html) / 1024).toFixed(0)} kB)`);

// Copy favicon
fs.copyFileSync(path.join(DIST, 'favicon.ico'), path.join(DEPLOY, 'favicon.ico'));

// Copy sprout image asset
const assetSrc = path.join(DIST, 'assets', 'assets');
if (fs.existsSync(assetSrc)) {
  fs.mkdirSync(path.join(DEPLOY, 'assets', 'assets'), { recursive: true });
  for (const f of fs.readdirSync(assetSrc)) {
    fs.copyFileSync(path.join(assetSrc, f), path.join(DEPLOY, 'assets', 'assets', f));
    console.log('Asset:', f);
  }
}

// Copy static web pages (privacy, support, etc.)
const staticSrc = path.join(ROOT, 'web-static');
if (fs.existsSync(staticSrc)) {
  for (const f of fs.readdirSync(staticSrc)) {
    fs.copyFileSync(path.join(staticSrc, f), path.join(DEPLOY, f));
    console.log('Static page:', f);
  }
}

// ── 5. Push to gh-pages ────────────────────────────────────────────────────
const run = cmd => execSync(cmd, { stdio: 'inherit', cwd: ROOT });

run('git fetch origin gh-pages');
run('git worktree add .gh-pages-wt gh-pages 2>/dev/null || git worktree add .gh-pages-wt origin/gh-pages');

const WT = path.join(ROOT, '.gh-pages-wt');

// Clear old files (keep .git)
for (const f of fs.readdirSync(WT)) {
  if (f === '.git') continue;
  const full = path.join(WT, f);
  fs.rmSync(full, { recursive: true });
}

// Copy deploy files into worktree
const copyDir = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f), d = path.join(dest, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
};
copyDir(DEPLOY, WT);

execSync('git add -A', { stdio: 'inherit', cwd: WT });
const ts = new Date().toISOString().slice(0, 16).replace('T', ' ');
execSync(`git commit -m "Deploy PWA: Supabase auth connected (${ts})" || echo "nothing to commit"`, { stdio: 'inherit', cwd: WT });
execSync('git push -u origin gh-pages', { stdio: 'inherit', cwd: WT });

// Cleanup
run('git worktree remove .gh-pages-wt --force');
fs.rmSync(DEPLOY, { recursive: true });

console.log('\n✓ Deployed to gh-pages');
