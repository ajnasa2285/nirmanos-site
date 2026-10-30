(function () {
  'use strict';
  const doc = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const all = selector => Array.from(document.querySelectorAll(selector));
  const text = (en, hi) => doc.lang === 'en' ? en : hi;

  // A fixed discrepancy illustration: a click changes only this browser's view.
  const shortage = document.getElementById('shortage-demo');
  function renderShortage() {
    if (!shortage) return;
    const checked = shortage.dataset.checked === 'true';
    document.getElementById('shortage-result-title').textContent = checked ? text('2 bags need checking.', '2 बोरी का अंतर है।') : text('Compare both counts.', 'दोनों गिनती जाँचें।');
    document.getElementById('shortage-result-body').textContent = checked
      ? text('50 billed − 48 received = 2 bags. Confirm the delivery or a correction with the supplier before approving payment.', 'बिल में 50 − प्राप्त 48 = 2 बोरी। भुगतान मंज़ूर करने से पहले सप्लायर से डिलीवरी या सुधार की पुष्टि करें।')
      : text('A sample of comparing the bill and delivery count before deciding payment.', 'भुगतान तय करने से पहले बिल और प्राप्ति की तुलना का उदाहरण।');
    document.getElementById('shortage-check-label').textContent = checked ? text('Reset example', 'नमूना रीसेट करें') : text('Check the example', 'नमूना जाँचें');
  }
  document.getElementById('shortage-check')?.addEventListener('click', () => {
    shortage.dataset.checked = String(shortage.dataset.checked !== 'true'); renderShortage();
  });

  // Desktop pointer glow is optional, throttled, and never covers controls.
  const spotlights = all('.architecture-flow article, .trust-grid article, .diary-card, .readiness-item');
  const pendingSpots = new Map(); let spotFrame = 0;
  function clearSpots() {
    if (spotFrame) cancelAnimationFrame(spotFrame); spotFrame = 0; pendingSpots.clear();
    spotlights.forEach(card => { delete card.dataset.spotActive; card.style.removeProperty('--spot-x'); card.style.removeProperty('--spot-y'); });
  }
  function paintSpots() {
    spotFrame = 0;
    if (reduce.matches || !fine.matches || document.hidden) { clearSpots(); return; }
    pendingSpots.forEach((point, card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', (point.x - rect.left) + 'px');
      card.style.setProperty('--spot-y', (point.y - rect.top) + 'px'); card.dataset.spotActive = 'true';
    }); pendingSpots.clear();
  }
  spotlights.forEach(card => {
    card.classList.add('spotlight-card');
    card.addEventListener('pointermove', event => {
      if (reduce.matches || !fine.matches || event.pointerType !== 'mouse') return;
      pendingSpots.set(card, {x:event.clientX, y:event.clientY});
      if (!spotFrame) spotFrame = requestAnimationFrame(paintSpots);
    }, {passive:true});
    card.addEventListener('pointerleave', () => { pendingSpots.delete(card); delete card.dataset.spotActive; });
  });

  // Enhance already-visible content. A failed observer can never hide the page.
  const animations = new Map(); let revealObserver;
  function cancelReveal(node) { const animation = animations.get(node); if (animation) animation.cancel(); animations.delete(node); }
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const node = entry.target; revealObserver.unobserve(node); node.dataset.revealReady = 'visible';
        if (reduce.matches || document.hidden || node.contains(document.activeElement) || !node.animate) return;
        const animation = node.animate([{opacity:.8, transform:'translateY(8px)'},{opacity:1, transform:'none'}], {duration:340, easing:'cubic-bezier(.22,1,.36,1)'});
        animations.set(node, animation); animation.onfinish = () => animations.delete(node);
      });
    }, {threshold:.1});
    all('.architecture-flow article, .trust-grid article, .readiness-item, .section-heading').forEach(node => {
      node.dataset.revealReady = 'visible';
      if (node.getBoundingClientRect().top >= window.innerHeight) revealObserver.observe(node);
      node.addEventListener('focusin', () => { revealObserver.unobserve(node); cancelReveal(node); });
    });
  }

  // One current section, measured in document coordinates after layout changes.
  const navLinks = all('.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]');
  const sections = Array.from(new Set(navLinks.map(a => a.getAttribute('href').slice(1)))).map(id => document.getElementById(id)).filter(Boolean);
  let navFrame = 0;
  function updateNav() {
    navFrame = 0;
    const cutoff = (document.querySelector('.site-header')?.getBoundingClientRect().height || 0) + 28;
    let current = '';
    const positions = sections.map(node => ({node, top:node.getBoundingClientRect().top})).sort((a,b) => a.top - b.top);
    positions.forEach(({node, top}) => { if (top <= cutoff) current = node.id; });
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === '#' + current;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }
  function queueNav() { if (!navFrame) navFrame = requestAnimationFrame(updateNav); }
  window.addEventListener('scroll', queueNav, {passive:true}); window.addEventListener('resize', queueNav);
  if ('ResizeObserver' in window) { const resize = new ResizeObserver(queueNav); sections.forEach(node => resize.observe(node)); }
  if (document.fonts?.ready) document.fonts.ready.then(queueNav);
  function motionChange() { if (reduce.matches || !fine.matches) clearSpots(); if (reduce.matches) animations.forEach((_, node) => cancelReveal(node)); }
  reduce.addEventListener('change', motionChange); fine.addEventListener('change', motionChange);
  function pageVisibility() { doc.dataset.pageHidden = String(document.hidden); if (document.hidden) { clearSpots(); animations.forEach((_, node) => cancelReveal(node)); } }
  document.addEventListener('visibilitychange', pageVisibility);
  new MutationObserver(() => { renderShortage(); queueNav(); }).observe(doc, {attributes:true, attributeFilter:['lang']});
  renderShortage(); updateNav(); pageVisibility();
}());
