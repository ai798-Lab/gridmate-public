import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isDownloadReady, isPublicLink, PUBLIC_REPOSITORY, websiteDownloadURL } from '../release-status.mjs';

const valid = { schemaVersion:1, version:'0.3.0', status:'published', minimumMacOS:'13.0', architecture:'arm64', downloadUrl:`${PUBLIC_REPOSITORY}/releases/download/v0.3.0/GridMate-0.3.0-arm64.dmg`, releaseUrl:`${PUBLIC_REPOSITORY}/releases/tag/v0.3.0`, sha256:'a'.repeat(64), sizeBytes:1000, releasedAt:'2026-09-17', appleNotarized:true, gatekeeperAccepted:true, downloadedArtifactTested:true };
test('same-domain download retains all release gates and exact version', () => {
  const websiteDownloadUrl = 'https://snaptiler.com/downloads/GridMate-0.3.0-arm64.dmg';
  assert.equal(websiteDownloadURL({...valid, websiteDownloadUrl}), websiteDownloadUrl);
  for (const gate of ['appleNotarized','gatekeeperAccepted','downloadedArtifactTested']) assert.equal(websiteDownloadURL({...valid,websiteDownloadUrl,[gate]:false}),null);
  assert.equal(websiteDownloadURL({...valid,websiteDownloadUrl,status:'pending'}),null);
  for (const url of ['https://snaptiler.com.evil.test/downloads/GridMate-0.3.0-arm64.dmg','https://snaptiler.com/downloads/GridMate-0.2.0-arm64.dmg','https://snaptiler.com/downloads/GridMate-0.3.0-arm64.dmg?token=secret','javascript:alert(1)']) assert.equal(websiteDownloadURL({...valid,websiteDownloadUrl:url}),valid.downloadUrl);
});
test('complete verified metadata enables a download', () => assert.equal(isDownloadReady(valid), true));
test('pending release is unavailable', async () => {
  const manifest = JSON.parse(await readFile(new URL('../release.json', import.meta.url), 'utf8'));
  if (manifest.status === 'pending') assert.equal(isDownloadReady(manifest), false);
  else assert.equal(isDownloadReady(manifest), true);
});
for (const gate of ['appleNotarized', 'gatekeeperAccepted', 'downloadedArtifactTested']) test(`missing ${gate} blocks downloads`, () => assert.equal(isDownloadReady({ ...valid, [gate]:false }), false));
for (const field of ['downloadUrl', 'releaseUrl', 'sha256', 'sizeBytes', 'releasedAt', 'version', 'architecture']) test(`missing ${field} blocks downloads`, () => assert.equal(isDownloadReady({ ...valid, [field]:null }), false));
test('URLs must match the exact versioned public release', () => {
  for (const downloadUrl of ['javascript:alert(1)', 'file:///tmp/GridMate.dmg', 'https://example.com/app.dmg', `${PUBLIC_REPOSITORY}/releases/download/v0.2.0/GridMate-0.2.0-arm64.dmg`, `${valid.downloadUrl}?token=private`]) assert.equal(isDownloadReady({ ...valid, downloadUrl }), false);
});
test('untrusted JSON does not throw', () => { for (const value of [null, undefined, {}, [], '', true, 3]) assert.equal(isDownloadReady(value), false); });
test('support and release URLs do not leak into private or lookalike repositories', () => {
  assert.equal(isPublicLink(`${PUBLIC_REPOSITORY}/issues`, 'issues'), true);
  for (const url of ['https://github.com/ai798-Lab/GridMate/issues', `${PUBLIC_REPOSITORY}/issues-evil`, `${PUBLIC_REPOSITORY}/issues?secret=x`, 'javascript:alert(1)', null]) assert.equal(isPublicLink(url, 'issues'), false);
});
