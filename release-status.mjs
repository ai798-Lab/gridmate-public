export const PUBLIC_REPOSITORY = 'https://github.com/ai798-Lab/gridmate-public';

export function isPublicLink(value, kind) {
  if (typeof value !== 'string') return false;
  const base = `${PUBLIC_REPOSITORY}/${kind}`;
  try {
    const url = new URL(value);
    return url.origin === 'https://github.com' && !url.username && !url.password &&
      !url.search && !url.hash && (value === base || value.startsWith(`${base}/`));
  } catch { return false; }
}

// Fail closed: never expose a local/self-signed/unverified binary as a public release.
export function isDownloadReady(release) {
  if (!release || release.schemaVersion !== 1 || release.status !== 'published') return false;
  if (typeof release.version !== 'string' || !/^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/.test(release.version)) return false;
  const tag = `v${release.version}`;
  return release.appleNotarized === true && release.gatekeeperAccepted === true &&
    release.downloadedArtifactTested === true && release.architecture === 'arm64' &&
    release.minimumMacOS === '13.0' && typeof release.sha256 === 'string' && /^[a-f0-9]{64}$/.test(release.sha256) &&
    Number.isSafeInteger(release.sizeBytes) && release.sizeBytes > 0 &&
    typeof release.releasedAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(release.releasedAt) &&
    !Number.isNaN(Date.parse(release.releasedAt)) && new Date(release.releasedAt).toISOString().slice(0,10) === release.releasedAt &&
    release.releaseUrl === `${PUBLIC_REPOSITORY}/releases/tag/${tag}` &&
    release.downloadUrl === `${PUBLIC_REPOSITORY}/releases/download/${tag}/GridMate-${release.version}-arm64.dmg`;
}
