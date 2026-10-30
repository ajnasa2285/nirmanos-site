(() => {
  'use strict';
  const data = window.NirmanSiteData;
  const faqs = Array.isArray(data?.technicalFaqs) ? data.technicalFaqs : [];
  const root = document.documentElement;
  const byId = id => document.getElementById(id);
  const all = selector => Array.from(document.querySelectorAll(selector));
  let language = 'hi';
  const choose = (en, hi) => language === 'hi' ? hi : en;

  function closeMenu(returnFocus = false) {
    if (byId('mobile-nav')) byId('mobile-nav').hidden = true;
    const toggle = byId('menu-toggle');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', choose('Open menu', 'मेन्यू खोलें'));
    if (returnFocus) toggle?.focus();
  }

  function renderFaq() {
    const list = byId('faq-list');
    if (!list) return;
    const opened = new Set(all('#faq-list details[open]').map(node => node.dataset.faq));
    const query = (byId('faq-search')?.value || '').trim().toLocaleLowerCase();
    const shown = faqs.filter(row => [...Object.values(row.q), ...Object.values(row.a)].join(' ').toLocaleLowerCase().includes(query));
    list.replaceChildren(...shown.map(row => {
      const details = document.createElement('details');
      details.className = 'faq-item'; details.dataset.faq = row.id; details.open = opened.has(row.id);
      const summary = document.createElement('summary');
      const title = document.createElement('span'); title.textContent = row.q[language];
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('class', 'icon'); icon.setAttribute('viewBox', '0 0 24 24'); icon.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use'); use.setAttribute('href', '#i-plus'); icon.append(use);
      const answer = document.createElement('p'); answer.textContent = row.a[language];
      summary.append(title, icon); details.append(summary, answer); return details;
    }));
    if (byId('faq-empty')) byId('faq-empty').hidden = shown.length > 0;
    if (byId('faq-count')) byId('faq-count').textContent = choose(`${shown.length} of ${faqs.length} questions`, `${faqs.length} में से ${shown.length} सवाल`);
  }

  function setLanguage(next, remember = true) {
    language = next === 'en' ? 'en' : 'hi';
    root.lang = language;
    if (remember) { try { localStorage.setItem('nirmanos-language', language); } catch { /* Language works without storage. */ } }
    all('[data-en][data-hi]').forEach(node => { node.textContent = node.dataset[language]; });
    all('[data-placeholder-en][data-placeholder-hi]').forEach(node => { node.placeholder = node.getAttribute('data-placeholder-' + language); });
    all('[data-label-en][data-label-hi]').forEach(node => { node.setAttribute('aria-label', node.getAttribute('data-label-' + language)); });
    all('[data-set-lang]').forEach(node => { node.setAttribute('aria-pressed', String(node.dataset.setLang === language)); });
    all('[data-page-link]').forEach(link => {
      const [page, hash] = link.dataset.pageLink.split('#');
      link.href = `${page}?lang=${language}${hash ? '#' + hash : ''}`;
    });
    byId('menu-toggle')?.setAttribute('aria-label', byId('mobile-nav')?.hidden ? choose('Open menu', 'मेन्यू खोलें') : choose('Close menu', 'मेन्यू बंद करें'));
    document.title = choose('Inside the technology · NirmanOS', 'तकनीक को समझें · NirmanOS');
    try { const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState(null, '', url); } catch { /* File previews may restrict history. */ }
    renderFaq();
  }

  all('[data-set-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.setLang)));
  byId('faq-search')?.addEventListener('input', renderFaq);
  byId('menu-toggle')?.addEventListener('click', () => {
    const menu = byId('mobile-nav'); if (!menu) return;
    menu.hidden = !menu.hidden;
    byId('menu-toggle').setAttribute('aria-expanded', String(!menu.hidden));
    byId('menu-toggle').setAttribute('aria-label', menu.hidden ? choose('Open menu', 'मेन्यू खोलें') : choose('Close menu', 'मेन्यू बंद करें'));
  });
  all('#mobile-nav a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && byId('mobile-nav') && !byId('mobile-nav').hidden) closeMenu(true); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  let saved = null;
  try { saved = localStorage.getItem('nirmanos-language'); } catch { /* Optional preference only. */ }
  const requested = new URLSearchParams(location.search).get('lang');
  setLanguage(['hi', 'en'].includes(requested) ? requested : ['hi', 'en'].includes(saved) ? saved : 'hi');
})();
