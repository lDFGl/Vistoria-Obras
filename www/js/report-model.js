/* Camada única de dados, cálculos e ordenação do relatório. */
(function(root){'use strict';
const STATUS_ORDER=['I','O','A','P','N'],STATUS_SYMBOL={I:'✔',O:'✔',A:'N/A',P:'⚠',N:'X'},STATUS_LABEL={I:'Implementado (IM)',O:'Oportunidade de melhoria (OM)',A:'Não avaliado / Não aplicável (NA)',P:'Parcialmente implementado (PI)',N:'Não implementado (NI)'};
const rank=s=>s==='I'||s==='O'?0:s==='A'?1:s==='P'?2:s==='N'?3:4;
function calcContract(c,criteria){let n=0,d=0;(criteria||[]).forEach((k,i)=>{const w=Number(k[2]),s=(c.s||[])[i];if(!Number.isFinite(w)||w<=0||!['I','O','A','P','N'].includes(s)||s==='A')return;d+=w;n+=(s==='I'||s==='O')?w:s==='P'?w/2:0});const p=d?n/d:null;return{p,lv:p==null?'A':p>=.8?'I':p>=.5?'P':'N'}}
function calcTotals(contracts,criteria){const results=(contracts||[]).map(c=>calcContract(c,criteria)),q={I:0,P:0,N:0,A:0};results.forEach(x=>q[x.lv]++);const n=q.I+q.P+q.N,pts=q.I+.65*q.P;return{results,q,n,pts,idx:n?pts/n:0,total:(contracts||[]).reduce((a,c)=>a+(Number(c.t)||0),0),measured:(contracts||[]).reduce((a,c)=>a+(Number(c.v)||0),0)}}
function orderedIndices(contracts,criteria){return(contracts||[]).map((c,i)=>({i,rank:(()=>{const l=calcContract(c,criteria).lv;return l==='I'?0:l==='A'?1:l==='P'?2:3})()})).sort((a,b)=>a.rank-b.rank||a.i-b.i).map(x=>x.i)}
function sortCriteriaForContract(contract,criteria){return(criteria||[]).map((k,i)=>({k,i,rank:rank((contract.s||[])[i])})).sort((a,b)=>a.rank-b.rank||a.i-b.i)}
function validateBackup(candidate){
 const s=candidate&&candidate.app==='Vistoria-Obras'&&candidate.data?candidate.data:candidate;
 if(!s||typeof s!=='object'||Array.isArray(s)||!Array.isArray(s.c)||(s.m!=null&&(typeof s.m!=='object'||Array.isArray(s.m)))||(s.p!=null&&(typeof s.p!=='object'||Array.isArray(s.p))))return{valid:false,message:'Estrutura de backup incompatível'};
 for(let i=0;i<s.c.length;i++){
  const c=s.c[i];if(!c||typeof c!=='object'||Array.isArray(c))return{valid:false,message:'Contrato inválido na posição '+(i+1)};
  const statuses=Array.isArray(c.s)?c.s:(typeof c.s==='string'?Array.from(c.s):(typeof c.status==='string'?Array.from(c.status):null));
  if(statuses&&statuses.some(v=>!['I','P','N','O','A'].includes(v)))return{valid:false,message:'Contrato inválido na posição '+(i+1)};
  if(c.t!=null&&c.t!==''&&!Number.isFinite(Number(c.t)))return{valid:false,message:'Contrato inválido na posição '+(i+1)};
  if(c.v!=null&&c.v!==''&&!Number.isFinite(Number(c.v)))return{valid:false,message:'Contrato inválido na posição '+(i+1)};
 }
 return{valid:true,message:''}
}
function buildReportModel(state,criteria){const source=state&&Array.isArray(state.c)?state.c:[],indices=orderedIndices(source,criteria),contracts=indices.map(i=>source[i]),totals=calcTotals(source,criteria),positions=[];indices.forEach((si,p)=>positions[si]=p+1);return{meta:state&&state.m||{},contracts,sourceIndices:indices,positions,totals,criteriaFor:c=>sortCriteriaForContract(c,criteria)}}
const api={STATUS_ORDER,STATUS_SYMBOL,STATUS_LABEL,rank,calcContract,calcTotals,orderedIndices,sortCriteriaForContract,validateBackup,buildReportModel};root.ReportModel=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
