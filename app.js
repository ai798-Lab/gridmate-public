import { isDownloadReady, isPublicLink, websiteDownloadURL, backupDownloadURL, resolveRelease } from './release-status.mjs?v=8bd83fdbcae0';

const english = {
  'nav.product':'The app', 'product.label':'LAYOUT LIBRARY', 'product.version':'v0.3.7 Beta · Interface illustration', 'product.preparing':'Capturing the new app interface', 'product.caption':'Choose a layout. See the result before you arrange.', 'product.how':'See how it works', 'product.provenance':'Redrawn SnapTiler v0.3.7 Beta interface · Interactive preview', 'workflow.title':'Fits your Mac. Fits your day.', 'workflow.intro':'A familiar Mac interface.<br>A little more room to focus.', 'workflow.settingsTitle':'Make yourself at home.', 'workflow.settingsBody':'Language, spacing, shortcuts, and excluded apps. Clear settings that make the everyday feel effortless.', 'workflow.layoutTitle':'Leave a little breathing room.', 'workflow.layoutBody':'Adjust gaps and screen margins. Arrange the whole screen or just one window, and find your own rhythm.',
  'brand.name':'SnapTiler', 'footer.brand':'Brand assets', 'brand.copyright':'© 2026 SnapTiler · ai798-Lab',
  'skip':'Skip to content', 'nav':'Main navigation', 'nav.features':'Features', 'nav.layouts':'Layouts', 'nav.languages':'Languages', 'nav.faq':'FAQ', 'nav.download':'Downloads ↗',
  'hero.eyebrow':'A NATIVE MAC WINDOW MANAGER', 'hero.line1':'Space to work.', 'hero.line2':'Room to think.',
  'hero.description':'Your research, notes, and browser. Side by side. Find a layout that fits the way you work, and keep your attention where it belongs.',
  'hero.cta':'Get it for Mac', 'hero.demo':'See the app', 'hero.native':'Native menu bar app',
  'demo.note':'One desktop. More possibilities.', 'demo.aria':'Interactive illustration of window layouts', 'demo.controls':'Demo layout', 'demo.try':'Try a layout', 'demo.caption':'Interactive illustration, not an app screenshot · Your windows stay untouched',
  'facts.aria':'At a glance', 'facts.layouts':'built-in layouts', 'facts.zones':'window zones', 'facts.languages':'language & region options', 'facts.native':'Made for Mac<br>At home in your menu bar',
  'features.eyebrow':'LESS ARRANGING. MORE DOING.', 'features.title':'Find your flow. Keep it.', 'features.intro':'From one window to your whole workspace.<br>Make room for the way you work.',
  'feature1.title':'One click. A clearer desktop.', 'feature1.body':'Choose a layout from the menu bar to arrange visible windows on the target display. Keep your other screens as they are.',
  'feature2.title':'Point, click, or take a shortcut.', 'feature2.body':'Open the layout library with a shortcut. Choose a layout and zone, then apply it to your frontmost window. Or drag a window to an edge to snap it into place.',
  'feature3.title':'Try a layout. Take it back.', 'feature3.body':'Undo the last arrangement to restore window positions and sizes. Exclude apps you want to leave alone. You stay in control.',
  'layouts.eyebrow':'A PLACE FOR EVERY WINDOW', 'layouts.title':'Big ideas.<br>No overlap needed.', 'layouts.body':'Compare two documents, spread out across four tiles, or turn a big screen into a 12-zone workspace. There’s room to work in 21 built-in layouts.', 'layouts.note':'A large or ultrawide display is recommended for 9 or 12 zones. Some apps enforce minimum window sizes and may not fit smaller zones.',
  'layout.halves':'Side by side', 'layout.quad':'Four corners', 'layout.focus':'One main, two beside', 'layout.six':'Six-window workspace', 'layout.nine':'Nine-grid', 'layout.twelve':'Twelve zones',
  'languages.eyebrow':'SPEAK YOUR LANGUAGE', 'languages.title':'Feel right at home.', 'languages.body':'Follow your system language, or switch instantly in settings.<br>Right-to-left reading is supported without mirroring physical window positions.', 'languages.list':'Languages supported in the app', 'languages.note':'The 32 options include regional variants. Localization is continually improving; feedback on wording is welcome. This website is available in Chinese and English.',
  'setup.eyebrow':'A CALMER DESKTOP, IN THREE STEPS', 'setup.title':'Meet your new workspace.',
  'setup1.title':'Download and install', 'setup1.body':'Once the verified installer is available, open the DMG, drag SnapTiler.app into Applications, and launch it from there.',
  'setup2.title':'Allow Accessibility access', 'setup2.body':'Go to System Settings → Privacy & Security → Accessibility and allow SnapTiler to adjust other apps’ windows.',
  'setup3.title':'Choose your layout', 'setup3.body':'Click the SnapTiler icon in the menu bar and choose a layout. Or press Control + Option + Command + G to open the layout library, choose a zone, then click Apply Layout.',
  'faq.title':'A few things to know.',
  'faq1.q':'Which Macs are supported?', 'faq1.a':'The first release targets Apple silicon Macs (M-series chips) running macOS 13 or later. A verified Intel installer is not available. Independent-device validation on the minimum supported macOS version is still being completed.',
  'faq2.q':'Why does it need Accessibility access?', 'faq2.a':'SnapTiler uses macOS Accessibility APIs to read window positions and sizes and adjust them when you use the app. This is not Screen Recording permission and does not require disabling System Integrity Protection (SIP). You can revoke access in System Settings at any time.',
  'faq3.q':'Does it upload my windows or work?', 'faq3.a':'The current app has no accounts, advertising SDKs, or analytics reporting, and contains no code that uploads window information to a server. Preferences stay on your Mac. If you choose to report an issue, remove private information from screenshots and logs first. Website hosting logs are covered separately in the privacy notice.',
  'faq4.q':'What about other displays and Spaces?', 'faq4.a':'Batch arrangement targets visible windows on the selected display; moving windows between Spaces is not a supported feature. Third-party apps, custom title bars, and display configurations can affect compatibility. The app reports limitations. Start with windows that contain no unsaved work.',
  'faq5.q':'Will it be on the App Store? How do updates work?', 'faq5.a':'We’re focusing on direct downloads from this website. Mac App Store sandbox requirements conflict with cross-app window control, so no App Store launch date is promised. The current version offers manual checks and optional daily reminders while the app is running; downloading and installing remain your choice. Download availability is shown below.',
  'faq6.q':'Where can I get help?', 'faq6.a':'Use the public support page to share your macOS version, chip, affected app, and steps to reproduce the problem. Never include passwords, private files, or sensitive window contents.', 'faq6.link':'See support options ↗',
  'download.eyebrow':'MAKE SPACE FOR WHAT MATTERS', 'download.title':'A little order. A lot more focus.', 'download.description':'Your next workspace is already on your desk.', 'download.pending':'RELEASE IN PREPARATION', 'download.pendingCta':'Installer coming soon', 'download.pendingNote':'Downloads open after Apple notarization and download-to-install verification. No public installer is available yet.', 'download.notes':'Read release notes ↗',
  'footer.tagline':'A little order. A lot more focus.', 'footer.nav':'Footer', 'footer.privacy':'Privacy', 'footer.support':'Help & feedback', 'footer.releases':'Release notes',
  'privacy.back':'← Back to SnapTiler', 'privacy.eyebrow':'TRANSPARENT BY DESIGN', 'privacy.title':'Privacy, in plain language.', 'privacy.date':'Last updated: September 20, 2026 · Applies to SnapTiler 0.3.4',
  'privacy.intro':'SnapTiler arranges windows on your Mac. The app’s local behavior and the website’s hosting services are different; here is what each does.',
  'privacy.app.title':'1. What the app accesses', 'privacy.app.body':'With Accessibility permission, SnapTiler reads app and window metadata such as the owning process, window position, size, state, and controls, then changes positions and sizes to arrange windows. Diagnostic commands can also read window titles. It does not capture screenshots or read document text to perform window arrangements.',
  'privacy.local.title':'2. What stays on your Mac', 'privacy.local.body':'Layout preferences, gaps, margins, excluded apps, and related settings are stored in the local Application Support/SnapTiler folder. The language choice is stored in app preferences. Undo information is held in memory for the running session. The current app has no account system, advertising SDK, or code that uploads this information.',
  'privacy.logs.title':'3. Diagnostics and feedback', 'privacy.logs.body':'Release builds disable the file-based mouse interaction debug log. macOS may retain operational logs, such as launch, arrangement counts, and errors. Development builds and manually run diagnostics can produce more detailed output. Feedback is voluntary; please remove window titles, personal file names, and private information before sharing screenshots or logs. Public GitHub issues are visible to everyone.',
  'privacy.website.title':'4. This website and downloads', 'privacy.website.body':'This website does not use analytics scripts, advertising trackers, or external font services. Fonts, icons, and illustrations are served with this website. It uses a local browser preference to remember your website language; blocking storage does not prevent access. When hosted on GitHub Pages, GitHub records visitors’ IP addresses for security. GitHub also serves downloads and feedback pages under its own privacy statement.', 'privacy.github':'Read GitHub’s privacy statement ↗',
  'privacy.control.title':'5. Your choices', 'privacy.control.body':'You can revoke SnapTiler’s Accessibility permission in System Settings and turn off launch at login. Automatic update checks can also be turned off in About. Removing the app does not necessarily remove local settings. To remove preferences, quit the app first, then remove only SnapTiler’s configuration and preferences. Clearing this website’s browser storage resets the website language preference.',
  'privacy.updates.title':'6. Update checks', 'privacy.updates.body':'The current version offers daily checks, enabled by default and optional, while the app is running. It reads a public version manifest on GitHub Pages without sending window data, logs, device identifiers or account information. Checks use an ephemeral session without persistent cookies; GitHub still receives normal connection information such as IP addresses. Check times, reminders and skipped versions stay on your Mac. You initiate downloads and installation. Older installed versions do not gain this feature automatically.',
  'privacy.contact.title':'7. Questions and updates', 'privacy.contact.body':'Use SnapTiler’s public support entry for general questions, without posting personal information. You can also search for the WeChat official account ai798Lab and leave a message; information you send is subject to WeChat’s privacy rules. This notice describes the current version; if accounts, payments, or analytics are introduced, the notice and relevant choices must be updated before those features are launched.', 'privacy.support':'SnapTiler support ↗'
};

