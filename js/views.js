const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const hl=s=>esc(s).replace(/(\+[A-ZÀ-ÚÇ]{3,})/g,'<span class="hot">$1</span>').replace(/\n/g,'<br>');
function blocksHtml(b){let h='',ul=false;for(const x of b){if(x.startsWith('• ')){if(!ul){h+='<ul>';ul=true}h+=`<li>${hl(x.slice(2))}</li>`}else{if(ul){h+='</ul>';ul=false}h+=`<p>${hl(x)}</p>`}}return h+(ul?'</ul>':'')}
const bx=(n,tot,k,cls='',labels)=>Array.from({length:tot},(_,i)=>`<span class="bx ${cls} ${i<n?'on':''}" ${labels?`title="${labels[i]}"`:''} onclick="tgl('${k}',${i})"></span>`).join('');
const dm=(n,k)=>[0,1,2].map(i=>`<span class="dm ${i<n?'on':''}" onclick="tgl('${k}',${i})"></span>`).join('');
const inp=(k,v,ph='')=>`<input type="text" value="${esc(v)}" placeholder="${esc(ph)}" oninput="setv('${k}',this.value)">`;
const area=(k,v,h)=>`<textarea ${h?`style="min-height:${h}px"`:''} oninput="setv('${k}',this.value)">${esc(v)}</textarea>`;
function portrait(src,k,id){return `<div class="portrait"><img src="${esc(src)}" alt=""></div><div class="row pbtn"><button class="sm" onclick="document.getElementById('${id}').click()">${t('file')}</button><button class="sm" onclick="imgUrl('${k}')">${t('link')}</button><button class="sm alt" onclick="setv('${k}','');render()">${t('defArt')}</button><input id="${id}" type="file" accept="image/*" hidden onchange="imgFile(this,'${k}')"></div>`}
function moveItem(en,loc,lead='',after=''){const txt=loc.text??(loc.blocks||[]).join(' ');const d=detect(en.text??(en.blocks||[]).join(' '));let btn='';
 if(d!==null){MV.push({name:loc.name,tr:d});btn=`<button class="sm" onclick="rollMv(${MV.length-1})">${t('roll')}${d?' '+tn(d):''}</button>`}
 return `<div class="mv"><div class="h">${lead}<b>${esc(loc.name)}</b>${btn}</div><div class="rules">${loc.blocks?blocksHtml(loc.blocks):blocksHtml(txt.split('\n'))}</div>${after}</div>`}
function fold(id,title,body,def=true){const o=C().fold[id]??def;return `<section class="fold ${o?'open':''}"><button class="fh" onclick="foldTgl('${id}')"><span>${title}</span><i></i></button>${o?`<div class="fb">${body}</div>`:''}</section>`}
function widget(c,w){
 const W=R().widgets[w.id];if(!W)return '';let h=`<div class="wg"><h5>${esc(W.title)}${W.hint?` <small>${esc(W.hint)}</small>`:''}</h5>`;
 if(w.type==='books'){
  h+=c.books.map((b,i)=>`<div class="book"><div class="row">${inp('books.'+i+'.name',b.name,W.name)}<span class="bx ${b.done?'on':''}" title="${esc(W.done)}" onclick="flip('books.${i}.done')"></span><button class="sm alt" onclick="delBook(${i})" title="${esc(W.del)}">✕</button></div>
   ${area('books.'+i+'.effect',b.effect,50).replace('<textarea','<textarea placeholder="'+esc(W.effect)+'"')}
   <h6>${esc(W.quests)}</h6>${W.questLabels.map((l,j)=>`<label class="fl">${esc(l)}</label>${inp('books.'+i+'.q.'+j,b.q[j])}`).join('')}
   <h6>${esc(W.reqs)}</h6>${W.reqLabels.map((l,j)=>`<label class="fl">${esc(l)}</label>${inp('books.'+i+'.r.'+j,b.r[j])}`).join('')}</div>`).join('')+`<button class="sm" onclick="addBook()">+ ${esc(W.add)}</button>`;
 }else{
  const items=[...W.items,...((w.extraIf!==undefined&&taken(c,w.extraIf)&&W.extra)||[])];const st=c.w[w.id]||{};
  const n=items.filter((_,i)=>st[i]).length,mx=w.max!==undefined?w.max+((w.bonusIf&&taken(c,w.bonusIf[0]))?w.bonusIf[1]:0):items.length;
  h=h.replace('</h5>',`<em class="cnt">${n}/${mx}</em></h5>`);
  h+=items.map((x,i)=>`<div class="opt" onclick="flip('w.${w.id}.${i}')"><span class="bx sq ${st[i]?'on':''}"></span><span>${hl(x)}</span></div>`).join('');
  if(W.marks)h+=`<div class="small">${esc(W.marks)}: <b>${n}</b></div>`;
  if(w.fields)h+=W.fields.map((l,i)=>`<label class="fl">${esc(l)}</label>${inp('w.'+(i?'protector':'nemesis'),c.w[i?'protector':'nemesis']||'')}`).join('');
 }
 return h+'</div>'}
