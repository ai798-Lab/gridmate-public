# 窗多多 / SnapTiler website & public downloads

This repository contains the public bilingual website and verified macOS release assets. It does **not** contain the app's private development history or internal notes.

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

The current release is **0.3.5, build 25**, published on 2026-09-20. The notarized Apple silicon DMG is served at `https://snaptiler.com/downloads/SnapTiler-0.3.5-arm64.dmg` with an identical immutable GitHub Release asset. Its SHA-256 and byte size are recorded in `latest.json`. Future unverified candidates must use the `pending` state, which disables download links. Do not add a download URL until the artifact has passed Developer ID signing, Apple notarization, Gatekeeper assessment, and download-to-install verification. Upload immutable versioned assets to this repository's GitHub Releases; do not reuse a URL for a different binary.

Set the exact version, file size, SHA-256, date, public URLs, and all verification flags in `latest.json` only after those checks. Run the tests and checker again before publishing. The website never guesses download links or exposes a development build as a verified release.

Keep app signing keys, notarization credentials, internal notes, private source, and personal paths out of this repository. Public issues should contain only the minimum information needed to reproduce a problem.

## A 宽厚方切品牌统一（2026-09-20）

当前采用用户选定的 A 宽厚方切字标。网站导航、页脚、品牌页、隐私页和下载区使用透明底白蓝双窗口，不添加紫色底板；中英文分别使用 `lockup-zh-color.svg` 和 `lockup-en-color.svg`。

统一母版在 `../品牌资产/窗多多-SnapTiler-VI-1.0/`。网站副本位于 `assets/brand-cut/`，提供 22 个 SVG、网站图标尺寸、11 页 PDF 手册与完整品牌 ZIP。所有字标均为路径，不依赖字体。`assets/brand-a5/` 与旧设计目录仅作历史存档，当前界面不再引用旧组合。

独立预览端口可以指定：

```sh
PORT=8201 npm run dev
```

产品区使用 `product-preview.js` / `product-preview.css` 重绘 v0.3.4 的布局库、通用设置、窗口与布局界面。文字、线条和控件随显示分辨率清晰渲染；支持布局选择、开关、间距与边距滑块，并同步中英文。界面明确标为交互示意，不操作访客的真实窗口。旧截图仅在 `assets/screenshots/` 保留来源存档，首页不再显示它们。

导航与按钮采用完整、简短的单行措辞，不使用省略号。英文小屏入口为「Downloads」「Download status」「See the app」。说明段落正常换行，避免为强制单行而缩小正文。验收宽度覆盖 320、390 和 1200 CSS 像素，另检查 1440 像素宽的布局边界。

公开下载继续由 `latest.json` 的验证字段控制。准备中时，顶部入口显示「下载状态」，不显示旧候选版本号；验证齐全后才显示获取和下载按钮。官网通过 GitHub Pages 发布，正式地址为 https://snaptiler.com/；www 子域名统一跳转到主域名。

## 官网域名

- 正式入口：https://snaptiler.com/
- 中文：https://snaptiler.com/?lang=zh
- English: https://snaptiler.com/?lang=en
- `CNAME` 文件必须随网站发布，避免后续部署丢失域名绑定。
- DNS 在 Porkbun 管理；根域 ALIAS 与 www CNAME 均指向 `ai798-lab.github.io`。
- `robots.txt`、`sitemap.xml` 和页面 canonical 地址使用正式域名。

## 2026-09-20 · Stack AI 参考改版

首页采用独立 `studio.css` / `studio.js`，延续现有 `app.js` 中的双语与下载验证。`window-scene.js` 是 Three.js 源码，`window-scene.bundle.js` 是生产使用的压缩产物。修改 3D 源码后必须运行 `npm run build:scene`，再做浏览器验收。第三方素材与许可证位于 `assets/vendor/three/`、`assets/icons/`、`assets/fonts/`；插画为本项目原创生成图，WebP 位于 `assets/illustrations/`。

本机预览：`PORT=8203 npm run dev`。Hero 支持三种窗口排列、鼠标轻视差及暂停；滚出视区和后台标签页会停止渲染；系统减少动态效果启用时使用静止布局；WebGL 不可用时显示静态插画。产品区三个标签切换重绘的交互原型，并跟随网站中英文选择；下方布局区支持 2 / 4 / 6 / 12 分区演示。主站与隐私、品牌页的中性视觉使用一致字体与基础颜色，品牌母版保持不变。

本版于 2026-09-20 获得正式域名与安装包上线授权，使用蓝灰色视觉、清晰的界面重绘，以及避免窗口交叠的 Hero 动画。部署目标为 `snaptiler.com`，公开仓库仅同步 `website/` 中经过检查的官网文件。0.3.4（24）已通过 Developer ID 签名、App 与 DMG 的 Apple 公证、Gatekeeper 检查、公开下载校验、正式安装和独立测试窗口移动/撤销验证。当前发行面向 Apple silicon；其他硬件和每个最低系统版本未逐台覆盖。官网首页和下载区均显示版本与构建号，下载区提供日期、大小、安装步骤及校验值。

## 0.3.5 naming update

The active installer is `SnapTiler-0.3.5-arm64.dmg`, containing `SnapTiler.app`. Its executable, resource bundle, and application identifier use the new brand. The package audit scans every filename and file byte (including UTF-16) for the retired name before release. Because the app identity changed, users grant Accessibility access again. The new app and website use the branded `latest.json` feed. The older `release.json` and versioned asset remain immutable compatibility archives for already-installed versions. Do not silently replace an immutable old asset.


## 官网动效维护

动效依赖固定为 Lenis 1.3.26、GSAP 3.15.0（ScrollTrigger 和 Flip），随官网一起打包，不依赖访客访问第三方 CDN。

- `npm ci` 安装锁定依赖，`npm run build` 重建滚动、3D 资源并刷新资源缓存版本。
- `npm test` 与 `npm run check` 检查窗口几何、发行信息、下载文件校验值和公开文件。
- 桌面精确指针且视口足够大时使用 Lenis；窄屏、触摸及减少动态效果模式保留原生滚动。
- ScrollTrigger 只在初始化、窗口变化和内容高度变化时测量位置；滚动期间使用直接 transform，不重新测量全部区块。
- GSAP Flip 在点击时测量布局，以 transform 完成过渡，避免逐帧改变宽高。3D 与滚动共用时钟，离屏或画面稳定后停止申请渲染。
- 上线前在实际浏览器检查连续滚动、导航定位、快速切换布局、原型交互、320px 窄屏、中英文和减少动态效果；测试通过不等于浏览器体验已验收。
