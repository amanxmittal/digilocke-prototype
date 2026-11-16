
/* ---- Icon set (stroke) ---- */
const ICON = {
 home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
 cards:'<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10.5h18"/>',
 scan:'<path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M4 12h16"/>',
 activity:'<path d="M3 12h4l2 6 4-15 2 9h6"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>',
 share:'<circle cx="6" cy="12" r="2.4"/><circle cx="17" cy="6" r="2.4"/><circle cx="17" cy="18" r="2.4"/><path d="M8.2 11 14.8 7M8.2 13l6.6 4"/>',
 shield:'<path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
 check:'<path d="m5 12 4 4 10-10"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
 bell:'<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/>',
 spark:'<path d="M12 3v6M12 15v6M3 12h6M15 12h6"/><path d="m6.5 6.5 1.6 1.6M15.9 15.9l1.6 1.6M17.5 6.5l-1.6 1.6M8.1 15.9l-1.6 1.6"/>',
 qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M14 21h3M21 17v4"/>',
 doc:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
 health:'<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>',
 drive:'<path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>',
 pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m14 6 4 4"/>',
 key:'<circle cx="8" cy="14" r="4"/><path d="m11 11 9-9M16 6l3 3M18 4l2 2"/>',
 family:'<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3 20c0-3 2.4-5 5-5s5 2 5 5M14 19c.4-2 1.9-3.5 3.4-3.5"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/>',
 chev:'<path d="m9 6 6 6-6 6"/>',
 back:'<path d="m15 5-7 7 7 7"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 fp:'<path d="M12 4a8 8 0 0 1 8 8M5 16c-.5-1.2-1-2.5-1-4a8 8 0 0 1 4-7M8 19a13 13 0 0 1-1-7 5 5 0 0 1 10 0c0 1 0 2 .2 3M12 12v3c0 1 .3 2 .6 3"/>',
 lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 phone:'<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
 dl:'<path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 star:'<path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19l1-5.8L3.5 9.2l5.9-.8z"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
 car:'<path d="M5 16v2M19 16v2M3 13l2-5h14l2 5v3H3z"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/>',
 grad:'<path d="M3 9l9-4 9 4-9 4z"/><path d="M7 11v5c0 1 2.2 2.5 5 2.5s5-1.5 5-2.5v-5M21 9v5"/>',
 lang:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15 0 18M12 3c-2.5 2.6-2.5 15 0 18"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2.3-1.3L13.5 2h-3l-.5 2.2A7 7 0 0 0 7.7 5.5l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2.3 1.3l.5 2.2h3l.5-2.2a7 7 0 0 0 2.3-1.3l2.3 1 2-3.4-2-1.5c.1-.4.1-.9.1-1.3z"/>',
 logout:'<path d="M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/><path d="m15 16 4-4-4-4M19 12H9"/>',
 filter:'<path d="M3 5h18M6 12h12M10 19h4"/>',
 bolt:'<path d="M13 3 4 14h6l-1 7 9-11h-6z"/>',
 map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
 building:'<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
 copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>'
};
function svg(n,c){return '<svg class="ic '+(c||'')+'" viewBox="0 0 24 24" aria-hidden="true">'+(ICON[n]||'')+'</svg>';}
window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-ic]').forEach(e=>{e.innerHTML=svg(e.dataset.ic,e.dataset.icc||'')+e.innerHTML;});
  // live clock
  const c=document.querySelector('[data-clock]');
  if(c){const d=new Date();c.textContent=d.getHours()+':'+String(d.getMinutes()).padStart(2,'0');}
});
/* navigate to another screen file (works standalone & inside review iframes) */
function nav(file){location.href=file;}
/* toast */
function toast(msg,ic){let t=document.querySelector('.toast');
  if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.querySelector('.screen').appendChild(t);}
  t.innerHTML=svg(ic||'check')+'<span>'+msg+'</span>';t.classList.add('show');
  if(navigator.vibrate)navigator.vibrate(15);
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400);}
/* accessibility widget */
function setText(s,el){document.documentElement.setAttribute('data-textscale',s);
  el.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('on'));el.classList.add('on');}
