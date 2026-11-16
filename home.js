/* Homepage: language switch and the step-by-step demo. Source: the root index.html preview. */
(function(){
  var root=document.documentElement, hi=document.getElementById('lang-hi'), en=document.getElementById('lang-en');
  // The other pages save the choice as 'nirmanos-language'; the preview used 'nirmanos-lang'. Read both, save the shared one.
  function save(l){ try{localStorage.setItem('nirmanos-language',l);}catch(e){} }
  function setLang(l, remember){ if(l==='en') root.setAttribute('data-lang','en'); else root.removeAttribute('data-lang');
    root.lang=l; hi.setAttribute('aria-pressed', String(l!=='en')); en.setAttribute('aria-pressed', String(l==='en'));
    if(remember!==false) save(l);
    // Carry the language to the other pages, as they do between themselves.
    [].forEach.call(document.querySelectorAll('a[href$=".html"],a[href*=".html?"],a[href*=".html#"]'),function(a){
      var href=a.getAttribute('href'); if(/^[a-z]+:/i.test(href)) return;
      var hash=href.split('#')[1], page=href.split('#')[0].split('?')[0];
      a.setAttribute('href', page+'?lang='+l+(hash?'#'+hash:''));
    });
  }
  var saved=null; try{saved=localStorage.getItem('nirmanos-language')||localStorage.getItem('nirmanos-lang');}catch(e){}
  var q=/[?&]lang=(en|hi)/.exec(location.search||''); setLang(q?q[1]:(saved==='en'?'en':'hi'));
  hi.addEventListener('click',function(){setLang('hi');}); en.addEventListener('click',function(){setLang('en');});

  var items=[].slice.call(document.querySelectorAll('#demo [data-s]')), btn=document.getElementById('replay'), timer=null;
  function show(n){ items.forEach(function(el){ el.classList.toggle('off', Number(el.getAttribute('data-s'))>n); }); }
  btn.addEventListener('click',function(){
    clearInterval(timer); var n=0; show(0);
    timer=setInterval(function(){ n++; show(n); if(n>=5) clearInterval(timer); }, 1300);
  });
})();
