/* state.js
   Estado da aplicação (S), persistência no localStorage, cálculo de notas e ordenação dos contratos. */
let S,cur=0,tab='chk',arm=0;

// estado inicial de um relatório novo (a partir de data/relatorio-padrao.json e data/contratos-exemplo.json)
const seed=()=>({m:JSON.parse(JSON.stringify(SEED_META)),
  c:SEED_CONTRACTS.map(x=>({f:x.fornecedor,ct:String(x.contrato),t:+x.total,v:+x.valorMedido,s:String(x.status).split(''),o:{},ac:{}})),p:{}});
function initState(){
try{S=JSON.parse(localStorage.getItem(LS_KEY))}catch(e){}S=S||seed();S.m=Object.assign({sec4:'',sec5:'',sec6:'',lim:'',imgs:[],pa:[]},S.m||{});S.m.pa=Array.isArray(S.m.pa)?S.m.pa:[];S.m.rex=S.m.rex||'';S.m.concl=S.m.concl||'';S.m.imp=S.m.imp||'Alto';S.m.prb=S.m.prb||'Extremo';S.m.imgs=Array.isArray(S.m.imgs)?S.m.imgs:[];S.c=(S.c||[]).map(c=>Object.assign({o:{},ac:{},imgs:[]},c,{o:c.o||{},ac:c.ac||{},imgs:Array.isArray(c.imgs)?c.imgs:[]}));S.p=S.p||{};normTI();normCR();
}
const save=()=>{try{localStorage.setItem(LS_KEY,JSON.stringify(S))}catch(e){toast('Memória do navegador cheia: exporte os dados e use imagens menores')}};
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const R$=n=>'R$ '+(+n).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const pc=n=>(n*100).toFixed(2).replace('.',',')+'%';
function calc(c){let n=0,d=0;CR.forEach((k,i)=>{const w=k[2],s=c.s[i];if(!w||s=='A')return;d+=w;n+=(s=='I'||s=='O')?w:s=='P'?w/2:0});
 const p=d?n/d:null;return{p,lv:p==null?'A':p>=.8?'I':p>=.5?'P':'N'}}
function tot(){const r=S.c.map(calc),q={I:0,P:0,N:0,A:0};r.forEach(x=>q[x.lv]++);const n=q.I+q.P+q.N;
 return{r,q,n,pts:q.I+.65*q.P,idx:n?(q.I+.65*q.P)/n:0,tot:S.c.reduce((a,c)=>a+c.t,0),med:S.c.reduce((a,c)=>a+c.v,0)}}
function normCR(){S.c=(S.c||[]).map(c=>{c.s=Array.from({length:CR.length},(_,i)=>(c.s&&c.s[i])||'A');return c})}
function normTI(){const m=S.m;m.ti=Object.assign({sec4:[],sec5:[],sec6:[],lim:[],rex:[],concl:[]},m.ti||{});Object.keys(m.ti).forEach(k=>{m.ti[k]=Array.isArray(m.ti[k])?m.ti[k]:[]});if(Array.isArray(m.imgs)&&m.imgs.length){m.ti.sec4=m.ti.sec4.concat(m.imgs);m.imgs=[]}}
const hi=k=>((S.m.ti||{})[k]||[]).length>0;
// ordem de exibição dos contratos no relatório: IM/OM -> NA -> PI -> NI (dentro de cada grupo, ordem de cadastro)
const RK=c=>{const l=calc(c).lv;return l=='I'||l=='O'?0:l=='A'?1:l=='P'?2:3};
const ordIdx=()=>S.c.map((c,j)=>[RK(c),j]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(x=>x[1]);
const sortedC=()=>ordIdx().map(j=>S.c[j]);
const posOf=()=>{const p=[];ordIdx().forEach((j,n)=>{p[j]=n+1});return p};
const aff=i=>{const P=posOf();return S.c.map((c,j)=>[c,j]).filter(([c])=>c.s[i]=='P'||c.s[i]=='N').map(([c,j])=>P[j]).sort((a,b)=>a-b).map(n=>'8.'+n)};
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),3500)}
