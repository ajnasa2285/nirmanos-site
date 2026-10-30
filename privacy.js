(() => {
  'use strict';
  const preferenceKey = 'nirmanos-language';
  const root = document.documentElement;
  const toggle = document.getElementById('lang-toggle');
  const status = document.getElementById('preference-status');
  let language = 'en';
  let preferenceResult = null;

  function savedLanguage() {
    try { return localStorage.getItem(preferenceKey); } catch { return null; }
  }

  function updateStatus() {
    const messages = {
      cleared: { en: 'Saved language cleared on this browser.', hi: 'इस ब्राउज़र से सेव की गई भाषा हटा दी गई है।' },
      unavailable: { en: 'Browser storage is unavailable. You can manage site data in your browser settings.', hi: 'ब्राउज़र स्टोरेज उपलब्ध नहीं है। ब्राउज़र की सेटिंग से साइट की जानकारी सँभाल सकते हैं।' }
    };
    status.textContent = preferenceResult ? messages[preferenceResult][language] : '';
  }

  function setLanguage(next, persist = false) {
    language = next === 'hi' ? 'hi' : 'en';
    root.lang = language;
    document.title = language === 'hi' ? 'निजता और आपकी जानकारी · NirmanOS' : 'Privacy & your data · NirmanOS';
    toggle.textContent = language === 'hi' ? 'English ↔' : 'हिंदी ↔';
    toggle.setAttribute('aria-label', language === 'hi' ? 'Switch to English' : 'हिंदी में देखें');
    document.querySelector('[data-nav-label]').setAttribute('aria-label', language === 'hi' ? 'पेज के लिंक' : 'Page navigation');
    document.querySelector('[data-guide-label]').setAttribute('aria-label', language === 'hi' ? 'इस पेज पर' : 'On this page');
    document.querySelector('[data-section-nav-label]').setAttribute('aria-label', language === 'hi' ? 'निजता के विषय' : 'Privacy sections');
    document.querySelectorAll('[data-home]').forEach(link => {
      link.href = `index.html?lang=${language}`;
      if (link.classList.contains('brand')) link.setAttribute('aria-label', language === 'hi' ? 'NirmanOS होम' : 'NirmanOS home');
    });
    if (persist) {
      try { localStorage.setItem(preferenceKey, language); } catch { /* Language works without persistent storage. */ }
      preferenceResult = null;
    }
    updateStatus();
    try {
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      history.replaceState(null, '', url);
    } catch { /* Local file preview may restrict history changes. */ }
  }

  const requested = new URLSearchParams(location.search).get('lang');
  const remembered = savedLanguage();
  setLanguage(['en', 'hi'].includes(requested) ? requested : ['en', 'hi'].includes(remembered) ? remembered : 'en');
  toggle.addEventListener('click', () => setLanguage(language === 'en' ? 'hi' : 'en', true));
  document.getElementById('forget-language').addEventListener('click', () => {
    try {
      localStorage.removeItem(preferenceKey);
      preferenceResult = 'cleared';
    } catch { preferenceResult = 'unavailable'; }
    updateStatus();
  });
})();
