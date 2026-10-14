/* data.js
   Carrega os arquivos de www/data (JSON) e as imagens de www/logo antes de iniciar a aplicação. */

let CR=[],TX={},MG={},SEED_META={},SEED_CONTRACTS=[],IMG={},LG={w:842,h:596};

async function getJSON(path){
  const r=await fetch(path,{cache:'no-cache'});
  if(!r.ok)throw new Error(path+' → HTTP '+r.status);
  return r.json();
}
async function getDataURL(path){
  const r=await fetch(path);
  if(!r.ok)throw new Error(path+' → HTTP '+r.status);
  const b=await r.blob();
  return new Promise((ok,err)=>{const f=new FileReader();f.onload=()=>ok(f.result);f.onerror=err;f.readAsDataURL(b)});
}
async function loadData(){
  const [cr,tx,mg,meta,ct]=await Promise.all([
    getJSON('data/criterios.json'),getJSON('data/textos.json'),getJSON('data/magnitude.json'),
    getJSON('data/relatorio-padrao.json'),getJSON('data/contratos-exemplo.json')]);
  // critério: [chave, pergunta, peso, constatação, recomendação, setor]
  CR=cr.map(o=>[o.chave,o.pergunta,o.peso,o.constatacao,o.recomendacao,o.setor]);
  TX=tx;MG=mg;SEED_META=meta;SEED_CONTRACTS=ct;
  const files={logo:'logo/logo.png',I:'logo/status/im.png',O:'logo/status/om.png',P:'logo/status/pi.png',N:'logo/status/ni.png',A:'logo/status/na.png'};
  await Promise.all(Object.entries(files).map(async([k,p])=>{IMG[k]=await getDataURL(p)}));
  await new Promise(ok=>{const i=new Image();i.onload=()=>{LG={w:i.naturalWidth,h:i.naturalHeight};ok()};i.onerror=ok;i.src=IMG.logo});
}
