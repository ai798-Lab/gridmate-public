import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let lenis;
const sceneFrames = new Set();

// Scroll, DOM animation and WebGL share one clock. Renderers request only the
// frames they need and cancel them when offscreen or settled.
function tick(time) {
  if (document.hidden) return;
  lenis?.raf(time * 1000);
  const pending = [...sceneFrames];
  sceneFrames.clear();
  for (const render of pending) render(time * 1000);
}
export const sceneClock = {
  request(render) { sceneFrames.add(render); gsap.ticker.wake(); return render; },
  cancel(render) { sceneFrames.delete(render); }
};

export function scrollToScene(target) {
  if (lenis) {
    const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const offset = padding - Math.max(padding, (innerHeight - target.offsetHeight) / 2);
    lenis.scrollTo(target, { offset, duration: .7 });
  } else target.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'center' });
}

// First/Last/Invert/Play: measure on selection, then animate transforms.
// Width/height no longer change on every animation frame.
let layoutTransition;
export function changeLayout(board, update, animate = true) {
  const panes = [...board.children];
  layoutTransition?.kill();
  const state = animate && !reduced.matches ? Flip.getState(panes) : null;
  gsap.set(panes, { clearProps: 'transform' });
  update();
  if (state) layoutTransition = Flip.from(state, {
    duration: .48, ease: 'power3.out', scale: true, prune: true,
    onComplete: () => { layoutTransition = null; }
  });
}

export function initScrollDepth() {
  if (!document.querySelector('.hero')) return;
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add(tick, false, true);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const media = gsap.matchMedia();
  media.add({
    desktop: '(min-width: 1001px) and (min-height: 650px) and (pointer: fine)',
    reduced: '(prefers-reduced-motion: reduce)',
    all: 'all'
  }, context => {
    const { desktop, reduced: quiet } = context.conditions;
    document.body.dataset.motion = quiet ? 'reduced' : desktop ? 'lenis-gsap' : 'native-gsap';
    document.body.classList.toggle('parallax-enabled', desktop && !quiet);
    if (quiet) return;
    if (desktop) {
      lenis = new Lenis({
        autoRaf: false, lerp: .18, smoothWheel: true, syncTouch: false,
        anchors: { duration: .75 },
        prevent: node => node.hasAttribute('data-lenis-prevent'),
        virtualScroll: ({ event }) => !event.ctrlKey && !event.metaKey && !event.shiftKey
      });
      lenis.on('scroll', ScrollTrigger.update);
    }
    // Only descendants move: trigger bounds and the sticky container stay still.
    // Direct transforms avoid invalidating inherited variables on a whole subtree.
    if (desktop) {
      const hero = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      hero.to('.hero-copy', { y: 38, ease: 'none' }, 0)
        .to('.hero-exhibit', { y: -28, ease: 'none' }, 0)
        .to('.scroll-atmosphere span:first-child', { y: 95, ease: 'none' }, 0)
        .to('.scroll-atmosphere span:last-child', { y: -45, ease: 'none' }, 0);
      const story = gsap.timeline({ scrollTrigger: { trigger: '.story-section', start: 'top 80%', end: 'bottom 30%', scrub: true } });
      story.fromTo('.story-art', { y: 48 }, { y: -48, ease: 'none' }, 0)
        .fromTo('.story-copy', { y: -20 }, { y: 20, ease: 'none' }, 0);
    }
    // Reveal independent pieces, never a whole section or a sticky parent.
    // Deep-linked content and content already on screen stay visible.
    const selectors = '.section-heading, .feature-item, .product-tabs, .details-heading, .detail-rows>article, .download-inner';
    for (const node of document.querySelectorAll(selectors)) {
      if (node.getBoundingClientRect().top < innerHeight * .95) continue;
      gsap.from(node, {
        opacity: 0, y: desktop ? 20 : 12, duration: .5, ease: 'power2.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: node, start: 'top 96%', once: true }
      });
    }
    return () => {
      // Stop first so pending native-scroll timers cannot restore stale classes.
      lenis?.stop(); lenis?.destroy(); lenis = undefined;
      document.body.classList.remove('parallax-enabled');
      layoutTransition?.progress(1);
    };
  });
  // Resize and content changes are uncommon: coalesce them, never remeasure
  // every section during wheel input. FAQ expansion also changes anchor bounds.
  const refresh = gsap.delayedCall(.15, () => { lenis?.resize(); ScrollTrigger.refresh(); }).pause();
  const scheduleRefresh = () => refresh.restart(true);
  const observer = new ResizeObserver(scheduleRefresh);
  observer.observe(document.querySelector('main'));
  document.addEventListener('site-language', scheduleRefresh);
  document.addEventListener('toggle', scheduleRefresh, true);
  document.fonts.ready.then(scheduleRefresh);
  addEventListener('pageshow', scheduleRefresh);
  addEventListener('pagehide', event => {
    if (event.persisted) return;
    observer.disconnect(); refresh.kill(); media.revert(); gsap.ticker.remove(tick);
    sceneFrames.clear();
  });
}
