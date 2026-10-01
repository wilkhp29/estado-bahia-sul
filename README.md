# Bahia do Sul — primeira entrega

## V1 local com SQL e administração

Atualização: logo original fornecida pelo usuário, tokens azul-marinho/oceano/verde/dourado, contador fictício removido. Banco SQLite persistente, painel em `/admin` com autenticação por e-mail e senha, exportação CSV agregada ou pessoal com justificativa e auditoria, formulário `/participar`, confirmação SMTP, certificado imprimível com QR, exclusão pelo titular e editor de conteúdo. A coleta está desativada até configurar contato de privacidade, SMTP, Turnstile e revisão responsável. Consulte **docs/v1-operacao.md** para acesso, configuração, testes, backup e limites de lançamento. As seções abaixo registram o histórico anterior à V1.

## Versão atual: reprodução do layout enviado

Homepage recomposta a partir da arte original autorizada pelo usuário em public/images/layout-original.png. ReferenceArt conserva as regiões da própria imagem via SVG viewBox. Em 17/09/2026, a miniatura ilustrativa foi substituída por geometria IBGE renderizada no servidor, com 171 links para /territorio?municipio=codigo. A seção de destaques cobre inicialmente 11 municípios nas seis regiões editoriais, com referências individuais em data/highlights.ts. Ausência de pesquisa não significa ausência de potencialidades.

O retrato agora é a fotografia de Professor Guilherme (José Carlos Guilherme Santos) publicada no perfil do Opera Mundi: https://operamundi.uol.com.br/eleicoes-2026/candidatos/professor-guilherme-ba/. Imagem externa, sem cópia local, com crédito e fallback de falha. A origem está identificada, mas não foi localizada licença explícita de reutilização: regularizar autorização ou substituir por arquivo autorizado antes da publicação pública. Vínculo com Bahia do Sul e trajetória no projeto aguardam documentação; o perfil não presume compromissos. O número 12.482 continua demonstrativo e não há coleta de assinatura. scripts/territory-content-qa.mjs verifica foto carregada, 171 links, seis filtros, fontes, deep links, estados pendentes e oito larguras.

Histórico: uma versão anterior usava fotografias do Unsplash (inventário em data/photos.ts). Ela foi substituída pela arte do usuário; esses componentes não são usados na homepage atual.

Homepage editorial com mapa municipal, agrupamento em seis regiões, busca textual, filtros, zoom, painel de detalhes e fontes. Stack: Next.js, TypeScript, Tailwind, D3 Geo. Iniciar com `npm install` e `npm run dev`; abrir http://localhost:3000. Não requer variáveis de ambiente nesta etapa.

## Dados e critérios

O JSON original permanece em municipios.json. Dataset derivado em data/territory.json; relatório público em public/data/validation.json. Cadastro e geometrias consultados nas APIs públicas do IBGE; data de consulta registrada no dataset. A API de malhas usada não fixa edição: não inferir ano de referência da data de consulta. Geometria simplificada, adequada à exploração visual, não a cálculos de área.

173 entradas, 171 correspondências por nome normalizado. Água Quente e Livramento do Brumado não são substituídos por municípios presumidos. Jaguaquara e Malhada de Pedras mantêm confirmação pendente. Correspondência cadastral não valida inclusão na proposta.

Agrupamento editorial autorizado pelo usuário e sujeito a revisão, usando microrregiões históricas retornadas pelo cadastro: Porto Seguro → Extremo Sul; Ilhéus-Itabuna → Sul; Valença → Baixo Sul; Vitória da Conquista, Itapetinga e Jequié → Sudoeste; Bom Jesus da Lapa e Santa Maria da Vitória → Médio São Francisco; Guanambi, Brumado, Boquira, Seabra e Livramento do Brumado → Centro Sul. As seis categorias não são uma regionalização oficial do IBGE. Não calcular agregados com essa classificação antes da revisão.

## Atualização

Baixar https://servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios em /tmp/bahia-municipios-ibge.json e https://servicodados.ibge.gov.br/api/v3/malhas/estados/29?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=municipio em /tmp/bahia-malha-ibge.json; executar `npm run data:prepare`. Revisar o diff antes de publicar.

## Verificação

`npm test`, `npm run lint`, `npm run typecheck`, `npm run build`. Com servidor ativo, `node scripts/browser-qa.mjs` verifica busca, seleção, filtros, zoom, vazio, erros e overflow em oito larguras. Screenshots em .impeccable/review.

## Escopo e pendências

Esta entrega é uma homepage com exploração territorial, não a plataforma completa. Sem CMS, banco, autenticação, abaixo-assinado, coleta pessoal ou certificado. Indicadores aguardam dados validados. Revisar licença do retrato e documentação biográfica antes da publicação. Nenhuma nota Lighthouse ou conformidade WCAG integral foi certificada. Indexação desativada enquanto protótipo. Para servir build local: `npm run build` e `npm start`; publicação não realizada. Não executar build e dev simultaneamente na mesma pasta .next.
