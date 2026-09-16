# GridMate website & public downloads

This repository contains the public bilingual website and, when available, verified macOS release assets. It does **not** contain the app's private development history or internal notes.

The app is a native Mac window manager with 21 layouts, up to 12 window zones, and 32 language/region options. The initial distribution target is Apple silicon, macOS 13 or later. See the website for known limitations and release availability.

## Develop the website

No dependencies, external fonts, analytics scripts, or build service are required. With Node.js installed:

```sh
npm test
npm run check
npm run dev
```

Preview at `http://127.0.0.1:8185`. Test both Chinese and English, desktop and mobile widths, keyboard navigation, reduced motion, FAQs, privacy navigation, layout controls, and download failure states. A visual demo is explicitly labeled as an illustration, not an app screenshot.

## Publish a release

The default `release.json` state is `pending` and download links remain unavailable. Do not add a download URL until the artifact has passed Developer ID signing, Apple notarization, Gatekeeper assessment, and download-to-install verification. Upload immutable versioned assets to this repository's GitHub Releases; do not reuse a URL for a different binary.

Set the exact version, file size, SHA-256, date, public URLs, and all verification flags in `release.json` only after those checks. Run the tests and checker again before publishing. The website never guesses download links or exposes a development build as a verified release.

Keep app signing keys, notarization credentials, internal notes, private source, and personal paths out of this repository. Public issues should contain only the minimum information needed to reproduce a problem.
