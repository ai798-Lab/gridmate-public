for (const button of document.querySelectorAll('[data-variant]')) {
  button.addEventListener('click', () => {
    const variant = button.dataset.variant;
    if (!['color', 'black', 'white'].includes(variant)) return;
    for (const other of document.querySelectorAll('[data-variant]')) other.setAttribute('aria-pressed', String(other === button));
    document.getElementById('logo-grid').classList.toggle('reversed', variant === 'white');
    for (const image of document.querySelectorAll('[data-lockup]')) image.src = `./assets/brand-cut/lockup-${image.dataset.lockup}-${variant}.svg`;
    for (const link of document.querySelectorAll('[data-download]')) link.href = `./assets/brand-cut/lockup-${link.dataset.download}-${variant}.svg`;
    for (const image of document.querySelectorAll('[data-symbol]')) image.src = `./assets/brand-cut/symbol-${variant}.svg`;
    for (const link of document.querySelectorAll('[data-symbol-download]')) link.href = `./assets/brand-cut/symbol-${variant}.svg`;
    document.getElementById('variant-status').textContent = `已显示${button.textContent}标志组合。`;
  });
}
document.getElementById('print-guide').addEventListener('click', () => window.print());

const returnLanguage = new URL(location.href).searchParams.get('lang') === 'en' ? 'en' : 'zh';
for (const link of document.querySelectorAll('a[href="./?lang=zh"]')) {
  link.href = `./?lang=${returnLanguage}`;
}
