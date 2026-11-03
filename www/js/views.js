/* views.js
   Telas (HTML em template string): checklist, quadro geral, planos de ação e dados do relatório. */
const imgBox=k=>{const a=(S.m.ti&&S.m.ti[k])||[];return`<div class="f" style="margin:4px 0 16px;padding:8px 10px;border:1px dashed var(--b);border-radius:8px"><b>Imagens deste tópico</b> <span cla[...]`}

function render(){const T=tot(),m=S.m;
$('#app').innerHTML=`<header><h1>Auditoria Interna · Checklist de Medição<small>${esc(m.ai)} · ${esc(m.obra)} · ${esc(m.mes)}</small></h1>
<button class="btn" data-a="exp">Exportar dados</button><label class="btn">Importar<input type="file" accept=".json" data-a="imp" hidden></label>
<button class="btn p" data-a="doc">Gerar Word</button><button class="btn p" data-a="pdf">Gerar PDF</button></header>
<nav>${[['chk','Checklist por contrato'],['qg','Quadro geral'],['pl','Planos de ação (tópico 11)'],['cf','Dados do relatório']].map(([k,n])=>`<button data-a="tab" data-v="${k}" class="${tab==k?"on":""}">${n}</button>`).join('')}</nav>
<main>${tab=='chk'?vChk(T):tab=='qg'?vQg(T):tab=='pl'?vPl():vCf()}</main>`}

function vChk(T){const c=S.c[cur];if(!c)return '<div class="card">Nenhum contrato. <p><button class="btn" data-a="add">+ Contrato</button></p></div>';
 const r=T.r[cur];
  const recs=CR.map((k,i)=>[k,i]).filter(([k,i])=>c.s[i]=='P'||c.s[i]=='N'),P=posOf();
  return`<div class="grid"><div class="card list">${ordIdx().map(j=>{const x=S.c[j];return`<div class="it ${j==cur?'on':''}" data-a="sel" data-v="${j}"><b>8.${P[j]}</b><span class="n">${esc(x.f)}</span></div>`}).join('')}<button class="btn" style="width:100%;margin-top:6px" data-a="add">+ Contrato</button></div>
<div class="card"><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:200px"><b>8.${P[cur]}</b> · Contrato <input class="i" data-f="ct" style="width:90px;display:inline-block" value="${esc(c.ct)}"></div>
<div style="text-align:right"><div class="big">${r.p==null?'—':pc(r.p)}</div><span class="tag t${r.lv}">${LB[r.lv]} – ${NM[r.lv]||'Não avaliado'}</span></div></div>
<div class="meta" style="margin-top:10px"><label class="f">Fornecedor<input class="i" data-f="f" value="${esc(c.f)}"></label><label class="f">Total do contrato (R$)<input class="i" data-f="t" type="number" value="${esc(c.t)}"></label><label class="f">Valor medido (R$)<input class="i" data-f="v" type="number" value="${esc(c.v)}"></label></div>
<div class="row contract-photos"><div class="section-heading"><b>Imagens do contrato</b><span class="w">As fotos serão incluídas na seção 8 do Word e do PDF, junto às constatações deste contrato.</span></div>
<label class="btn photo-add">+ Adicionar imagem<input type="file" accept="image/*" data-img multiple hidden></label>
${(c.imgs||[]).length?`<div class="photos">${c.imgs.map((ph,i)=>`<div class="photo"><img src="${ph.data}" alt="${esc(ph.name||'Imagem do contrato')}"><button type="button" data-rmimg="${i}" title="Remover imagem">×</button><span class="photo-name">${esc(ph.name||'Imagem')}</span></div>`).join('')}</div>`:'<p class="w">Nenhuma imagem adicionada a este contrato.</p>'}</div>
<div class="row"><b>Checklist de controles</b>
${CR.map((k,i)=>`<div class="row ${k[2]?'':'al'}"><b>${esc(k[1])}</b> <span class="w">${k[2]?'peso '+k[2]:'⚠ ALERTA — não influencia a nota'}</span>
<div class="sb">${'IPNOA'.split('').map(s=>`<button class="${s}${c.s[i]==s?' on':''}" data-a="st" data-i="${i}" data-v="${s}">${LB[s]}</button>`).join('')}</div>
<input class="i" placeholder="Evidência / observação" data-o="${k[0]}" value="${esc(c.o[k[0]])}"></div>`).join('')}
<div class="row"><b>Recomendações geradas</b>${recs.length?'<ol>'+recs.map(([k,i])=>`<li>${esc(k[4])}${k[2]?'':' <i>(alerta)</i>'}</li>`).join('')+'</ol>':'<p class="w">Processo sem pendências.</p>'}
<button class="btn" data-a="del">${arm=='d'?'Confirmar exclusão?':'Remover este contrato'}</button></div></div>`}

