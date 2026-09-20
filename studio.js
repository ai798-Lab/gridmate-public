import { initProductPreview } from './product-preview.js?v=bc15dbc25246';
const en = () => document.documentElement.lang === 'en';
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('mobile-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.hidden = true; }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.hidden = !open; });
nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

initProductPreview();

let count = 4;
function setLayout(value) {
  count = value;
  const board = document.getElementById('layout-board');
  board.dataset.count = String(count);
  const cols = count === 2 || count === 4 ? 2 : count === 6 ? 3 : 4;
  const rows = count / cols;
  for (const [i, pane] of [...board.children].entries()) {
    const visible = i < count;
    pane.style.setProperty('--x', (i % cols) * 100 / cols);
    pane.style.setProperty('--y', Math.floor(i / cols) * 100 / rows);
    pane.style.setProperty('--w', 100 / cols);
    pane.style.setProperty('--h', 100 / rows);
    pane.style.opacity = visible ? '1' : '0';
    pane.style.transform = visible ? 'scale(1)' : 'scale(.85)';
  }
  document.getElementById('layout-status').textContent = en() ? `Previewing ${count} window zones` : `正在演示 ${count} 个窗口分区`;
}
for (const button of document.querySelectorAll('[data-layout]')) button.addEventListener('click', () => {
  for (const other of document.querySelectorAll('[data-layout]')) other.setAttribute('aria-pressed', String(other === button));
  setLayout(Number(button.dataset.layout));
});
setLayout(4);
document.addEventListener('site-language', () => { setLayout(count); document.querySelector('[data-illustration]').alt = en() ? 'An architectural sculpture of porcelain white and pale blue window frames' : '白色与浅蓝色的窗口框架构成一组轻盈的建筑模型'; });
document.querySelector('[data-illustration]').alt = en() ? 'An architectural sculpture of porcelain white and pale blue window frames' : '白色与浅蓝色的窗口框架构成一组轻盈的建筑模型';

const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}, { threshold: .06 });
if (!reduce.matches) {
  document.body.classList.add('motion-enabled');
  for (const node of document.querySelectorAll('.section-heading, .feature-item, .story-inner, .product-tabs, .product-stage, .details-heading, .detail-rows, .faq-section, .download-inner')) { node.classList.add('reveal'); revealObserver.observe(node); }
}
reduce.addEventListener('change', e => { document.body.classList.toggle('motion-enabled', !e.matches); });

// Main content and downloads never wait for the optional 3D renderer.
const sceneHost = document.getElementById('window-scene');
try {
  const { startScene } = await import('./window-scene.bundle.js?v=2a76d8a2a93d');
  await startScene(sceneHost);
} catch (error) {
  sceneHost.dataset.renderer = 'static-fallback';
  document.getElementById('motion-toggle').hidden = true;
  document.querySelector('.scene-controls').hidden = true;
  document.getElementById('hero-try').hidden = true;
  document.getElementById('scene-status').textContent = en() ? 'Static illustration' : '静态插画模式';
  console.warn('Interactive illustration unavailable; static artwork remains visible.', error.message);
}
