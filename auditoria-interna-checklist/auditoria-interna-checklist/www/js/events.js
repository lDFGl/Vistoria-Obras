/* events.js
   Eventos de clique/alteração, importação/exportação de dados e download de arquivos. */
document.addEventListener('click',e=>{const rr=e.target.closest('[data-rmreportimg]');if(rr){const[k,i]=rr.dataset.rmreportimg.split(':');normTI();(S.m.ti[k]||[]).splice(+i,1);save();render();return}const ri=e.target.closest('[data-rmimg]');if(ri){c=S.c[cur];c.imgs=c.imgs||[];c.imgs.splice(+ri.dataset.rmimg,1);save();render();return}const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,c=S.c[cur];
 if(a=='tab'){tab=b.dataset.v;arm=0}else if(a=='sel')cur=+b.dataset.v;else if(a=='st'){c.s[+b.dataset.i]=b.dataset.v}
 else if(a=='add'){S.c.push({f:'NOVO FORNECEDOR',ct:'',t:0,v:0,s:Array(CR.length).fill('A'),o:{},ac:{},imgs:[]});cur=S.c.length-1}
 else if(a=='del'){if(arm=='d'){S.c.splice(cur,1);cur=Math.max(0,cur-1);arm=0}else{arm='d';render();return}}
 else if(a=='clr'){if(arm=='c'){S.c=[];S.p={};cur=0;arm=0}else{arm='c';render();return}}
 else if(a=='addpa'){S.m.pa.push({c:'',r:'',a:'',s:'',z:'',t:'Pendente',x:''})}else if(a=='delpa'){S.m.pa.splice(+b.dataset.v,1)}
 else if(a=='exp')return exp();else if(a=='doc')return word();else if(a=='pdf')return pdf();else return;
 arm=0;save();render()});
document.addEventListener('change',e=>{const t=e.target,c=S.c[cur];
 if('reportImg' in t.dataset){const files=[...t.files],key=t.dataset.reportImg;normTI();const arr=S.m.ti[key]=S.m.ti[key]||[];let done=0;files.forEach(file=>{const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const max=key=='sec4'?1400:1000,scale=Math.min(1,max/Math.max(im.width,im.height));const cv=document.createElement('canvas');cv.width=Math.round(im.width*scale);cv.height=Math.round(im.height*scale);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);arr.push({name:file.name,data:cv.toDataURL('image/jpeg',.78),w:cv.width,h:cv.height});if(++done===files.length){save();render();toast(files.length+' imagem(ns) do relatório adicionada(s)')}};im.src=rd.result};rd.readAsDataURL(file)});t.value='';return}
 if('img' in t.dataset){const files=[...t.files];c.imgs=c.imgs||[];let done=0;files.forEach(file=>{const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const max=1100,scale=Math.min(1,max/Math.max(im.width,im.height));const cv=document.createElement('canvas');cv.width=Math.round(im.width*scale);cv.height=Math.round(im.height*scale);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);c.imgs.push({name:file.name,data:cv.toDataURL('image/jpeg',.72),w:cv.width,h:cv.height});if(++done===files.length){save();render();toast(files.length+' imagem(ns) adicionada(s)')}};im.src=rd.result};rd.readAsDataURL(file)});t.value='';return}

 if(t.dataset.a=='imp'){const r=new FileReader();r.onload=()=>{try{S=JSON.parse(r.result);S.m=Object.assign({sec4:'',sec5:'',sec6:'',lim:'',imgs:[],pa:[]},S.m||{});S.m.imgs=S.m.imgs||[];normTI();S.m.pa=S.m.pa||[];S.m.rex=S.m.rex||'';S.m.concl=S.m.concl||'';S.m.imp=S.m.imp||'Alto';S.m.prb=S.m.prb||'Extremo';S.p=S.p||{};S.c=(S.c||[]).map(c=>Object.assign({o:{},ac:{},imgs:[]},c));normCR();cur=0;save();render();toast('Dados importados')}catch(x){toast('Arquivo inválido')}};r.readAsText(t.files[0]);return}
 if(t.dataset.f){c[t.dataset.f]=['t','v'].includes(t.dataset.f)?+t.value||0:t.value;save();render();return}
 if(t.dataset.o){c.o[t.dataset.o]=t.value}
 else if(t.dataset.ac){c.ac=c.ac||{};c.ac[t.dataset.ac]=t.value}
 else if(t.dataset.p){const[k,f]=t.dataset.p.split('.');(S.p[k]=S.p[k]||{})[f]=t.value}
 else if(t.dataset.xa){const[i,f]=t.dataset.xa.split('.');(S.m.pa[+i]=S.m.pa[+i]||{})[f]=t.value}else if(t.dataset.m){S.m[t.dataset.m]=t.value}else return;save()});

async function dl(name,data){
  try{const b=data instanceof Blob?data:new Blob([data],{type:/\.pdf$/.test(name)?'application/pdf':'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('Download iniciado')}
  catch(e){toast('Não foi possível gerar o download neste ambiente')}}
const exp=()=>dl('auditoria-'+S.m.ai.replace(/\W+/g,'-')+'.json',JSON.stringify(S));
