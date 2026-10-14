# Auditoria Interna · Checklist de Medição de Obra

Aplicação web (HTML + CSS + JavaScript, sem build) para registrar o checklist de auditoria das medições de obra por contrato e gerar o **Relatório de Auditoria Interna em Word (.docx) e PDF**.

## Estrutura

```
.
├─ package.json
├─ README.md
├─ .gitignore
├─ .github/workflows/pages.yml     # publica a pasta www no GitHub Pages
└─ www/                            # raiz do site (é o que vai ao ar)
   ├─ index.html
   ├─ css/
   │  └─ styles.css
   ├─ js/
   │  ├─ config.js                 # rótulos (IM/PI/NI/OM/NA), níveis, chave do localStorage
   │  ├─ data.js                   # carrega data/*.json e logo/*.png
   │  ├─ state.js                  # estado, cálculo da nota, ordenação dos contratos
   │  ├─ views.js                  # telas (checklist, quadro geral, planos, dados do relatório)
   │  ├─ events.js                 # eventos, importar/exportar, download
   │  ├─ report-common.js          # interpretador dos textos livres (Word e PDF)
   │  ├─ report-pdf.js             # relatório em PDF (jsPDF)
   │  ├─ report-word.js            # relatório em Word (docx)
   │  └─ main.js                   # inicialização
   ├─ data/
   │  ├─ criterios.json            # critérios do checklist, pesos, constatações e recomendações
   │  ├─ textos.json               # textos fixos das seções 1, 2 e 3 do relatório
   │  ├─ magnitude.json            # tabelas do tópico 9 (impacto x probabilidade)
   │  ├─ relatorio-padrao.json     # cabeçalho padrão (nº do relatório, tema, obra, competência)
   │  └─ contratos-exemplo.json    # contratos carregados na primeira abertura
   └─ logo/
      ├─ logo.png                  # logo do cabeçalho do relatório (branco, fundo transparente)
      └─ status/                   # ícones im/om/pi/ni/na usados nas tabelas do Word
```

## Como executar

A aplicação lê os arquivos de `data/` e `logo/` via HTTP, então **não abra o `index.html` com duplo clique**. Use um servidor local:

```bash
npm start              # http://localhost:8080  (usa http-server via npx)
# ou, sem Node:
npm run start:python   # python3 -m http.server --directory www
```

Precisa de internet apenas para carregar as bibliotecas (jsPDF 2.5.1, jsPDF-AutoTable 3.8.2 e docx 8.5.0, em versões fixas via CDN).

## Publicar no GitHub Pages

1. Crie o repositório e envie o projeto para a branch `main`.
2. Em **Settings → Pages → Build and deployment → Source**, escolha **GitHub Actions**.
3. A cada push em `main`, o workflow `.github/workflows/pages.yml` publica a pasta `www`.

> **Atenção:** `www/data/contratos-exemplo.json` contém nomes reais de fornecedores. Use repositório **privado** ou troque esses dados antes de tornar o projeto público.

## Regras do relatório

- **Ordem dos contratos** no Quadro Geral, no tópico 7, no tópico 8 e no tópico 11: **IM e OM → NA → PI → NI**. Dentro de cada grupo vale a ordem de cadastro. A numeração `8.x` acompanha essa ordem, inclusive na tela.
- **Nota do contrato:** soma dos pesos dos critérios IM/OM (1) e PI (0,5) sobre os pesos avaliados; NA não entra. IM ≥ 80% · PI ≥ 50% · NI < 50%.
- **Nível de conformidade geral:** (IM + 0,65 × PI) ÷ contratos avaliados.
- **Imagens por tópico:** cada tópico em *Dados do relatório* (4, 5, 6, 6.1, Resumo executivo e 10) aceita as próprias imagens, inseridas logo abaixo do texto do tópico. Fotos de evidência por contrato ficam no tópico 8.
- Os critérios **Análise fiscal** e **Documentação trabalhista** continuam no checklist e aparecem normalmente no relatório (item a item, recomendações e plano de ação), mas têm peso 0 e **não influenciam a nota**. O relatório não traz o texto "alerta"; a marcação de alerta existe apenas na tela do aplicativo.

## Como personalizar

| Quero alterar… | Edite |
|---|---|
| critérios, pesos, constatações e recomendações | `www/data/criterios.json` |
| textos de Introdução, Legislação e Objetivos | `www/data/textos.json` |
| tabelas de magnitude (tópico 9) | `www/data/magnitude.json` |
| nº do relatório, tema, obra e competência padrão | `www/data/relatorio-padrao.json` |
| logo | `www/logo/logo.png` (mesmas proporções; branco sobre fundo transparente) |
| contratos de exemplo | `www/data/contratos-exemplo.json` (`status` = uma letra por critério, na ordem do `criterios.json`: `I`, `P`, `N`, `O`, `A`) |

A **posição** do critério em `criterios.json` define a coluna do status nos dados já salvos. Se mudar a ordem ou a quantidade de critérios, exporte um backup antes.

## Dados e privacidade

Os dados digitados ficam no `localStorage` do navegador (chave `aud1`) e **não vão para o repositório**. Use **Exportar dados** (JSON) para backup e **Importar** para restaurar ou migrar de computador. Dados importados com mais ou menos critérios que o `criterios.json` atual são ajustados automaticamente (posições faltantes viram NA).