function vQg(T){return`<div class="kpi"><div class="card"><div class="w">Nível de conformidade</div><div class="big">${pc(T.idx)}</div></div><div class="card"><div class="w">Contratos auditados</div><div class="big">${T.n}</div></div></div>
<div class="grid" style="grid-template-columns:1fr 1fr"><div class="card sc"><table><tr><th>Item</th><th>Processo auditado</th><th>Nível</th></tr>${ordIdx().map((j,n)=>{const c=S.c[j];return`<tr><td>8.${n+1}</td><td>${esc(c.f)}</td><td>${LB[T.r[j].lv]}</td></tr>`}).join('')}</table></div>
<div class="card sc"><table><tr><th>Controles internos</th><th>Qtd</th><th>Pontos</th></tr><tr><td>Implementados (IM)</td><td>${T.q.I}</td><td>${T.q.I}</td></tr><tr><td>Oportunidade de melhoria (OM)</td><td>${T.q.O}</td><td>${T.q.O}</td></tr><tr><td>Parcialmente implementados (PI)</td><td>${T.q.P}</td><td>${(T.q.P*0.65).toFixed(2)}</td></tr><tr><td>Não implementados (NI)</td><td>${T.q.N}</td><td>0</td></tr><tr><td>Não avaliados / não aplicáveis (NA)</td><td>${T.q.A}</td><td>0</td></tr></table></div></div>
<p class="w">Cálculo: (${T.pts.toFixed(2)} ÷ ${T.n}) × 100 = ${pc(T.idx)}. Contrato: IM ≥ 80% · PI ≥ 50% · NI &lt; 50%.</p></div>`}

function vPl(){const it=CR.map((k,i)=>[k,i,aff(i)]).filter(x=>x[2].length);if(!it.length)return'<div class="card">Sem constatações: nenhum item PI/NI.</div>';
 return it.map(([k,i,a],n)=>{const p=S.p[k[0]]||{};return`<div class="card" style="margin-bottom:10px"><b>${n+1}. ${esc(k[3])}</b> ${k[2]?'':'<span class="tag tP">ALERTA</span>'}
<p><b>Recomendação da AI:</b> ${esc(p.rec||k[4])}<br><b>Itens afetados:</b> ${a.join(', ')}</p>
<div class="meta">
<label class="f">Causa provável (validar com evidências)<textarea class="i" rows="2" data-p="${k[0]}.causa">${esc(p.causa||'')}</textarea></label>
<label class="f">Risco / efeito potencial<textarea class="i" rows="2" data-p="${k[0]}.risco">${esc(p.risco||'')}</textarea></label>
<label class="f">Recomendação revisada<textarea class="i" rows="3" data-p="${k[0]}.rec" placeholder="Ajuste a recomendação padrão, se necessário">${esc(p.rec||k[4])}</textarea></label>
<label class="f">Setor<input class="i" data-p="${k[0]}.s" value="${esc(p.s??k[5])}"></label><label class="f">Prazo<input class="i" data-p="${k[0]}.z" placeholder="MM/AAAA" value="${esc(p.z)}"></label>
<label class="f">Status<select class="i" data-p="${k[0]}.t">${['Pendente','Em andamento','Concluído'].map(o=>`<option ${(p.t||'Pendente')==o?'selected':''}>${o}</option>`).join('')}</select></label>
<label class="f">Plano de ação do setor auditado<textarea class="i" rows="2" data-p="${k[0]}.x">${esc(p.x)}</textarea></label></div></div>`}).join('')}

