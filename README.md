# 窗多多 / SnapTiler website & public downloads

This repository contains the public bilingual website and, when available, verified macOS release assets. It does **not** contain the app's private development history or internal notes.

The app is a native Mac window manager with 21 layouts, up to 12 window zones, and 32 language/region options. The initial distribution target is Apple silicon, macOS 13 or later. See the website for known limitations and release availability.

## Develop the website

The published site is static. Fonts, icons, and the bundled Three.js scene are served locally with the site; no external font service, tracking scripts, or runtime build service is required. With Node.js installed:

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

## A 宽厚方切品牌统一（2026-09-20）

当前采用用户选定的 A 宽厚方切字标。网站导航、页脚、品牌页、隐私页和下载区使用透明底白蓝双窗口，不添加紫色底板；中英文分别使用 `lockup-zh-color.svg` 和 `lockup-en-color.svg`。

统一母版在 `../品牌资产/窗多多-SnapTiler-VI-1.0/`。网站副本位于 `assets/brand-cut/`，提供 22 个 SVG、网站图标尺寸、11 页 PDF 手册与完整品牌 ZIP。所有字标均为路径，不依赖字体。`assets/brand-a5/` 与旧设计目录仅作历史存档，当前界面不再引用旧组合。

独立预览端口可以指定：

```sh
PORT=8201 npm run dev
```

App 截图放在 `assets/screenshots/`，来源和版本见同目录 `manifest.json`。当前六张原始截图均来自正式安装版 0.3.4（24），2026-09-20 拍摄；切换网站语言时同步切换中文或英文界面截图。图片 URL 带版本标识，避免旧缓存。点击图片可查看未经重绘的原始大图。布局交互明确标为示意，不操作访客的真实窗口。

导航与按钮采用完整、简短的单行措辞，不使用省略号。英文小屏入口为「Downloads」「Download status」「See the app」。说明段落正常换行，避免为强制单行而缩小正文。验收宽度覆盖 320、390 和 1200 CSS 像素，另检查 1440 像素宽的布局边界。

公开下载继续由 `release.json` 的验证字段控制。准备中时，顶部入口显示「下载状态」，不显示旧候选版本号；验证齐全后才显示获取和下载按钮。官网通过 GitHub Pages 发布，正式地址为 https://snaptiler.com/；www 子域名统一跳转到主域名。

## 官网域名

- 正式入口：https://snaptiler.com/
- 中文：https://snaptiler.com/?lang=zh
- English: https://snaptiler.com/?lang=en
- `CNAME` 文件必须随网站发布，避免后续部署丢失域名绑定。
- DNS 在 Porkbun 管理；根域 ALIAS 与 www CNAME 均指向 `ai798-lab.github.io`。
- `robots.txt`、`sitemap.xml` 和页面 canonical 地址使用正式域名。

## 2026-09-20 · Stack AI 参考改版

首页采用独立 `studio.css` / `studio.js`，延续现有 `app.js` 中的双语与下载验证。`window-scene.js` 是 Three.js 源码，`window-scene.bundle.js` 是生产使用的压缩产物。修改 3D 源码后必须运行 `npm run build:scene`，再做浏览器验收。第三方素材与许可证位于 `assets/vendor/three/`、`assets/icons/`、`assets/fonts/`；插画为本项目原创生成图，WebP 位于 `assets/illustrations/`。

本机预览：`PORT=8203 npm run dev`。Hero 支持三种窗口排列、鼠标轻视差及暂停；滚出视区和后台标签页会停止渲染；系统减少动态效果启用时使用静止布局；WebGL 不可用时显示静态插画。产品区三个标签切换原始 App 截图，并跟随网站中英文选择；下方布局区支持 2 / 4 / 6 / 12 分区演示。主站与隐私、品牌页的中性视觉使用一致字体与基础颜色，品牌母版保持不变。

本版于 2026-09-20 获得正式域名发布授权，使用最后确认的蓝灰色视觉与构建 24 中英文原始截图。部署目标为 `snaptiler.com`，公开仓库仅同步 `website/` 中经过检查的官网文件。App 安装包独立管理；官网设计更新不改变 `release.json` 的发行验证状态。
