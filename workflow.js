(() => {
  'use strict';
  const scenes=window.NirmanWorkflowScenes||[], player=document.querySelector('#workflow-player');
  if(!player||scenes.length!==8)return;
  const $=id=>document.getElementById(id), checks=[
    ['known_sender','क्या भेजने वाला पहचान का है?','Do I know this sender?'],
    ['signature','क्या हस्ताक्षर सही हैं?','Is the signature valid?'],
    ['recipient','क्या यह संदेश मेरे लिए है?','Is it addressed to me?'],
    ['duplicate','क्या यही संदेश पहले आया है?','Have I seen this exact message?'],
    ['expiry','क्या संदेश की समयसीमा बाकी है?','Has it expired?'],
    ['permission','क्या इस भेजने वाले को अनुमति है?','Is this sender allowed to do this?'],
    ['state','क्या ऑर्डर की अवस्था इसकी अनुमति देती है?','Does the order state allow it now?']
  ];
  let state={mode:'main',index:0,playing:false,check:0,timer:null};
  const lang=()=>document.documentElement.lang==='en'?'en':'hi';
  const stext=(en,hi)=>lang()==='en'?en:hi;
  const chapters=$('wf-chapters');
  scenes.forEach((scene,i)=>{const b=document.createElement('button');b.type='button';b.className='wf-control';b.dataset.chapter=i;b.textContent=`${String(i+1).padStart(2,'0')} · ${lang()==='hi'?scene.title.hi:scene.title.en}`;b.setAttribute('aria-current',i===0?'step':'false');b.addEventListener('click',()=>seek(i));chapters.append(b)});
  function stop(){if(state.timer){clearTimeout(state.timer);state.timer=null}state.playing=false;player.dataset.playing='false'}
  function makeRow(side,label,ref,amount){const row=document.createElement('div');row.className='wf-row';row.dataset.entry=ref;const a=document.createElement('span'),b=document.createElement('span');a.textContent=label;b.textContent=amount;row.append(a,b);return row}
  const say=x=>x?(lang()==='en'?x.en:x.hi):'';
  function getLedger(mode,index){const upto=mode==='forged'?0:index,a=[],b=[];
    scenes.slice(0,upto+1).forEach(s=>{if(s.bookA)a.push({label:say(s.bookA[0]),amount:say(s.bookA[1])});if(s.bookB)b.push({label:say(s.bookB[0]),amount:say(s.bookB[1])})});
    if(mode==='mismatch'&&a.length){a[a.length-1]={label:stext('Site count · 48','साइट पर गिनती · 48'),amount:stext('2 bags differ','2 बोरी का अंतर')}}
    return {a,b,due:say(scenes[upto].due)};
  }
  const QUIET_SEEN='इस बार यहाँ कोई संदेश नहीं आया।';
  function chatFor(side){const scene=scenes[state.index];
    if(state.mode==='forged')return side==='a'?[['quiet','नकली संदेश रोक दिया गया। फ़ोन पर कोई भाव नहीं आया।']]:[['quiet',QUIET_SEEN]];
    if(state.mode==='duplicate')return side==='b'?[['quiet','वही ऑर्डर दोबारा आया। सप्लायर से दोबारा नहीं पूछा गया।']]:[['quiet',QUIET_SEEN]];
    if(state.mode==='mismatch')return side==='a'?[['me','48'],['bot','गिनती अलग है: साइट 48, डिलीवरी 50। ठेकेदार को दिखाया।']]:[['quiet','इस चरण में यहाँ कोई संदेश नहीं।']];
    return side==='a'?scene.a:scene.b}
  const CHAT_CLASS={me:'wf-human',bot:'wf-agent',quiet:'wf-quiet'};
  function renderChat(node,side){node.replaceChildren();chatFor(side).forEach(([kind,text])=>{const m=document.createElement('div');m.className='wf-bubble '+CHAT_CLASS[kind];m.textContent=text;node.append(m)});node.scrollTop=node.scrollHeight}
  function localizeUI(){const en=lang()==='en',set=(selector,hi,english)=>{const node=document.querySelector(selector);if(node)node.textContent=en?english:hi};
    const back=document.querySelector('.wf-back');if(back){back.textContent=en?'← Business overview':'← कारोबार की बात';back.href='index.html?lang='+lang()}set('.wf-meta','नमूना · रामपुर · 50 बोरी सीमेंट · कोई लाइव संदेश नहीं','Sample · Rampur · 50 cement bags · No live messages');
    set('main>.eyebrow','काम की कहानी · काल्पनिक उदाहरण','HOW IT WORKS · ILLUSTRATIVE EXAMPLE');
    set('#wf-contractor h2','कारोबार A · ठेकेदार','Business A · Contractor');set('#wf-supplier h2','कारोबार B · सप्लायर','Business B · Supplier');
    document.querySelectorAll('.wf-key').forEach(n=>n.textContent=en?'🔑 Own signing key':'🔑 अपनी साइनिंग कुंजी');
    set('#wf-a-phase','अपनी बही · इस कारोबार के पास','Own book · held by this business');document.title=en?'One order, two businesses · NirmanOS':'एक ऑर्डर, दो कारोबार · NirmanOS';set('#wf-b-phase','अपनी बही · इस कारोबार के पास','Own book · held by this business');
    set('#wf-contractor .wf-book h3','ठेकेदार की अपनी बही','Contractor’s own book');set('#wf-supplier .wf-book h3','सप्लायर की अपनी बही','Supplier’s own book');
    document.querySelectorAll('.wf-due').forEach(n=>{if(n.firstChild)n.firstChild.nodeValue=en?'Due: ':'बाकी: '});
    set('.wf-bridge strong','कारोबारों के बीच','Between businesses');const nav=document.querySelector('#wf-chapters');if(nav)nav.setAttribute('aria-label',en?'Story chapters':'कहानी के चरण');
    set('#wf-prev','← पीछे','← Previous');set('#wf-next','अगला →','Next →');set('#wf-replay','फिर से शुरू','Restart');
    const speed=document.querySelector('label[for="wf-speed"]');if(speed)speed.textContent=en?'Speed':'गति';
    const options=document.querySelectorAll('#wf-speed option');if(options.length===3){options[0].textContent=en?'Slow':'धीमी';options[1].textContent=en?'Normal':'सामान्य';options[2].textContent=en?'Fast':'तेज़'}
    const branchLabels={main:['पूरा ऑर्डर','Full order'],forged:['गलत हस्ताक्षर','Invalid signature'],duplicate:['वही संदेश दोबारा','Duplicate message'],mismatch:['गिनती में अंतर','Count mismatch']};
    document.querySelectorAll('[data-wf-mode]').forEach(b=>b.textContent=branchLabels[b.dataset.wfMode]?.[en?1:0]||b.textContent);
    const branch=document.querySelector('#wf-branches > strong');if(branch)branch.textContent=en?'Show a case:':'अलग से दिखाएँ:';
    const detail=document.querySelector('.wf-details');if(detail){detail.querySelector('summary').textContent=en?'What happens inside each business?':'हर कारोबार के अंदर क्या होता है?';const ps=detail.querySelectorAll('p');if(ps[0])ps[0].textContent=en?'Code checks identity, permissions, order state and amounts. AI helps interpret voice, photos and text. A person reviews and says yes or no. AI does not write to the books.':'कोड भेजने वाले की पहचान, अनुमति, ऑर्डर की स्थिति और रकम जाँचता है। AI आवाज़, फोटो और लिखी बात समझकर सुझाव देता है। व्यक्ति जाँचकर हाँ या नहीं कहता है। AI बही में नहीं लिखता।';if(ps[1])ps[1].textContent=en?'The receiving business checks sender identity, signature, recipient, repeat delivery, expiry, permission and valid order state—in that order. Only then can code append to that business’s own book.':'दूसरी ओर कोड सात बातें इसी क्रम में जाँचता है: भेजने वाले की पहचान, हस्ताक्षर, किसको भेजा, पहले देखा गया है या नहीं, समयसीमा, अनुमति और ऑर्डर की सही अवस्था। जाँच पास होने पर ही उस कारोबार की बही में एंट्री होती है।';const lis=detail.querySelectorAll('li');const lines={en:['Code verifies the WhatsApp signature.','Code identifies the user’s role from their phone number.','AI transcribes voice into text.','AI helps read document photos.','AI suggests a permitted next step.','Code checks amounts, quantity, date and order state.','The person reviews the readback and chooses yes or no.','Each business appends a new entry to its own book.','Code signs with that business’s own key.'],hi:['WhatsApp के सिग्नेचर की कोड से जाँच।','फोन नंबर से भूमिका की पहचान; AI नहीं करता।','AI आवाज़ को लिखे शब्दों में बदलता है।','AI फोटो में कागज़ और रकम पहचानने में मदद करता है।','AI अनुमति वाले छोटे कदमों में से सुझाव देता है।','कोड रकम, मात्रा, तारीख और ऑर्डर की स्थिति जाँचता है।','व्यक्ति को पढ़कर सुनाया/दिखाया जाता है; हाँ या नहीं व्यक्ति कहता है।','हर कारोबार अपनी बही में नई एंट्री जोड़ता है।','कोड अपने कारोबार की कुंजी से हस्ताक्षर करता है।']};lis.forEach((n,i)=>{n.textContent=lines[en?'en':'hi'][i]})}
    const note=document.querySelector('.wf-note');if(note)note.textContent=en?'WhatsApp dialogue remains in Hindi. Signatures and receipts are illustrative: this page sends no messages, writes no real ledger and confirms no bank payment. A later record is added instead of changing an earlier ledger entry.':'WhatsApp के संवाद हिंदी में हैं। हस्ताक्षर और रसीद इस एनिमेशन के उदाहरण हैं; यह वेबसाइट संदेश नहीं भेजती, किसी वास्तविक बही में नहीं लिखती और बैंक भुगतान की पुष्टि नहीं करती। पुरानी बही की एंट्री बदलने के बजाय अगला रिकॉर्ड जोड़ा जाता है।';
    const technicalLink=document.querySelector('main>p[style*="margin-top"] a');if(technicalLink){technicalLink.textContent=en?'NirmanOS technology and FAQs →':'NirmanOS तकनीक और सवाल →';technicalLink.href='technical.html?lang='+lang()}
  }
  function render(){const scene=scenes[state.index], incoming=scene.kind==='signed';player.dataset.mode=state.mode;player.dataset.frame=String(state.index);player.dataset.playing=String(state.playing);player.dataset.direction=state.mode==='forged'?'a-to-b':scene.direction;player.dataset.check=String(state.check);
    document.querySelectorAll('[data-en][data-hi]').forEach(node=>{node.textContent=lang()==='en'?node.dataset.en:node.dataset.hi});
    localizeUI();
    $('wf-lang').textContent=lang()==='hi'?'English':'हिन्दी';
    $('wf-caption-title').textContent=lang()==='hi'?scene.title.hi:scene.title.en;
    let body=say(scene.body);const ownerNodes=document.querySelectorAll('.wf-owner');if(ownerNodes[0])ownerNodes[0].textContent=say(scene.ownerA);if(ownerNodes[1])ownerNodes[1].textContent=say(scene.ownerB);if(scene.note&&state.mode==='main')$('wf-a-phase').textContent=say(scene.note);
    if(state.mode==='forged')body=stext('Someone sends a fake rate in the supplier’s name. The contractor’s agent knows that sender, but the signature is wrong. Only an unsigned error goes back; no book changes and no fake rate reaches anyone’s phone.', 'कोई सप्लायर के नाम से नकली भाव भेजता है। ठेकेदार का एजेंट उस नाम को पहचानता है, पर हस्ताक्षर गलत हैं। सिर्फ़ बिना हस्ताक्षर की त्रुटि लौटती है; कोई बही नहीं बदलती और नकली भाव किसी के फ़ोन तक नहीं पहुँचता।');
    if(state.mode==='duplicate')body=stext('The same signed order arrives again, for example after a network retry. The supplier’s agent returns the same receipt. Nothing new is written and the supplier is not asked again.', 'वही हस्ताक्षरित ऑर्डर दोबारा आता है, जैसे नेटवर्क की वजह से। सप्लायर का एजेंट वही रसीद लौटाता है। कुछ नया नहीं लिखा जाता और सप्लायर से दोबारा नहीं पूछा जाता।');
    if(state.mode==='mismatch')body=stext('The delivery says 50; the site counted 48. Code finds the difference. AI explains the two bags in plain words, using only figures code has checked. It does not say who is right; the contractor decides.', 'डिलीवरी में 50, साइट की गिनती में 48। कोड अंतर पकड़ता है। AI सिर्फ़ जाँचे हुए आँकड़ों से दो बोरी का अंतर सरल शब्दों में समझाता है। कौन सही है, यह नहीं कहता; फैसला ठेकेदार करेगा।');
    $('wf-caption-body').textContent=body;$('wf-a-chat').setAttribute('aria-live','off');$('wf-b-chat').setAttribute('aria-live','off');renderChat($('wf-a-chat'),'a');renderChat($('wf-b-chat'),'b');
    const receiver=scene.direction==='a-to-b'?'b':'a';const message=state.mode==='forged'?stext('Fake message · wrong signature','नकली संदेश · गलत हस्ताक्षर'):state.mode==='duplicate'?stext('The same signed order, again','वही हस्ताक्षरित ऑर्डर, दोबारा'):state.mode==='mismatch'?stext('No message between the two books','दोनों बहियों के बीच कोई संदेश नहीं'):say(scene.envelope);
    $('wf-envelope').textContent=message;$('wf-envelope').dataset.moving=String(state.playing&&incoming);
    $('wf-receipt').textContent=state.mode==='forged'?stext('No receipt · unsigned error · no book changed','रसीद नहीं · बिना हस्ताक्षर की त्रुटि · कोई बही नहीं बदली'):state.mode==='duplicate'?stext('Same receipt · nothing new written','वही रसीद · कुछ नया नहीं लिखा गया'):state.mode==='mismatch'?stext('Held · the contractor decides','रुका · फैसला ठेकेदार करेगा'):scene.kind==='local'?stext('This stays in the contractor’s book','यह जानकारी ठेकेदार की बही में रहती है'):state.check>=7?stext('Signed receipt · sample','हस्ताक्षरित रसीद · नमूना'):stext('Receiver’s checks running','पाने वाले एजेंट की जाँच चल रही है');
    const activeSide=state.mode==='forged'?'a':state.mode==='mismatch'?'a':receiver;$('wf-contractor').dataset.active=String(activeSide==='a');$('wf-supplier').dataset.active=String(activeSide==='b');
    $('wf-a-ledger').replaceChildren(...getLedger(state.mode,state.index).a.map(x=>makeRow('a',x.label,x.label,x.amount)));$('wf-b-ledger').replaceChildren(...getLedger(state.mode,state.index).b.map(x=>makeRow('b',x.label,x.label,x.amount)));
    const due=getLedger(state.mode,state.index).due;$('wf-a-due').textContent=due;$('wf-b-due').textContent=due;
    const list=$('wf-checks');list.replaceChildren();const step=(text,st)=>{const e=document.createElement('span');e.className='wf-step';e.dataset.state=st;e.textContent=text+(st==='passed'?' ✓':st==='failed'?' ✗':'');list.append(e)};const q=(c,i)=>`${i+1} ${lang()==='hi'?c[1]:c[2]}`;
    if(state.mode==='forged'){step(q(checks[0],0),'passed');step(q(checks[1],1),'failed')}
    else if(state.mode==='duplicate'){checks.slice(0,3).forEach((c,i)=>step(q(c,i),'passed'));step(q(checks[3],3)+stext(' Yes: same receipt',' हाँ: वही रसीद'),'passed')}
    else if(state.mode==='mismatch'){step(stext('Delivery · 50','डिलीवरी · 50'),'passed');step(stext('Site · 48','साइट · 48'),'passed');step(stext('Difference · 2 bags','अंतर · 2 बोरी'),'failed')}
    else if(incoming)checks.forEach((c,i)=>step(q(c,i),i<state.check?'passed':i===state.check&&state.playing?'active':'queued'));
    else step(stext('Stays inside · no message out','अंदर ही · बाहर कोई संदेश नहीं'),'passed');
    chapters.querySelectorAll('button').forEach((b,i)=>{if(i===state.index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');b.textContent=`${String(i+1).padStart(2,'0')} · ${lang()==='hi'?scenes[i].title.hi:scenes[i].title.en}`});
    const p=Math.round((state.index+(state.check/7))/8*100);$('wf-progress').style.width=p+'%';document.querySelector('.wf-track').setAttribute('aria-valuenow',String(p));
    $('wf-play').textContent=state.playing?(lang()==='hi'?'रोकें':'Pause'):(state.index===7&&state.check>=7?(lang()==='hi'?'फिर चलाएँ':'Replay'):(lang()==='hi'?'चलाएँ':'Play'));
    $('wf-prev').disabled=state.playing||state.index===0;$('wf-next').disabled=state.playing||state.index===7;$('wf-status').textContent=state.mode==='main'?(state.playing?(lang()==='hi'?'चल रहा है · संदेश, जाँच और अगली एंट्री':'Playing · message, checks and next entry'):(lang()==='hi'?`रुका हुआ · चरण ${state.index+1} / 8 · पढ़ने के लिए रुका रखें`:`Paused · chapter ${state.index+1} / 8 · pause to read`)):(lang()==='hi'?'शाखा डेमो · नमूना डेटा':'Branch demo · sample data');
  }
  function start(){if(state.playing){stop();render();return}if(state.mode!=='main'){state.mode='main';state.index=0;state.check=0;document.querySelectorAll('[data-wf-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.wfMode==='main')))}else if(state.index===7&&state.check>=7){state.index=0;state.check=0}state.playing=true;player.dataset.playing='true';render();advance()}
  function advance(){if(!state.playing)return;const scene=scenes[state.index];if(scene.kind==='signed'&&state.mode==='main'&&state.check<7){state.check++;render();state.timer=setTimeout(advance,Math.round(850/Number($('wf-speed').value)))}else if(state.index<7){state.index++;state.check=0;render();state.timer=setTimeout(advance,Math.round(4400/Number($('wf-speed').value)))}else{stop();state.check=7;render()}}
  function seek(i,fresh){stop();state.index=Math.max(0,Math.min(7,i));state.check=fresh?0:7;state.mode='main';document.querySelectorAll('[data-wf-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.wfMode==='main')));player.dataset.mode='main';render()}
  $('wf-play').addEventListener('click',start);$('wf-prev').addEventListener('click',()=>seek(state.index-1));$('wf-next').addEventListener('click',()=>seek(state.index+1));$('wf-replay').addEventListener('click',()=>seek(0,true));$('wf-speed').addEventListener('change',()=>{});
  document.querySelectorAll('[data-wf-mode]').forEach(button=>button.addEventListener('click',()=>{stop();state.check=0;state.mode=button.dataset.wfMode;state.index=state.mode==='main'?0:state.mode==='mismatch'?3:state.mode==='duplicate'?0:1;document.querySelectorAll('[data-wf-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render()}));
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.playing){stop();render()}});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.playing){stop();render()}});
  const params=new URLSearchParams(location.search);let saved='hi';try{saved=localStorage.getItem('nirmanos-language')||'hi'}catch{}
  document.documentElement.lang=params.get('lang')||saved;
  $('wf-lang').addEventListener('click',()=>{const next=lang()==='hi'?'en':'hi';document.documentElement.lang=next;const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(null,'',url);try{localStorage.setItem('nirmanos-language',next)}catch{};render()});
  render();
})();
