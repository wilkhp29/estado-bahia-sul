# Atualização da página do projeto a partir do documento Implementation Plan

> **For agentic workers:** Execute task-by-task with validation checkpoints.

**Goal:** Incorporate the supplied SITE ESTADO BAHIA DO SUL document into the project page without changing the existing visual identity or presenting unverified claims as official data.

**Architecture:** Keep the existing App Router and editorial layout. Move document-derived copy into a typed data module, render it through a focused project narrative component, and use existing design tokens with a small project-specific CSS layer. Classify all numerical and historical claims as document statements pending source review.

**Tech Stack:** Next.js, TypeScript, React, CSS, existing DM Sans/Libre Baskerville design system, Playwright QA.

---

### Task 1: Create the document-derived editorial model

**Files:**
- Create: `data/project-document.ts`
- Test: `tests/project-document.test.mjs`

- [ ] Store the narrative sections, comparison rows, development paths, and source-status labels as typed data.
- [ ] Preserve the document's meaning while explicitly marking estimates, projections, declarations, and historical claims as pending verification.
- [ ] Add tests that ensure the page does not label document estimates as official indicators.

### Task 2: Build the project narrative surface

**Files:**
- Create: `components/ProjectDocument.tsx`
- Modify: `app/[section]/page.tsx`
- Modify: `app/globals.css`

- [ ] Render the document only for `/projeto` using the current header, footer, typography, colors, and spacing rhythm.
- [ ] Include sections for origin, cocoa cycle, territorial inequality, historical movement, viability, development paths, expected changes, national comparisons, legal context, and participation CTA.
- [ ] Show the comparison table as “document estimate / pending verification” and link users to sources and methodology.
- [ ] Preserve the site's distinction between project position and official data.

### Task 3: Metadata and browser QA

**Files:**
- Modify: `app/[section]/page.tsx`
- Modify: `scripts/v1-qa.ts` only if a new assertion is needed.

- [ ] Keep the route-specific project title and description.
- [ ] Verify the project page at desktop, tablet, and mobile widths with no overflow.
- [ ] Run lint, typecheck, unit tests, SQL tests, build, and V1 QA.