function toggleContrast(el){const r=document.documentElement;
  const on=r.getAttribute('data-contrast')==='high';r.setAttribute('data-contrast',on?'normal':'high');}
function pin(el){el.classList.toggle('on'); if(el.classList.contains('switch')) el.setAttribute('aria-checked', el.classList.contains('on')?'true':'false');}
function tab(el){el.parentNode.querySelectorAll('button,a').forEach(b=>b.classList&&b.classList.remove('on'));el.classList.add('on');}

/* ---- Easy Mode: real text-to-speech + listen simulation ---- */
Object.assign(ICON,{
 speaker:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a4 4 0 0 1 0 7"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 0 1 4.6 1.3c0 1.7-2.4 2-2.4 3.5"/><path d="M12 17.5h.01"/>',
 play:'<path d="M8 5v14l11-7z"/>',
 phone2:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l2 5v3a1 1 0 0 1-1 1A17 17 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
 folder:'<path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>',
 file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
 camera:'<path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L18 6h0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a0 0 0 0 1 0 0z"/><circle cx="12" cy="13" r="3.2"/>',
 image:'<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m5 17 4-4 3 3 3-3 4 4"/>',
 trash:'<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13"/>',
 dots:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
 upload:'<path d="M12 20V9m0 0 4 4m-4-4-4 4M5 5h14"/>',
 link:'<path d="M9 15a3 3 0 0 1 0-4l3-3a3 3 0 0 1 4 4l-1 1M15 9a3 3 0 0 1 0 4l-3 3a3 3 0 0 1-4-4l1-1"/>',
 hospital:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 7v6M9 10h6"/>',
 sliders:'<path d="M4 8h10M18 8h2M4 16h2M10 16h10"/><circle cx="16" cy="8" r="2"/><circle cx="8" cy="16" r="2"/>',
 calendar:'<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
 move:'<path d="M12 3v18M3 12h18M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
 bellplus:'<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/><path d="M12 4V1M11 2.5h2" stroke-width="1.6"/>',
 sign:'<path d="M3 19c3 0 3-12 6-12s2 8 4 8 2-4 5-4"/><path d="M4 21h16"/>',
 wallet2:'<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M16 12h3"/><path d="M3 9h18"/>',
 grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
 umbrella:'<path d="M12 3v2M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v6a2 2 0 0 0 4 0"/>',
 plane:'<path d="M21 15v-2l-8-4.5V4a1.5 1.5 0 0 0-3 0v4.5L2 13v2l8-2.2V18l-2 1.4V23l3.5-1 3.5 1v-1.6L13 18v-3.2z"/>',
 drop:'<path d="M12 3s6 6 6 10a6 6 0 0 1-12 0c0-4 6-10 6-10z"/>',
 award:'<circle cx="12" cy="9" r="5"/><path d="m9 13-1 8 4-2 4 2-1-8"/>',
 nfc:'<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M10.5 8a4 4 0 0 1 0 8M13.5 6a7 7 0 0 1 0 12"/>',
 eyeoff:'<path d="M3 3l18 18"/><path d="M10.6 10.6a3 3 0 0 0 4.2 4.2"/><path d="M9.8 5.1A9 9 0 0 1 21 12a13 13 0 0 1-2.2 3M6 6.2A13 13 0 0 0 3 12a9 9 0 0 0 12.8 4.1"/>',
 passport:'<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9.5 16h5"/>',
 access:'<circle cx="12" cy="4" r="1.7"/><path d="M4.5 8h15M12 8v6M9 21l3-7 3 7"/>',
 face:'<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9 14.5c1.2 1.2 4.8 1.2 6 0"/>',
 idcard:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5.8 16c.3-1.3 1.2-2 2.2-2s1.9.7 2.2 2M14 9h4M14 12.5h4M14 16h3"/>',
 refresh:'<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4"/>',
 form:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
 code:'<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 5l-2 14"/>',
 rupee:'<path d="M7 5h10M7 9h10M15.5 5c.5 4-2.5 5-5.5 5H8l6.5 7"/>',
 bluetooth:'<path d="M7 8.5 17 16l-5 3.5v-15L17 8 7 15.5"/>',
 list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
 people:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><path d="M16 5.2a3 3 0 0 1 0 5.6M21 20c0-2.4-1.4-4-3.4-4.6"/>',
 apps:'<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><circle cx="17" cy="17" r="3"/>',
 cloud:'<path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A3.5 3.5 0 0 1 18 18z"/>',
 printer:'<path d="M6 9V3h12v6M6 18H4v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-2M8 15h8v6H8z"/>'
});
/* ---- Dark mode ---- */
function applyTheme(){try{var t=localStorage.getItem('dl-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}}
applyTheme();
function toggleTheme(el){var d=document.documentElement;var on=d.getAttribute('data-theme')==='dark';
  d.setAttribute('data-theme',on?'light':'dark');try{localStorage.setItem('dl-theme',on?'light':'dark');}catch(e){}
  if(el&&el.classList){el.classList.toggle('on',!on); el.setAttribute('aria-checked', String(!on));}}
/* go back honestly */
function goBack(fb){ try{ if(window.history.length>1){ window.history.back(); return; } }catch(e){} nav(fb||'06-home.html'); }
/* confirm sheet for consequential actions */
function confirmDo(title, body, label, danger, okMsg, okIcon, goto){
  var s=document.querySelector('.screen'); if(!s) return;
  var scrim=document.createElement('div'); scrim.className='cscrim'; scrim.setAttribute('role','dialog'); scrim.setAttribute('aria-label',title);
  scrim.innerHTML='<div class="csheet"><div class="grab"></div><div class="h2">'+title+'</div><p class="ink2 mt2">'+(body||'')+'</p>'
    +'<button class="btn block mt5" style="'+(danger?'background:var(--danger)':'')+'">'+(label||'Confirm')+'</button>'
    +'<button class="btn ghost block mt3">Cancel</button></div>';
  s.appendChild(scrim); requestAnimationFrame(function(){scrim.classList.add('show');});
  var b=scrim.querySelectorAll('button');
  function close(){scrim.classList.remove('show');setTimeout(function(){scrim.remove();},260);}
  setTimeout(function(){b[0].focus&&b[0].focus();},60);
  b[0].addEventListener('click',function(){close(); if(okMsg) toast(okMsg,okIcon||'check'); if(goto) setTimeout(function(){nav(goto);},320);});
  b[1].addEventListener('click',close);
  scrim.addEventListener('click',function(e){if(e.target===scrim)close();});
  document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',esc);}});
}
window.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('[onclick]').forEach(function(el){
    var t=el.tagName.toLowerCase();
    if(t==='button'||(t==='a'&&el.getAttribute('href'))) return;
    if(!el.getAttribute('role')) el.setAttribute('role','button');
    if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0');
    el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault(); el.click();} });
  });
  document.querySelectorAll('.switch').forEach(function(sw){
    sw.setAttribute('role','switch'); sw.setAttribute('aria-checked', sw.classList.contains('on')?'true':'false');
  });
});
/* tactile button ripple */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.btn');if(!b)return;
  var r=document.createElement('span');r.className='ripple';var rc=b.getBoundingClientRect();var d=Math.max(rc.width,rc.height);
  r.style.width=r.style.height=d+'px';r.style.left=(e.clientX-rc.left-d/2)+'px';r.style.top=(e.clientY-rc.top-d/2)+'px';
  b.appendChild(r);setTimeout(function(){r.remove();},600);});
