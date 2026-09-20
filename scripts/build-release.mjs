import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { isDownloadReady, backupDownloadURL } from '../release-status.mjs';

export function embedRelease(html, release) {
  const ready = isDownloadReady(release);
  if (release.status === 'published' && !ready) throw new Error('Published release is missing verification fields');
  const version = ready ? `v${release.version}${release.channel === 'beta' ? ' Beta' : ''}` : '';
  const filename = ready ? `SnapTiler-${release.version}-arm64.dmg` : '';
  const backup = backupDownloadURL(release);
  const markup = ready ? `
<span class="release-badge" id="release-badge">${release.channel === 'beta' ? 'Beta 测试版 · ' : ''}已通过 Apple 公证</span>
<a class="button button-light" id="download-link" data-installer-download href="${release.downloadUrl}" download="${filename}">下载 Apple silicon 版 ↓</a>
<p class="release-status" id="release-status" role="status">版本 ${version.slice(1)} · ${(release.sizeBytes / 1048576).toFixed(1)} MB · ${release.releasedAt}。已完成 Developer ID 签名与 Apple 公证。</p>
${backup ? `<a class="backup-download" data-backup-download href="${backup}" target="_blank" rel="noopener">下载未开始？试试备用下载 ↗</a>` : ''}
` : `
<span class="release-badge" id="release-badge">发行准备中</span>
<a class="button button-light" id="download-link" data-installer-download aria-disabled="true">安装包即将开放</a>
<p class="release-status" id="release-status" role="status">安装包完成验证后开放下载。</p>
`;
  html = html.replace(/<!-- release-download:start -->[\s\S]*?<!-- release-download:end -->/,
    `<!-- release-download:start -->${markup}<!-- release-download:end -->`);
  const snapshot = JSON.stringify(ready ? release : null).replace(/</g, '\\u003c');
  html = html.replace(/<!-- release-snapshot:start -->[\s\S]*?<!-- release-snapshot:end -->/,
    `<!-- release-snapshot:start -->\n<script type="application/json" id="release-snapshot">${snapshot}</script>\n<!-- release-snapshot:end -->`);
  html = html.replace(/<a\b([^>]*\bdata-installer-download\b[^>]*)>/g, (_, attrs) => {
    attrs = attrs.replace(/\s(?:href|download|aria-disabled|tabindex)="[^"]*"/g, '');
    return `<a${attrs}${ready ? ` href="${release.downloadUrl}" download="${filename}"` : ' aria-disabled="true" tabindex="-1"'}>`;
  });
  html = html.replace(/<(span|p)([^>]*\bdata-release-version\b[^>]*)>[\s\S]*?<\/\1>/g,
    (_, tag, attrs) => `<${tag}${attrs.replace(/\s+hidden\b/g, '')}${ready ? '' : ' hidden'}>${version}</${tag}>`);
  html = html.replace(/<code\b[^>]*id="checksum"[^>]*>[\s\S]*?<\/code>/,
    `<code class="checksum" id="checksum"${ready ? '' : ' hidden'}>${ready ? `SHA-256: ${release.sha256}` : ''}</code>`);
  html = html.replace(/<a\b([^>]*data-release-link[^>]*)>/g, (_, attrs) => {
    if (!ready) return `<a${attrs}>`;
    return `<a${attrs.replace(/\s+hidden\b/g, '').replace(/href="[^"]*"/, `href="${release.releaseUrl}"`)}>`;
  });
  return html;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = new URL('../', import.meta.url);
  const release = JSON.parse(await readFile(new URL('latest.json', root), 'utf8'));
  if (isDownloadReady(release)) {
    const bytes = await readFile(new URL(`downloads/SnapTiler-${release.version}-arm64.dmg`, root));
    if (bytes.length !== release.sizeBytes || createHash('sha256').update(bytes).digest('hex') !== release.sha256) {
      throw new Error('Installer does not match the release manifest');
    }
  }
  const entry = new URL('index.html', root);
  await writeFile(entry, embedRelease(await readFile(entry, 'utf8'), release));
  console.log('Embedded verified download links and release metadata in HTML.');
}
