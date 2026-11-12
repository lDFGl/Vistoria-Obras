/* Camada única de dados, cálculos e ordenação do relatório. */
(function(root){'use strict';
const STATUS_ORDER=['I','O','A','P','N'],STATUS_SYMBOL={I:'✔',O:'✔',A:'N/A',P:'⚠',N:'X'},STATUS_LABEL={I:'Implementado (IM)',O:'Oportunidade de melhoria (OM)',A:'Não avaliado / Não aplicável (NA)',P:'Parcialmente implementado (PI)',N:'Não implementado (NI)'};
const rank=s=>s==='I'||s==='O'?0:s==='A'?1:s==='P'?2:s==='N'?3:4;
function calcContract(c,criteria){let n=0,d=0;(criteria||[]).forEach((k,i)=>{const w=Number(k[2])||0,s=(c.s||[])[i];if(!w||s==='A')return;d+=w;n+=(s==='I'||s==='O')?w:s==='P'?w/2:0});const p=d?n/d:null;return{p,lv:p==null?'A':p>=.8?'I':p>=.5?'P':'N'}}
function calcTotals(contracts,criteria){const results=(contracts||[]).map(c=>calcContract(c,criteria)),q={I:0,P:0,N:0,A:0};results.forEach(x=>q[x.lv]++);const n=q.I+q.P+q.N,pts=q.I+.65*q.P;return{results,q,n,pts,idx:n?pts/n:0,total:(contracts||[]).reduce((a,c)=>a+(Number(c.t)||0),0),measured:(contracts||[]).reduce((a,c)=>a+(Number(c.v)||0),0)}}
function orderedIndices(contracts,criteria){return(contracts||[]).map((c,i)=>({i,rank:(()=>{const l=calcContract(c,criteria).lv;return l==='I'?0:l==='A'?1:l==='P'?2:3})()})).sort((a,b)=>a.rank-b.rank||a.i-b.i).map(x=>x.i)}
function sortCriteriaForContract(contract,criteria){return(criteria||[]).map((k,i)=>({k,i,rank:rank((contract.s||[])[i])})).sort((a,b)=>a.rank-b.rank||a.i-b.i)}
function buildReportModel(state,criteria){const source=state&&Array.isArray(state.c)?state.c:[],indices=orderedIndices(source,criteria),contracts=indices.map(i=>source[i]),totals=calcTotals(source,criteria),positions=[];indices.forEach((si,p)=>positions[si]=p+1);return{meta:state&&state.m||{},contracts,sourceIndices:indices,positions,totals,criteriaFor:c=>sortCriteriaForContract(c,criteria)}}
const api={STATUS_ORDER,STATUS_SYMBOL,STATUS_LABEL,rank,calcContract,calcTotals,orderedIndices,sortCriteriaForContract,buildReportModel};root.ReportModel=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
