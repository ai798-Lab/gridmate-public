import { initProductPreview } from './product-preview.js?v=bcf880c0f601';
import { initScrollDepth, changeLayout, sceneClock, scrollToScene } from './scroll-depth.bundle.js?v=04d2cd199721';
const en = () => document.documentElement.lang === 'en';
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('mobile-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.hidden = true; }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.hidden = !open; });
nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

initProductPreview();
initScrollDepth();

let count = 4;
function setLayout(value, animate = true) {
  count = value;
  const board = document.getElementById('layout-board');
  board.dataset.count = String(count);
  const cols = count === 2 || count === 4 ? 2 : count === 6 ? 3 : 4;
  const rows = count / cols;
  changeLayout(board, () => {
  for (const [i, pane] of [...board.children].entries()) {
    const visible = i < count;
    pane.style.setProperty('--x', (i % cols) * 100 / cols);
    pane.style.setProperty('--y', Math.floor(i / cols) * 100 / rows);
    pane.style.setProperty('--w', 100 / cols);
    pane.style.setProperty('--h', 100 / rows);
    pane.style.opacity = visible ? '1' : '0';
    pane.style.visibility = visible ? 'visible' : 'hidden';
  }
  }, animate);
  document.getElementById('layout-status').textContent = en() ? `Previewing ${count} window zones` : `正在演示 ${count} 个窗口分区`;
}
for (const button of document.querySelectorAll('[data-layout]')) button.addEventListener('click', () => {
  for (const other of document.querySelectorAll('[data-layout]')) other.setAttribute('aria-pressed', String(other === button));
  setLayout(Number(button.dataset.layout));
});
setLayout(4, false);
document.addEventListener('site-language', () => { setLayout(count, false); document.querySelector('[data-illustration]').alt = en() ? 'An architectural sculpture of porcelain white and pale blue window frames' : '白色与浅蓝色的窗口框架构成一组轻盈的建筑模型'; });
document.querySelector('[data-illustration]').alt = en() ? 'An architectural sculpture of porcelain white and pale blue window frames' : '白色与浅蓝色的窗口框架构成一组轻盈的建筑模型';

// Main content and downloads never wait for the optional 3D renderer.
const sceneHost = document.getElementById('window-scene');
try {
  const { startScene } = await import('./window-scene.bundle.js?v=1da5ec996f9a');
  await startScene(sceneHost, { clock: sceneClock, scrollTo: scrollToScene });
} catch (error) {
  sceneHost.dataset.renderer = 'static-fallback';
  document.getElementById('motion-toggle').hidden = true;
  document.querySelector('.scene-controls').hidden = true;
  document.getElementById('hero-try').hidden = true;
  document.getElementById('scene-status').textContent = en() ? 'Static illustration' : '静态插画模式';
  console.warn('Interactive illustration unavailable; static artwork remains visible.', error.message);
}
