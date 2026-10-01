# Jornada pelo território — entrega local

> Registro histórico da primeira entrega. A revisão posterior de logo, retrato tratado com IA, número 1026, trajetória e publicação de produção está em `docs/candidate-update-2026-09-20.md` e prevalece sobre o estado local descrito abaixo.

## Implementado

- Composição da primeira opção escolhida: hero panorâmico, índice por capítulos e banner azul de Professor Guilherme.
- Logo original preservada; retrato de fonte publicada, sem reconstrução facial por IA, com crédito e tamanho reduzido para respeitar a resolução disponível.
- Textos, links e controles em HTML; nenhuma interface rasterizada.
- Navegação simplificada, rodapé por temas, imagens temáticas maiores, ritmo editorial na home e atualização do sistema compartilhado nas páginas internas.
- Paisagens WebP estáticas de 1200/2400 px, evitando timeout observado no otimizador dinâmico em uma variante de 828 px.
- Tabela comparativa acessível por teclado, com região nomeada e foco visível.

## Verificação

- Lint, typecheck e build aprovados nos ciclos da implementação.
- 21 testes gerais e 13 testes de SQL/API aprovados.
- Teste V1 em banco isolado aprovado: coleta fechada, autenticação, CSRF, exportação, auditoria, confirmação, certificado, exclusão e logout.
- Jornada: dez larguras entre 320 e 1920 px; imagens, capítulos, perfil, Instagram, menu mobile e ausência de erros de execução aprovados.
- Regressão: 18 rotas em seis larguras aprovadas; busca, atalhos, SEO privado e destinos de navegação preservados.
- Revisão Impeccable independente: `ship` limitado às três correções revisadas (eyebrow superior, escala do retrato e verificação final). Não equivale à prontidão operacional de todo o produto.
- Axe final em 390 px: zero violações nas páginas home, projeto, perfil e participação. A região rolável da tabela de /projeto recebeu foco por teclado e passou na revalidação. Isso não certifica conformidade WCAG completa.

## Limites e decisões

O usuário aceitou a composição sem exigir cópia exata em pixels, priorizando a logo e a foto originais. Os gates de reprodução visual foram dispensados com esse contexto registrado; os percentuais de similaridade não são nota de qualidade nem aprovação automática. O ECC orientou a clareza da jornada e a regressão funcional; o Impeccable orientou composição, revisão e refinamento.

A coleta pública permanece desativada. Não foram alterados banco de produção, DNS, e-mail, consentimentos ou configuração eleitoral. Não houve deployment nesta tarefa. Não foram medidos votos, intenção eleitoral, Lighthouse ou conformidade WCAG completa. A autorização específica de uso do retrato e os demais requisitos operacionais anteriores continuam pendentes.

## Arquivos e reprodução

- `components/JourneyOpening.tsx`, `app/jornada.css`, `app/page.tsx` e componentes compartilhados.
- `scripts/jornada-qa.ts` e `scripts/quality-8-qa.ts`.
- Capturas em `.impeccable/review/jornada/` e `.impeccable/review/quality-8/`.
- Imagem criada pelo gerador integrado do ChatGPT: `public/images/jornada-coast.webp`; prompt exato e proveniência em `public/images/jornada-coast.webp.json` e `docs/jornada-assets.md`.
- Ambiente de revisão: http://localhost:3102/.
