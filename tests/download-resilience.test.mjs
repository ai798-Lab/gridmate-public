import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { embedRelease } from '../scripts/build-release.mjs';
import { resolveRelease, backupDownloadURL } from '../release-status.mjs';

const current = JSON.parse(await readFile(new URL('../latest.json', import.meta.url), 'utf8'));
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('network failure or malformed refresh retains the verified published installer', () => {
  for (const result of [null, undefined, {}, 'unavailable', {status:'published'}]) {
    assert.equal(resolveRelease(current, result), current);
  }
});
test('an explicit release withdrawal disables the embedded download', () => {
  assert.equal(resolveRelease(current, {schemaVersion:1,status:'pending'}), null);
});
test('backup must be the exact verified version on the existing release repository', () => {
  assert.equal(backupDownloadURL(current), current.backupDownloadUrl);
  assert.equal(backupDownloadURL({...current,backupDownloadUrl:current.backupDownloadUrl.replaceAll(current.version,'0.1.0')}), null);
  assert.equal(backupDownloadURL({...current,backupDownloadUrl:'https://github.com.evil.test/app.dmg'}), null);
});
test('without JavaScript all three primary buttons point to the published package', () => {
  const output = embedRelease(html, current);
  const anchors = [...output.matchAll(/<a\b[^>]*data-installer-download[^>]*>/g)].map(x=>x[0]);
  assert.equal(anchors.length, 3);
  for (const anchor of anchors) {
    assert(anchor.includes(`href="${current.downloadUrl}"`));
    assert(anchor.includes(`download="SnapTiler-${current.version}-arm64.dmg"`));
    assert(!anchor.includes('aria-disabled'));
  }
  assert(output.includes(`SHA-256: ${current.sha256}`));
  assert(!output.includes('当前没有可公开下载的正式安装包'));
});
test('publishing is deterministic and refreshes every link and label on version change', () => {
  const changed = {...current, version:'0.4.0', downloadUrl:'https://snaptiler.com/downloads/SnapTiler-0.4.0-arm64.dmg', releaseUrl:'https://snaptiler.com/releases/0.4.0.html', backupDownloadUrl:'https://github.com/ai798-Lab/gridmate-public/releases/download/v0.4.0/SnapTiler-0.4.0-arm64.dmg'};
  const output = embedRelease(html, changed);
  assert.equal(embedRelease(output, changed), output);
  assert.equal([...output.matchAll(/href="https:\/\/snaptiler.com\/downloads\/SnapTiler-0.4.0-arm64.dmg"/g)].length, 3);
  assert(output.includes('v0.4.0 Beta'));
});
test('unverified or withdrawn releases cannot become static public download links', () => {
  assert.throws(()=>embedRelease(html, {...current,appleNotarized:false}));
  const output = embedRelease(html, {schemaVersion:1,status:'pending',downloadUrl:null});
  const anchors = [...output.matchAll(/<a\b[^>]*data-installer-download[^>]*>/g)].map(x=>x[0]);
  for (const anchor of anchors) { assert(!anchor.includes('href=')); assert(anchor.includes('aria-disabled="true"')); }
});
