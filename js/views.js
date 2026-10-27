const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const hl=s=>esc(s).replace(/(\+[A-ZÀ-ÚÇ]{3,})/g,'<span class="hot">$1</span>');
function blocksHtml(b){let h='',ul=false;for(const x of b){if(x.startsWith('• ')){if(!ul){h+='<ul>';ul=true}h+=`<li>${hl(x.slice(2))}</li>`}else{if(ul){h+='</ul>';ul=false}h+=`<p>${hl(x)}</p>`}}return h+(ul?'</ul>':'')}
const bx=(n,tot,k,cls='',labels)=>Array.from({length:tot},(_,i)=>`<span class="bx ${cls} ${i<n?'on':''}" ${labels?`title="${labels[i]}"`:''} onclick="tgl('${k}',${i})"></span>`).join('');
const dm=(n,k)=>[0,1,2].map(i=>`<span class="dm ${i<n?'on':''}" onclick="tgl('${k}',${i})"></span>`).join('');
const inp=(k,v,ph='')=>`<input type="text" value="${esc(v)}" placeholder="${esc(ph)}" oninput="setv('${k}',this.value)">`;
const area=(k,v,h)=>`<textarea ${h?`style="min-height:${h}px"`:''} oninput="setv('${k}',this.value)">${esc(v)}</textarea>`;
function portrait(src,k,id){return `<div class="portrait"><img src="${esc(src)}"></div><div class="row"><button class="sm" onclick="document.getElementById('${id}').click()">${t('file')}</button><button class="sm" onclick="imgUrl('${k}')">${t('link')}</button><button class="sm alt" onclick="setv('${k}','');render()">${t('defArt')}</button><input id="${id}" type="file" accept="image/*" hidden onchange="imgFile(this,'${k}')"></div>`}
function moveItem(en,loc,core){const txt=loc.text??(loc.blocks||[]).join(' ');const d=detect(en.text??(en.blocks||[]).join(' '));let btn='';
 if(d!==null){MV.push({name:loc.name,tr:d});btn=`<button class="sm" onclick="rollMv(${MV.length-1})">${t('roll')}${d?' '+tn(d):''}</button>`}
 return `<div class="mv"><div class="h">${core?`<span class="core" title="${t('core')}"></span>`:''}<b>${esc(loc.name)}</b>${btn}</div><div class="rules">${loc.blocks?blocksHtml(loc.blocks):`<p>${hl(txt)}</p>`}</div></div>`}