function speak(t,lang){
  try{ if(window.speechSynthesis){speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(t); u.lang=lang||'hi-IN'; u.rate=.9; speechSynthesis.speak(u);} }catch(e){}
  toast(t,'speaker');
}
function listen(el,reply){
  el.classList.add('live'); var o=el.innerHTML; el.innerHTML=svg('mic','mi')+'<span>सुन रही हूँ… Listening</span>';
  setTimeout(function(){ el.classList.remove('live'); el.innerHTML=o; if(reply) reply(); },1700);
}
/* auto-greet on Easy screens that declare data-greet */
window.addEventListener('DOMContentLoaded',function(){
  var g=document.querySelector('[data-greet]'); if(g){ setTimeout(function(){ /* speak(g.getAttribute('data-greet')); */ },400); }
});

/* ============================================================
   SERVER-DRIVEN PROMOTION BANNER + ADVERTISEMENT SLOT
   Mirrors v2's dashboard "container" model (Items/Properties:
   type, value, action, navigation, priority). Both sections are
   populated from a config object that would come from the
   server-driven dashboard template; if the server returns no
   items for a section, that section renders nothing (no empty
   placeholder, no leftover spacing).
   ============================================================ */

/**
 * Render the clickable promotion banner (carousel of cards).
 * @param {string} wrapId - id of the wrapper element (hidden by default in markup)
 * @param {Array} slides - [{title, subtitle, icon, skin, cta:{type:'screen'|'url', target}}]
 */