function render(){
 document.getElementById('lgc').checked=lang==='pt';diceUI();MV=[];
 document.getElementById('hb').innerHTML=cur===null?`<button onclick="newChar()">+ ${t('newChar')}</button> <button class="alt" onclick="exp()">${t('exp')}</button> <button class="alt" onclick="document.getElementById('imp').click()">${t('imp')}</button><input type="file" id="imp" hidden accept=".json" onchange="imp(this)">`:`<button class="alt" onclick="home()">← ${t('hub')}</button>`;
 const note=ptMissing()?`<div class="notice">${t('untranslated')}</div>`:'';
 document.getElementById('app').innerHTML=cur===null?hub():note+`<div class="tabs">${[['sheet','sheet'],['ship','ship'],['moves','moves']].map(x=>`<button class="${tab==x[0]?'on':''}" onclick="setTab('${x[0]}')">${t(x[1])}</button>`).join('')}</div>`+(tab=='sheet'?sheetTab():tab=='ship'?shipTab():movesTab());
 const a=document.getElementById('app');a.classList.remove('enter');if(anim){void a.offsetWidth;a.classList.add('enter');anim=false}
}
function hub(){return !S.c.length?`<p>${t('empty')}</p>`:'<div class="grid">'+S.c.map((c,i)=>`<div class="card" onclick="openChar(${i})"><button class="del sm alt" onclick="delChar(${i},event)">✕</button><img src="${esc(artOf(c))}" alt=""><div class="t"><b>${esc(c.name||'—')}</b><br><span class="small">${pbn(c.pb)}${c.ship.name?' · '+esc(c.ship.name):''}</span></div></div>`).join('')+'</div>'}
function sheetTab(){
 const c=C(),P=R().playbooks[c.pb],PE=EN.playbooks[c.pb],vice=P.vice,core=CORE[c.pb],sw=c.pb==='swashbuckler';
 const traits=`<div class="traitbox">${TR.map(x=>`<div class="tr"><input type="number" value="${c.tr[x]}" onchange="setn('tr.${x}',this.value)"><label title="${t('roll')}" onclick="rollTrait('${x}')">${tn(x)}</label></div>`).join('')}</div>`;
 const harm=Array.from({length:8},(_,i)=>`<span class="bx ${i>=5?'sk':''} ${i<c.harm?'on':''}" onclick="tgl('harm',${i})"></span>`).join('');
 const viceHtml=vice.troubles?`<div class="rules"><p>${hl(vice.text)}</p></div>`+vice.troubles.map((x,i)=>`<div class="opt" onclick="flip('trb.${i}')"><span class="bx sk ${c.trb[i]?'on':''}"></span><div class="rules"><b class="hot">${esc(x.name)}.</b> ${hl(x.text)}</div></div>`).join(''):
  `<div class="opt" onclick="flip('vice')"><span class="bx sk ${c.vice?'on':''}"></span><div class="rules"><b class="hot">${esc(vice.name)}</b><p>${hl(vice.text)}</p></div></div>`;
 const unrest=c.pb==='captain'?`<h4>${t('unrest')}</h4><div>${bx(c.unrest,3,'unrest','sq')}</div>`:'';
 const mvs=P.moves.map((m,i)=>moveItem(PE.moves[i],m,i<core?`<span class="core" title="${t('core')}"></span>`:`<span class="bx ${c.mvOn[i]?'on':''}" title="${t('taken')}" onclick="flip('mvOn.${i}')"></span>`,(WG[c.pb]||[]).filter(w=>w.m===i).map(w=>widget(c,w)).join(''))).join('');
 const o=P.oddities[c.odd];
 const oddBody=`<p class="small">${t('tapOdd')}</p>`+P.oddities.map((x,i)=>`<div class="oddc ${i==c.odd?'sel':''}" onclick="oddSet(${i})"><b>${esc(x.name)}</b> <span class="mods">${x.mods.map(n=>(n>0?'+':'')+n).join(' ')}</span><div class="rules"><p>${hl(x.text)}</p></div></div>`).join('');
 const kitBody=`<p class="small">${t('kitHint')}</p>`+P.kits.map((k,i)=>`<div class="kitc ${i==c.kitSel?'sel':''}"><div class="rules"><p>${hl(k)}</p></div><button class="sm" onclick="addKit(${i})">${t('addKit')}</button></div>`).join('')+(P.kitExtra?`<div class="rules"><p>${hl(P.kitExtra)}</p></div>`:'');
 const qBody=P.questions.map((q,i)=>`<div class="q"><span class="small">${i+1}. ${esc(q)}</span>${area('qa.'+i,c.qa[i],50)}</div>`).join('');
 return `<div class="sheetpage">
 <div class="shead"><div class="ttl"><span class="the">Um</span> <span class="pbt">${esc(pbn(c.pb))}</span></div>
  <div class="flds"><label>${t('name')}${inp('name',c.name)}</label><label>${t('looks')}${inp('looks',c.looks)}</label></div>
  <label class="pbsel">${t('playbook')}<select onchange="pbSet(this.value)">${PBS.map(x=>`<option value="${x}" ${x==c.pb?'selected':''}>${pbn(x)}</option>`).join('')}</select></label></div>
 <div class="p1">
  <div class="c-left">${traits}
   <h2 class="script">${t('luck')}</h2><div>${bx(c.luck,P.luck,'luck')}</div>
   <h2 class="script">${t('harm')}</h2><div>${harm}</div>
   <div class="holdbox"><b>${t('hold')}</b><button class="sm alt" onclick="holdAdj(-1)">−</button><span class="hv">${c.hold}</span><button class="sm" onclick="holdAdj(1)">+</button></div>
   <h3>${t('lastWords')}</h3><div class="rules"><p><i>${esc(P.lastIntro)}</i></p><ul>${P.last.map(x=>`<li>${hl(x)}</li>`).join('')}</ul></div></div>
  <div class="c-mid">
   <h3>${t('belongings')}</h3><div class="greybox">${area('bel',c.bel,170)}</div>
   <div class="two"><div><h3>${t('troubles')}</h3>${c.tb.map((x,i)=>`<div class="pill"><span class="bx sk "></span>${inp('tb.'+i,x)}</div>`).join('')}
    <h3>${t('vice')}</h3>${viceHtml}${unrest}</div>
    <div><h3>${t('bonds')}</h3>${c.bonds.map((b,i)=>`<div class="bond">${dm(b.v,'bonds.'+i+'.v')}${inp('bonds.'+i+'.n',b.n)}${sw?`<select class="bt" onchange="setv('bonds.${i}.type',this.value)"><option value="">—</option>${['comrade','rival','lover'].map(k=>`<option value="${k}" ${b.type==k?'selected':''}>${t(k)}</option>`).join('')}</select>`:''}</div>`).join('')}</div></div>
   <h3>${t('notes')}</h3><div class="greybox">${area('notes',c.notes,70)}</div>
   <h2 class="script">${t('experience')}</h2><div class="xpbar">${Array.from({length:15},(_,i)=>`${i==5?'<b class="dia"></b>':''}<span class="bx ${i<c.xp?'on':''}" onclick="tgl('xp',${i})"></span>`).join('')}</div>
   <h2 class="script">${t('advances')}</h2><div class="rules"><p>${esc(t('advancesText'))}</p></div></div>
  <div class="c-art"><div class="stick">${portrait(artOf(c),'img','pf')}</div></div>
 </div>
 <div class="p2"><div class="pm"><div class="banner">${t('pbMoves')}</div>${mvs}</div>
  <aside class="cc"><h2 class="cct">${t('creation')}</h2>
   ${o?`<div class="oddc sel"><b>${esc(o.name)}</b> <span class="mods">${o.mods.map(n=>(n>0?'+':'')+n).join(' ')}</span><div class="rules"><p>${hl(o.text)}</p></div><button class="sm alt" onclick="foldTgl('odd')">${t('change')}</button></div>`:''}
   ${fold('odd',t('oddities'),oddBody,!o)}
   ${fold('kit',t('kit'),kitBody,c.kitSel<0)}${c.kitSel>=0?`<p class="small">✓ ${t('kitAdded')}</p>`:''}
   ${fold('q',t('questions'),qBody,true)}</aside></div></div>`}
