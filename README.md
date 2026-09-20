# 窗多多 / SnapTiler website & public downloads

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

## A5 官网迭代（2026-09-20）

首页以真实布局库为主要展示，另有通用设置和窗口间距的实机截图。中文与英文入口分别使用 A5 的 `lockup-zh-app-color.svg` 和 `lockup-en-app-color.svg`，整组等比显示；品牌资源页展示无紫底的双语、中文、英文组合与紫底配套版。

当前字标母版为 `../design/refinements/2026-09-20-wordmark-A-v3/` 中用户确认的 A5 双点版；目录名保留历史版本，不代表字标仍为 A3。网站副本位于 `assets/brand-a5/`，22 个 SVG 和品牌下载包与母版逐一核对一致。字标均为轮廓路径，界面正文继续使用系统字体。`assets/brand/` 保留 App icon 和历史资源，首页字标不再引用旧组合。

独立预览端口可以指定：

```sh
PORT=8201 npm run dev
```

App 截图放在 `assets/screenshots/`，来源和版本见同目录 `manifest.json`。点击图片可查看未经重绘的原始大图。布局交互明确标为示意，不操作访客的真实窗口。

导航与按钮采用完整、简短的单行措辞，不使用省略号。英文小屏入口为「Downloads」「Download status」「See the app」。说明段落正常换行，避免为强制单行而缩小正文。验收宽度覆盖 320、390 和 1200 CSS 像素，另检查 1440 像素宽的布局边界。

公开下载继续由 `release.json` 的验证字段控制。准备中时，顶部入口显示「下载状态」，不显示旧候选版本号；验证齐全后才显示获取和下载按钮。官网通过 GitHub Pages 发布，正式地址为 https://snaptiler.com/；www 子域名统一跳转到主域名。

## 官网域名

- 正式入口：https://snaptiler.com/
- 中文：https://snaptiler.com/?lang=zh
- English: https://snaptiler.com/?lang=en
- `CNAME` 文件必须随网站发布，避免后续部署丢失域名绑定。
- DNS 在 Porkbun 管理；根域 ALIAS 与 www CNAME 均指向 `ai798-lab.github.io`。
- `robots.txt`、`sitemap.xml` 和页面 canonical 地址使用正式域名。
