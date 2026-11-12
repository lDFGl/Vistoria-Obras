/* report-pdf.js
   Geração do relatório em PDF (jsPDF + autoTable). Os contratos saem na ordem IM/OM → NA → PI → NI. */
function pdf(){const bak=S.c,model=ReportModel.buildReportModel(S,CR);S.c=model.contracts;try{return pdfGen()}catch(e){console.error(e);toast('Erro ao gerar PDF: '+(e&&e.message||e))}finally{S.c=bak}}
function pdfGen(){if(!window.jspdf||!window.jspdf.jsPDF){toast('Biblioteca de PDF não carregou (verifique a conexão)');return}
 if(!S.c.length){toast('Nenhum contrato para gerar o relatório');return}
 const m=S.m,{jsPDF}=window.jspdf,d=new jsPDF({unit:'pt',format:'a4',orientation:m.pdfOrientation==='landscape'?'landscape':'portrait'});if(typeof d.autoTable!='function'){toast('Plugin de tabelas do PDF não carregou');return}const T=tot();let M=85,W=d.internal.pageSize.getWidth()-170;const centerX=()=>d.internal.pageSize.getWidth()/2,pageH=()=>d.internal.pageSize.getHeight(),col={I:[30,142,78],P:[217,138,0],N:[198,47,47],O:[43,111,214],A:[0,138,201]};let y=0;
 const NP=()=>{d.addPage();y=110},fit=h=>{if(y+h>pageH()-90)NP()};
 const H=t=>{if(y>110)NP();d.setFont('helvetica','bold').setFontSize(13).setTextColor(19,92,108);d.text(t,M,y);y+=8;d.setDrawColor(19,92,108).line(M,y,M+W,y);y+=16;d.setTextColor(0)};
 const P=(t,b,o={})=>{const x0=M+(o.i||0),w0=W-(o.i||0),jus=!b&&o.j!==false,tk=[];
  String(t).split(/\*\*(.+?)\*\*/g).forEach((q,i)=>q.split(/ +/).filter(Boolean).forEach(w=>tk.push({w,b:b||i%2==1})));
  const wd=k=>(d.setFont('helvetica',k.b?'bold':'normal').setFontSize(12),d.getTextWidth(k.w)),sw=(d.setFont('helvetica','normal').setFontSize(12),d.getTextWidth(' '));
  const L=[];let ln=[],cw=0;tk.forEach(k=>{const w=wd(k);if(ln.length&&cw+sw+w>w0){L.push(ln);ln=[];cw=0}cw+=(ln.length?sw:0)+w;ln.push({...k,wd:w})});if(ln.length)L.push(ln);
  L.forEach((r,i)=>{fit(14);let x=x0;const tw=r.reduce((a,k)=>a+k.wd,0),g=jus&&i<L.length-1&&r.length>1?(w0-tw)/(r.length-1):sw;r.forEach(k=>{d.setFont('helvetica',k.b?'bold':'normal').setFontSize(12);d.text(k.w,x,y);x+=k.wd+g});y+=13});y+=5};
 const BU=t=>{fit(14);const y0=y;P(t,0,{i:14});d.setFont('helvetica','normal').setFontSize(12);d.text('•',M+3,y0)};
 const IMGS=(k,items=null)=>{const a=items||((m.ti||{})[k]||[]),gap=14,cw=(W-gap)/2,maxH=Math.min(320,pageH()-220),columns=k==='sec4'?1:2,cellW=columns===1?W:(W-gap)/2;for(let i=0;i<a.length;i+=2){const pair=a.slice(i,i+columns),prepared=pair.map(ph=>{const pw=ph.w||400,phh=ph.h||300,s=Math.min(cellW/pw,maxH/phh,1);return{ph,w:pw*s,h:phh*s}}),rh=Math.max(...prepared.map(v=>v.h))+28;if(y+rh>pageH()-90)NP();prepared.forEach((v,j)=>{const single=columns===1||prepared.length===1,x=single?M+(W-v.w)/2:M+j*(cellW+gap)+(cellW-v.w)/2;d.addImage(v.ph.data,'JPEG',x,y,v.w,v.h);d.setFont('helvetica','italic').setFontSize(8);d.text(v.ph.name||'Imagem',single?centerX():M+j*(cw+gap)+cw/2,y+v.h+11,{align:'center',maxWidth:single?W:cellW})});y+=rh+8}};
 const RT=t=>parseRT(t).forEach(e=>e.k=='h'?(y+=4,P(e.t,1)):e.k=='b'?BU(e.t):e.k=='n'?P(e.l+' '+e.t,0,{i:14}):P(e.t));
 const DATA=k=>(TX[k]||[]).forEach(([type,text])=>type==='h'?(y+=4,P(text,1)):type==='b'?BU(text):P(text));
 const TB=(o)=>{d.autoTable({startY:y,margin:{left:M,right:M},styles:{fontSize:12,cellPadding:3},headStyles:{fillColor:[19,92,108]},theme:'grid',didParseCell:h=>{if(h.section=='body'&&h.column.index==o.lc&&typeof h.cell.raw=='string'&&Object.keys(LB).find(k=>LB[k]==h.cell.raw)){h.cell.styles.textColor=255;h.cell.styles.fillColor=255;h.cell.styles.minCellHeight=22}},didDrawCell:h=>{if(h.section=='body'&&h.column.index==o.lc&&typeof h.cell.raw=='string'){const k=Object.keys(LB).find(k=>LB[k]==h.cell.raw);if(k)d.addImage(IMG[k],'PNG',h.cell.x+h.cell.width/2-9,h.cell.y+h.cell.height/2-8.5,18,17)}},...o});y=d.lastAutoTable.finalY+12};
 // capa
 d.setTextColor(0).setFont('helvetica','bold').setFontSize(22);const coverH=pageH(),cx=centerX();d.text('RELATÓRIO DE AUDITORIA INTERNA',cx,coverH*.31,{align:'center'});d.text(m.ai,cx,coverH*.35,{align:'center'});d.text(m.tema,cx,coverH*.45,{align:'center'});d.text(m.obra,cx,coverH*.49,{align:'center'});d.setFontSize(18).text(m.mes,cx,coverH*.68,{align:'center'});
 // quadro geral
 NP();H('QUADRO GERAL');P('Síntese dos resultados da auditoria interna realizada sobre '+T.n+' contratos ('+m.obra+'), com cobertura de 100% das medições da competência de '+m.mes+', no valor de '+R$(T.med)+'.');
 TB({head:[['Item','Processo auditado','Nível de conformidade','%']],body:S.c.map((c,j)=>['8.'+(j+1)+' · ct '+c.ct+' · '+c.f,'',LB[T.r[j].lv],T.r[j].p==null?'—':pc(T.r[j].p)]).map(r=>[r[0].split(' · ')[0],r[0].split(' · ').slice(1).join(' · '),r[2],r[3]]),lc:2,columnStyles:{0:{cellWidth:40},2:{cellWidth:90,halign:'center'},3:{cellWidth:55,halign:'right'}}});
 TB({head:[['Controles internos','Quantidade','Pontos']],body:[['Implementados (IM) – 1 ponto',T.q.I,T.q.I],['Não avaliado / Não aplicável (NA)',T.q.A,0],['Parcialmente implementados (PI) – 0,65',T.q.P,(T.q.P*.65).toFixed(2)],['Não implementados (NI) – 0',T.q.N,0],['TOTAL',T.n,T.pts.toFixed(2)]]});
 P('Obs.: Cálculo do Nível de Conformidade ('+T.pts.toFixed(2)+' ÷ '+T.n+') x 100 = '+pc(T.idx),1);
 if(m.rex||hi('rex')){H('RESUMO EXECUTIVO');RT(m.rex);IMGS('rex')}
 // sumário
 H('SUMÁRIO');['1. Introdução','2. Legislação aplicada','3. Objetivos da auditoria interna e critérios de avaliação'].concat((m.sec4||hi('sec4'))?['4. Organograma e fluxograma']:[],(m.sec5||hi('sec5'))?['5. Procedimentos internos']:[],(m.sec6||hi('sec6'))?['6. Testes da auditoria interna']:[],(m.lim||hi('lim'))?['6.1 Limitação de escopo']:[],['7. Escopo e amostragem','8. Constatações da auditoria','9. Tabela de magnitude (impacto x probabilidade)','10. Conclusão da auditoria','11. Resumo das recomendações e planos de ação do setor auditado']).forEach(t=>P(t));
 NP();H('1. INTRODUÇÃO');P('O ciclo de medição de obras e serviços é o momento crítico de realização financeira e operacional de um empreendimento. O ateste físico e documental das medições é a principal salvaguarda para que os desembolsos sejam proporcionais ao avanço real da obra. Um ambiente de controles eficiente, com segregação de funções, alçadas e uma fonte única da verdade no ERP, mitiga riscos de superfaturamento, pagamentos em duplicidade e serviços extracontratuais não autorizados.');
 P('Esta auditoria avaliou a integridade do ambiente de controles do fluxo de medições, cruzando boletins de medição, planilhas de controle gerencial e registros do ERP, e apresenta recomendações para fortalecer controles e preservar os recursos da companhia.');
 H('2. LEGISLAÇÃO E MARCO REGULATÓRIO APLICÁVEL');DATA('2');
 H('3. OBJETIVOS DA AUDITORIA INTERNA');P('Avaliar o planejamento, a execução, as evidências e a efetividade dos controles internos, da gestão de riscos e da governança do processo de medição de obras no período de '+m.mes+'. Legenda: IM Implementado · PI Parcialmente implementado · NI Não implementado · OM Oportunidade de melhoria · NA Não avaliado ou não aplicável.');
 TB({head:[['Critério','Peso']],body:CR.map(k=>[k[1],k[2]?k[2]:'Não pontua'])});
 P('Resultado do contrato: IM igual ou superior a 80% · PI entre 50% e 79% · NI inferior a 50%.');
 if(m.sec4||hi('sec4')){H('4. ORGANOGRAMA E FLUXOGRAMA');RT(m.sec4);IMGS('sec4')}
 if(m.sec5||hi('sec5')){H('5. PROCEDIMENTOS INTERNOS');RT(m.sec5);IMGS('sec5')}
 if(m.sec6||hi('sec6')){H('6. TESTES DA AUDITORIA INTERNA');RT(m.sec6);IMGS('sec6')}
 if(m.lim||hi('lim')){H('6.1 LIMITAÇÃO DE ESCOPO');RT(m.lim);IMGS('lim')}
 H('7. ESCOPO E AMOSTRAGEM');TB({head:[['Item','Contrato','Fornecedor','Total contrato','Valor medido']],body:[...S.c.map((c,j)=>[j+1,c.ct,c.f,R$(c.t),R$(c.v)]),['','','TOTAL',R$(T.tot),R$(T.med)]],columnStyles:{3:{halign:'right'},4:{halign:'right'}}});
 NP();H('8. CONSTATAÇÕES DA AUDITORIA');
 S.c.forEach((c,j)=>{if(j>0)NP();const r=T.r[j];TB({head:[['Item','Serviço/Terceirizada','Valor medido']],body:[['8.'+(j+1),c.f+' (contrato '+c.ct+')',R$(c.v)]]});
  P('Resultado da Auditoria Interna:',1);
  TB({body:ReportModel.sortCriteriaForContract(c,CR).map(({k,i})=>[LB[c.s[i]],k[1]+(c.o[k[0]]?' — '+c.o[k[0]]:'')]),lc:0,columnStyles:{0:{cellWidth:36,halign:'center'}}});
  const rc=CR.map((k,i)=>({k,i})).filter(x=>c.s[x.i]=='P'||c.s[x.i]=='N');P('Recomendação da AI:',1);
  rc.forEach((x,i)=>{const p=S.p[x.k[0]]||{};if(p.causa)P('Causa provável: '+p.causa);if(p.risco)P('Risco / efeito potencial: '+p.risco);P(['I','II','III','IV','V','VI','VII','VIII','IX'][i]+'. '+(p.rec||x.k[4]))});
  if(!rc.length)P('I. Processo sem pendências.');
  if((c.imgs||[]).length){P('Evidências fotográficas:',1);IMGS('',c.imgs)}
  TB({body:[['Nível de Conformidade',LB[r.lv]+' – '+(NM[r.lv]||'Não avaliado')+(r.p==null?'':' ('+pc(r.p)+')')],['Objetivo do Controle','Controle Interno e Gestão'],['Dono do Processo','Engenharia e Suprimentos'],['Comentário do Setor','']],columnStyles:{0:{fontStyle:'bold',cellWidth:140}}})});
 H('9. TABELA DE MAGNITUDE (IMPACTO x PROBABILIDADE)');RT(MG.t);{const mi=Math.max(0,LV.indexOf(m.imp)),mp=Math.max(0,LV.indexOf(m.prb));TB({head:[['Impacto / Magnitude',...LV]],body:[4,3,2,1,0].map(r=>[LV[r],...LV.map((l,j)=>r==mi&&j==mp?'FG '+pc(T.idx):'')]).concat([[{content:'PROBABILIDADE',colSpan:6,styles:{halign:'center',fontStyle:'bold'}}]])});
 TB({head:[['Graduação','Nível','Descrição','Ocorrências']],body:MG.p});TB({head:[['Graduação','Nível','Descrição','Tipo de dano','Financeiro']],body:MG.i,columnStyles:{3:{cellWidth:170}}})}
 H('10. CONCLUSÃO DA AUDITORIA');P('Foram verificados '+T.n+' processos de medição de obras do empreendimento, correspondentes à totalidade das medições de '+m.mes+', no montante de '+R$(T.med)+'. O resultado consolidado indicou nível de conformidade de '+pc(T.idx)+', composto por '+T.q.I+' controles implementados, '+T.q.N+' não implementados e '+T.q.P+' parcialmente implementados. As exceções identificadas requerem tratamento específico, com definição de responsáveis, prazos e evidências de conclusão.');
 
 RT(m.concl);IMGS('concl');
 H('11. RESUMO DAS RECOMENDAÇÕES E PLANOS DE AÇÃO DO SETOR AUDITADO');
 const body=[];CR.forEach((k,i)=>{const a=aff(i);if(!a.length)return;const p=S.p[k[0]]||{};
  body.push([(body.length/2+1)+' '+(p.s??k[5]),k[3]+(p.causa?' Causa provável: '+p.causa:'')+(p.risco?' Risco / efeito potencial: '+p.risco:''),(p.rec||k[4])+' Itens afetados: '+a.join(', ')+'.',p.z||'—',p.t||'Pendente']);
  body.push([{content:'PLANO DE AÇÃO DO SETOR AUDITADO: '+(p.x||''),colSpan:5,styles:{fillColor:[236,240,246],minCellHeight:22}}])});
 (S.m.pa||[]).forEach(e=>{if(!(e.c||e.r||e.x))return;body.push([(body.length/2+1)+' '+(e.s||'—'),e.c||'',(e.r||'')+(e.a?' Itens afetados: '+e.a+'.':''),e.z||'—',e.t||'Pendente']);body.push([{content:'PLANO DE AÇÃO DO SETOR AUDITADO: '+(e.x||''),colSpan:5,styles:{fillColor:[236,240,246],minCellHeight:22}}])});
 body.length?TB({head:[['Item / Setor','Constatação','Recomendação da Auditoria Interna','Prazo','Status']],body,columnStyles:{0:{cellWidth:62},3:{cellWidth:45},4:{cellWidth:55}}}):P('Sem constatações PI/NI.');
 const n=d.getNumberOfPages(),lgW=36*LG.w/LG.h;for(let i=1;i<=n;i++){d.setPage(i);const pageW=d.internal.pageSize.getWidth(),pageHeight=d.internal.pageSize.getHeight();d.setFillColor(19,92,108);d.rect(0,0,pageW,62,'F');d.rect(0,pageHeight-30,pageW,30,'F');d.addImage(IMG.logo,'PNG',M,13,lgW,36);d.setTextColor(255).setFont('helvetica','bold').setFontSize(8);d.text(m.ai+' '+m.tema,pageW-M,22,{align:'right'});d.text('AUDITORIA INTERNA',pageW-M,34,{align:'right'});d.text(m.mes.toUpperCase(),pageW-M,46,{align:'right'});d.text('Página '+i,centerX(),pageHeight-10,{align:'center'})}
 dl(safeFilePart(m.ai)+'-'+safeFilePart(m.tema)+'.pdf',d.output('arraybuffer'))}
