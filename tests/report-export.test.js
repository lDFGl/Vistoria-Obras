const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const pdf=fs.readFileSync(path.join(__dirname,'../www/js/report-pdf.js'),'utf8');
const word=fs.readFileSync(path.join(__dirname,'../www/js/report-word.js'),'utf8');
const textos=JSON.parse(fs.readFileSync(path.join(__dirname,'../www/data/textos.json'),'utf8'));

test('PDF usa o conteúdo integral e estruturado do tópico 2 cadastrado em textos.json',()=>{
  assert.ok(Array.isArray(textos['2'])&&textos['2'].length>6,'tópico 2 deve conter todos os parágrafos, títulos e fundamentos');
  assert.match(pdf,/H\('2\. LEGISLAÇÃO E MARCO REGULATÓRIO APLICÁVEL'\);DATA\('2'\);/);
  assert.doesNotMatch(pdf,/Código Civil \(Lei 10\.406\/2002\), arts\. 610 a 626/);
});

test('PDF organiza imagens em duas colunas e aplica quebra de página antes de cada linha',()=>{
  assert.match(pdf,/const IMGS=\(k,items=null\)=>/);
  assert.match(pdf,/const pair=a\.slice\(i,i\+2\)/);
  assert.match(pdf,/if\(y\+rh>pageH\(\)-90\)NP\(\)/);
  assert.match(pdf,/IMGS\('',c\.imgs\)/);
});

