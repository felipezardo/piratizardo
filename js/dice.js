let rollMode='n',diceOpen=true,rolling=false;
const calm=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function diceUI(){const el=document.getElementById('dice');if(!el||el.dataset.l===lang)return;el.dataset.l=lang;
 el.innerHTML=`<div class="h" onclick="diceOpen=!diceOpen;document.getElementById('dice').classList.toggle('shut',!diceOpen)"><span>${t('dice')}</span><i></i></div><div class="b" id="db">
 <div class="row"><label style="flex:1">${t('bonus')}</label><input type="number" id="bonus" value="0" style="width:70px"></div>
 <div class="row"><button class="sm" onclick="rollNow('2d6',0)">2d6</button><button class="sm alt" onclick="rollMode=rollMode=='n'?'x':'n';this.textContent=rollMode=='n'?t('normal'):t('low2')">${rollMode=='n'?t('normal'):t('low2')}</button></div>
 <div id="res"></div><div class="row logbar"><span class="small" style="color:#999;flex:1"></span><button class="sm alt" onclick="clearLog()">${t('clear')}</button></div><div class="log" id="log"></div></div>`}
function clearLog(){document.getElementById('log').innerHTML='';document.getElementById('res').innerHTML=''}
function rollNow(label,mod){
 if(rolling)return;rolling=true;
 const bn=+document.getElementById('bonus').value||0,n=rollMode==='x'?3:2,d=Array.from({length:n},()=>1+Math.floor(Math.random()*6));
 let keep=d.map((_,i)=>i);if(n===3){const hi=d.indexOf(Math.max(...d));keep=keep.filter(i=>i!==hi)}
 const tot=keep.reduce((a,i)=>a+d[i],0)+mod+bn,k=tot>=10?['full','t10']:tot>=7?['part','t79']:['miss','t6'];
 const res=document.getElementById('res'),fast=calm();
 res.innerHTML=`<div class="rlabel">${esc(label)}</div><div class="tray">${d.map(()=>`<span class="die rolling">?</span>`).join('')}</div><div class="big" style="opacity:.25">–</div><div class="tier"></div><div class="small mods" style="text-align:center;color:#aaa"></div>`;
 const dies=[...res.querySelectorAll('.die')],big=res.querySelector('.big'),tier=res.querySelector('.tier');
 const tick=setInterval(()=>dies.forEach(e=>{if(e.classList.contains('rolling'))e.textContent=1+Math.floor(Math.random()*6)}),70);
 dies.forEach((e,i)=>setTimeout(()=>{e.classList.remove('rolling');e.textContent=d[i];e.classList.add('land');if(n===3&&!keep.includes(i))e.classList.add('drop')},fast?0:550+i*220));
 const end=fast?0:550+n*220+120;
 setTimeout(()=>{clearInterval(tick);big.style.opacity=1;big.className='big '+k[1]+' pop';
  const t0=performance.now(),dur=fast?0:380;(function step(now){const p=dur?Math.min(1,(now-t0)/dur):1;big.textContent=Math.round(p*tot);if(p<1)requestAnimationFrame(step);else{big.textContent=tot;tier.className='tier '+k[1]+' fadein';tier.textContent=t(k[0]);res.querySelector('.mods').textContent=`[${d.join(' + ')}] ${mod>=0?'+':''}${mod}${bn?' / '+bn:''}`;
   const l=document.getElementById('log');l.insertAdjacentHTML('afterbegin',`<div class="slide">${esc(label)}: <b class="${k[1]}">${tot}</b> — ${t(k[0])}</div>`);while(l.children.length>30)l.lastChild.remove();rolling=false}})(t0);
  document.getElementById('bonus').value=0},end);
 document.getElementById('dice').classList.remove('shut');diceOpen=true}
function traitMod(k){const c=C();return TR.includes(k)?c.tr[k]:STR.includes(k)?c.ship.tr[k]:0}
function rollTrait(k){rollNow(tn(k),traitMod(k))}
let MV=[];function rollMv(i){const m=MV[i];rollNow(m.name+(m.tr?' ('+tn(m.tr)+')':''),m.tr?traitMod(m.tr):0)}
/* Detects which trait a move rolls from the ENGLISH rules text. Returns trait id, '' for "roll blank"/plain 2d6, or null (no auto roll). */
function detect(en){const m=en.match(/roll\s+\+\s*(blood|vinegar|polish|spitfire|steadfast|speed|fortune)\b/i);if(m)return m[1].toLowerCase();return /roll blank|roll 2d6/i.test(en)?'':null}
