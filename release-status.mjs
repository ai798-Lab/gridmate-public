export const PUBLIC_WEBSITE = 'https://snaptiler.com';

export function isPublicLink(value, kind) {
  if (typeof value !== 'string') return false;
  if (kind === 'issues') return value === `${PUBLIC_WEBSITE}/support.html`;
  if (kind === 'releases') return value === `${PUBLIC_WEBSITE}/releases/` || /^https:\/\/snaptiler\.com\/releases\/\d+\.\d+\.\d+\.html$/.test(value);
  return false;
}

export function isDownloadReady(release) {
  if (!release || release.schemaVersion !== 1 || release.status !== 'published') return false;
  if (typeof release.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(release.version)) return false;
  return release.appleNotarized === true && release.gatekeeperAccepted === true &&
    release.downloadedArtifactTested === true && release.architecture === 'arm64' &&
    release.minimumMacOS === '13.0' && typeof release.sha256 === 'string' && /^[a-f0-9]{64}$/.test(release.sha256) &&
    Number.isSafeInteger(release.sizeBytes) && release.sizeBytes > 0 &&
    typeof release.releasedAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(release.releasedAt) &&
    !Number.isNaN(Date.parse(release.releasedAt)) && new Date(release.releasedAt).toISOString().slice(0,10) === release.releasedAt &&
    release.releaseUrl === `${PUBLIC_WEBSITE}/releases/${release.version}.html` &&
    release.downloadUrl === `${PUBLIC_WEBSITE}/downloads/SnapTiler-${release.version}-arm64.dmg`;
}

export function websiteDownloadURL(release) {
  return isDownloadReady(release) ? release.downloadUrl : null;
}

export function backupDownloadURL(release) {
  if (!isDownloadReady(release)) return null;
  const expected = `https://github.com/ai798-Lab/gridmate-public/releases/download/v${release.version}/SnapTiler-${release.version}-arm64.dmg`;
  return release.backupDownloadUrl === expected ? expected : null;
}

// An unavailable update request must not erase a verified release embedded at
// publication. An explicit withdrawal still disables every download entry.
export function resolveRelease(snapshot, response) {
  if (response?.schemaVersion === 1 && response.status === 'pending') return null;
  if (isDownloadReady(response)) return response;
  return isDownloadReady(snapshot) ? snapshot : null;
}
