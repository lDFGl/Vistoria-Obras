/* report-common.js
   Interpretador de texto livre (parágrafos, tópicos "- ", itens "1) ", títulos) usado no Word e no PDF. */
const parseRT=t=>String(t||'').replace(/\r/g,'').split('\n').map(l=>l.replace(/[\t\u00a0 ]+/g,' ').trim()).filter(Boolean).map(l=>{let q;
 if(q=l.match(/^#{1,3}\s+(.+)$/))return{k:'h',t:q[1]};
 if(q=l.match(/^[-•*–]\s+(.+)$/))return{k:'b',t:q[1]};
 if(q=l.match(/^(\(?\d+[.)]|\(?[a-z][.)]|[IVX]+[.)])\s+(.+)$/i))return{k:'n',l:q[1],t:q[2]};
 const lt=l.replace(/[^A-Za-zÀ-ÿ]/g,'');
 if(l.length<=90&&(/:$/.test(l)||(lt.length>=3&&l===l.toUpperCase())))return{k:'h',t:l};
 return{k:'p',t:l}});