Object.assign(english, {
 'studio.get':'Downloads', 'studio.menu':'Open navigation',
 'studio.eyebrow':'MADE FOR MAC. ROOM FOR THOUGHT.',
 'studio.line1':'Windows in place.', 'studio.line2':'Ideas in motion.',
 'studio.description':'Less switching. More seeing.<br>Bring your windows together, and give your ideas room to unfold.',
 'studio.try':'See it come together', 'studio.exhibit':'A little order, a clearer desktop',
 'studio.scene':'Interactive three-dimensional illustration of window arrangements',
 'studio.controls':'Choose an illustrated layout', 'studio.float':'Unfold', 'studio.focus':'Focus', 'studio.grid':'Four-up',
 'studio.pause':'Pause animation', 'studio.caption':'Interactive concept · Your real windows stay untouched',
 'studio.native':'Native to Mac<br>At home in your menu bar',
 'studio.featuresTitle':'Less to arrange.<br>More to get into.',
 'studio.featuresIntro':'Research, code, and notes. All in sight.<br>Keep your attention on the work, and let everything else fall into place.',
 'studio.feature2':'A familiar kind of effortless.', 'studio.feature2body':'Call up your layouts with a shortcut, or drag a window to the edge. A natural rhythm, with mouse or keyboard.',
 'studio.storyTitle':'Room to think.<br>Built right in.', 'studio.storyBody':'Your screen doesn’t need more things.<br>Just the right things, in the right places.<br>A little breathing room changes everything.', 'studio.storyLink':'Find your working arrangement',
 'studio.productTitle':'Feels like your Mac.<br>Works like you do.', 'studio.productIntro':'Choose a layout. Preview the arrangement.<br>Set the spacing and exclusions to make it yours.', 'studio.productTabs':'Explore the app interface',
 'studio.tab1':'Layout library', 'studio.tab2':'General', 'studio.tab3':'Spacing', 'studio.provenance':'Redrawn from v0.3.7 Beta · Try the layouts, switches, and sliders',
 'studio.layoutTitle':'Different work.<br>Different ways to make room.', 'studio.layoutIntro':'Compare side by side, write across windows,<br>or spread out on a larger screen. Try a layout below.',
 'studio.six':'Six-up', 'studio.twelve':'Twelve zones', 'studio.layoutStatus':'Previewing 4 window zones',
 'studio.layoutNote':'Interactive illustration, not an app screenshot. A large screen is recommended for 9 or 12 zones. App minimum window sizes may limit arrangements.',
 'studio.detailsTitle':'A small app.<br>A thoughtful set of details.',
 'studio.languagesTitle':'In words that feel like home.', 'studio.languagesBody':'32 language and region options. Follow your system, or switch in settings.', 'studio.allLanguages':'Explore all languages',
 'studio.privacyTitle':'Your desktop stays on your Mac.', 'studio.privacyBody':'No account, ads, or analytics in the app. Preferences and window arrangement stay local.',
 'studio.displayTitle':'One screen, considered.', 'studio.displayBody':'Arrange visible windows on your target display. Leave the rhythm of your other screens intact.',
 'studio.productPreview':'Interactive product interface illustration', 'download.install':'Open the DMG → drag to Applications → launch SnapTiler.<br>On first use, follow the guide to allow Accessibility access.', 'download.checksum':'Installer checksum',
 'studio.support':'Tell us what’s on your mind', 'studio.downloadTitle':'A clearer desktop.<br>A little more headspace.', 'studio.downloadDescription':'SnapTiler. Make room for your next good idea.'
});

