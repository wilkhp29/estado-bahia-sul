# Abaixo assinado Bahia do Sul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar o manifesto do DOCX ao portal e deixar o fluxo de participação pronto, seguro e testável sem publicar afirmações não verificadas como fatos.

**Architecture:** Uma página editorial apresenta o manifesto e suas ressalvas; o formulário reutiliza `ParticipationForm` e as APIs atuais. A coleta permanece fail-closed por configuração e os dados públicos continuam agregados.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS, PostgreSQL/SQLite existentes, Turnstile e testes Node.

---

### Task 1: Conteúdo editorial do manifesto

**Files:**
- Create: `app/participar/abaixo-assinado/page.tsx`
- Modify: `app/page.tsx`, `app/participar/page.tsx`
- Test: `tests/petition-content.test.mjs`

- [ ] **Step 1: escrever teste de presença e integridade editorial**

```js
assert.match(source, /manifestação voluntária/i);
assert.match(source, /não é.*plebiscito/i);
assert.match(source, /informação.*verificação/i);
assert.doesNotMatch(source, /5\.074\.306.*habitantes/);
```

- [ ] **Step 2: criar a página com título, texto do documento, posição do projeto e ressalvas**
- [ ] **Step 3: apontar CTAs existentes para `/participar/abaixo-assinado`**
- [ ] **Step 4: rodar `node --test tests/petition-content.test.mjs` e confirmar PASS**

### Task 2: Fluxo de formulário protegido

**Files:**
- Modify: `app/participar/abaixo-assinado/page.tsx`, `components/ParticipationForm.tsx`, `app/privacidade/page.tsx`
- Test: `tests/petition-content.test.mjs`, `tests/participation-api.test.ts`

- [ ] **Step 1: reutilizar o formulário existente com `collectionReady()` e os municípios validados**
- [ ] **Step 2: explicar que o envio gera confirmação por e-mail e só então entra no contador**
- [ ] **Step 3: manter o checkbox de newsletter independente e não adicionar WhatsApp sem revisão aprovada**
- [ ] **Step 4: testar coleta fechada, consentimento ausente, município inválido e duplicidade**

### Task 3: Navegação, acessibilidade e visual

**Files:**
- Modify: `components/SiteHeader.tsx`, `components/SiteFooter.tsx`, `app/usability.css`
- Test: navegador local em 390px e viewport padrão

- [ ] **Step 1: adicionar o link da página ao menu e ao rodapé**
- [ ] **Step 2: aplicar a hierarquia editorial, aviso de dados e alvos de toque do design system**
- [ ] **Step 3: testar teclado, foco, menu mobile, textos longos e estado fechado**

### Task 4: Verificação final

- [ ] **Step 1:** executar `npm test`, `npm run test:sql`, `npm run typecheck`, `npm run lint` e `npm run build`.
- [ ] **Step 2:** executar detector Impeccable nos novos arquivos e corrigir qualquer ocorrência real.
- [ ] **Step 3:** conferir no navegador a página editorial, formulário fechado, ajuda, privacidade e link de confirmação sem transmitir dados.