function renderPromoBanner(wrapId, slides){
  var wrap = document.getElementById(wrapId);
  if(!wrap) return;
  if(!slides || !slides.length){ wrap.style.display='none'; wrap.innerHTML=''; return; }
  var track = wrap.querySelector('.promo-track');
  if(!track){
    wrap.innerHTML = '<div class="between"><span class="eyebrow">Offers &amp; updates for you</span></div><div class="promo-track mt3"></div>';
    track = wrap.querySelector('.promo-track');
  }
  track.innerHTML = slides.map(function(s, i){
    return '<div class="promo-card '+(s.skin||'promo-sk1')+'" tabindex="0" role="button" data-i="'+i+'" aria-label="'+(s.title||'')+'">'
      + '<div class="pc-ic">'+svg(s.icon||'spark')+'</div>'
      + '<div class="pc-tt">'+(s.title||'')+'</div>'
      + (s.subtitle? '<div class="pc-sub">'+s.subtitle+'</div>' : '')
      + '<div class="pc-cta">'+(s.ctaLabel||'View')+' '+svg('chev','ic-sm')+'</div>'
      + '</div>';
  }).join('');
  wrap.style.display='block';
  track.querySelectorAll('.promo-card').forEach(function(el){
    var slide = slides[+el.dataset.i];
    function go(){
      if(!slide.cta) return;
      if(slide.cta.type==='url'){ toast('Opening link…','link'); }
      else { nav(slide.cta.target); }
    }
    el.addEventListener('click', go);
    el.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } });
  });
}

/**
 * Render the advertisement slot (single sponsored creative).
 * Clearly labelled "Advertisement" for transparency; entire
 * section is hidden when the server has no ad to serve.
 * @param {string} wrapId
 * @param {Object|null} ad - {image/skin, sponsor, title, subtitle, cta:{type,target}} or null/undefined to hide
 */
function renderAdSlot(wrapId, ad){
  var wrap = document.getElementById(wrapId);
  if(!wrap) return;
  if(!ad){ wrap.style.display='none'; wrap.innerHTML=''; return; }
  wrap.innerHTML = '<div class="ad-card '+(ad.skin||'')+'" tabindex="0" role="button" aria-label="Advertisement: '+(ad.title||'')+'">'
    + '<span class="ad-badge">Advertisement</span>'
    + '<div class="row gap2 mt2"><div class="ad-ic">'+svg(ad.icon||'bolt')+'</div>'
    + '<div class="grow"><div class="bold sm">'+(ad.title||'')+'</div>'
    + (ad.subtitle? '<div class="sm muted">'+ad.subtitle+'</div>' : '')
    + '</div><span class="chev-wrap">'+svg('chev','ic-sm')+'</span></div>'
    + (ad.sponsor? '<div class="ad-sponsor">Sponsored by '+ad.sponsor+'</div>' : '')
    + '</div>';
  wrap.style.display='block';
  var card = wrap.querySelector('.ad-card');
  function go(){
    if(!ad.cta) return;
    if(ad.cta.type==='url'){ toast('Opening advertiser link…','link'); }
    else { nav(ad.cta.target); }
  }
  card.addEventListener('click', go);
  card.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } });
}