const chinese = new Map();
for (const node of document.querySelectorAll('[data-i18n]')) chinese.set(node.dataset.i18n, node.innerHTML);
const chineseLabels = new Map();
for (const node of document.querySelectorAll('[data-i18n-aria]')) chineseLabels.set(node.dataset.i18nAria, node.getAttribute('aria-label'));
let snapshot = null;
try { snapshot = JSON.parse(document.getElementById('release-snapshot')?.textContent || 'null'); } catch { /* Static links remain usable. */ }
let release = resolveRelease(snapshot, null);
let language = 'zh';

function initialLanguage() {
  const query = new URL(location.href).searchParams.get('lang');
  if (query === 'en' || query === 'zh') return query;
  try { const saved = localStorage.getItem('snaptiler.site.language'); if (saved === 'en' || saved === 'zh') return saved; } catch { /* Storage can be blocked. */ }
  return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

function renderRelease() {
  for (const node of document.querySelectorAll('[data-release-version]')) {
    node.hidden = !isDownloadReady(release);
    node.textContent = isDownloadReady(release) ? `v${release.version}${release.channel === 'beta' ? ' Beta' : ''}` : '';
  }
  for (const node of document.querySelectorAll('[data-support-link]')) {
    if (isPublicLink(release?.supportUrl, 'issues')) node.href = release.supportUrl;
  }
  for (const node of document.querySelectorAll('[data-release-link]')) {
    if (isPublicLink(release?.releaseUrl, 'releases')) node.href = release.releaseUrl;
  }
  const ready = isDownloadReady(release);
  for (const anchor of document.querySelectorAll('[data-installer-download]')) {
    if (ready) {
      anchor.href = websiteDownloadURL(release);
      anchor.setAttribute('download', `SnapTiler-${release.version}-arm64.dmg`);
      anchor.removeAttribute('aria-disabled');
      anchor.removeAttribute('tabindex');
    } else {
      anchor.removeAttribute('href');
      anchor.removeAttribute('download');
      anchor.setAttribute('aria-disabled', 'true');
      anchor.setAttribute('tabindex', '-1');
    }
  }
  for (const anchor of document.querySelectorAll('[data-backup-download]')) {
    const url = backupDownloadURL(release);
    anchor.hidden = !url;
    if (url) anchor.href = url;
    else anchor.removeAttribute('href');
    anchor.textContent = language === 'en' ? 'Download not starting? Try the backup ↗' : '下载未开始？试试备用下载 ↗';
  }
  if (!ready) {
    const link = document.getElementById('download-link');
    if (link) {
      link.textContent = language === 'en' ? 'Installer coming soon' : '安装包即将开放';
      document.getElementById('release-badge').textContent = language === 'en' ? 'RELEASE IN PREPARATION' : '发行准备中';
      document.getElementById('release-status').textContent = language === 'en' ? 'Downloads open after installer verification.' : '安装包完成验证后开放下载。';
      document.getElementById('checksum').hidden = true;
    }
    return;
  }
  for (const node of document.querySelectorAll('[data-download-cta]')) node.textContent = language === 'en' ? 'Get it for Mac' : '获取 Mac 版';
  const link = document.getElementById('download-link');
  if (!link) return;
  link.href = websiteDownloadURL(release);
  link.setAttribute('download', `SnapTiler-${release.version}-arm64.dmg`);
  link.removeAttribute('aria-disabled');
  link.textContent = language === 'en' ? 'Download for Mac ↓' : '下载 Apple silicon 版 ↓';
  document.getElementById('release-badge').textContent = release.channel === 'beta' ? (language === 'en' ? 'BETA · APPLE NOTARIZED' : 'Beta 测试版 · 已通过 Apple 公证') : (language === 'en' ? 'APPLE NOTARIZED' : '已通过 Apple 公证');
  document.getElementById('release-status').textContent = language === 'en' ? `Version ${release.version}${release.channel === 'beta' ? ' Beta' : ''} · ${(release.sizeBytes / 1048576).toFixed(1)} MB · ${release.releasedAt}. Developer ID signed and notarized by Apple.` : `版本 ${release.version}${release.channel === 'beta' ? ' Beta' : ''} · ${(release.sizeBytes / 1048576).toFixed(1)} MB · ${release.releasedAt}。已完成 Developer ID 签名与 Apple 公证。`;
  document.querySelector('.download-action [data-release-link]').hidden = false;
  const checksum = document.getElementById('checksum');
  if (checksum) { checksum.hidden = false; checksum.textContent = `SHA-256: ${release.sha256}`; }
}

function setLanguage(value, persist = false) {
  language = value;
  document.documentElement.lang = value === 'en' ? 'en' : 'zh-CN';
  for (const node of document.querySelectorAll('[data-i18n]')) {
    // The only HTML comes from the fixed, reviewed translation table above.
    node.innerHTML = value === 'en' ? (english[node.dataset.i18n] ?? chinese.get(node.dataset.i18n)) : chinese.get(node.dataset.i18n);
  }
  for (const node of document.querySelectorAll('[data-i18n-aria]')) node.setAttribute('aria-label', value === 'en' ? english[node.dataset.i18nAria] : chineseLabels.get(node.dataset.i18nAria));
  const control = document.getElementById('language-switch');
  control.textContent = value === 'en' ? '中文' : 'EN';
  control.lang = value === 'en' ? 'zh-CN' : 'en';
  control.setAttribute('aria-label', value === 'en' ? '将网站切换为中文' : 'Switch website to English');
  for (const mark of document.querySelectorAll('[data-brand-lockup]')) {
    mark.src = `./assets/brand-cut/lockup-${value === 'en' ? 'en' : 'zh'}-color.svg`;
    mark.alt = value === 'en' ? 'SnapTiler' : '窗多多';
  }
  for (const shot of document.querySelectorAll('[data-shot-zh]')) {
    shot.src = value === 'en' && shot.dataset.shotEn ? shot.dataset.shotEn : shot.dataset.shotZh;
    shot.alt = value === 'en' ? shot.dataset.altEn : shot.dataset.altZh;
    const link = shot.closest('a');
    if (link) {
      link.href = shot.src;
      link.setAttribute('aria-label', `${shot.alt} · ${value === 'en' ? 'Open full-size image' : '查看原始大图'}`);
    }
  }
  const isPrivacy = document.body.dataset.page === 'privacy';
  const canonicalURL = `https://snaptiler.com/${isPrivacy ? 'privacy.html' : ''}?lang=${value}`;
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = canonicalURL;
  const ogURL = document.querySelector('meta[property="og:url"]');
  if (ogURL) ogURL.content = canonicalURL;
  document.title = isPrivacy ? (value === 'en' ? 'Privacy · SnapTiler' : '隐私说明 · 窗多多') : (value === 'en' ? 'SnapTiler · Space to work. Room to think.' : '窗多多 · 多窗口，各就各位');
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = isPrivacy ? (value === 'en' ? 'How SnapTiler handles window data, local preferences, diagnostics, and website hosting.' : '了解窗多多的窗口数据、本地偏好、诊断和官网托管服务。') : (value === 'en' ? 'A native Mac window manager. 21 layouts, up to 12 zones, and 32 language and region options. Make space for what matters.' : '窗多多，原生 Mac 多窗口整理工具。21 种布局、最多 12 分区、32 个语言与地区版本。让窗口各就各位，把注意力留给工作。');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = document.title;
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription && description) ogDescription.content = description.content;
  for (const node of document.querySelectorAll('[data-keep-language]')) {
    const url = new URL(node.href); url.searchParams.set('lang', value); node.href = url.href;
  }
  const demoStatus = document.getElementById('demo-status');
  if (demoStatus?.textContent) {
    const count = document.getElementById('demo-canvas').dataset.layout;
    demoStatus.textContent = value === 'en' ? `Preview: ${count} window zones.` : `正在演示 ${count} 个窗口分区。`;
  }
  if (persist) {
    try { localStorage.setItem('snaptiler.site.language', value); } catch { /* Optional preference. */ }
    const url = new URL(location.href); url.searchParams.set('lang', value); history.replaceState(null, '', url);
  }
  renderRelease();
  document.dispatchEvent(new CustomEvent('site-language', { detail: value }));
}