function vCf(){const m=S.m;const field=(label,key,rows,placeholder='')=>`<label class="f">${label}<textarea class="i" rows="${rows}" data-m="${key}" placeholder="${placeholder}">${esc(m[key])}</textarea></label>`;
const group=(title,content,open=false)=>`<details class="form-section" ${open?'open':''}><summary>${title}</summary><div class="section-body">${content}</div></details>`;
return `<div class="card report-data">
${group('Identificação do relatório',`<div class="meta">${[['ai','Nº do relatório'],['tema','Tema'],['obra','Obra'],['mes','Competência']].map(([k,n])=>`<label class="f">${n}<input class="i" data-m="${k}" value="${esc(m[k])}"></label>`).join('')}</div>`,true)}
${group('4. Organograma e fluxograma',field('Descrição do organograma, fluxo e responsabilidades','sec4',6,'Descreva a estrutura, o fluxo e as responsabilidades.')+imgBox('sec4'))}
${group('5. Procedimentos internos',field('Procedimentos, instruções de trabalho e documentos de referência','sec5',6,'Informe os procedimentos, instruções, formulários e documentos que embasam os testes.')+imgBox('sec5'))}
${group('6. Testes da auditoria interna',field('Procedimentos e verificações realizados','sec6',8,'Descreva os testes, procedimentos e verificações realizados.')+imgBox('sec6'))}
${group('6.1 Limitação de escopo',field('Descrição da limitação (se houver)','lim',4,'Registre eventuais limitações de escopo.')+imgBox('lim'))}
${group('Resumo executivo',field('Texto do resumo (após o Quadro Geral)','rex',8,'Apresente a síntese dos principais resultados.')+imgBox('rex'))}
${group('9. Magnitude — avaliação de impacto e probabilidade',`<div class="meta"><label class="f">Impacto<select class="i" data-m="imp">${['Muito Baixo','Baixo','Médio','Alto','Extremo'].map(o=>`<option ${m.imp==o?'selected':''}>${o}</option>`).join('')}</select></label><label class="f">Probabilidade<select class="i" data-m="prb">${['Muito Baixo','Baixo','Médio','Alto','Extremo'].map(o=>`<option ${m.prb==o?'selected':''}>${o}</option>`).join('')}</select></label></div><p class="w">Selecione o nível de impacto e probabilidade que será representado na matriz de magnitude.</p>`)}
${group('10. Conclusão da auditoria',field('Conclusão e recomendações por setor','concl',8,'Descreva a conclusão e as ações recomendadas por setor.')+imgBox('concl'))}
${group('11. Planos de ação adicionais',`<p class="w">Use esta seção para constatações que não decorrem diretamente do checklist por contrato.</p>
${(S.m.pa||[]).map((e,i)=>`<div class="extra-action"><b>Plano adicional ${i+1}</b><label class="f">Constatação<textarea class="i" rows="2" data-xa="${i}.c">${esc(e.c)}</textarea></label><label class="f">Recomendação<textarea class="i" rows="3" data-xa="${i}.r">${esc(e.r)}</textarea></label><div class="meta"><label class="f">Itens / contratos afetados<input class="i" data-xa="${i}.a" value="${esc(e.a)}"></label><label class="f">Setor<input class="i" data-xa="${i}.s" value="${esc(e.s)}"></label><label class="f">Prazo<input class="i" data-xa="${i}.z" value="${esc(e.z)}"></label><label class="f">Status<select class="i" data-xa="${i}.t">${['Pendente','Em andamento','Concluído'].map(o=>`<option ${(e.t||'Pendente')==o?'selected':''}>${o}</option>`).join('')}</select></label></div><label class="f">Plano de ação do setor auditado<textarea class="i" rows="3" data-xa="${i}.x">${esc(e.x)}</textarea></label><button class="btn" data-a="delpa" data-v="${i}">Remover plano</button></div>`).join('')}
<button class="btn" data-a="addpa">+ Adicionar plano de ação</button>`)}
<div class="form-footer"><p class="w">Nos campos textuais, uma linha corresponde a um parágrafo. Linhas iniciadas por “- ” são convertidas em tópicos; “1) ” e “a) ” em itens recuados. Evite inserir HTML.</p><button class="btn" data-a="clr">${arm=='c'?'Confirmar: zerar todos os contratos?':'Novo relatório (limpar contratos)'}</button></div>
</div>`}
