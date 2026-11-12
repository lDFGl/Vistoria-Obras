/* state.js
   Estado da aplicação (S), persistência no localStorage, cálculo de notas e ordenação dos contratos. */
let S,cur=0,tab='chk',arm=0;

// estado inicial de um relatório novo (a partir de data/relatorio-padrao.json e data/contratos-exemplo.json)
const seed=()=>({m:JSON.parse(JSON.stringify(SEED_META)),
  c:SEED_CONTRACTS.map(x=>({f:x.fornecedor,ct:String(x.contrato),t:+x.total,v:+x.valorMedido,s:String(x.status).split(''),o:{},ac:{}})),p:{}});
function initState(){
try{S=JSON.parse(localStorage.getItem(LS_KEY))}catch(e){}S=S||seed();S.m=Object.assign({sec4:'',sec5:'',sec6:'',lim:'',imgs:[],pa:[]},S.m||{});S.m.pa=Array.isArray(S.m.pa)?S.m.pa:[];S.m.pdfOrientation=S.m.pdfOrientation==='landscape'?'landscape':'portrait';S.m.rex=S.m.rex||'';S.m.concl=S.m.concl||'';S.m.imp=S.m.imp||'Alto';S.m.prb=S.m.prb||'Extremo';S.m.imgs=Array.isArray(S.m.imgs)?S.m.imgs:[];S.c=(S.c||[]).map(c=>Object.assign({o:{},ac:{},imgs:[]},c,{o:c.o||{},ac:c.ac||{},imgs:Array.isArray(c.imgs)?c.imgs:[]}));S.p=S.p||{};normTI();normCR();
}
const save=()=>{try{localStorage.setItem(LS_KEY,JSON.stringify(S))}catch(e){toast('Memória do navegador cheia: exporte os dados e use imagens menores')}};
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const R$=n=>'R$ '+(+n).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const pc=n=>(n*100).toFixed(2).replace('.',',')+'%';
function calc(c){return ReportModel.calcContract(c,CR)}
function tot(){const x=ReportModel.calcTotals(S.c,CR);return{r:x.results,q:x.q,n:x.n,pts:x.pts,idx:x.idx,tot:x.total,med:x.measured}}
function normCR(){S.c=(S.c||[]).map(c=>{c.s=Array.from({length:CR.length},(_,i)=>(c.s&&c.s[i])||'A');return c})}
function normTI(){const m=S.m;m.ti=Object.assign({sec4:[],sec5:[],sec6:[],lim:[],rex:[],concl:[]},m.ti||{});Object.keys(m.ti).forEach(k=>{m.ti[k]=Array.isArray(m.ti[k])?m.ti[k]:[]});if(Array.isArray(m.imgs)&&m.imgs.length){m.ti.sec4=m.ti.sec4.concat(m.imgs);m.imgs=[]}}
const hi=k=>((S.m.ti||{})[k]||[]).length>0;
// ordem de exibição dos contratos no relatório: IM/OM -> NA -> PI -> NI (dentro de cada grupo, ordem de cadastro)
const RK=c=>{const l=calc(c).lv;return l=='I'?0:l=='A'?1:l=='P'?2:3};
const ordIdx=()=>ReportModel.orderedIndices(S.c,CR);
const sortedC=()=>ReportModel.buildReportModel(S,CR).contracts;
const posOf=()=>ReportModel.buildReportModel(S,CR).positions;
const aff=i=>{const P=posOf();return S.c.map((c,j)=>[c,j]).filter(([c])=>c.s[i]=='P'||c.s[i]=='N').map(([c,j])=>P[j]).sort((a,b)=>a-b).map(n=>'8.'+n)};
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),3500)}