document.getElementById('language-switch').addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en', true));
const canvas = document.getElementById('demo-canvas');
if (canvas) {
  canvas.setAttribute('aria-hidden', 'true');
  for (const button of document.querySelectorAll('[data-demo-layout]')) button.addEventListener('click', () => {
    const count = Number(button.dataset.demoLayout);
    if (![4, 6, 9, 12].includes(count)) return;
    const columns = count === 4 ? 2 : count === 12 ? 4 : 3;
    for (const [i, window] of [...canvas.children].entries()) {
      window.style.setProperty('--col', i % columns);
      window.style.setProperty('--row', Math.floor(i / columns));
    }
    canvas.dataset.layout = String(count);
    for (const other of document.querySelectorAll('[data-demo-layout]')) other.setAttribute('aria-pressed', String(other === button));
    document.getElementById('demo-status').textContent = language === 'en' ? `Preview: ${count} window zones.` : `正在演示 ${count} 个窗口分区。`;
  });
}

setLanguage(initialLanguage());
// Progressive enhancement: content remains visible without JS or with reduced motion.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: .08 });
  for (const section of document.querySelectorAll('.section-heading, .feature-card, .layout-inner, .language-heading, .setup-steps, .download-card')) {
    section.classList.add('will-reveal');
    observer.observe(section);
  }
}
let feedbackTimer;
document.addEventListener('click', event => {
  const anchor = event.target.closest('a[data-installer-download], a[data-backup-download]');
  if (!anchor || anchor.getAttribute('aria-disabled') === 'true' || !anchor.hasAttribute('href')) return;
  // Do not prevent default: the browser's native file download handles the link.
  const feedback = document.getElementById('download-feedback');
  if (!feedback) return;
  feedback.textContent = language === 'en' ? 'Download requested. Check your browser’s downloads.' : '已发起下载，请查看浏览器的下载列表。';
  const backup = backupDownloadURL(release);
  if (backup) {
    const alternative = document.createElement('a');
    alternative.href = backup; alternative.target = '_blank'; alternative.rel = 'noopener';
    alternative.textContent = language === 'en' ? 'Try backup' : '备用下载';
    feedback.append(' ', alternative);
  }
  feedback.hidden = false;
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => { feedback.hidden = true; }, 10000);
});

// Version refresh enhances the already verified static page. Network failure
// cannot turn a published download back into a disabled placeholder.
try {
  const response = await fetch('./latest.json', { cache: 'no-store', signal: AbortSignal.timeout(5000) });
  if (response.ok) { release = resolveRelease(snapshot, await response.json()); renderRelease(); }
} catch { /* Keep the verified snapshot and its native download links. */ }
