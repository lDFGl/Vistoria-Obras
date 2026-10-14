/* report-pdf.js
   Geração do relatório em PDF (jsPDF + autoTable). Os contratos saem na ordem IM/OM → NA → PI → NI. */
function pdf(){const bak=S.c;S.c=sortedC();try{return pdfGen()}catch(e){console.error(e);toast('Erro ao gerar PDF: '+(e&&e.message||e))}finally{S.c=bak}}
function pdfGen(){if(!window.jspdf||!window.jspdf.jsPDF){toast('Biblioteca de PDF não carregou (verifique a conexão)');return}
 if(!S.c.length){toast('Nenhum contrato para gerar o relatório');return}
 const{jsPDF}=window.jspdf,d=new jsPDF({unit:'pt',format:'a4'});if(typeof d.autoTable!='function'){toast('Plugin de tabelas do PDF não carregou');return}const T=tot(),m=S.m,M=40,W=515,col={I:[30,142,78],P:[217,138,0],N:[198,47,47],O:[43,111,214],A:[0,138,201]};let y=0;
 const NP=()=>{d.addPage();y=95},fit=h=>{if(y+h>770)NP()};
 const H=t=>{if(y>96)NP();d.setFont('helvetica','bold').setFontSize(13).setTextColor(19,92,108);d.text(t,M,y);y+=8;d.setDrawColor(19,92,108).line(M,y,M+W,y);y+=16;d.setTextColor(0)};
 const P=(t,b,o={})=>{const x0=M+(o.i||0),w0=W-(o.i||0),jus=!b&&o.j!==false,tk=[];
  String(t).split(/\*\*(.+?)\*\*/g).forEach((q,i)=>q.split(/ +/).filter(Boolean).forEach(w=>tk.push({w,b:b||i%2==1})));
  const wd=k=>(d.setFont('helvetica',k.b?'bold':'normal').setFontSize(10),d.getTextWidth(k.w)),sw=(d.setFont('helvetica','normal').setFontSize(10),d.getTextWidth(' '));
  const L=[];let ln=[],cw=0;tk.forEach(k=>{const w=wd(k);if(ln.length&&cw+sw+w>w0){L.push(ln);ln=[];cw=0}cw+=(ln.length?sw:0)+w;ln.push({...k,wd:w})});if(ln.length)L.push(ln);
  L.forEach((r,i)=>{fit(14);let x=x0;const tw=r.reduce((a,k)=>a+k.wd,0),g=jus&&i<L.length-1&&r.length>1?(w0-tw)/(r.length-1):sw;r.forEach(k=>{d.setFont('helvetica',k.b?'bold':'normal').setFontSize(10);d.text(k.w,x,y);x+=k.wd+g});y+=13});y+=5};
 const BU=t=>{fit(14);const y0=y;P(t,0,{i:14});d.setFont('helvetica','normal').setFontSize(10);d.text('•',M+3,y0)};
 const IMGS=k=>{for(const ph of((m.ti||{})[k]||[])){try{const pw=ph.w||400,phh=ph.h||300,kk=Math.min(W/pw,420/phh,1),w=pw*kk,h=phh*kk;if(y+h+24>770)NP();d.addImage(ph.data,'JPEG',M+(W-w)/2,y,w,h);y+=h+10;d.setFont('helvetica','italic').setFontSize(8);d.text(ph.name||'Imagem',297,y,{align:'center'});y+=18}catch(e){}}};
 const RT=t=>parseRT(t).forEach(e=>e.k=='h'?(y+=4,P(e.t,1)):e.k=='b'?BU(e.t):e.k=='n'?P(e.l+' '+e.t,0,{i:14}):P(e.t));
 const TB=(o)=>{d.autoTable({startY:y,margin:{left:M,right:M},styles:{fontSize:9,cellPadding:4},headStyles:{fillColor:[19,92,108]},theme:'grid',didParseCell:h=>{if(h.section=='body'&&h.column.index==o.lc&&typeof h.cell.raw=='string'&&Object.keys(LB).find(k=>LB[k]==h.cell.raw)){h.cell.styles.textColor=255;h.cell.styles.fillColor=255;h.cell.styles.minCellHeight=22}},didDrawCell:h=>{if(h.section=='body'&&h.column.index==o.lc&&typeof h.cell.raw=='string'){const k=Object.keys(LB).find(k=>LB[k]==h.cell.raw);if(k)d.addImage(IMG[k],'PNG',h.cell.x+h.cell.width/2-9,h.cell.y+h.cell.height/2-8.5,18,17)}},...o});y=d.lastAutoTable.finalY+12};
 // capa
 d.setTextColor(0).setFont('helvetica','bold').setFontSize(22);d.text('RELATÓRIO DE AUDITORIA INTERNA',297,260,{align:'center'});d.text(m.ai,297,292,{align:'center'});d.text(m.tema,297,380,{align:'center'});d.text(m.obra,297,408,{align:'center'});d.setFontSize(18).text(m.mes,297,560,{align:'center'});
 // quadro geral
 NP();H('QUADRO GERAL');P('Síntese dos resultados da auditoria interna realizada sobre '+T.n+' contratos ('+m.obra+'), com cobertura de 100% das medições da competência de '+m.mes+', no valor de '+R$(T.med)+'.');
 TB({head:[['Item','Processo auditado','Nível de conformidade','%']],body:S.c.map((c,j)=>['8.'+(j+1)+' · ct '+c.ct+' · '+c.f,'',LB[T.r[j].lv],T.r[j].p==null?'—':pc(T.r[j].p)]).map(r=>[r[0].split(' · ')[0],r[0].split(' · ').slice(1).join(' · '),r[2],r[3]]),lc:2,columnStyles:{0:{cellWidth:40},2:{cellWidth:90,halign:'center'},3:{cellWidth:55,halign:'right'}}});
 TB({head:[['Controles internos','Quantidade','Pontos']],body:[['Implementados (IM) – 1 ponto',T.q.I,T.q.I],['Oportunidade de melhoria (OM) – 1 ponto',0,0],['Parcialmente implementados (PI) – 0,65',T.q.P,(T.q.P*.65).toFixed(2)],['Não implementados (NI) – 0',T.q.N,0],['Não avaliado / N.A.',T.q.A,0],['TOTAL',T.n,T.pts.toFixed(2)]]});
 P('Obs.: Cálculo do Nível de Conformidade ('+T.pts.toFixed(2)+' ÷ '+T.n+') x 100 = '+pc(T.idx),1);RT(m.rex);IMGS('rex');
 // sumário
 H('SUMÁRIO');['1. Introdução','2. Legislação aplicada','3. Objetivos da auditoria interna e critérios de avaliação'].concat((m.sec4||hi('sec4'))?['4. Organograma e fluxograma']:[],(m.sec5||hi('sec5'))?['5. Procedimentos internos']:[],(m.sec6||hi('sec6'))?['6. Testes da auditoria interna']:[],(m.lim||hi('lim'))?['6.1 Limitação de escopo']:[],['7. Escopo e amostragem','8. Constatações da auditoria','9. Tabela de magnitude (impacto x probabilidade)','10. Conclusão da auditoria','11. Resumo das recomendações e planos de ação do setor auditado']).forEach(t=>P(t));
 NP();H('1. INTRODUÇÃO');P('O ciclo de medição de obras e serviços é o momento crítico de realização financeira e operacional de um empreendimento. O ateste físico e documental das medições é a principal salvaguarda para que os desembolsos sejam proporcionais ao avanço real da obra. Um ambiente de controles eficiente, com segregação de funções, alçadas e uma fonte única da verdade no ERP, mitiga riscos de superfaturamento, pagamentos em duplicidade e serviços extracontratuais não autorizados.');
 P('Esta auditoria avaliou a integridade do ambiente de controles do fluxo de medições, cruzando boletins de medição, planilhas de controle gerencial e registros do ERP, e apresenta recomendações para fortalecer controles e preservar os recursos da companhia.');
 H('2. LEGISLAÇÃO E MARCO REGULATÓRIO APLICÁVEL');['Código Civil (Lei 10.406/2002), arts. 610 a 626, especialmente art. 614 (medição de empreitada).','CLT art. 455, Lei 6.019/1974 e Súmula 331 do TST (responsabilidade trabalhista).','IN RFB 2.110/2022, EFD-Reinf e LC 116/2003 (retenções previdenciárias e ISSQN).','Lei 12.846/2013 e Decreto 11.129/2022 (Lei Anticorrupção e programas de integridade).','Lei 6.404/1976, art. 177 (escrituração e controles).','PBQP-H (SiAC) e ABNT NBR 12721.'].forEach(t=>BU(t));
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
  TB({body:CR.map((k,i)=>[LB[c.s[i]],k[1]+(c.o[k[0]]?' — '+c.o[k[0]]:'')]),lc:0,columnStyles:{0:{cellWidth:36,halign:'center'}}});
  const rc=CR.filter((k,i)=>c.s[i]=='P'||c.s[i]=='N');P('Recomendação da Auditoria Interna:',1);
  (rc.length?rc.map((k,i)=>['I','II','III','IV','V','VI','VII','VIII','IX'][i]+'. '+k[4]):['I. Processo sem pendências.']).forEach(t=>P(t));
  if((c.imgs||[]).length){P('Evidências fotográficas:',1);for(const ph of c.imgs){try{if(y>690)NP();const pw=ph.w||400,phh=ph.h||300,kk=Math.min(300/pw,200/phh,1),w=pw*kk,h=phh*kk;if(y+h+30>770)NP();d.addImage(ph.data,'JPEG',297-w/2,y,w,h);y+=h+10;d.setFont('helvetica','italic').setFontSize(8);d.text(ph.name||'Evidência fotográfica',297,y,{align:'center'});y+=16}catch(e){}}}
  TB({body:[['Nível de Conformidade',LB[r.lv]+' – '+(NM[r.lv]||'Não avaliado')+(r.p==null?'':' ('+pc(r.p)+')')],['Objetivo do Controle','Controle Interno e Gestão'],['Dono do Processo','Engenharia e Suprimentos'],['Comentário do Setor','']],columnStyles:{0:{fontStyle:'bold',cellWidth:140}}})});
 H('9. TABELA DE MAGNITUDE (IMPACTO x PROBABILIDADE)');RT(MG.t);{const mi=Math.max(0,LV.indexOf(m.imp)),mp=Math.max(0,LV.indexOf(m.prb));TB({head:[['Impacto / Magnitude',...LV]],body:[4,3,2,1,0].map(r=>[LV[r],...LV.map((l,j)=>r==mi&&j==mp?'FG '+pc(T.idx):'')]).concat([[{content:'PROBABILIDADE',colSpan:6,styles:{halign:'center',fontStyle:'bold'}}]])});
 TB({head:[['Graduação','Nível','Descrição','Ocorrências']],body:MG.p});TB({head:[['Graduação','Nível','Descrição','Tipo de dano','Financeiro']],body:MG.i,columnStyles:{3:{cellWidth:170}}})}
 H('10. CONCLUSÃO DA AUDITORIA');P('Foram verificados '+T.n+' processos de medição de obras do empreendimento, correspondentes à totalidade das medições de '+m.mes+', no montante de '+R$(T.med)+'. O resultado consolidado indicou nível de conformidade de '+pc(T.idx)+', composto por '+T.q.I+' controles implementados, '+T.q.N+' não implementados e '+T.q.P+' parcialmente implementados. As exceções identificadas requerem tratamento específico, com definição de responsáveis, prazos e evidências de conclusão.');
 
 RT(m.concl);IMGS('concl');
 H('11. RESUMO DAS RECOMENDAÇÕES E PLANOS DE AÇÃO DO SETOR AUDITADO');
 const body=[];CR.forEach((k,i)=>{const a=aff(i);if(!a.length)return;const p=S.p[k[0]]||{};
  body.push([(body.length/2+1)+' '+(p.s??k[5]),k[3],k[4]+' Itens afetados: '+a.join(', ')+'.',p.z||'—',p.t||'Pendente']);
  body.push([{content:'PLANO DE AÇÃO DO SETOR AUDITADO: '+(p.x||''),colSpan:5,styles:{fillColor:[236,240,246],minCellHeight:22}}])});
 (S.m.pa||[]).forEach(e=>{if(!(e.c||e.r||e.x))return;body.push([(body.length/2+1)+' '+(e.s||'—'),e.c||'',(e.r||'')+(e.a?' Itens afetados: '+e.a+'.':''),e.z||'—',e.t||'Pendente']);body.push([{content:'PLANO DE AÇÃO DO SETOR AUDITADO: '+(e.x||''),colSpan:5,styles:{fillColor:[236,240,246],minCellHeight:22}}])});
 body.length?TB({head:[['Item / Setor','Constatação','Recomendação da Auditoria Interna','Prazo','Status']],body,columnStyles:{0:{cellWidth:62},3:{cellWidth:45},4:{cellWidth:55}}}):P('Sem constatações PI/NI.');
 const n=d.getNumberOfPages(),lgW=36*LG.w/LG.h;for(let i=1;i<=n;i++){d.setPage(i);d.setFillColor(19,92,108);d.rect(0,0,595,62,'F');d.rect(0,812,595,30,'F');d.addImage(IMG.logo,'PNG',M,13,lgW,36);d.setTextColor(255).setFont('helvetica','bold').setFontSize(8);d.text(m.ai+' '+m.tema,555,22,{align:'right'});d.text('AUDITORIA INTERNA',555,34,{align:'right'});d.text(m.mes.toUpperCase(),555,46,{align:'right'});d.text('Página '+i,297,830,{align:'center'})}
 dl(m.ai.replace(/\W+/g,'-')+'-'+m.tema.replace(/\W+/g,'-')+'.pdf',d.output('arraybuffer'))}
