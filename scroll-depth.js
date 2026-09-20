// Native scrolling drives bounded layers. No wheel interception or perpetual loop.
export function initScrollDepth() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 1001px) and (min-height: 650px)');
  const hero = document.querySelector('.hero');
  const story = document.querySelector('.story-section');
  const product = document.querySelector('.product-stage');
  const features = document.querySelector('.feature-columns');
  if (!hero || !story || !product || !features) return;
  const clamp = value => Math.min(1, Math.max(0, value));
  let frame = 0;

  function render() {
    frame = 0;
    if (reduced.matches || document.hidden) return;
    const height = innerHeight;
    // Complete all reads before writing styles to avoid layout thrashing.
    const h = hero.getBoundingClientRect();
    const s = story.getBoundingClientRect();
    const p = product.getBoundingClientRect();
    const f = features.getBoundingClientRect();
    const wide = desktop.matches;
    const heroProgress = clamp(-h.top / Math.max(1, h.height));
    const storyProgress = wide
      ? clamp((110 - s.top) / Math.max(1, s.height - height + 190))
      : clamp((height - s.top) / (height + s.height));
    const productProgress = clamp((height - p.top) / (height * .78));
    const featureProgress = clamp((height - f.top) / (height * .72));
    hero.style.setProperty('--copy-shift', `${heroProgress * (wide ? 42 : 12)}px`);
    hero.style.setProperty('--exhibit-shift', `${heroProgress * (wide ? -40 : -12)}px`);
    hero.style.setProperty('--atmosphere-shift', `${heroProgress * (wide ? 145 : 35)}px`);
    story.style.setProperty('--art-shift', `${(.5 - storyProgress) * (wide ? 150 : 28)}px`);
    story.style.setProperty('--story-shift', `${(storyProgress - .5) * (wide ? 60 : 12)}px`);
    story.style.setProperty('--frame-shift', `${(storyProgress - .5) * (wide ? 110 : 20)}px`);
    story.style.setProperty('--art-scale', String(1.035 - storyProgress * .07));
    product.style.setProperty('--preview-shift', `${(1 - productProgress) * (wide ? 32 : 12)}px`);
    product.style.setProperty('--preview-scale', String(.96 + productProgress * .04));
    features.style.setProperty('--step-shift', `${(1 - featureProgress) * (wide ? 42 : 0)}px`);
  }
  function schedule() {
    if (!frame && !reduced.matches && !document.hidden) frame = requestAnimationFrame(render);
  }
  function configure() {
    document.body.classList.toggle('parallax-enabled', !reduced.matches);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    schedule();
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('site-language', schedule);
  reduced.addEventListener('change', configure);
  desktop.addEventListener('change', schedule);
  new ResizeObserver(schedule).observe(document.querySelector('main'));
  configure();
}
