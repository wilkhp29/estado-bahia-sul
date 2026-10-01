# Guilherme — atualização de apresentação

Solicitação: aproximar logo, retrato e ondas da prévia Jornada; destacar 1026; pesquisar trajetória; publicar após validação.

## Imagens

Logo horizontal adaptada pelo gerador integrado a partir da V2; original mantida. Retrato tratado pelo gerador a partir da foto de 161 × 225 pixels. O usuário autorizou explicitamente geração após informar não possuir foto maior. O tratamento reconstrói textura: não é uma fotografia documental intacta. A legenda e o alt informam IA. Original preservado no perfil e nos arquivos.

Prompts e procedência: sidecars junto a `logo-bahia-horizontal.webp` e `professor-guilherme-cutout.webp`. Ondas são geometria SVG de interface, não fotografia.

## Trajetória — fontes consultadas em 20/09/2026

- 2016: publicação ALBA, resultados TSE, p. 53. Candidatura a prefeito de Arataca, não eleito. Não confundir com exercício de mandato.
- 2017: Prefeitura de Arataca, registro funcional de agosto, p. 11. Nome completo e cargo de professor efetivo; não inferir vínculo atual, titulação ou instituição de formação. Não republicar remuneração ou identificadores pessoais. A data de admissão diverge entre documentos e foi omitida.
- 2025: reportagem Expressão Única, 27/10/2025, sobre encontro de 24/10/2025 na Câmara de Arataca. Participação e coordenação do Movisul atribuídas à reportagem, sem converter o movimento em mantenedor deste portal.
- 2026: Tribuna e perfil Opera Mundi; candidato a deputado federal, Republicanos, Bahia, 1026. Número também fornecido pelo usuário.

URLs ficam junto aos marcos em `data/candidate.ts`, visíveis no perfil. Não foram inventadas falas, realizações, cursos ou cargos.

## Escopo operacional

Nenhuma alteração em SQL, envio de e-mail, consentimento, DNS ou habilitação da coleta. Implantação somente após testes. Deploy anterior para referência de rollback: https://bahia-do-c3qdjr8yj-williamtanayoupopcs-projects.vercel.app.

## Validação local concluída

- Lint, TypeScript e build Next.js aprovados.
- 22 testes gerais e 13 testes SQL/API aprovados.
- Jornada: 10 larguras de 320 a 1920px, imagens, 1026, logo, links, teclado e formulário fechado.
- Qualidade: 18 rotas × 6 larguras, busca, sem overflow e navegação mobile.
- Axe: home e perfil em 390 e 1536px sem violações nas regras WCAG A/AA executadas. Não é certificação integral de acessibilidade.
- Conferência visual desktop/mobile contra o comp; ajuste final da altura do retrato para 380px no desktop. Não se declara igualdade pixel a pixel, pois logo e retrato são adaptações e 1026 é conteúdo adicional solicitado.

## Publicação concluída

- Vercel: `dpl_BYVCupV5WH1Ymnuk7d5VwDESfTs6`, Ready / Production.
- URL: https://estadobahiadosul.com.br/ — HTTP 200, HTTPS e cabeçalhos de segurança conferidos.
- Deployment: https://bahia-do-1q4qx4ilx-williamtanayoupopcs-projects.vercel.app.
- Smoke de produção aprovado em cinco rotas, 390/1536px: home, perfil, território, projeto e participação. Logo, retrato e número presentes; quatro marcos com fontes. Sem overflow ou erros de execução observados. Nenhum formulário enviado.
- Atualização posterior: retrato do banner substituído pela foto de perfil de 1080 × 1080 do Instagram oficial, com recorte transparente assistido por IA; o JPEG original permanece preservado e a legenda agora aponta para o Instagram oficial.
- Nova publicação: `dpl_G6hMP7nc6VsnPqipERthGh3CBc8H`, Ready / Production; smoke de produção repetido e aprovado.
- CLI global antiga foi recusada pela Vercel; implantação realizada com `npx --yes vercel@latest` (59.23.2), sem substituir instalação global.

## Arquivos finais e prompts

- Logo: `/Users/williamsantos/Documents/ChatGPT/estado bahia sul/public/images/logo-bahia-horizontal.webp`.
- Retrato atualizado: `/Users/williamsantos/Documents/ChatGPT/estado bahia sul/public/images/professor-guilherme-instagram-cutout.webp`, derivado da foto oficial de perfil de 1080 × 1080 do Instagram; JPEG original também preservado em `public/images/professor-guilherme-instagram-original.jpg`.
- Prompts usados pelo gerador integrado do ChatGPT e notas de origem: sidecars de mesmo nome com extensão `.json`.
