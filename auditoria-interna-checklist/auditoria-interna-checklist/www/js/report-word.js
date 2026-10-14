/* report-word.js
   Geração do relatório em Word (docx). Os contratos saem na ordem IM/OM → NA → PI → NI. */
async function word(){const bak=S.c;S.c=sortedC();try{return await wordGen()}finally{S.c=bak}}
async function wordGen(){try{
const D=window.docx;if(!D){toast('Biblioteca Word não carregou (verifique a conexão)');return}
if(!S.c.length){toast('Nenhum contrato para gerar o relatório');return}
const{Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,ImageRun,Header,Footer,AlignmentType:AL,WidthType:WT,ShadingType,BorderStyle:BS,PageNumber,VerticalAlign:VA,HeadingLevel,LineRuleType,TableOfContents,Bookmark,PageReference}=D;
const C='135C6C',T=tot(),m=S.m,ic={I:'I',P:'P',N:'N',O:'I',A:'A'},RM=['I','II','III','IV','V','VI','VII','VIII','IX'];
const u8=k=>Uint8Array.from(atob(IMG[k].split(',')[1]),c=>c.charCodeAt(0));
const u8data=x=>Uint8Array.from(atob(x.split(',')[1]),c=>c.charCodeAt(0));
const fit=(ph,maxW,maxH)=>{const w=Number(ph&&ph.w)||1400,h=Number(ph&&ph.h)||900,s=Math.min(maxW/w,maxH/h,1);return{width:Math.max(1,Math.round(w*s)),height:Math.max(1,Math.round(h*s))}};
const im=(k,w,h)=>new ImageRun({type:'png',data:u8(k),transformation:{width:w,height:h}});
const bd={style:BS.SINGLE,size:4,color:'7F7F7F'},B={top:bd,bottom:bd,left:bd,right:bd},nb={style:BS.NONE,size:0,color:'FFFFFF'},NB={top:nb,bottom:nb,left:nb,right:nb};
const tr=(t,o={})=>new TextRun({text:String(t),font:o.f||'Arial',size:o.s||20,bold:o.b,italics:o.i,color:o.c});
const pa=(t,o={})=>new Paragraph({alignment:o.a||AL.JUSTIFIED,spacing:{before:o.bf||0,after:o.af??120,line:276},pageBreakBefore:o.pb,heading:o.h,children:Array.isArray(t)?t:[tr(t,o)]});
const ce=(c,w,o={})=>new TableCell({width:{size:w,type:WT.DXA},borders:o.nb?NB:B,verticalAlign:VA.CENTER,columnSpan:o.cs,margins:{top:60,bottom:60,left:90,right:90},shading:o.f?{type:ShadingType.CLEAR,fill:o.f,color:'auto'}:undefined,children:Array.isArray(c)?c:[pa(c,{a:o.a,b:o.b,i:o.i,c:o.c,s:o.s||18,af:0})]});
const tb=(ws,rows,ind)=>new Table({width:{size:ws.reduce((a,b)=>a+b),type:WT.DXA},columnWidths:ws,indent:ind?{size:ind,type:WT.DXA}:undefined,rows:rows.map(r=>new TableRow({cantSplit:true,tableHeader:!!r.h,children:r.c||r}))});
const hd=(t,w)=>ce(t,w,{f:C,c:'FFFFFF',b:1,a:AL.CENTER}),ico=(k,w)=>ce([pa([im(ic[k],24,22)],{a:AL.CENTER,af:0})],w),sp=()=>pa('',{af:60});
const H1=(t,o={})=>pa(t,{h:HeadingLevel.HEADING_1,b:1,s:24,pb:true,af:200,a:AL.LEFT,...o});
const tx1=([t,x])=>t=='b'?new Paragraph({alignment:AL.JUSTIFIED,bullet:{level:0},spacing:{after:60},children:[tr(x)]}):t=='h'?pa(x,{b:1,bf:120,af:60,a:AL.LEFT}):pa(x,{a:AL.JUSTIFIED});
const runs=(t,o={})=>String(t).split(/\*\*(.+?)\*\*/g).map((q,i)=>tr(q,{...o,b:o.b||i%2==1}));
const rtW=t=>parseRT(t).map(e=>e.k=='h'?pa(runs(e.t,{b:1}),{a:AL.LEFT,bf:120,af:80}):e.k=='b'?new Paragraph({alignment:AL.JUSTIFIED,bullet:{level:0},spacing:{after:80,line:276},children:runs(e.t)}):e.k=='n'?new Paragraph({alignment:AL.JUSTIFIED,indent:{left:567,hanging:567},spacing:{after:80,line:276},children:[tr(e.l+'  ',{b:1}),...runs(e.t)]}):pa(runs(e.t),{a:AL.JUSTIFIED}));
const SY={I:['✔','00B050'],O:['✔','00B050'],P:['⚠','FFC000'],N:['✖','FF0000'],A:['N/A','008AC9']};
const tx=k=>(TX[k]||[]).map(tx1);
const ctr=AL.CENTER,cb={b:1,a:ctr};
const imgW=(k,mw=620,mh=400)=>{const a=(m.ti&&m.ti[k])||[];return a.length?[new Paragraph({keepNext:true,spacing:{before:140,after:100},children:[tr('Imagens de apoio:',{b:1})]}),...a.flatMap(ph=>[new Paragraph({alignment:AL.CENTER,spacing:{after:80},keepNext:true,children:[new ImageRun({type:'jpeg',data:u8data(ph.data),transformation:fit(ph,mw,mh)})]}),pa(ph.name||'Imagem do relatório',{a:AL.CENTER,i:1,s:16,af:120})])]:[]};
// capa
const cover=[pa('RELATÓRIO DE AUDITORIA INTERNA',{a:ctr,b:1,s:36,bf:2400,af:200}),pa(m.ai,{a:ctr,b:1,s:36,af:1500}),pa(m.tema,{a:ctr,b:1,s:36,af:0}),pa(m.obra,{a:ctr,b:1,s:36,af:2200}),pa(m.mes,{a:ctr,b:1,s:30})];
// quadro geral
const q=[['Implementados (IM)',T.q.I+' (1 ponto)',T.q.I],['Oportunidade de Melhoria (OM)','0 (1 ponto)',0],['Não analisado – Não Aplicável (NA)',T.q.A,0],['Parcialmente implementados (PI)',T.q.P+' (0,65 pontos)',(T.q.P*.65).toFixed(2)],['Não implementados (NI)',T.q.N+' (0 pontos)',0]];
const qg=[pa('QUADRO GERAL:',{b:1,pb:true}),pa('Apresenta-se, a seguir, a síntese dos resultados da auditoria interna realizada sobre as medições de serviços pagas a empreiteiros e demais prestadores vinculados ao empreendimento, com base nas informações disponibilizadas pela equipe de Engenharia e nas evidências obtidas durante os procedimentos de auditoria:',{a:AL.JUSTIFIED}),
tb([900,5038,1200,2500],[{h:1,c:[hd('Item:',900),hd('Processo Auditado:',5038),hd('Página:',1200),hd('Nível de Conformidade:',2500)]},...S.c.map((c,j)=>{const[g,col]=SY[T.r[j].lv];return[ce('8.'+(j+1),900,cb),ce(c.f,5038,{b:1}),ce([pa([new PageReference('ct'+j)],{a:ctr,af:0,b:1,s:18})],1200),ce([pa([tr(g,{b:1,c:col,f:'Segoe UI Symbol',s:22})],{a:ctr,af:0})],2500)]}),[ce('TOTAL APROVEITAMENTO %',7138,{cs:3,f:C,c:'FFFFFF',b:1,a:ctr}),ce(pc(T.idx),2500,{f:C,c:'FFFFFF',b:1,a:ctr})]]),sp(),
tb([5238,2400,2000],[{h:1,c:[hd('Controles Internos:',5238),hd('Quantidade:',2400),hd('Pontos:',2000)]},...q.map(r=>[ce(r[0],5238,{b:1}),ce(r[1],2400,cb),ce(r[2],2000,cb)]),[ce('TOTAL',5238,{b:1,f:'D9D9D9'}),ce(T.n,2400,{b:1,a:ctr,f:'D9D9D9'}),ce(T.pts.toFixed(2),2000,{b:1,a:ctr,f:'D9D9D9'})]]),sp(),
pa([tr('Obs.: ',{b:1}),tr('Cálculo do Nível de Conformidade ('+T.pts.toFixed(2)+' ÷ '+T.n+') x 100 = '),tr(pc(T.idx),{b:1})]),...rtW(m.rex),...imgW('rex')];
const sum=['1. INTRODUÇÃO','2. LEGISLAÇÃO E MARCO REGULATÓRIO APLICÁVEL','3. OBJETIVOS DA AUDITORIA INTERNA'];if(m.sec4||hi('sec4'))sum.push('4. ORGANOGRAMA E FLUXOGRAMA');if(m.sec5||hi('sec5'))sum.push('5. PROCEDIMENTOS INTERNOS');if(m.sec6||hi('sec6'))sum.push('6. TESTES DA AUDITORIA INTERNA');if(m.lim||hi('lim'))sum.push('6.1. LIMITAÇÃO DE ESCOPO');sum.push('7. ESCOPO e AMOSTRAGEM','8. CONSTATAÇÕES DA AUDITORIA','10. CONCLUSÃO DA AUDITORIA','11. RESUMO DAS RECOMENDAÇÕES DA AUDITORIA INTERNA e PLANOS DE AÇÕES DO SETOR AUDITADO');
const sm=[pa('SUMÁRIO',{h:HeadingLevel.HEADING_1,b:1,s:24,pb:true,a:ctr,af:240}),new TableOfContents('Sumário',{hyperlink:true,headingStyleRange:'1-3',rightTabStop:9000}) ,sp()];
// seções 1, 2
const s1=[H1('1. INTRODUÇÃO'),...tx('1')],s2=[H1('2. LEGISLAÇÃO E MARCO REGULATÓRIO APLICÁVEL'),...tx('2')];
// seção 3
const lg=tb([1200,8438],[{h:1,c:[ce('LEGENDA:',9638,{cs:2,f:C,c:'FFFFFF',b:1})]},...[['IM','Implementado;'],['OM','Oportunidade de melhoria;'],['NA','Não avaliado e ou Não Aplicável;'],['PI','Parcialmente implementado; e'],['NI','Não implementado.']].map(r=>[ce(r[0],1200,cb),ce(r[1],8438,{b:1})])]);
const ps=tb([3600,4238,1800],[['Implementado (IM)','Possui peso de ≥ 80%','I'],['Oportunidade de Melhoria (OM)','Possui peso de ≥ 80%','O'],['Não Avaliado ou Não Aplicável (NA)','Não possui peso 0%','A'],['Parcialmente implementado (PI)','Possui peso entre ≥ 50% até 79%','P'],['Não implementado (NI)','Possui peso abaixo de < 50%','N']].map(r=>[ce(r[0],3600,{b:1}),ce(r[1],4238),ico(r[2],1800)]));
const s3=[H1('3. OBJETIVOS DA AUDITORIA INTERNA')];(TX['3']||[]).forEach(e=>{s3.push(tx1(e));if(e[1].startsWith('Para cada aspecto'))s3.push(lg,sp());if(e[1].startsWith('Concluída'))s3.push(ps,sp())});
// 4, 5, 6 e 6.1 — opcionais e editáveis pelo usuário
const s4=(m.sec4||hi('sec4'))? [H1('4. ORGANOGRAMA E FLUXOGRAMA',{pb:false}),...rtW(m.sec4),...imgW('sec4',940,520)] : [];
const s5=(m.sec5||hi('sec5'))? [H1('5. PROCEDIMENTOS INTERNOS'),...rtW(m.sec5),...imgW('sec5')] : [];
const s6=(m.sec6||hi('sec6'))? [H1('6. TESTES DA AUDITORIA INTERNA'),...rtW(m.sec6),...imgW('sec6')] : [];
if(m.lim||hi('lim')){s6.push(H1('6.1. LIMITAÇÃO DE ESCOPO',{pb:!(m.sec6||hi('sec6'))}),...rtW(m.lim),...imgW('lim'))}
// 7
const s7=[H1('7. ESCOPO e AMOSTRAGEM'),pa('A auditoria interna utilizou como base a planilha gerencial de controle de medições pagas a empreiteiros e prestadores de serviços referente à competência de '+m.mes+'. O escopo adotou a cobertura integral (100%) do universo de serviços medidos, correspondendo a um volume financeiro validado de '+R$(T.med)+'. A seguir, apresentamos as empresas submetidas à avaliação documental e inspeção in loco:',{a:AL.JUSTIFIED}),
tb([800,1100,3538,2100,2100],[{h:1,c:[hd('ITEM:',800),hd('CONTRATO:',1100),hd('FORNECEDOR:',3538),hd('TOTAL CONTRATO:',2100),hd('VALOR MEDIDO:',2100)]},...S.c.map((c,j)=>[ce(j+1,800,cb),ce(c.ct,1100,cb),ce(c.f,3538,{b:1}),ce(R$(c.t),2100,{b:1,a:AL.RIGHT}),ce(R$(c.v),2100,{b:1,a:AL.RIGHT})]),[ce('TOTAL PAGO:',5438,{cs:3,f:C,c:'FFFFFF',b:1,a:ctr}),ce(R$(T.tot),2100,{f:C,c:'FFFFFF',b:1,a:AL.RIGHT}),ce(R$(T.med),2100,{f:C,c:'FFFFFF',b:1,a:AL.RIGHT})]])];
// 8: uma página por contrato
const MK={I:['✔','00B050'],O:['✔','00B050'],P:['⚠','FFC000'],N:['X','FF0000'],A:['N/A','008AC9']};
const s8=[H1('8. CONSTATAÇÕES DA AUDITORIA')];
S.c.forEach((c,j)=>{const r=T.r[j];if(j>0)s8.push(pa('',{pb:true,af:0}));
 s8.push(tb([900,6138,2600],[{h:1,c:[hd('Item:',900),hd('Serviço/Terceirizada:',6138),hd('Valor Medido:',2600)]},[ce([pa([new Bookmark({id:'ct'+j,children:[tr('8.'+(j+1),{b:1,s:18})]})],{a:ctr,af:0})],900),ce(c.f+' (contrato '+c.ct+')',6138,{b:1}),ce(R$(c.v),2600,cb)]]),sp(),pa('Resultado da Auditoria Interna:',{b:1}));
 CR.forEach((k,i)=>{const[g,col]=MK[c.s[i]];s8.push(pa([tr(g,{b:1,c:col,f:'Segoe UI Symbol'}),tr(' - '+k[1]+(c.o[k[0]]?' — '+c.o[k[0]]:'')+';')],{af:60}))});
 const rc=CR.filter((k,i)=>c.s[i]=='P'||c.s[i]=='N');s8.push(pa('Recomendação da Auditoria Interna:',{b:1,bf:160}));
 (rc.length?rc.map((k,i)=>RM[i]+'. '+k[4]):['I. Processo sem pendências.']).forEach((t,i)=>{const k=rc[i]?.[0];const action='';s8.push(pa(t+action,{a:AL.JUSTIFIED,af:80}));});
 if((c.imgs||[]).length){s8.push(pa('Evidências fotográficas:',{b:1,bf:120,af:80}));for(const ph of c.imgs){try{s8.push(pa([new ImageRun({type:'jpeg',data:u8data(ph.data),transformation:fit(ph,600,380)})],{a:AL.CENTER,af:80}),pa(ph.name||'Evidência fotográfica',{a:AL.CENTER,i:1,s:16,af:100}))}catch(e){}}}
s8.push(sp(),tb([2400,5238,2000],[[ce('Nível de Conformidade:',2400,{b:1}),ce(LB[r.lv]+' – '+(NM[r.lv]||'Não avaliado')+(r.p==null?'':' ('+pc(r.p)+')'),5238,{b:1}),ico(r.lv,2000)],[ce('Objetivo do Controle:',2400,{b:1}),ce('Controle Interno e Gestão',5238,{b:1}),ce('',2000)],[ce('Dono do Processo:',2400,{b:1}),ce('Engenharia e Suprimentos',5238,{b:1}),ce('',2000)]]),sp(),tb([2400,7238],[[ce('Comentário do Setor:',2400,{b:1,i:1}),ce('',7238)]]))});
// 10
const mi=Math.max(0,LV.indexOf(m.imp)),mp=Math.max(0,LV.indexOf(m.prb)),CF=['92D050','C6E0B4','FFD966','F4B183','FF7C80'];
const s9=[H1('9. TABELA DE MAGNITUDE (IMPACTO x PROBABILIDADE)'),...rtW(MG.t),sp(),
tb([1738,1580,1580,1580,1580,1580],[{h:1,c:[hd('IMPACTO / Magnitude',1738),...LV.map(l=>hd(l,1580))]},...[4,3,2,1,0].map(r=>[ce(LV[r],1738,{b:1,a:ctr}),...LV.map((l,j)=>ce(r==mi&&j==mp?'FG '+pc(T.idx):'',1580,{f:CF[Math.floor((r+j)/2)],b:1,a:ctr}))]),[ce('PROBABILIDADE',9638,{cs:6,b:1,a:ctr})]]),sp(),
tb([1800,900,4238,2700],[{h:1,c:[hd('Graduação',1800),hd('Nível',900),hd('Descrição',4238),hd('Ocorrências',2700)]},...MG.p.map((r,i)=>[ce(r[0],1800,{b:1,f:CF[4-i]}),ce(r[1],900,cb),ce(r[2],4238),ce(r[3],2700)])]),sp(),
tb([1500,700,2500,3638,1300],[{h:1,c:[hd('Graduação',1500),hd('Nível',700),hd('Descrição',2500),hd('Tipo de dano',3638),hd('Financeiro',1300)]},...MG.i.map((r,i)=>[ce(r[0],1500,{b:1,f:CF[4-i]}),ce(r[1],700,cb),ce(r[2],2500),ce(r[3],3638),ce(r[4],1300,cb)])])];
const s10=[H1('10. CONCLUSÃO DA AUDITORIA'),pa('Verificamos um total de '+T.n+' processos de medição de obras do empreendimento, correspondentes à totalidade das medições da competência de '+m.mes+', no montante de '+R$(T.med)+'. O resultado consolidado indicou nível de conformidade de '+pc(T.idx)+', composto por '+T.q.I+' controles implementados, '+T.q.N+' não implementados e '+T.q.P+' parcialmente implementados. As exceções identificadas requerem tratamento específico, com definição de responsáveis, prazos e evidências de conclusão, especialmente nos casos classificados como não implementados e parcialmente implementados.',{a:AL.JUSTIFIED})];
s10.push(...rtW(m.concl));
s10.push(...imgW('concl'));
// 11
const rw=[{h:1,c:[hd('ITEM / SETOR:',1100),hd('CONSTATAÇÃO:',2200),hd('RECOMENDAÇÃO DA AUDITORIA INTERNA:',3938),hd('PRAZO:',1200),hd('STATUS:',1200)]}];let n=0;
CR.forEach((k,i)=>{const a=aff(i);if(!a.length)return;const p=S.p[k[0]]||{};n++;rw.push([ce([pa(String(n),{b:1,s:18,af:0}),pa(p.s??k[5],{b:1,s:18,af:0})],1100),ce(k[3],2200),ce([pa(k[4],{s:18,af:60}),pa('Contratos afetados: '+a.join(', ')+'.',{b:1,s:18,af:60})],3938),ce(p.z||'—',1200,{a:ctr}),ce(p.t||'Pendente',1200,cb)]);rw.push([ce('PLANO DE AÇÃO DO SETOR AUDITADO: '+(p.x||''),9638,{cs:5,f:'ECF0F6',b:1})])});
(m.pa||[]).forEach(e=>{if(!(e.c||e.r||e.x))return;n++;rw.push([ce([pa(String(n),{b:1,s:18,af:0}),pa(e.s||'—',{b:1,s:18,af:0})],1100),ce(e.c||'',2200),ce([pa(e.r||'',{s:18,af:60})].concat(e.a?[pa('Itens afetados: '+e.a,{b:1,s:18,af:60})]:[]),3938),ce(e.z||'—',1200,{a:ctr}),ce(e.t||'Pendente',1200,cb)]);rw.push([ce('PLANO DE AÇÃO DO SETOR AUDITADO: '+(e.x||''),9638,{cs:5,f:'ECF0F6',b:1})])});
const s11=[H1('11. RESUMO DAS RECOMENDAÇÕES DA AUDITORIA INTERNA e PLANOS DE AÇÕES DO SETOR AUDITADO'),pa('Resumo do acompanhamento das recomendações feitas pela auditoria interna e providências tomadas pelo setor auditado para atender as demandas.',{a:AL.JUSTIFIED}),n?tb([1100,2200,3938,1200,1200],rw):pa('Sem constatações PI/NI.')];
// cabeçalho e rodapé (faixa 135C6C + logo)
const tiny=()=>new Paragraph({spacing:{after:0,line:20,lineRule:LineRuleType.EXACT},children:[]});
const wh={b:1,c:'FFFFFF',s:16,a:AL.RIGHT,af:0};
const hdr=new Header({children:[tb([3800,8106],[[ce([pa([im('logo',Math.round(46*LG.w/LG.h),46)],{af:0})],3800,{f:C,nb:1}),ce([pa(m.ai+' '+m.tema,wh),pa('AUDITORIA INTERNA',wh),pa(m.mes.toUpperCase(),wh)],8106,{f:C,nb:1})]],-1134),tiny()]});
const ftr=new Footer({children:[tb([11906],[[ce([new Paragraph({alignment:ctr,children:[new TextRun({children:['Página ',PageNumber.CURRENT],font:'Arial',size:16,bold:true,color:'FFFFFF'})]})],11906,{f:C,nb:1})]],-1134),tiny()]});
const portraitProps={page:{size:{width:11906,height:16838},margin:{top:1800,bottom:1000,left:1134,right:1134,header:0,footer:0}}};
const landscapeProps={page:{size:{width:16838,height:11906},margin:{top:1500,bottom:900,left:900,right:900,header:0,footer:0}}};
const hdrL=new Header({children:[tb([5000,11838],[[ce([pa([im('logo',Math.round(46*LG.w/LG.h),46)],{af:0})],5000,{f:C,nb:1}),ce([pa(m.ai+' '+m.tema,wh),pa('AUDITORIA INTERNA',wh),pa(m.mes.toUpperCase(),wh)],11838,{f:C,nb:1})]],-900),tiny()]});
const ftrL=new Footer({children:[tb([15038],[[ce([new Paragraph({alignment:ctr,children:[new TextRun({children:['Página ',PageNumber.CURRENT],font:'Arial',size:16,bold:true,color:'FFFFFF'})]})],15038,{f:C,nb:1})]],-900),tiny()]});
const pre=[...cover,...qg,...sm,...s1,...s2,...s3],post=[...s5,...s6,...s7,...s8,...s9,...s10,...s11];
const hasLandscape=!!(m.sec4||hi('sec4'));
const sections=hasLandscape?[{properties:portraitProps,headers:{default:hdr},footers:{default:ftr},children:pre},{properties:landscapeProps,headers:{default:hdrL},footers:{default:ftrL},children:s4},{properties:portraitProps,headers:{default:hdr},footers:{default:ftr},children:post}]:[{properties:portraitProps,headers:{default:hdr},footers:{default:ftr},children:[...pre,...s4,...post]}];
const doc=new Document({features:{updateFields:true},creator:'Auditoria Interna',title:m.ai+' - '+m.tema,styles:{default:{document:{run:{font:'Arial',size:20}}}},sections});
const blob=await Packer.toBlob(doc);
dl(m.ai.replace(/\W+/g,'-')+'-'+m.tema.replace(/\W+/g,'-')+'.docx',blob);
}catch(e){console.error(e);toast('Erro ao gerar Word: '+(e&&e.message||e))}}
