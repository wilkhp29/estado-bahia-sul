# Identidade V2 Implementation Plan

> Execução nesta sessão: atualização visual delimitada aprovada pelo usuário, sem mudança de comportamento ou infraestrutura.

**Goal:** aplicar a nova logo integral e paleta aprovada ao site publicado.

**Architecture:** manter o componente Brand compartilhado e os tokens de app/design-system.css. Usar arquivo com novo nome para evitar cache da logo anterior. Preservar layout, fotografias, textos e dados. Verde identifica ações primárias; oceano identifica navegação; dourado fica nos detalhes; navy nos títulos.

**Tech Stack:** Next.js, React, CSS, Playwright e Vercel.

- [x] Copiar a imagem original para public/images/logo-bahia-do-sul-v2.png sem edição; atualizar components/Brand.tsx. SHA-256 idêntico ao anexo.
- [x] Atualizar tokens e estados em app/design-system.css e categorias em data/highlights.ts, mantendo seis rótulos e limites.
- [x] Registrar a direção vigente em DESIGN.md.
- [x] Executar lint, typecheck, build e teste de contraste; inspecionar homepage, mapa e formulário em desktop/mobile em uma rodada. QA inclui acesso administrativo, seleção regional e ausência de overflow.
- [x] Executar detector Impeccable sobre os arquivos alterados; nenhum achado retornado.
- [x] Publicar na Vercel e confirmar logo, cores e resposta HTTP em produção, sem alterar coleta nem banco. Deploy dpl_aiFD92bmyYXwVyfYQ6DbkFZVTeFr READY; domínio próprio respondeu 200, logo decodificada e botão verde confirmado no navegador.