/* ============================================================
   NAVIGATION RAIL — Desktop (840dp+)
   Renders a persistent left-side navigation rail on post-login
   screens. CSS in desktop.css handles collapsed/expanded states;
   JS only handles show/hide at the 840px boundary.
   ============================================================ */

var NAV_ITEMS = [
  { icon: 'home',    label: 'Home',     href: '06-home.html' },
  { icon: 'wallet2', label: 'Wallet',   href: '07-wallet.html' },
  { icon: 'drive',   label: 'Drive',    href: '12-drive.html' },
  { icon: 'apps',    label: 'Services', href: '30-esign.html' },
  { icon: 'user',    label: 'Account',  href: '21-account.html' }
];

/**
 * Screens that should NOT get the nav-rail (pre-login, onboarding, auth).
 * Matches filenames starting with these prefixes.
 */
var NAV_RAIL_EXCLUDE_PREFIXES = ['01','02','03','04','05','52','60','61','62','63','64','65','66','67','68','69','70','74','75','76','77','78'];

function isPostLoginScreen() {
  var filename = location.pathname.split('/').pop() || '';
  for (var i = 0; i < NAV_RAIL_EXCLUDE_PREFIXES.length; i++) {
    if (filename.indexOf(NAV_RAIL_EXCLUDE_PREFIXES[i]) === 0) return false;
  }
  // Also exclude if no filename (e.g. directory index)
  if (!filename || filename === '' || filename === 'index.html') return false;
  return true;
}

function getActiveNavItem() {
  var filename = location.pathname.split('/').pop() || '';
  for (var i = 0; i < NAV_ITEMS.length; i++) {
    if (NAV_ITEMS[i].href === filename) return i;
  }
  return -1;
}

function renderNavRail() {
  var screen = document.querySelector('.screen');
  if (!screen) return;
  // Don't render on excluded screens
  if (!isPostLoginScreen()) return;
  // Don't render twice
  if (screen.querySelector('.nav-rail')) return;

  var activeIndex = getActiveNavItem();
  var html = '<nav class="nav-rail" aria-label="Main navigation">';

  for (var i = 0; i < NAV_ITEMS.length; i++) {
    var item = NAV_ITEMS[i];
    var isActive = (i === activeIndex);
    html += '<a class="nav-rail__item' + (isActive ? ' nav-rail__item--active' : '') + '"'
      + ' href="' + item.href + '"'
      + ' aria-label="' + item.label + '"'
      + ' title="' + item.label + '"'
      + ' data-tooltip="' + item.label + '"'
      + (isActive ? ' aria-current="page"' : '')
      + '>';
    html += '<span class="nav-rail__indicator"></span>';
    html += svg(item.icon, 'nav-rail__icon');
    html += '<span class="nav-rail__label">' + item.label + '</span>';
    html += '</a>';
  }

  html += '</nav>';
  screen.insertAdjacentHTML('afterbegin', html);
}

function removeNavRail() {
  var rail = document.querySelector('.nav-rail');
  if (rail) rail.remove();
}

function handleNavRailViewport() {
  if (window.innerWidth >= 840) {
    renderNavRail();
  } else {
    removeNavRail();
  }
}

/* ---- Truncation utility ---- */
function truncate(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
}

/* ---- Avatar dropdown ---- */
function initAvatarDropdown() {
  document.querySelectorAll('.avatar-wrap').forEach(function(wrap) {
    var btn = wrap.querySelector('.avatar');
    var dropdown = wrap.querySelector('.avatar-dropdown');
    if (!btn || !dropdown) return;

    function open() {
      wrap.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      wrap.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      wrap.classList.contains('open') ? close() : open();
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggle();
    });

    // Close on click outside
    document.addEventListener('click', function(e) {
      if (!wrap.contains(e.target)) close();
    });

    // Close on Escape, return focus to avatar button
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && wrap.classList.contains('open')) {
        close();
        btn.focus();
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', function() {
  handleNavRailViewport();
  initAvatarDropdown();
});

var _navRailResizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(_navRailResizeTimer);
  _navRailResizeTimer = setTimeout(handleNavRailViewport, 100);
});
