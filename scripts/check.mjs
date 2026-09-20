import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { isDownloadReady, isPublicLink } from '../release-status.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = await readFile(resolve(root, 'app.js'), 'utf8');
const englishKeys = new Set([...script.matchAll(/'([^']+)'\s*:/g)].map(m => m[1]));
for (const page of ['index.html', 'privacy.html', 'brand.html', 'support.html', 'releases/index.html', 'releases/0.3.5.html', 'releases/0.3.6.html', 'releases/0.3.7.html']) {
  const html = await readFile(resolve(root, page), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${page}: duplicate IDs`);
  for (const [, key] of html.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)) assert(englishKeys.has(key), `${page}: missing English key ${key}`);
  for (const [, href] of html.matchAll(/(?:href|src)="([^"?]+)(?:\?[^"#]*)?"/g)) {
    if (href.startsWith('https:')) continue;
    if (href.startsWith('#')) { assert(ids.includes(href.slice(1)), `${page}: missing anchor ${href}`); continue; }
    const [path] = href.split('#');
    if (path && path !== './') await access(resolve(dirname(resolve(root, page)), path));
  }
  assert(!html.includes('®'), 'Do not imply a registered trademark');
  assert(!/https?:\/\/(?:fonts|www\.google-analytics)/.test(html), 'No external fonts or tracking');
}
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const languages = html.match(/<ul\s+class="language-list"[\s\S]*?<\/ul>/)?.[0];
assert(languages, 'Language list must be present');
assert.equal([...languages.matchAll(/<li\b/g)].length, 32, 'Language count must match the app');
assert(/id="download-link"\s+aria-disabled="true"/.test(html), 'Download must default to disabled');
const release = JSON.parse(await readFile(resolve(root, 'latest.json'), 'utf8'));
assert(['pending', 'published'].includes(release.status), 'Unknown release state');
if (release.status === 'published') {
  assert(isDownloadReady(release), 'Published release fails acceptance gates');
  if (release.websiteDownloadUrl) {
    assert.equal(release.websiteDownloadUrl, `https://snaptiler.com/downloads/SnapTiler-${release.version}-arm64.dmg`);
    const installer = await readFile(resolve(root, `downloads/SnapTiler-${release.version}-arm64.dmg`));
    assert.equal(installer.byteLength, release.sizeBytes, 'Website installer size differs from verified release');
    assert.equal(createHash('sha256').update(installer).digest('hex'), release.sha256, 'Website installer differs from verified release');
  }
}
else assert.equal(release.downloadUrl, null, 'Pending release cannot contain a download URL');
if (release.supportUrl) assert(isPublicLink(release.supportUrl, 'issues'), 'Invalid support destination');
if (release.releaseUrl) assert(isPublicLink(release.releaseUrl, 'releases'), 'Invalid release destination');
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes:true })) {
    if (entry.name.startsWith('.git') || entry.name === 'node_modules') continue;
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) { await scan(path); continue; }
    if (/\.(p12|p8|key|pem|mobileprovision)$/.test(entry.name) || entry.name.startsWith('.env')) throw new Error(`Private file in public site: ${entry.name}`);
    const source = await readFile(path, 'utf8');
    // Check concrete credentials and personal paths, not this scanner's regex source.
    if (entry.name === 'check.mjs') continue;
    assert(!/(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|\/Users\/[a-zA-Z0-9_-]+\/)/.test(source), `Sensitive content in ${entry.name}`);
  }
}
await scan(root);
console.log('PASS: bilingual copy, links, 32 languages, download safety gates, public-file scan.');
