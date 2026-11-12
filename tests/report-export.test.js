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

test('PDF executa quebra de página antes de imagens que excedem a área útil',()=>{
  assert.match(pdf,/if\(y\+h\+24>pageH\(\)-90\)NP\(\);d\.addImage/);
  assert.match(pdf,/if\(y\+h\+30>pageH\(\)-90\)NP\(\);d\.addImage/);
  assert.doesNotMatch(pdf,/if\(y\+h\+\d+>pageH\(\)-90\);d\.addImage/);
});

test('Word não injeta conteúdo automático em cabeçalho ou rodapé',()=>{
  assert.doesNotMatch(word,/new Header\(|new Footer\(|headers:\s*\{|footers:\s*\{|PageNumber/);
  assert.match(word,/const sections=hasLandscape\?\[\{properties:portraitProps,children:pre\}/);
});
