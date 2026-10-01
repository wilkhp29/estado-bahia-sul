# Resultado da revisão — 19/09/2026

## Resultado e limite da meta

Revisor independente Impeccable: **8,0/10** para acabamento e usabilidade observáveis da prévia, veredicto `ship`. A primeira rodada recebeu 7,5 por duplicação de destaques no território e recorte do hero; ambos foram corrigidos e confirmados. A nota não mede votos, conversão, acessibilidade integral ou operação em produção.

Não é correto afirmar que a operação inteira chegou a 8: a coleta pública continua desativada e falta o e-mail autorizado. Professor Guilherme foi indicado pelo usuário como responsável pelo portal, em substituição à atribuição anterior ao MOVISUL; nenhum contato foi inventado. O produto está aprimorado para apresentação e exploração, mas a inscrição real permanece uma dependência de lançamento.

## Conceito revisado

Projeto como porta de entrada; Guilherme com apresentação pública e vínculo político explícito; fontes e leitura progressiva; ações voluntárias distintas de acompanhamento, compartilhamento e apoio ao projeto. Sem perfis políticos individuais e sem reutilizar o abaixo-assinado para campanha.

## Mudanças entregues

- /entenda: resumo de leitura curta, com caminhos para projeto, mapa, candidato e fontes.
- /buscar: páginas e municípios, busca sem acentos, resultados e recuperação sem resultados; acesso no menu e Ctrl/⌘ + K.
- Homepage mais curta no celular, preservando logo, hero, mapa e imagens temáticas. Destaques completos ficam no mapa.
- Página de Guilherme com identificação pública atribuída e Instagram acessível no início.
- Conteúdo das páginas internas centralizado; mapa com largura maior; IDs duplicados do admin corrigidos.
- Ajuda e aviso do abaixo-assinado refletem a configuração de coleta, sem afirmar abertura inexistente.
- Professor Guilherme identificado como responsável no rodapé e na privacidade, conforme correção posterior do usuário.
- Labels de status removidas de /projeto continuam removidas; notas de procedência permanecem.
- Metadados, canonical e prévia social por página; sitemap apenas para páginas públicas selecionadas.
- Indexação permitida por padrão apenas em produção Vercel. PUBLIC_INDEXING_ENABLED=false bloqueia; preview/local não indexados por padrão. Busca, admin, certificados e gerenciamento não entram no sitemap.

## Validação

- Lint, TypeScript e build de produção passaram.
- 21 testes unitários/SEO e 13 testes SQL/API passaram.
- QA V1 passou com banco isolado: formulário fechado, autenticação, exportação, auditoria, confirmação, certificado privado e exclusão. Nenhum banco real de participantes foi usado nos testes.
- Capturas desktop/mobile da home, resumo, projeto, candidato, território e busca revisadas.
- QA de navegação passou em 18 rotas e seis larguras (320, 390, 768, 1024, 1440 e 1920): limites de conteúdo, H1 e IDs, busca por página/município/sem acentos, estado vazio, Ctrl/⌘ + K e menu mobile. Nenhum erro de execução observado nessa sessão.
- Detector Impeccable sem achados nos arquivos consultados; não substitui revisão humana nem certificação WCAG.

## Pendências reais

1. E-mail autorizado de contato/privacidade e configuração operacional para ativar inscrições; revisão responsável antes da abertura.
2. Autorização específica do retrato ou arquivo fornecido pela equipe. A atribuição da fonte não equivale a licença.
3. Vídeo, agenda e novas declarações somente quando fornecidos ou documentalmente confirmados.
4. Publicar esta revisão e validar novamente no domínio. Nada nesta rodada foi implantado na Vercel.
5. Testes com visitantes reais e medição agregada de interesse. Sem dados de uso, não há como certificar resultado eleitoral. Nenhum rastreamento novo foi ativado.

## Artefatos

Plano: docs/quality-8-plan.md. Evidências visuais: .impeccable/review/quality-8/. Teste de navegação: scripts/quality-8-qa.ts, servidor em localhost:3102. Testes de indexação: tests/site.test.ts, incluídos em npm test.
