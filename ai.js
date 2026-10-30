(function () {
  'use strict';
  const root = document.getElementById('ai-simulation');
  if (!root || root.dataset.aiReady === 'true') return;
  root.dataset.aiReady = 'true';
  const $ = id => root.querySelector('#' + id);
  const pick = (en, hi) => document.documentElement.lang === 'hi' ? hi : en;
  const locale = value => value[document.documentElement.lang === 'hi' ? 'hi' : 'en'];
  const t = (en, hi) => ({ en, hi });
  const scenarios = {
    bricks: {
      label: t('Bricks for a site', 'साइट के लिए ईंटें'), node: 'kiln',
      request: t('I need 10,000 bricks at my site tomorrow. Compare the offers and ask me before confirming.', 'कल साइट पर 10,000 ईंटें चाहिए। कोटेशन मिलाकर दिखाएँ और पक्का करने से पहले मुझसे पूछें।'),
      intent: t('10,000 bricks · site delivery · tomorrow', '10,000 ईंटें · साइट पर डिलीवरी · कल'),
      route: t('Brick-kiln agent selected for this requirement', 'इस ज़रूरत के लिए भट्ठे का एजेंट चुना'),
      comparison: t('Two fictional offers: ₹75,000 / ₹78,000', 'दो काल्पनिक कोटेशन: ₹75,000 / ₹78,000'),
      offer: t('Two sample offers for 10,000 bricks: ₹75,000 and ₹78,000. Grade, delivery terms and evidence still need the owner’s review.', '10,000 ईंटों के दो नमूना कोटेशन: ₹75,000 और ₹78,000। किस्म, डिलीवरी की शर्तों और सबूत की जाँच मालिक करेगा।'),
      approval: t('Pause · owner chooses the supplier and terms', 'रुकें · सप्लायर और शर्तें मालिक चुनेगा'),
    },
    machinery: {
      label: t('Machinery for a site', 'साइट के लिए मशीन'), node: 'rental',
      request: t('We need a JCB for four hours at the site tomorrow morning. Show the rates before booking.', 'कल सुबह साइट पर चार घंटे के लिए JCB चाहिए। बुकिंग से पहले दरें दिखाएँ।'),
      intent: t('JCB · four hours · tomorrow morning', 'JCB · चार घंटे · कल सुबह'),
      route: t('Machinery-rental agent selected', 'मशीन किराये का एजेंट चुना'),
      comparison: t('Two fictional offers: ₹6,000 / ₹6,400', 'दो काल्पनिक कोटेशन: ₹6,000 / ₹6,400'),
      offer: t('Four sample hours: ₹6,000 at ₹1,500/hour or ₹6,400 at ₹1,600/hour. The time slot and working terms need confirmation.', 'चार नमूना घंटे: ₹1,500 प्रति घंटे पर ₹6,000 या ₹1,600 प्रति घंटे पर ₹6,400। समय और काम की शर्तों की पुष्टि बाकी है।'),
      approval: t('Pause · no booking without owner approval', 'रुकें · मालिक की मंज़ूरी के बिना बुकिंग नहीं'),
    },
    supplies: {
      label: t('Supplies for a kiln', 'भट्ठे के लिए सामान'), node: 'shop',
      request: t('The kiln needs 10 tirpal sheets and 20 pairs of gloves. Compare delivery quotes for me.', 'भट्ठे पर 10 तिरपाल और 20 जोड़ी दस्ताने चाहिए। डिलीवरी के कोटेशन मिलाकर दिखाएँ।'),
      intent: t('10 tirpal sheets · 20 glove pairs · delivery', '10 तिरपाल · 20 जोड़ी दस्ताने · डिलीवरी'),
      route: t('Construction-shop agent selected', 'निर्माण सामग्री की दुकान का एजेंट चुना'),
      comparison: t('Two fictional offers: ₹13,600 / ₹14,100', 'दो काल्पनिक कोटेशन: ₹13,600 / ₹14,100'),
      offer: t('Two sample totals: ₹13,600 and ₹14,100 for the same quantities. Review sizes, safety specifications and delivery before choosing.', 'एक जैसी मात्रा के दो नमूना कुल: ₹13,600 और ₹14,100। चुनने से पहले आकार, सुरक्षा की जानकारी और डिलीवरी जाँचें।'),
      approval: t('Pause · stock and purchase need confirmation', 'रुकें · स्टॉक और खरीद की पुष्टि बाकी है'),
    },
  };
  const stages = [
    { code: 'intent.extract', label: t('Understand the request', 'ज़रूरत समझना'), queued: t('Read the sample requirement', 'नमूना ज़रूरत पढ़ना'), field: 'intent' },
    { code: 'directory.match', label: t('Route to the right business agent', 'सही कारोबार के एजेंट तक पहुँचाना'), queued: t('Select the relevant business type', 'संबंधित कारोबार का प्रकार चुनना'), field: 'route' },
    { code: 'a2a.request', label: t('Compare sample offers', 'नमूना कोटेशन मिलाना'), queued: t('Review two fictional offers', 'दो काल्पनिक कोटेशन देखना'), field: 'comparison' },
    { code: 'policy.approval', label: t('Pause for owner approval', 'मालिक की मंज़ूरी के लिए रुकना'), queued: t('Keep the final decision with the owner', 'आखिरी फैसला मालिक के पास रखना'), field: 'approval' },
  ];
  const nodeLabels = {
    owner: t('Owner', 'मालिक'), orchestrator: t('NirmanOS', 'NirmanOS'),
    kiln: t('Kiln agent', 'भट्ठा एजेंट'), rental: t('Rental agent', 'किराया एजेंट'), shop: t('Shop agent', 'दुकान एजेंट'),
  };
  const state = { scenario: 'bricks', stage: -1, phase: 'idle' };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer = null, runVersion = 0;
  function setText(id, value) { const node = $(id); if (node) node.textContent = value; }
  function cancelTimers() { runVersion += 1; if (timer !== null) window.clearTimeout(timer); timer = null; }
  function renderNetwork() {
    const selected = scenarios[state.scenario].node;
    let active = 'none';
    if (state.phase === 'running') active = state.stage === 0 ? 'orchestrator' : selected;
    if (state.phase === 'approval') active = 'approval';
    if ($('ai-network')) $('ai-network').dataset.aiActive = active;
    root.querySelectorAll('[data-ai-node]').forEach(node => {
      const id = node.dataset.aiNode; let status = 'idle';
      if (state.phase !== 'idle') {
        if (id === 'owner') status = state.phase === 'approval' ? 'waiting' : 'complete';
        if (id === 'orchestrator') status = state.stage === 0 ? 'active' : 'complete';
        if (id === selected && state.stage >= 1) status = state.phase === 'approval' ? 'complete' : 'active';
      }
      node.dataset.state = status;
      for (const name of ['active', 'complete', 'waiting']) node.classList.toggle('is-' + name, status === name);
      const label = node.querySelector('[data-ai-node-label]'); if (label && nodeLabels[id]) label.textContent = locale(nodeLabels[id]);
    });
  }
  function renderLog() {
    const log = $('ai-log'); if (!log) return;
    const scenario = scenarios[state.scenario];
    // Four fixed rows keep the card still while the presentation advances.
    if (log.children.length !== stages.length) {
      log.replaceChildren(...stages.map((stage, index) => {
        const line = document.createElement('li'); line.className = 'ai-log-line'; line.dataset.aiStage = String(index);
        const code = document.createElement('code'); code.className = 'ai-log-code'; code.textContent = stage.code;
        const detail = document.createElement('span'); detail.className = 'ai-log-detail'; line.append(code, detail); return line;
      }));
    }
    Array.from(log.children).forEach((line, index) => {
      const reached = index <= state.stage;
      const status = !reached ? 'queued' : index === 3 && state.phase === 'approval' ? 'waiting' : index === state.stage ? 'active' : 'complete';
      line.dataset.state = status;
      for (const name of ['active', 'complete', 'waiting']) line.classList.toggle('is-' + name, status === name);
      line.querySelector('.ai-log-detail').textContent = reached ? locale(scenario[stages[index].field]) : locale(stages[index].queued);
      if (reached && index === state.stage) line.setAttribute('aria-current', 'step'); else line.removeAttribute('aria-current');
    });
  }
  function render() {
    root.dataset.phase = state.phase; root.dataset.state = state.phase === 'approval' ? 'awaiting_approval' : state.phase;
    root.dataset.scenario = state.scenario; root.dataset.stage = String(state.stage);
    root.setAttribute('aria-label', pick('Interactive AI orchestration simulation', 'AI समन्वय का इंटरैक्टिव नमूना'));
    if ($('ai-scenarios')) $('ai-scenarios').setAttribute('aria-label', pick('Choose a sample requirement', 'नमूना ज़रूरत चुनें'));
    root.querySelectorAll('[data-ai-scenario]').forEach(chip => {
      const id = chip.dataset.aiScenario, scenario = scenarios[id]; if (!scenario) return;
      chip.setAttribute('aria-pressed', String(id === state.scenario)); chip.classList.toggle('is-active', id === state.scenario);
      const label = chip.querySelector('[data-ai-chip-label]') || chip; label.textContent = locale(scenario.label);
    });
    setText('ai-request', locale(scenarios[state.scenario].request));
    setText('ai-stage-label', state.stage < 0 ? pick('From one request to a reviewed decision', 'एक ज़रूरत से जाँचे हुए फैसले तक') : locale(stages[state.stage].label));
    const run = $('ai-run');
    if (run) {
      run.disabled = state.phase === 'running';
      const label = run.querySelector('[data-ai-run-label]') || run;
      label.textContent = state.phase === 'running' ? pick('Running simulation…', 'नमूना चल रहा है…') : state.phase === 'approval' ? pick('Replay simulation', 'नमूना फिर चलाएँ') : pick('Run simulation', 'नमूना चलाएँ');
    }
    const reset = $('ai-reset'); if (reset) { reset.disabled = state.phase === 'idle'; reset.setAttribute('aria-label', pick('Reset the AI simulation', 'AI नमूना रीसेट करें')); const label = reset.querySelector('[data-ai-reset-label]') || reset; label.textContent = pick('Reset', 'रीसेट'); }
    setText('ai-status', state.phase === 'idle' ? pick('Ready when you are.', 'जब चाहें, शुरू करें।') : state.phase === 'approval' ? pick('Paused for owner approval. No order sent.', 'मालिक की मंज़ूरी पर रुका है। कोई ऑर्डर नहीं भेजा।') : locale(stages[state.stage].label) + '…');
    const result = $('ai-result'); if (result) result.hidden = state.stage < 2;
    setText('ai-result-title', state.phase === 'approval' ? pick('Your approval is the next step.', 'अगला कदम आपकी मंज़ूरी है।') : pick('Two sample offers. One informed decision.', 'दो नमूना कोटेशन। सोच-समझकर एक फैसला।'));
    setText('ai-result-body', locale(scenarios[state.scenario].offer));
    setText('ai-approval-badge', state.phase === 'approval' ? pick('Awaiting owner approval', 'मालिक की मंज़ूरी बाकी') : pick('Not approved', 'मंज़ूरी नहीं हुई'));
    renderLog(); renderNetwork();
  }
  function reset(scenario = state.scenario) {
    cancelTimers(); state.scenario = scenario; state.stage = -1; state.phase = 'idle'; render();
  }
  function finishWithoutMotion() { cancelTimers(); state.stage = 3; state.phase = 'approval'; render(); }
  function run() {
    if (state.phase === 'running') return;
    cancelTimers(); state.stage = 0; state.phase = 'running';
    if (reducedMotion.matches) { finishWithoutMotion(); return; }
    render();
    const version = runVersion;
    // These are presentation delays for fixed fixtures, never service latency.
    const durations = [800, 1050, 1250];
    function advance() {
      if (version !== runVersion || state.phase !== 'running') return;
      state.stage += 1;
      if (state.stage === 3) { timer = null; state.phase = 'approval'; render(); return; }
      render(); timer = window.setTimeout(advance, durations[state.stage]);
    }
    timer = window.setTimeout(advance, durations[0]);
  }
  $('ai-run')?.addEventListener('click', run);
  $('ai-reset')?.addEventListener('click', () => reset());
  const chips = Array.from(root.querySelectorAll('[data-ai-scenario]')).filter(chip => scenarios[chip.dataset.aiScenario]);
  chips.forEach((chip, index) => {
    chip.addEventListener('click', () => reset(chip.dataset.aiScenario));
    chip.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % chips.length;
      if (event.key === 'ArrowLeft') next = (index + chips.length - 1) % chips.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = chips.length - 1;
      if (next !== undefined) { event.preventDefault(); reset(chips[next].dataset.aiScenario); chips[next].focus(); }
    });
  });
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  reducedMotion.addEventListener('change', event => { if (event.matches && state.phase === 'running') finishWithoutMotion(); });
  window.addEventListener('pagehide', () => { if (state.phase === 'running') reset(); else cancelTimers(); });
  render();
}());