function movesTab(){
 const M=R().moves,ME=EN.moves;
 const sec=(h,k)=>`<div class="banner sm">${h}</div>`+M[k].map((m,i)=>moveItem(ME[k][i],m)).join('');
 return `<div class="cols">${sec(t('basic'),'basic')}${sec(t('special'),'special')}${sec(t('downtime'),'downtime')}${sec(t('shipMoves'),'ship')}</div>`}
function shipTab(){
 const c=C(),s=c.ship,D=R().ships[s.type],o=D.oddities[s.odd];
 return `<div class="shipgrid">
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
  <div class="panel"><h3>${t('kit')}</h3>${D.kits.map((k,i)=>`<div class="rules"><p><b>(${k.mods.join(', ')})</b> ${hl(k.text)} <button class="sm alt" onclick="shipKit(${i})">${t('apply')}</button></p></div>`).join('')}${D.kitExtra?`<div class="rules"><p>${hl(D.kitExtra)}</p></div>`:''}</div>
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
document.documentElement.lang=lang==='pt'?'pt-BR':'en';
Promise.all(['en','pt'].map(l=>fetch('data/rules.'+l+'.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}))).then(([e,p])=>{EN=e;window.RULES_PT=p;render()}).catch(()=>{document.getElementById('app').innerHTML='<div class="notice">'+t('loadErr')+'</div>'});
