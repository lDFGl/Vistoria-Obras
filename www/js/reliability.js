/* reliability.js
   Migração, validação, backup versionado e persistência testável. */
(function(root){
'use strict';
const VERSION=3,VALID=['I','O','A','P','N'];
const clone=x=>JSON.parse(JSON.stringify(x));
function unwrap(input){
  if(input&&typeof input==='object'&&!Array.isArray(input)&&input.app==='Vistoria-Obras'&&input.data)return input.data;
  return input;
}
function validateState(input){
  const s=unwrap(input);
  if(!s||typeof s!=='object'||Array.isArray(s)||!Array.isArray(s.c))return{valid:false,message:'Estrutura incompatível: lista de contratos ausente'};
  if(s.m!=null&&(typeof s.m!=='object'||Array.isArray(s.m)))return{valid:false,message:'Metadados do relatório inválidos'};
  if(s.p!=null&&(typeof s.p!=='object'||Array.isArray(s.p)))return{valid:false,message:'Recomendações inválidas'};
  const validImage=ph=>ph&&typeof ph==='object'&&typeof ph.data==='string'&&/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(ph.data);
  const imageLists=[...(Array.isArray(s.m&&s.m.imgs)?[s.m.imgs]:[]),...Object.values(s.m&&s.m.ti&&typeof s.m.ti==='object'?s.m.ti:{}).filter(Array.isArray)];
  if(imageLists.some(list=>list.some(ph=>!validImage(ph))))return{valid:false,message:'Imagem inválida: somente JPEG em base64 é permitido'};
  for(let i=0;i<s.c.length;i++){
    const c=s.c[i];if(!c||typeof c!=='object'||Array.isArray(c))return{valid:false,message:'Contrato inválido na posição '+(i+1)};
    const statuses=Array.isArray(c.s)?c.s:(typeof c.s==='string'?Array.from(c.s):(typeof c.status==='string'?Array.from(c.status):null));
    if(statuses&&statuses.some(v=>!VALID.includes(v)))return{valid:false,message:'Classificação inválida no contrato '+(i+1)};
    if(c.t!=null&&c.t!==''&&!Number.isFinite(Number(c.t)))return{valid:false,message:'Valor contratual inválido no contrato '+(i+1)};
    if(c.v!=null&&c.v!==''&&!Number.isFinite(Number(c.v)))return{valid:false,message:'Valor medido inválido no contrato '+(i+1)};
    if(c.imgs!=null&&(!Array.isArray(c.imgs)||c.imgs.some(ph=>!validImage(ph))))return{valid:false,message:'Imagem inválida no contrato '+(i+1)};
  }
  return{valid:true,message:''};
}
function normalizeState(input,criteriaCount){
  const source=unwrap(input),check=validateState(source);if(!check.valid)throw new Error(check.message);
  const s=clone(source),count=Number.isInteger(criteriaCount)&&criteriaCount>=0?criteriaCount:null;
  s.m=Object.assign({sec4:'',sec5:'',sec6:'',lim:'',imgs:[],pa:[],pdfOrientation:'portrait'},s.m||{});
  s.m.pdfOrientation=s.m.pdfOrientation==='landscape'?'landscape':'portrait';
  s.m.pa=Array.isArray(s.m.pa)?s.m.pa:[];
  s.m.imgs=Array.isArray(s.m.imgs)?s.m.imgs:[];
  s.m.rex=s.m.rex||'';s.m.concl=s.m.concl||'';s.m.imp=s.m.imp||'Alto';s.m.prb=s.m.prb||'Extremo';
  s.c=s.c.map(c=>{
    const raw=Array.isArray(c.s)?c.s:(typeof c.s==='string'?Array.from(c.s):(typeof c.status==='string'?Array.from(c.status):[]));
    const statuses=count===null?raw:raw.slice(0,count);
    if(count!==null)while(statuses.length<count)statuses.push('A');
    const out=Object.assign({f:'',ct:'',t:0,v:0,o:{},ac:{},imgs:[]},c);
    out.s=statuses;delete out.status;
    out.t=out.t===''?0:Number(out.t||0);out.v=out.v===''?0:Number(out.v||0);
    out.o=out.o&&typeof out.o==='object'&&!Array.isArray(out.o)?out.o:{};
    out.ac=out.ac&&typeof out.ac==='object'&&!Array.isArray(out.ac)?out.ac:{};
    out.imgs=Array.isArray(out.imgs)?out.imgs:[];
    return out;
  });
  s.p=s.p&&typeof s.p==='object'&&!Array.isArray(s.p)?s.p:{};
  return s;
}
function createBackup(state,now){
  return JSON.stringify({app:'Vistoria-Obras',schemaVersion:VERSION,exportedAt:(now||new Date()).toISOString(),data:clone(state)},null,2);
}
function parseBackup(text,criteriaCount){
  let parsed;try{parsed=typeof text==='string'?JSON.parse(text):text}catch(e){throw new Error('Arquivo JSON inválido')};
  if(parsed&&parsed.app==='Vistoria-Obras'&&Number(parsed.schemaVersion)>VERSION)throw new Error('Backup criado por uma versão mais recente do aplicativo');
  const validation=validateState(parsed);if(!validation.valid)throw new Error(validation.message);
  return normalizeState(parsed,criteriaCount);
}
function readStorage(storage,key,criteriaCount){
  let raw;try{raw=storage.getItem(key)}catch(e){return{state:null,error:e}}
  if(raw==null)return{state:null,error:null};
  try{return{state:normalizeState(JSON.parse(raw),criteriaCount),error:null}}
  catch(e){try{storage.setItem(key+'.recovery',raw)}catch(ignore){}return{state:null,error:e}}
}
function writeStorage(storage,key,state){
  try{storage.setItem(key,JSON.stringify(state));return{ok:true,error:null}}
  catch(e){return{ok:false,error:e}}
}
const api={VERSION,validateState,normalizeState,createBackup,parseBackup,readStorage,writeStorage};
root.Reliability=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
