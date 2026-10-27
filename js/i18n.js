/* UI strings + rules merging. Rules text lives in data/rules.<lang>.js; missing pt keys fall back to English. */
const UI={
en:{hub:'Hub',newChar:'New character',exp:'Export',imp:'Import',empty:'No characters yet. Click “New character”.',del:'Delete',
sheet:'Sheet',ship:'Ship',moves:'Moves',name:'Name',looks:'Looks',playbook:'Playbook',oddity:'Oddity',noOddity:'— Oddity —',
luck:'Luck',harm:'Harm',troubles:'Troubles',bonds:'Bonds',belongings:'Belongings',experience:'Experience',advances:'Advances',
advancesText:'(Up to 3 times) +1 to trait. Gain 1 bond with a relevant person or the ship. Take an unmarked playbook move.',
lastWords:'Last Words',vice:'Vice',marked:'Marked',kit:'Kit',addKit:'Add to belongings',questions:'Questions',notes:'Notes',
file:'File',link:'Link',defArt:'Default art',askUrl:'Image URL:',roll:'Roll',dice:'Dice',clear:'Clear history',bonus:'Bonus / penalty',normal:'Normal',low2:'Lowest 2 of 3d6',
full:'Full success (10+)',part:'Partial success (7-9)',miss:'Miss (6-)',confirmDel:'Delete this character?',
pbMoves:'Playbook moves',basic:'Basic Moves',special:'Special Moves',shipMoves:'Ship Moves',downtime:'Downtime Moves',core:'Always taken',
shipName:'Ship name',kitMods:'Kit',wreck:'Wreck',renown:'Renown',chase:'Chase Tally',legacy:'Legacy (hold)',crew:'Crew',cargo:'Cargo',
shipAdv:'Ship Advances',specials:'Specials',epilogue:'Epilogue',renownActs:'Renown actions',useBond:'Roll using bonds spent: set the bonus field.',
untranslated:'Part of the rules text is not translated yet and is shown in English.',invalid:'Invalid file',
traits:{blood:'Blood',vinegar:'Vinegar',polish:'Polish',spitfire:'Spitfire',steadfast:'Steadfast',speed:'Speed',fortune:'Fortune'},
pb:{captain:'Captain',chirurgeon:'Chirurgeon',chronicler:'Chronicler',gunslinger:'Gunslinger',matelot:'Matelot',mountebank:'Mountebank',navigator:'Navigator',shiprat:'Shiprat',swashbuckler:'Swashbuckler'},
sh:{jewel:'The Jewel',legend:'The Legend',ramshackle:'The Ramshackle'}},
pt:{hub:'Início',newChar:'Novo personagem',exp:'Exportar',imp:'Importar',empty:'Nenhum personagem ainda. Clique em “Novo personagem”.',del:'Excluir',
sheet:'Ficha',ship:'Navio',moves:'Movimentos',name:'Nome',looks:'Aparência',playbook:'Classe',oddity:'Peculiaridade',noOddity:'— Peculiaridade —',
luck:'Sorte',harm:'Ferimento',troubles:'Problemas',bonds:'Vínculos',belongings:'Pertences',experience:'Experiência',advances:'Avanços',
advancesText:'(Até 3 vezes) +1 em um atributo. Ganhe 1 vínculo com uma pessoa relevante ou com o navio. Escolha um movimento da classe ainda não marcado.',
lastWords:'Últimas Palavras',vice:'Vício',marked:'Marcado',kit:'Kit',addKit:'Adicionar aos pertences',questions:'Perguntas',notes:'Anotações',
file:'Arquivo',link:'Link',defArt:'Arte padrão',askUrl:'URL da imagem:',roll:'Rolar',dice:'Dados',clear:'Limpar histórico',bonus:'Bônus / penalidade',normal:'Normal',low2:'2 menores de 3d6',
full:'Sucesso total (10+)',part:'Sucesso parcial (7-9)',miss:'Falha (6-)',confirmDel:'Excluir este personagem?',
pbMoves:'Movimentos da classe',basic:'Movimentos Básicos',special:'Movimentos Especiais',shipMoves:'Movimentos de Navio',downtime:'Movimentos de Descanso',core:'Sempre adquirido',
shipName:'Nome do navio',kitMods:'Kit',wreck:'Avaria',renown:'Renome',chase:'Contador de Perseguição',legacy:'Legado (reserva)',crew:'Tripulação',cargo:'Carga',
shipAdv:'Avanços do Navio',specials:'Especiais',epilogue:'Epílogo',renownActs:'Ações de Renome',useBond:'Para rolar com vínculos gastos, ajuste o campo de bônus.',
untranslated:'Parte do texto das regras (classes e navios) ainda não foi traduzida e aparece em inglês.',invalid:'Arquivo inválido',
traits:{blood:'Sangue',vinegar:'Vinagre',polish:'Lábia',spitfire:'Centelha',steadfast:'Firmeza',speed:'Velocidade',fortune:'Fortuna'},
pb:{captain:'Capitão',chirurgeon:'Cirurgião',chronicler:'Cronista',gunslinger:'Pistoleiro',matelot:'Marujo',mountebank:'Charlatão',navigator:'Navegador',shiprat:'Rato de Navio',swashbuckler:'Espadachim'},
sh:{jewel:'A Joia',legend:'A Lenda',ramshackle:'A Desengonçada'}}};
let lang=localStorage.getItem('rps_lang')||'en';
const t=k=>UI[lang][k]??UI.en[k]??k;
const tn=k=>UI[lang].traits[k]||k, pbn=k=>UI[lang].pb[k]||k, shn=k=>UI[lang].sh[k]||k;
function merge(a,b){if(b===undefined||b===null||b==='')return a;if(Array.isArray(a))return a.map((x,i)=>merge(x,b[i]));
 if(a&&typeof a==='object'){const o={};for(const k in a)o[k]=merge(a[k],b[k]);return o}return b}
const EN=window.RULES_EN;let _R=null,_L=null;
function R(){if(_L!==lang){_R=lang==='en'?EN:merge(EN,window.RULES_PT||{});_L=lang}return _R}
const ptMissing=()=>{if(lang!=='pt')return false;const p=window.RULES_PT||{};return !(p.playbooks&&p.ships&&p.moves)};
function toggleLang(){lang=lang==='en'?'pt':'en';localStorage.setItem('rps_lang',lang);document.documentElement.lang=lang==='pt'?'pt-BR':'en';render()}