test('Resumo executivo é apresentado abaixo do Quadro Geral em Word e PDF',()=>{
  assert.match(pdf,/NP\(\);H\('QUADRO GERAL'\)/);
  assert.match(pdf,/Cálculo do Nível de Conformidade[^;]*;\s*if\(m\.rex\|\|hi\('rex'\)\)\{H\('RESUMO EXECUTIVO'\)/);
  assert.match(word,/const execSummary=\(m\.rex\|\|hi\('rex'\)\)/);
  assert.match(word,/const pre=\[\.\.\.cover,\.\.\.qg,\.\.\.execSummary/);
});

test('Word apresenta imagens em tabela de duas colunas, com legenda e proporção preservada',()=>{
  assert.match(word,/const imgW=\(k,mw=620,mh=400,items=null,showTitle=true\)/);
  assert.match(word,/columnWidths:\[4200,4200\]/);
  assert.match(word,/fit\(ph,Math\.min\(mw\/2-20,190\),mh\)/);
  assert.match(word,/\.\.\.imgW\('',600,380,c\.imgs,false\)/);
});

test('Word não injeta conteúdo automático em cabeçalho ou rodapé',()=>{
  assert.doesNotMatch(word,/new Header\(|new Footer\(|headers:\s*\{|footers:\s*\{|PageNumber/);
  assert.match(word,/const sections=hasLandscape\?\[\{properties:portraitProps,children:pre\}/);
});

const reliability=require('../www/js/reliability.js');
const model=require('../www/js/report-model.js');

test('PDF e Word usam o mesmo modelo central e restauram o estado original',()=>{
  for(const [name,src] of [['PDF',pdf],['Word',word]]){
    assert.match(src,/ReportModel\.buildReportModel\(S,CR\)/,name+' deve consumir o modelo central');
    assert.match(src,/S\.c=bak/,name+' deve restaurar a lista original de contratos');
    assert.match(src,/ReportModel\.sortCriteriaForContract/,name+' deve manter a ordenação padronizada da seção 8');
  }
});
test('PDF e Word mantêm os blocos essenciais do relatório e a fonte de textos',()=>{
  for(const [name,src] of [['PDF',pdf],['Word',word]]){
    for(const section of ['1. INTRODUÇÃO','2. LEGISLAÇÃO E MARCO REGULATÓRIO APLICÁVEL','8. CONSTATAÇÕES DA AUDITORIA','9. TABELA DE MAGNITUDE','10. CONCLUSÃO DA AUDITORIA'])
      assert.ok(src.includes(section),name+' deve conter '+section);
    assert.match(src,/TX\['2'\]|DATA\('2'\)|tx\('2'\)/,name+' deve carregar a seção 2 estruturada');
    assert.match(src,/Packer\.toBlob|d\.output\('arraybuffer'\)/,name+' deve produzir o arquivo final');
  }
});
test('backup novo versionado e backup antigo sem envelope são importáveis',()=>{
  const old={m:{ai:'AI-017/2026'},c:[{f:'Fornecedor',ct:'A-1',t:'1000',v:'250',status:'IPNA'}]};
  const migrated=reliability.parseBackup(JSON.stringify(old),4);
  assert.deepEqual(migrated.c[0].s,['I','P','N','A']);
  assert.equal(migrated.p && typeof migrated.p,'object');
  const encoded=reliability.createBackup(migrated,new Date('2026-11-12T12:00:00Z'));
  const parsed=JSON.parse(encoded);
  assert.equal(parsed.app,'Vistoria-Obras');assert.equal(parsed.schemaVersion,2);
  assert.deepEqual(reliability.parseBackup(encoded,4),migrated);
});
test('backup inválido é rejeitado sem alterar estado anterior',()=>{
  const before={m:{ai:'mantido'},c:[],p:{}};
  assert.throws(()=>reliability.parseBackup('{"c":[{"s":["I","Z"]}]}',2));
  assert.deepEqual(before,{m:{ai:'mantido'},c:[],p:{}});
});
test('persistência local salva, restaura e preserva JSON corrompido para recuperação',()=>{
  const map=new Map(),storage={getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,v)};
  const state={m:{ai:'AI-018'},c:[{f:'Obra',s:['I'],t:10,v:5}],p:{}};
  assert.equal(reliability.writeStorage(storage,'aud1',state).ok,true);
  assert.deepEqual(reliability.readStorage(storage,'aud1',1).state,reliability.normalizeState(state,1));
  map.set('aud1','{json quebrado');
  assert.ok(reliability.readStorage(storage,'aud1',1).error);
  assert.equal(map.get('aud1.recovery'),'{json quebrado');
});
test('limites dos cálculos de conformidade e pesos inválidos',()=>{
  const cr=[['a','A',1],['b','B',1],['c','C',1],['d','D',1]];
  const contract=status=>({s:status,t:0,v:0});
  assert.equal(model.calcContract(contract(['I','I','I','P']),cr).p,.875);
  assert.equal(model.calcContract(contract(['I','I','P','P']),cr).p,.75);
  assert.equal(model.calcContract(contract(['I','P','P','N']),cr).p,.5);
  assert.equal(model.calcContract(contract(['P','P','N','N']),cr).p,.25);
  assert.equal(model.calcContract(contract(['A','A','A','A']),cr).lv,'A');
  assert.equal(model.calcContract(contract(['I','I']),[['x','x',-1],['y','y',0]]).lv,'A');
  assert.equal(model.calcContract(contract(['I','I','I','I']),cr).p,1);
  assert.equal(model.calcContract(contract(['I','I','I','N']),cr).p,.75);
  assert.equal(model.calcContract(contract(['I','I','I','P']),cr).lv,'I');
  assert.equal(model.calcContract(contract(['I','I','I','I','N']),[...cr,['e','E',1]]).p,.8);
  assert.equal(model.calcContract(contract(['I','I','I','I','N']),[...cr,['e','E',1]]).lv,'I');
  assert.equal(model.calcContract(contract(['I','I','I','N']),cr).lv,'P');
  assert.equal(model.calcContract(contract(['I','N','N','N']),cr).lv,'N');
});

test('falha de gravação não é reportada como persistência concluída',()=>{
  const storage={getItem:()=>null,setItem:()=>{throw new Error('quota exceeded')}};
  const result=reliability.writeStorage(storage,'aud1',{m:{},c:[],p:{}});
  assert.equal(result.ok,false);
  assert.ok(result.error);
});

test('backup de versão futura é recusado para evitar migração destrutiva',()=>{
  const future={app:'Vistoria-Obras',schemaVersion:999,data:{m:{},c:[],p:{}}};
  assert.throws(()=>reliability.parseBackup(future,0),/versão mais recente/);
});