function render(){
 document.getElementById('lg').textContent=lang==='en'?'PT-BR':'EN';diceUI();MV=[];
 document.getElementById('hb').innerHTML=cur===null?`<button onclick="newChar()">+ ${t('newChar')}</button> <button class="alt" onclick="exp()">${t('exp')}</button> <button class="alt" onclick="document.getElementById('imp').click()">${t('imp')}</button><input type="file" id="imp" hidden accept=".json" onchange="imp(this)">`:`<button class="alt" onclick="home()">← ${t('hub')}</button>`;
 const note=ptMissing()?`<div class="notice">${t('untranslated')}</div>`:'';
 document.getElementById('app').innerHTML=cur===null?hub():note+`<div class="tabs">${[['sheet','sheet'],['ship','ship'],['moves','moves']].map(x=>`<button class="${tab==x[0]?'on':''}" onclick="setTab('${x[0]}')">${t(x[1])}</button>`).join('')}</div>`+(tab=='sheet'?sheetTab():tab=='ship'?shipTab():movesTab());
 const a=document.getElementById('app');a.classList.remove('enter');if(anim){void a.offsetWidth;a.classList.add('enter');anim=false}
}
function hub(){return !S.c.length?`<p>${t('empty')}</p>`:'<div class="grid">'+S.c.map((c,i)=>`<div class="card" onclick="openChar(${i})"><button class="del sm alt" onclick="delChar(${i},event)">✕</button><img src="${esc(artOf(c))}"><div class="t"><b>${esc(c.name||'—')}</b><br><span class="small">${pbn(c.pb)}${c.ship.name?' · '+esc(c.ship.name):''}</span></div></div>`).join('')+'</div>'}
function sheetTab(){
 const c=C(),P=R().playbooks[c.pb],o=P.oddities[c.odd],core=CORE[c.pb];
 const vice=P.vice;
 return `<div class="sheet">
 <div>
  <div class="panel"><h3>${pbn(c.pb)}</h3>
   <select onchange="pbSet(this.value)">${PBS.map(x=>`<option value="${x}" ${x==c.pb?'selected':''}>${pbn(x)}</option>`).join('')}</select>
   <div class="row" style="margin-top:6px">${inp('name',c.name,t('name'))}</div><div class="row">${inp('looks',c.looks,t('looks'))}</div>
   <select onchange="oddSet(this.value)"><option value="-1">${t('noOddity')}</option>${P.oddities.map((x,i)=>`<option value="${i}" ${i==c.odd?'selected':''}>${esc(x.name)} (${x.mods.join(', ')})</option>`).join('')}</select>
   ${o?`<div class="rules"><p>${hl(o.text)}</p></div>`:''}</div>
  <div class="panel">${portrait(artOf(c),'img','pf')}</div>
  <div class="panel">${TR.map(x=>`<div class="trait"><label title="${t('roll')}" onclick="rollTrait('${x}')">${tn(x)}</label><input type="number" value="${c.tr[x]}" onchange="setn('tr.${x}',this.value)"></div>`).join('')}</div>
  <div class="panel"><h3>${t('luck')}</h3>${bx(c.luck,P.luck,'luck')}<h3 style="margin-top:10px">${t('harm')}</h3>${bx(c.harm,8,'harm','sk')}</div>
 </div>
 <div>
  <div class="panel"><h3>${t('belongings')}</h3>${area('bel',c.bel,120)}
   <h4>${t('kit')}</h4>${P.kits.map((k,i)=>`<div class="rules"><p>${hl(k)} <button class="sm alt" onclick="addKit(R().playbooks['${c.pb}'].kits[${i}])">${t('addKit')}</button></p></div>`).join('')}${P.kitExtra?`<div class="rules"><p>${hl(P.kitExtra)}</p></div>`:''}</div>
  <div class="panel"><h3>${t('troubles')}</h3>${c.tb.map((x,i)=>`<div class="row">${inp('tb.'+i,x)}</div>`).join('')}
   <h3 style="margin-top:10px">${t('vice')}${vice.troubles?'':' — '+esc(vice.name)}</h3>
   ${vice.troubles?`<div class="rules"><p>${hl(vice.text)}</p></div>`+vice.troubles.map((x,i)=>`<div class="row"><span class="bx ${c.trb[i]?'on':''}" onclick="flip('trb.${i}')"></span><div class="rules"><b class="hot">${esc(x.name)}.</b> ${hl(x.text)}</div></div>`).join(''):
   `<div class="row"><span class="bx ${c.vice?'on':''}" onclick="flip('vice')"></span><span>${t('marked')}</span></div><div class="rules"><p>${hl(vice.text)}</p></div>`}</div>
  <div class="panel"><h3>${t('lastWords')}</h3><div class="rules"><p><i>${esc(P.lastIntro)}</i></p><ul>${P.last.map(x=>`<li>${hl(x)}</li>`).join('')}</ul></div></div>
  <div class="panel"><h3>${t('questions')}</h3>${P.questions.map((q,i)=>`<div class="q"><span class="small">${i+1}. ${esc(q)}</span>${area('qa.'+i,c.qa[i],50)}</div>`).join('')}</div>
  <div class="panel"><h3>${t('notes')}</h3>${area('notes',c.notes)}</div>
  <div class="panel"><h3>${t('experience')}</h3>${bx(c.xp,15,'xp')}<h4>${t('advances')}</h4><div class="rules"><p>${esc(t('advancesText'))}</p></div></div>
 </div>
 <div>
  <div class="panel"><h3>${t('bonds')}</h3>${c.bonds.map((b,i)=>`<div class="row">${inp('bonds.'+i+'.n',b.n)}${dm(b.v,'bonds.'+i+'.v')}</div>`).join('')}</div>
  <div class="panel"><h3>${t('pbMoves')}</h3>${P.moves.map((m,i)=>`<div class="row">${i<core?'<span class="bx on"></span>':`<span class="bx ${c.mvOn[i]?'on':''}" onclick="flip('mvOn.${i}')"></span>`}<span>${esc(m.name)}</span></div>`).join('')}</div>
 </div></div>`}
function movesTab(){
 const c=C(),P=R().playbooks[c.pb],PE=EN.playbooks[c.pb],M=R().moves,ME=EN.moves,core=CORE[c.pb];
 const sec=(h,arr,en,cf)=>`<div class="mvh">${h}</div>`+arr.map((m,i)=>moveItem(en[i],m,cf&&i<core)).join('');
 return `<div class="cols">${sec(t('pbMoves')+' — '+pbn(c.pb),P.moves,PE.moves,true)}${sec(t('basic'),M.basic,ME.basic)}${sec(t('special'),M.special,ME.special)}${sec(t('downtime'),M.downtime,ME.downtime)}${sec(t('shipMoves'),M.ship,ME.ship)}</div>`}
