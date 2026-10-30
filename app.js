(function () {
  'use strict';
  const data = window.NirmanSiteData;
  if (!data) return;
  const $ = id => document.getElementById(id);
  const all = selector => Array.from(document.querySelectorAll(selector));
  const state = { language: 'en', business: 'brick_kiln', scenario: data.scenarios[0].id, reached: 0, viewed: 0, corrected: false, diaryApproved: false, briefStep: 0, briefStarted: false, evidence: null };
  const text = value => typeof value === 'string' ? value : value[state.language];
  const tr = (en, hi) => state.language === 'hi' ? hi : en;
  const money = paise => new Intl.NumberFormat(state.language === 'hi' ? 'hi-IN' : 'en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: paise % 100 ? 2 : 0, maximumFractionDigits: 2 }).format(paise / 100);
  const selectedBusiness = () => data.businesses.find(row => row.id === state.business);
  const selectedScenario = () => data.scenarios.find(row => row.id === state.scenario);
  const setText = (id, value) => { if ($(id)) $(id).textContent = value; };
  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }
  function icon(name) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    node.setAttribute('aria-hidden', 'true'); node.setAttribute('viewBox', '0 0 24 24'); node.setAttribute('class', 'icon');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use'); use.setAttribute('href', '#i-' + name); node.append(use); return node;
  }
  function button(label, className, handler) {
    const node = el('button', className, label); node.type = 'button'; if (handler) node.addEventListener('click', handler); return node;
  }
  function announce(message, id = 'toast') { setText(id, message); }
  function download(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = el('a'); link.href = url; link.download = name; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  const dialogOpeners = new Map();
  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    dialogOpeners.set(dialog, document.activeElement); dialog.showModal();
  }
  all('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      const opener = dialogOpeners.get(dialog);
      if (opener?.isConnected && opener.getClientRects().length) opener.focus();
      else if (opener?.closest('#mobile-nav')) $('menu-toggle')?.focus();
    });
    dialog.addEventListener('click', event => {
      const r = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
    });
  });
  all('[data-close-dialog]').forEach(node => node.addEventListener('click', () => node.closest('dialog')?.close()));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const dialogs = all('dialog[open]');
    const dialog = dialogs.find(node => node.contains(document.activeElement)) || dialogs.at(-1);
    if (!dialog) return;
    const focusable = Array.from(dialog.querySelectorAll('a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]')).filter(node =>
      node.tabIndex >= 0 && !node.matches(':disabled') && !node.closest('[hidden], [inert]')
      && getComputedStyle(node).visibility !== 'hidden' && Array.from(node.getClientRects()).some(rect => rect.width > 0 && rect.height > 0));
    if (!focusable.length) { event.preventDefault(); dialog.tabIndex = -1; dialog.focus(); return; }
    const first = focusable[0], last = focusable.at(-1), current = document.activeElement;
    if (!focusable.includes(current) || event.shiftKey && current === first || !event.shiftKey && current === last) {
      event.preventDefault(); (event.shiftKey ? last : first).focus();
    }
  }, true);

  function renderBusinesses(focus = false) {
    const tabs = $('business-tabs'), panel = $('business-panel'); if (!tabs || !panel) return;
    tabs.replaceChildren();
    data.businesses.forEach(business => {
      const tab = button('', 'business-tab' + (business.id === state.business ? ' active' : ''), () => { state.business = business.id; renderBusinesses(true); });
      tab.id = 'business-tab-' + business.id; tab.dataset.business = business.id; tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', 'business-panel');
      tab.setAttribute('aria-selected', String(business.id === state.business)); tab.tabIndex = business.id === state.business ? 0 : -1;
      tab.append(icon(business.icon), el('span', '', text(business.name)));
      tab.addEventListener('keydown', event => {
        const index = data.businesses.findIndex(row => row.id === state.business); let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % data.businesses.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + data.businesses.length - 1) % data.businesses.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = data.businesses.length - 1;
        if (next !== undefined) { event.preventDefault(); state.business = data.businesses[next].id; renderBusinesses(true); }
      });
      tabs.append(tab);
    });
    const business = selectedBusiness(), grid = el('div', 'profile-grid'), copy = el('div', 'profile-copy');
    const emblem = el('div', 'profile-icon'); emblem.append(icon(business.icon));
    copy.append(emblem, el('p', 'eyebrow', text(business.agent)), el('h3', '', text(business.headline)), el('p', '', text(business.description)));
    const features = el('ul', 'check-list');
    business.features.forEach(feature => { const li = el('li'); li.append(icon('check'), el('span', '', text(feature))); features.append(li); });
    copy.append(features);
    const setup = button(tr('Plan this business setup', 'इस कारोबार का सेटअप बनाएँ'), 'button button-dark', () => openBrief()); copy.append(setup);
    const links = el('div', 'profile-links');
    links.append(el('p', 'eyebrow', tr('Part of the same working network', 'एक-दूसरे के काम आने वाला नेटवर्क')),
      el('h4', '', tr('Your next job connects here.', 'अगला काम इनसे जुड़ता है।')),
      el('p', '', tr('Explore related businesses. Every business keeps its own approvals and books.', 'जुड़े हुए कारोबार देखें। हर कारोबार की मंज़ूरी और बही अपनी रहती है।')));
    business.connects.forEach(id => {
      const related = data.businesses.find(row => row.id === id);
      const link = button('', 'profile-link', () => { state.business = id; renderBusinesses(true); });
      link.append(icon(related.icon), el('span', '', text(related.name)), icon('arrow')); links.append(link);
    });
    grid.append(copy, links); panel.replaceChildren(grid); panel.setAttribute('aria-labelledby', 'business-tab-' + business.id); panel.tabIndex = 0;
    setText('selected-business-label', text(business.name));
    if (focus) $('business-tab-' + business.id).focus({ preventScroll: true });
  }

  const nextLabels = [
    ['Preview the quotation', 'कोटेशन देखें'], ['Review the approval', 'मंज़ूरी की जाँच करें'],
    ['Approve the sample order', 'नमूना ऑर्डर मंज़ूर करें'], ['Confirm sample delivery', 'नमूना डिलीवरी की पुष्टि करें'],
    ['Record sample settlement', 'नमूना भुगतान दर्ज करें'], ['Sample complete', 'नमूना पूरा हुआ'],
  ];
  function stageContent(scenario, stage) {
    const total = money(scenario.amountPaise);
    const content = [
      { heading: tr('A clear requirement starts the job.', 'साफ़ ज़रूरत से काम की शुरुआत।'), who: text(scenario.buyer), message: text(scenario.requirement), summary: tr('A requirement is a request. Stock, price and availability still need confirmation.', 'ज़रूरत एक माँग है। स्टॉक, दर और उपलब्धता की पुष्टि अभी बाकी है।') },
      { heading: tr('Both sides can see the same terms.', 'दोनों पक्षों के सामने एक जैसी शर्तें।'), who: text(scenario.seller), message: text(scenario.quotation), summary: text(scenario.item) },
      { heading: tr('The owner stays in control.', 'फैसला मालिक के हाथ में।'), who: tr('Owner review', 'मालिक की जाँच'), message: tr('Review the sample total of ' + total + ' and the terms. The next button explicitly approves this illustration.', total + ' की नमूना रकम और शर्तें जाँचें। अगला बटन केवल इस उदाहरण की मंज़ूरी देता है।'), summary: tr('No real order is sent. Each business makes its own decision.', 'कोई असली ऑर्डर नहीं भेजा जाता। हर कारोबार अपना फैसला खुद करता है।') },
      { heading: tr('Delivery needs a record, not a guess.', 'डिलीवरी का रिकॉर्ड चाहिए, अनुमान नहीं।'), who: text(scenario.seller), message: text(scenario.delivery), summary: tr('Dispatch and receipt are separate facts. Keep evidence for both.', 'निकासी और प्राप्ति अलग बातें हैं। दोनों के सबूत रखें।') },
      { heading: tr('Two businesses. Two private books.', 'दो कारोबार। दोनों की अपनी बही।'), who: tr('Sample accounting review', 'नमूना हिसाब की जाँच'), message: tr('Seller receivable: ' + total + '. Buyer payable: ' + total + '. Record the sample settlement only after checking the supporting receipt.', 'बेचने वाले की लेनदारी: ' + total + '। खरीदार की देनदारी: ' + total + '। सहायक रसीद जाँचने के बाद ही नमूना भुगतान दर्ज करें।'), summary: tr('A receipt or claim is not independent bank verification.', 'रसीद या दावा अपने आप बैंक की पुष्टि नहीं है।') },
    ];
    return content[stage];
  }
  function renderJob() {
    const scenario = selectedScenario(), select = $('scenario-select');
    if (select) {
      select.replaceChildren(...data.scenarios.map(row => { const option = el('option', '', text(row.name)); option.value = row.id; return option; })); select.value = state.scenario;
    }
    const steps = $('job-steps');
    if (steps) {
      steps.replaceChildren();
      data.stageLabels.forEach((label, index) => {
        const step = button('', 'job-step' + (index === state.viewed ? ' active' : '') + (index < state.reached ? ' complete' : ''), () => { state.viewed = index; renderJob(); $('job-steps').querySelector('[data-step="' + index + '"]')?.focus({ preventScroll: true }); });
        step.dataset.step = index; step.disabled = index > state.reached; step.setAttribute('aria-current', index === state.viewed ? 'step' : 'false');
        step.append(el('span', 'step-number', String(index + 1)), el('span', '', text(label))); steps.append(step);
      });
    }
    const stage = $('job-stage');
    if (stage) {
      stage.dataset.stage = String(state.viewed); stage.dataset.completedSteps = String(state.reached); stage.dataset.complete = String(state.reached === 5);
      const content = stageContent(scenario, state.viewed), header = el('div', 'stage-heading');
      header.append(el('p', 'eyebrow', text(data.stageLabels[state.viewed])), el('h3', '', content.heading));
      const bubble = el('div', 'chat-message'); bubble.append(el('strong', '', content.who), el('p', '', content.message));
      stage.replaceChildren(header, bubble, el('p', 'stage-summary', content.summary), el('p', 'stage-meta', tr('Fictional example · no messages sent or entries posted', 'काल्पनिक उदाहरण · कोई संदेश या बही की एंट्री नहीं')));
      if (state.reached === 5 && state.viewed === 4) stage.append(el('p', 'stage-summary success', tr('Sample settled. Both illustrative balances are ₹0. Download the sample record below.', 'नमूना भुगतान पूरा। दोनों काल्पनिक बकाया ₹0 हैं। नीचे नमूना रिकॉर्ड डाउनलोड करें।')));
    }
    if ($('job-next')) { $('job-next').disabled = state.reached === 5 && state.viewed === 4; $('job-next').textContent = state.viewed < Math.min(state.reached, 4) ? tr('Return to current step', 'मौजूदा कदम पर लौटें') : tr(...nextLabels[state.reached]); }
    if ($('job-download')) $('job-download').disabled = state.reached !== 5;
    const progress = $('job-progressbar');
    if (progress) { const value = state.reached * 20; progress.setAttribute('aria-valuenow', String(value)); progress.setAttribute('aria-valuetext', tr(state.reached + ' of 5 sample actions completed', '5 में से ' + state.reached + ' नमूना काम पूरे')); (progress.querySelector('span') || progress).style.width = value + '%'; }
    renderEvidence();
  }
  function resetJob() { state.reached = 0; state.viewed = 0; state.evidence = null; if ($('evidence-dialog')?.open) $('evidence-dialog').close(); renderJob(); announce(tr('Sample reset. Nothing was sent or posted.', 'नमूना रीसेट हुआ। कुछ भेजा या दर्ज नहीं किया गया।'), 'demo-status'); }
  function renderEvidence() {
    const list = $('evidence-list'); if (!list) return;
    const ids = ['request', 'quote', 'approval', 'delivery', 'settlement'];
    list.replaceChildren();
    ids.slice(0, Math.min(state.reached + 1, 5)).forEach((id, index) => {
      const row = button('', 'evidence-row', () => { state.evidence = id; renderEvidenceDialog(); openDialog($('evidence-dialog')); }); row.dataset.evidence = id;
      row.append(icon('document'), el('span', '', text(data.stageLabels[index]) + tr(' · sample record', ' · नमूना रिकॉर्ड')), icon('arrow')); list.append(row);
    });
  }
  function renderEvidenceDialog() {
    const box = $('evidence-content'); if (!box || !state.evidence) return;
    const index = ['request', 'quote', 'approval', 'delivery', 'settlement'].indexOf(state.evidence), scenario = selectedScenario();
    const content = stageContent(scenario, index), finalized = index < state.reached;
    const heading = el('h2', '', text(data.stageLabels[index]) + tr(' record', ' का रिकॉर्ड')); heading.id = 'evidence-detail-title'; $('evidence-dialog')?.setAttribute('aria-labelledby', heading.id);
    box.replaceChildren(el('p', 'eyebrow', tr('Illustrative evidence', 'उदाहरण का सबूत')), heading,
      el('p', '', text(scenario.buyer) + ' → ' + text(scenario.seller)), el('p', '', content.message),
      el('p', 'tag', finalized ? tr('Sample action confirmed', 'नमूना कार्रवाई की पुष्टि हुई') : tr('Sample awaiting confirmation', 'नमूना पुष्टि की प्रतीक्षा में')),
      el('p', 'stage-meta', tr('This is a built-in fictional note, not an uploaded document, real invoice or verified payment.', 'यह पहले से दिया काल्पनिक नोट है। यह अपलोड किया दस्तावेज़, असली बिल या पुष्टि किया भुगतान नहीं है।')));
  }
  $('scenario-select')?.addEventListener('change', event => { state.scenario = event.target.value; resetJob(); });
  $('job-next')?.addEventListener('click', () => {
    if (state.viewed < Math.min(state.reached, 4)) state.viewed = Math.min(state.reached, 4);
    else if (state.reached < 5) { state.reached += 1; state.viewed = Math.min(state.reached, 4); }
    renderJob(); announce(state.reached === 5 ? tr('Illustration complete. Sample download is ready.', 'उदाहरण पूरा हुआ। नमूना डाउनलोड तैयार है।') : text(data.stageLabels[state.viewed]) + tr(' is ready to review.', ' जाँच के लिए तैयार है।'), 'demo-status');
  });
  $('job-reset')?.addEventListener('click', resetJob);
  $('job-download')?.addEventListener('click', () => {
    if (state.reached !== 5) return;
    const s = selectedScenario(), result = { schema: 'urn:nirmanos:website-job-demo:v1', illustrativeOnly: true, scenarioId: s.id, currency: 'INR', totalPaise: s.amountPaise,
      buyer: { name: s.buyer.en, samplePayablePaise: s.amountPaise, samplePaidPaise: s.amountPaise, sampleOutstandingPaise: 0 },
      seller: { name: s.seller.en, sampleReceivablePaise: s.amountPaise, sampleReceivedPaise: s.amountPaise, sampleOutstandingPaise: 0 },
      stagesReviewed: ['requirement', 'quotation', 'approval', 'delivery', 'settlement'], realOrdersCreated: false, ledgerEntriesPosted: false, messagesSent: false,
      notice: 'Fictional website illustration. Not an invoice, payment confirmation, identity check or permission to operate an agent.' };
    download('nirmanos-sample-job.json', JSON.stringify(result, null, 2), 'application/json'); announce(tr('Fictional job record downloaded.', 'काल्पनिक काम का रिकॉर्ड डाउनलोड हुआ।'), 'demo-status');
  });

  function renderDiary() {
    const sample = data.diary, rows = state.corrected ? [...sample.lines, sample.correction] : sample.lines;
    const expense = rows.reduce((sum, row) => sum + row.amountPaise, 0), closing = sample.openingPaise + sample.receiptsPaise - expense, variance = closing - sample.writtenClosingPaise;
    const list = $('diary-lines');
    if (list) {
      list.setAttribute('role', 'list');
      list.replaceChildren(...rows.map(row => { const line = el('div', 'diary-line' + (row.id === sample.correction.id ? ' diary-added' : '')); line.setAttribute('role', 'listitem'); line.append(el('span', '', text(row.label)), el('strong', '', money(row.amountPaise))); return line; }));
    }
    setText('diary-opening', money(sample.openingPaise)); setText('diary-receipts', money(sample.receiptsPaise)); setText('diary-expenses', money(expense));
    setText('diary-closing', money(closing)); setText('diary-variance', money(Math.abs(variance)) + (variance === 0 ? tr(' difference · totals match', ' का अंतर · जोड़ मिल गया') : tr(' difference from the written closing', ' का अंतर, डायरी की बची रकम से')));
    for (const [id, amount] of Object.entries({ 'diary-opening': sample.openingPaise, 'diary-receipts': sample.receiptsPaise, 'diary-expenses': expense, 'diary-closing': closing, 'diary-variance': variance })) if ($(id)) $(id).dataset.paise = String(amount);
    if ($('diary-variance')) $('diary-variance').dataset.matched = String(variance === 0);
    if ($('diary-correct')) { $('diary-correct').disabled = state.corrected; $('diary-correct').textContent = state.corrected ? tr('Missing slip included', 'छूटी पर्ची जोड़ दी गई') : tr('Add the missing ₹500 slip', 'छूटी हुई ₹500 की पर्ची जोड़ें'); }
    if ($('diary-approve')) { $('diary-approve').disabled = variance !== 0 || state.diaryApproved; $('diary-approve').textContent = state.diaryApproved ? tr('Sample approved', 'नमूना मंज़ूर हुआ') : tr('Approve this sample', 'यह नमूना मंज़ूर करें'); }
    announce(state.diaryApproved ? tr('You approved the corrected sample. It remains in this page only; no ledger entry was posted.', 'आपने सुधरा हुआ नमूना मंज़ूर किया। यह केवल इसी पेज में है; बही में कोई एंट्री नहीं हुई।')
      : variance === 0 ? tr('The calculated closing now matches the diary’s ₹7,500. Review it before approving.', 'अब गणना की बची रकम डायरी के ₹7,500 से मिलती है। मंज़ूरी से पहले जाँच लें।')
        : tr('Calculated closing: ₹8,000. The diary says ₹7,500. A ₹500 loading slip is missing from the expense list.', 'गणना की बची रकम: ₹8,000। डायरी में ₹7,500 हैं। खर्च की सूची से ₹500 की लदाई पर्ची छूट गई है।'), 'diary-status');
  }
  $('diary-correct')?.addEventListener('click', () => { state.corrected = true; state.diaryApproved = false; renderDiary(); });
  $('diary-approve')?.addEventListener('click', () => { if (state.corrected) { state.diaryApproved = true; renderDiary(); } });
  $('diary-reset')?.addEventListener('click', () => { state.corrected = false; state.diaryApproved = false; renderDiary(); });

  function populateBriefBusinesses() {
    const select = $('brief-business'); if (!select) return;
    const current = select.value || state.business;
    select.replaceChildren(...data.businesses.map(row => { const option = el('option', '', text(row.name)); option.value = row.id; return option; })); select.value = current;
  }
  function openBrief() {
    if (!state.briefStarted) { if ($('brief-business')) $('brief-business').value = state.business; if ($('brief-language')) $('brief-language').value = state.language; state.briefStarted = true; }
    renderBrief(); openDialog($('brief-dialog'));
  }
  all('[data-open-brief]').forEach(node => node.addEventListener('click', openBrief));
  const needLabels = { orders: { en: 'Orders and quotations', hi: 'ऑर्डर और कोटेशन' }, books: { en: 'Daily books and dues', hi: 'रोज़ का हिसाब और बकाया' }, suppliers: { en: 'Finding and coordinating suppliers', hi: 'सप्लायर खोजना और समन्वय' }, deliveries: { en: 'Delivery and work records', hi: 'डिलीवरी और काम का रिकॉर्ड' } };
  function briefText() {
    const lang = $('brief-language')?.value === 'hi' ? 'hi' : 'en', pick = (en, hi) => lang === 'hi' ? hi : en;
    const business = data.businesses.find(row => row.id === $('brief-business')?.value) || selectedBusiness();
    const needs = all('#brief-form input[name="needs"]:checked').map(node => needLabels[node.value]?.[lang]).filter(Boolean);
    return [pick('NirmanOS · Business setup brief', 'NirmanOS · कारोबार सेटअप सार'), '',
      pick('Business type: ', 'कारोबार का प्रकार: ') + business.name[lang],
      pick('Business name: ', 'कारोबार का नाम: ') + ($('brief-name')?.value.trim() || pick('Not provided', 'नहीं दिया गया')),
      pick('Town / area: ', 'शहर / इलाका: ') + ($('brief-town')?.value.trim() || ''),
      pick('Preferred language: ', 'पसंदीदा भाषा: ') + (lang === 'hi' ? 'हिंदी' : 'English'),
      pick('Priorities:', 'प्राथमिकताएँ:'), ...needs.map(need => '• ' + need), '',
      pick('Before integration: confirm the owner, business documents, address, approval rules and the destination books.', 'जोड़ने से पहले: मालिक, कारोबारी दस्तावेज़, पता, मंज़ूरी के नियम और मुख्य बही तय करें।'), '',
      pick('Prepared locally in the website preview. This is not an application, account, quotation or order. Nothing has been submitted. Share this file yourself only when you choose.', 'वेबसाइट की झलक में आपके लिए तैयार किया गया। यह आवेदन, खाता, कोटेशन या ऑर्डर नहीं है। कुछ भेजा नहीं गया है। अपनी इच्छा से ही यह फ़ाइल साझा करें।')].join('\n');
  }
  function validateBrief() {
    let message = '', focus;
    if (state.briefStep === 0 && !all('#brief-form input[name="needs"]:checked').length) { message = tr('Choose at least one priority for your setup.', 'सेटअप के लिए कम से कम एक प्राथमिकता चुनें।'); focus = document.querySelector('#brief-form input[name="needs"]'); }
    if (state.briefStep === 1) {
      if (!$('brief-town')?.value.trim() || $('brief-town').value.trim().length > 80) { message = tr('Enter your town or area using 1–80 characters.', '1–80 अक्षरों में अपना शहर या इलाका लिखें।'); focus = $('brief-town'); }
      else if (($('brief-name')?.value.trim().length || 0) > 100) { message = tr('Keep the optional name within 100 characters.', 'वैकल्पिक नाम 100 अक्षरों के अंदर रखें।'); focus = $('brief-name'); }
    }
    setText('brief-error', message); all('#brief-form [aria-invalid]').forEach(node => node.removeAttribute('aria-invalid'));
    if (focus) { focus.setAttribute('aria-invalid', 'true'); focus.focus(); }
    return !message;
  }
  function renderBrief(focus = false) {
    all('[data-brief-step]').forEach(section => { section.hidden = Number(section.dataset.briefStep) !== state.briefStep; });
    setText('brief-step-label', tr('Step ' + (state.briefStep + 1) + ' of 3', 'कदम ' + (state.briefStep + 1) + ' / 3'));
    if ($('brief-progress')) {
      const progress = $('brief-progress'); progress.setAttribute('role', 'progressbar'); progress.setAttribute('aria-label', tr('Setup brief progress', 'सेटअप सार की प्रगति'));
      progress.setAttribute('aria-valuemin', '0'); progress.setAttribute('aria-valuemax', '3'); progress.setAttribute('aria-valuenow', String(state.briefStep + 1));
      if (progress.querySelector('span')) progress.querySelector('span').style.width = (state.briefStep + 1) / 3 * 100 + '%';
    }
    if ($('brief-back')) $('brief-back').hidden = state.briefStep === 0;
    if ($('brief-next')) { $('brief-next').hidden = state.briefStep === 2; $('brief-next').textContent = state.briefStep === 1 ? tr('Prepare my brief', 'मेरा सार तैयार करें') : tr('Next', 'आगे'); }
    ['brief-copy', 'brief-download'].forEach(id => { if ($(id)) $(id).hidden = state.briefStep !== 2; });
    if (state.briefStep === 2) setText('brief-preview', briefText());
    if (focus) {
      const section = document.querySelector('[data-brief-step="' + state.briefStep + '"]');
      const target = section?.querySelector('input, select, textarea, [tabindex]') || $('brief-step-label');
      if (target) { if (!target.matches('input, select, textarea, [tabindex]')) target.tabIndex = -1; target.focus(); }
    }
  }
  $('brief-next')?.addEventListener('click', () => { if (validateBrief() && state.briefStep < 2) { state.briefStep += 1; setText('brief-status', ''); renderBrief(true); } });
  $('brief-back')?.addEventListener('click', () => { if (state.briefStep > 0) { state.briefStep -= 1; setText('brief-error', ''); setText('brief-status', ''); renderBrief(true); } });
  $('brief-form')?.addEventListener('submit', event => { event.preventDefault(); if (state.briefStep < 2) $('brief-next')?.click(); });
  $('brief-start-over')?.addEventListener('click', () => {
    $('brief-form')?.reset(); all('#brief-form input[name="needs"]').forEach(node => { node.checked = false; });
    if ($('brief-name')) $('brief-name').value = ''; if ($('brief-town')) $('brief-town').value = '';
    if ($('brief-business')) $('brief-business').value = state.business; if ($('brief-language')) $('brief-language').value = state.language;
    state.briefStep = 0; state.briefStarted = true; setText('brief-error', ''); setText('brief-status', ''); setText('brief-preview', ''); all('#brief-form [aria-invalid]').forEach(node => node.removeAttribute('aria-invalid')); renderBrief(true);
  });
  $('brief-download')?.addEventListener('click', () => { if (state.briefStep !== 2) return; download('nirmanos-setup-brief.txt', briefText(), 'text/plain;charset=utf-8'); announce(tr('Brief downloaded to your device. Nothing was submitted.', 'सार आपके डिवाइस पर डाउनलोड हुआ। कुछ भेजा नहीं गया।'), 'brief-status'); });
  $('brief-copy')?.addEventListener('click', async () => {
    if (state.briefStep !== 2) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(briefText()); announce(tr('Brief copied. You choose where to share it.', 'सार कॉपी हुआ। कहाँ साझा करना है, आप तय करें।'), 'brief-status');
    } catch { announce(tr('Clipboard access is unavailable. Download the brief or select its text to copy manually.', 'क्लिपबोर्ड उपलब्ध नहीं है। सार डाउनलोड करें या टेक्स्ट चुनकर खुद कॉपी करें।'), 'brief-status'); }
  });
  $('brief-language')?.addEventListener('change', () => { if (state.briefStep === 2) setText('brief-preview', briefText()); });

  function renderFaq() {
    const list = $('faq-list'); if (!list) return;
    const open = new Set(Array.from(list.querySelectorAll('details[open]')).map(node => node.dataset.faq));
    const query = ($('faq-search')?.value || '').trim().toLocaleLowerCase();
    const rows = data.faqs.filter(row => Object.values(row.q).concat(Object.values(row.a)).join(' ').toLocaleLowerCase().includes(query));
    list.replaceChildren(...rows.map(row => {
      const details = el('details', 'faq-item'); details.dataset.faq = row.id; details.open = open.has(row.id);
      const summary = el('summary'); summary.append(el('span', '', text(row.q)), icon('plus')); details.append(summary, el('p', '', text(row.a))); return details;
    }));
    if ($('faq-empty')) $('faq-empty').hidden = rows.length !== 0;
  }
  $('faq-search')?.addEventListener('input', renderFaq);

  function closeMenu(returnFocus = false) { if ($('mobile-nav')) $('mobile-nav').hidden = true; $('menu-toggle')?.setAttribute('aria-expanded', 'false'); $('menu-toggle')?.setAttribute('aria-label', tr('Open menu', 'मेन्यू खोलें')); if (returnFocus) $('menu-toggle')?.focus(); }
  $('menu-toggle')?.addEventListener('click', () => { const menu = $('mobile-nav'); if (!menu) return; menu.hidden = !menu.hidden; $('menu-toggle').setAttribute('aria-expanded', String(!menu.hidden)); $('menu-toggle').setAttribute('aria-label', menu.hidden ? tr('Open menu', 'मेन्यू खोलें') : tr('Close menu', 'मेन्यू बंद करें')); });
  all('#mobile-nav a, #mobile-nav [data-open-brief]').forEach(node => node.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && $('mobile-nav') && !$('mobile-nav').hidden && !document.querySelector('dialog[open]')) closeMenu(true); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  function setLanguage(language) {
    state.language = language === 'hi' ? 'hi' : 'en'; document.documentElement.lang = state.language;
    try { localStorage.setItem('nirmanos-language', state.language); } catch { /* Language still works when storage is blocked. */ }
    all('[data-en][data-hi]').forEach(node => { node.textContent = node.dataset[state.language]; });
    all('[data-placeholder-en][data-placeholder-hi]').forEach(node => { node.placeholder = node.getAttribute('data-placeholder-' + state.language); });
    all('[data-label-en][data-label-hi]').forEach(node => { node.setAttribute('aria-label', node.getAttribute('data-label-' + state.language)); });
    all('[data-set-lang]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.setLang === state.language)));
    for (const [id, labels] of Object.entries({ 'business-tabs': ['Business types', 'कारोबार के प्रकार'], 'job-steps': ['Sample job progress', 'नमूना काम की प्रगति'], 'job-progressbar': ['Sample job completion', 'नमूना काम कितना पूरा हुआ'], 'mobile-nav': ['Mobile navigation', 'मोबाइल मेन्यू'] })) $(id)?.setAttribute('aria-label', tr(...labels));
    $('menu-toggle')?.setAttribute('aria-label', $('mobile-nav')?.hidden ? tr('Open menu', 'मेन्यू खोलें') : tr('Close menu', 'मेन्यू बंद करें'));
    all('[data-close-dialog]').forEach(node => node.setAttribute('aria-label', tr('Close dialog', 'विंडो बंद करें')));
    all('a[href^="privacy.html"]').forEach(node => { node.href = 'privacy.html?lang=' + state.language; });
    document.title = tr('NirmanOS — Businesses connected. Books kept clear.', 'NirmanOS — कारोबार जुड़े रहें। हिसाब साफ़ रहे।');
    renderBusinesses(); renderJob(); renderDiary(); populateBriefBusinesses(); renderBrief(); renderFaq(); if ($('evidence-dialog')?.open) renderEvidenceDialog();
    setText('brief-error', ''); setText('brief-status', ''); setText('demo-status', ''); setText('toast', '');
  }
  all('[data-set-lang]').forEach(node => node.addEventListener('click', () => setLanguage(node.dataset.setLang)));
  let language = 'en';
  try { const saved = localStorage.getItem('nirmanos-language'); if (['en', 'hi'].includes(saved)) language = saved; } catch { /* Optional preference. */ }
  const queryLanguage = new URLSearchParams(window.location.search).get('lang'); if (['en', 'hi'].includes(queryLanguage)) language = queryLanguage;
  setLanguage(language);
  function scrollProgress() { const bar = $('scroll-progress'); if (!bar) return; const max = document.documentElement.scrollHeight - window.innerHeight; bar.style.width = (max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0) + '%'; }
  window.addEventListener('scroll', scrollProgress, { passive: true }); window.addEventListener('resize', scrollProgress); scrollProgress();
}());
