/* main.js
   Inicialização: carrega dados/imagens, monta o estado e renderiza a tela. */

(async function(){
  try{await loadData();initState();render()}
  catch(e){
    console.error(e);
    document.getElementById('app').innerHTML=`<div class="card" style="margin:16px"><b>Não foi possível carregar os arquivos do projeto.</b><p>${esc(e.message)}</p><p class="w">A aplicação lê as pastas <code>data/</code> e <code>logo/</code> via HTTP, então não abra o <code>index.html</code> com duplo clique (file://). Rode <code>npm start</code> (ou <code>python3 -m http.server -d www 8080</code>) e acesse <code>http://localhost:8080</code>.</p></div>`;
  }
})();