function shipTab(){
 const c=C(),s=c.ship,D=R().ships[s.type],o=D.oddities[s.odd];
 return `<div class="sheet" style="grid-template-columns:260px 1fr 300px">
 <div>
  <div class="panel"><h3>${shn(s.type)}</h3>
   <select onchange="shipType(this.value)">${SHS.map(x=>`<option value="${x}" ${x==s.type?'selected':''}>${shn(x)}</option>`).join('')}</select>
   <div class="row" style="margin-top:6px">${inp('ship.name',s.name,t('shipName'))}</div>
   <select onchange="setn('ship.odd',this.value);render()"><option value="-1">${t('noOddity')}</option>${D.oddities.map((x,i)=>`<option value="${i}" ${i==s.odd?'selected':''}>${esc(x.name)}</option>`).join('')}</select>
   ${o?`<div class="rules"><p>${hl(o.text)}</p></div>`:''}</div>
  <div class="panel">${portrait(shipArt(s),'ship.img','sf')}</div>
  <div class="panel">${STR.map(x=>`<div class="trait"><label onclick="rollTrait('${x}')">${tn(x)}</label><input type="number" value="${s.tr[x]}" onchange="setn('ship.tr.${x}',this.value)"></div>`).join('')}
   <h4>${t('wreck')}</h4>${bx(s.wreck,7,'ship.wreck','sk',['+3','+2','+1','0','-1','','WRECKED'])}
   <h4>${t('renown')}</h4>${bx(s.ren,5,'ship.ren')}
   ${D.advances?'':''}${s.type==='jewel'?`<h4>${t('chase')}</h4>${bx(s.tally,5,'ship.tally','sq')}`:''}
   ${s.type==='legend'?`<h4>${t('legacy')}</h4><input type="number" value="${s.hold}" onchange="setn('ship.hold',this.value)">`:''}</div>
 </div>
 <div>
  <div class="panel"><h3>${esc(D.special.title)}</h3><div class="rules">${blocksHtml(D.special.blocks)}</div></div>
  <div class="panel"><h3>${t('kit')}</h3>${D.kits.map((k,i)=>`<div class="rules"><p><b>(${k.mods.join(', ')})</b> ${hl(k.text)} <button class="sm alt" onclick="shipKit(${i})">${tn('steadfast')}/${tn('speed')}/${tn('fortune')}</button></p></div>`).join('')}${D.kitExtra?`<div class="rules"><p>${hl(D.kitExtra)}</p></div>`:''}</div>
  <div class="panel"><h3>${t('crew')}</h3>${area('ship.crew',s.crew,100)}<h3 style="margin-top:10px">${t('cargo')}</h3>${area('ship.cargo',s.cargo,100)}<h3 style="margin-top:10px">${t('notes')}</h3>${area('ship.notes',s.notes)}</div>
  <div class="panel"><h3>${t('questions')}</h3><div class="rules"><ol>${D.questions.map(q=>`<li>${hl(q)}</li>`).join('')}</ol></div></div>
  <div class="panel"><h3>${t('epilogue')}</h3><div class="rules"><p>${hl(D.epilogue.intro)}</p><ul>${D.epilogue.bullets.map(x=>`<li>${hl(x)}</li>`).join('')}</ul></div></div>
 </div>
 <div>
  <div class="panel"><h3>${t('shipAdv')}</h3>${D.advances.map((a,i)=>`<div class="mv"><div class="h"><b>${esc(a.name)}</b>${bx(s.adv[i]||0,a.boxes,'ship.adv.'+i)}</div><div class="rules"><p>${hl(a.text)}</p></div></div>`).join('')}</div>
  <div class="panel"><h3>${t('specials')}</h3><div class="rules"><ul>${D.specials.map(x=>`<li>${hl(x)}</li>`).join('')}</ul></div></div>
  <div class="panel"><h3>${t('renownActs')}</h3>${D.renownActions.map((a,i)=>`<div class="rules"><p>${esc(a)}<br>${bx(s.rg[i]||0,5,'ship.rg.'+i,'sq')}</p></div>`).join('')}<div class="rules"><ul>${D.renownNotes.map(x=>`<li>${hl(x)}</li>`).join('')}</ul></div></div>
  <div class="panel"><h3>${t('shipMoves')}</h3><div class="small">${t('useBond')}</div>${R().moves.ship.map((m,i)=>moveItem(EN.moves.ship[i],m)).join('')}</div>
 </div></div>`}
document.documentElement.lang=lang==='pt'?'pt-BR':'en';
render();
