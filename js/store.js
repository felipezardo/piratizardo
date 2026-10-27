let anim=false,S=JSON.parse(localStorage.getItem('rps')||'{"c":[]}'),cur=null,tab='sheet';
const save=()=>localStorage.setItem('rps',JSON.stringify(S));
const PBS=['captain','chirurgeon','chronicler','gunslinger','matelot','mountebank','navigator','shiprat','swashbuckler'];
const SHS=['jewel','legend','ramshackle'];
const TR=['blood','vinegar','polish','spitfire'],STR=['steadfast','speed','fortune'];
const CORE={captain:1,chirurgeon:2,chronicler:1,gunslinger:1,matelot:2,mountebank:2,navigator:1,shiprat:1,swashbuckler:2};
const C=()=>S.c[cur];
const artOf=c=>c.img||`assets/art/${c.pb}.png`;
const shipArt=s=>s.img||`assets/art/${s.type}.png`;
function newShip(){return{type:'ramshackle',name:'',img:'',odd:-1,tr:{steadfast:0,speed:0,fortune:0},wreck:0,ren:0,tally:0,hold:5,crew:'',cargo:'',notes:'',adv:{},rg:{}}}
function newChar(){S.c.push({id:Date.now(),name:'',looks:'',pb:'captain',odd:-1,img:'',tr:{blood:0,vinegar:0,polish:0,spitfire:0},luck:0,harm:0,tb:['','','',''],vice:0,
 trb:{},bonds:Array.from({length:8},()=>({n:'',v:0})),bel:'',xp:0,notes:'',mvOn:{},qa:['','','',''],ship:newShip()});save();openChar(S.c.length-1)}
function get(o,k){return k.split('.').reduce((a,p)=>a?.[p],o)}
function setv(k,v){const p=k.split('.'),l=p.pop();let o=C();for(const x of p)o=o[x]??(o[x]={});o[l]=v;save()}
function setn(k,v){setv(k,+v)}
function tgl(k,i){setv(k,get(C(),k)===i+1?i:i+1);render()}
function flip(k){setv(k,get(C(),k)?0:1);render()}
function pbSet(v){const c=C();c.pb=v;c.odd=-1;c.mvOn={};c.img=c.img;save();render()}
function oddSet(i){const c=C();c.odd=+i;const o=R().playbooks[c.pb].oddities[+i];if(o)TR.forEach((x,j)=>c.tr[x]=o.mods[j]);save();render()}
function shipType(v){const s=C().ship;s.type=v;s.odd=-1;s.adv={};s.rg={};save();render()}
function shipKit(i){const s=C().ship,k=R().ships[s.type].kits[i];STR.forEach((x,j)=>s.tr[x]=k.mods[j]);save();render()}
function addKit(txt){const c=C();c.bel=(c.bel?c.bel+'\n':'')+txt;save();render()}
function openChar(i){anim=true;cur=i;tab='sheet';render()}
function home(){anim=true;cur=null;render()}
function delChar(i,e){e.stopPropagation();if(confirm(t('confirmDel'))){S.c.splice(i,1);save();render()}}
function setTab(x){anim=true;tab=x;render()}
function imgUrl(k){const u=prompt(t('askUrl'));if(u){setv(k,u);render()}}
function imgFile(inp,k){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const q=Math.min(1,700/im.width),cv=document.createElement('canvas');cv.width=im.width*q;cv.height=im.height*q;
 const x=cv.getContext('2d');x.drawImage(im,0,0,cv.width,cv.height);setv(k,cv.toDataURL('image/png'));render()};im.src=r.result};r.readAsDataURL(f)}
function exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='rapscallion-sheets.json';a.click()}
function imp(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{S=JSON.parse(r.result);save();render()}catch(e){alert(t('invalid'))}};r.readAsText(f)}
