const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const views=fs.readFileSync(path.join(__dirname,'../www/js/views.js'),'utf8');
const events=fs.readFileSync(path.join(__dirname,'../www/js/events.js'),'utf8');

test('Dados do relatório renderiza seletor de imagens para cada tópico',()=>{
  assert.match(views,/data-report-img="\$\{k\}"/);
  assert.match(views,/accept="image\/\*" data-report-img=/);
});

test('Dados do relatório exibe miniaturas e permite remover imagens por tópico',()=>{
  assert.match(views,/data-rmreportimg="\$\{k\}:\$\{i\}"/);
  assert.match(events,/closest\('\[data-rmreportimg\]'\)/);
  assert.match(events,/t\.dataset\.reportImg/);
  assert.match(events,/S\.m\.ti\[key\]=S\.m\.ti\[key\]\|\|\[\]/);
  assert.match(events,/arr\.push\(\{name:file\.name,data:cv\.toDataURL/);
});
