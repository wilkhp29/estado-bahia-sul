# Usabilidade V1 — Implementation Plan

**Goal:** Corrigir os cinco problemas da avaliação e atingir pelo menos 3/4 em cada heurística aplicável, com evidência e sem simular maturidade editorial.

**Architecture:** Componentes compartilhados de navegação e rodapé; ajustes incrementais na home preservando arte e identidade; mapa com URL restaurável; mensagens de falha centralizadas. Nenhuma mudança no banco ou abertura da coleta.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS, testes Node e inspeção no navegador.

## Execução aprovada pelo usuário

- [ ] Criar `components/SiteHeader.tsx` com menu de disclosure, `aria-expanded`, Escape e restauração de foco. Reutilizar em `InnerLayout` e na home; acrescentar `SiteFooter` e salto ao conteúdo.
- [ ] Criar `app/usability.css`: texto funcional mínimo 14px, corpo 16px, alvos 44px, blocos fluidos. Preservar fontes, fotografia, azul/verde e hierarquia aprovada.
- [ ] Corrigir `app/page.tsx`: projeto → `/projeto`, temas → âncoras reais, identificação do professor sem promessa biográfica; status de prévia e coleta legíveis; encerramento em HTML.
- [ ] Acrescentar atalho antes dos links SVG em `HomeMap`; filtros e município em URL no `Territory`, restaurados ao voltar; manter alternativa de lista.
- [ ] Criar `/ajuda` com respostas sobre natureza, fontes, cobertura e participação fechada. Em economia, separar temas com referências existentes e indicar lacunas sem preenchimento fictício.
- [ ] Criar estados de carregamento, 404 e erro com recuperação. Centralizar mensagens de rede em `lib/client-request.ts`; preservar campos, impedir reenvio durante espera e explicar token inválido.
- [ ] Testar mensagens de rede, resposta inválida e erro HTTP com mocks isolados; executar `npm test`, `npm run test:sql`, lint, typecheck e build. Nenhum registro de teste em produção.
- [ ] Inspecionar desktop/mobile, menu por teclado, fontes computadas, overflow, busca sem resultado e voltar. Executar detector Impeccable e duas revisões independentes.
- [ ] Corrigir problemas reproduzidos e repetir testes afetados. Notas não substituem testes com usuários, revisão jurídica ou confirmação editorial.
- [ ] Publicar após validação; conferir páginas e coleta fechada; registrar evidências e limitações.

## Critérios de saída

Nenhum problema crítico ou alto reproduzível nos caminhos inspecionados. Todas as heurísticas aplicáveis com pelo menos 3/4 na reavaliação, ou bloqueio externo explicitamente identificado sem atribuir aprovação fictícia. Não afirmar resultado de teste que não foi executado.
