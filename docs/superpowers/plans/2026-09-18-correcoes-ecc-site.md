# Correções ECC do Bahia do Sul — Implementation Plan

> **For agentic workers:** Execute task-by-task with validation checkpoints.

**Goal:** Eliminate the ECC findings without changing the product positioning or opening public participation.

**Architecture:** Preserve the existing CSS/Next.js structure. Add a content-aware tablet breakpoint for the reference homepage, centralize route metadata in the App Router, keep provisional municipality status explicit, and replace the inconsistent fallback font. Validate with the existing unit, SQL, V1, build, and browser QA scripts.

**Tech Stack:** Next.js 15, TypeScript, CSS, Playwright, Node test runner.

---

### Task 1: Remove the 1024px homepage overflow

**Files:**
- Modify: `app/reference.css`
- Test: `scripts/v1-qa.ts`

- [ ] Add a content-driven tablet breakpoint around the reference header/navigation so the desktop visual remains intact above 1100px while 1024px uses a compact, non-overflowing header.
- [ ] Preserve all navigation destinations and keep touch targets at least 44px where the compact layout is used.
- [ ] Run the V1 responsive assertion across 320, 375, 390, 430, 768, 1024, 1440 and 1920px.

### Task 2: Give routes distinct SEO metadata

**Files:**
- Modify: `app/layout.tsx`
- Modify: route `page.tsx` files that currently inherit the generic title.
- Test: `scripts/v1-qa.ts` or a focused metadata assertion.

- [ ] Keep the global title as a fallback.
- [ ] Add route-specific title and description metadata for homepage, projeto, territorio, economia, mineracao, historia, estudos, documentos, noticias, fontes, privacidade and participacao.
- [ ] Verify each production page exposes a unique title and meaningful description.

### Task 3: Clarify provisional municipality validation

**Files:**
- Modify: the territory summary component/data source that renders validation counts.
- Test: existing municipality tests and territory browser QA.

- [ ] Keep the original 173-entry count.
- [ ] Label IBGE-confirmed and pending-review counts as validation status, not official municipality totals.
- [ ] Preserve visible links to the validation/conference source.

### Task 4: Normalize typography fallback

**Files:**
- Modify: `app/globals.css`

- [ ] Replace Arial-only fallback declarations with a coherent system sans stack while retaining the existing DM Sans and Libre Baskerville primary fonts.
- [ ] Re-run the Impeccable detector and confirm the font warning is gone or reduced to a justified external limitation.

### Task 5: Full verification

**Files:**
- No production data changes.
- Test outputs: `.impeccable/review/`.

- [ ] Run `npm test`, `npm run test:sql`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:v1`.
- [ ] Inspect desktop and mobile screenshots and production routes in a real browser.
- [ ] Confirm collection remains disabled and no personal data is submitted.
- [ ] Record remaining limitations only if a validation still fails.
