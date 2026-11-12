const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const word=fs.readFileSync(path.join(__dirname,'../www/js/report-word.js'),'utf8');

test('células de cabeçalho e destaque usam preenchimento de fundo na cor institucional FG',()=>{
  assert.match(word,/const C='135C6C'/);
  assert.match(word,/const hd=\(t,w\)=>ce\(t,w,\{f:C,c:'FFFFFF',b:1,a:AL.CENTER\}\)/);
  assert.match(word,/shading:o\.f\?\{type:ShadingType\.SOLID,fill:o\.f,color:o\.f\}:undefined/);
});
