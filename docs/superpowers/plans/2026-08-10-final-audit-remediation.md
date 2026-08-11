# Final Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the ChuangTe customer site satisfy every actionable item found in the final delivery audit.

**Architecture:** Centralize tenant locale configuration, locale-aware paths and SEO generation; make product fallback state-aware; sanitize article content at the data boundary; add the missing independent process page and a compact brand favicon. Preserve the existing Next.js App Router, Supabase data model and approved UI.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase, Vitest, Testing Library, sanitize-html, Next Image.

## Global Constraints

- Launch content remains English-only until the tenant enables another language.
- Only Charge Trays and Charge Racks may be published as products.
- Do not publish warranty, guarantee or certification claims.
- Keep customer-visible Chinese files UTF-8 and edit them with `apply_patch`.
- Do not expose Supabase service-role, GitHub, Vercel or Cloudflare credentials.
- Do not change the approved bright industrial visual system.

---

### Task 1: Tenant-driven locale routing, links and SEO

**Files:**
- Create: `lib/tenant-config.ts`
- Modify: `lib/i18n.ts`, `lib/site-config.ts`, `lib/seo.ts`, `app/[locale]/layout.tsx`, `app/sitemap.ts`, locale pages and shared navigation components
- Test: `tests/i18n.test.ts`, `tests/seo.test.ts`, `tests/routes.test.ts`, `tests/sitemap.test.ts`

**Interfaces:**
- Produces: `normalizeTenantLocaleConfig`, `getTenantLocaleConfig`, `buildLocalePath`, locale-aware alternates and Sitemap entries.

- [ ] **Step 1: Write failing tests** proving `{ default_language: "en", supported_languages: ["en", "de"] }` enables `de`, internal paths use the requested locale, alternates contain reciprocal `en`, `de`, and `x-default`, and Sitemap emits both enabled locales.
- [ ] **Step 2: Run tests and confirm failures** with `pnpm test -- tests/i18n.test.ts tests/seo.test.ts tests/routes.test.ts tests/sitemap.test.ts`.
- [ ] **Step 3: Implement the minimal locale source of truth** and change route suffix constants from `/en/...` to locale-neutral paths.
- [ ] **Step 4: Pass locale through navigation, heroes, cards, metadata and Sitemap** so no public internal route is hardcoded to English.
- [ ] **Step 5: Run the targeted tests** and confirm they pass.

### Task 2: Product mapping and correct fallback states

**Files:**
- Modify: `lib/products-fallback.ts`, `lib/products-db.ts`, `app/[locale]/products/[slug]/page.tsx`
- Test: `tests/data-mapping.test.ts`, `tests/products-query.test.ts`

**Interfaces:**
- Produces: `ProductRecord.advantages`, complete JSONB mapping, and query result resolvers that distinguish errors from successful empty results.

- [ ] **Step 1: Write failing tests** showing `advantages_i18n` follows locale fallback, an empty successful list stays empty, a missing successful detail stays `null`, and database errors alone use launch fallback.
- [ ] **Step 2: Run tests and confirm failures** with `pnpm test -- tests/data-mapping.test.ts tests/products-query.test.ts`.
- [ ] **Step 3: Implement the minimal mapping and result-state helpers** and wire them into list/detail queries.
- [ ] **Step 4: Render product advantages only when present** without changing factual fallback content.
- [ ] **Step 5: Run the targeted tests** and confirm they pass.

### Task 3: News safety, descriptive images and independent process page

**Files:**
- Create: `lib/sanitize-article-html.ts`, `app/[locale]/custom-process/page.tsx`
- Modify: `app/[locale]/news/page.tsx`, `app/[locale]/news/[slug]/page.tsx`, `lib/site-config.ts`, `package.json`, lockfile
- Test: `tests/article-safety.test.ts`, `tests/routes.test.ts`

**Interfaces:**
- Produces: `sanitizeArticleHtml(html: string): string` and `/[locale]/custom-process`.

- [ ] **Step 1: Write failing tests** proving unsafe scripts, event handlers and `javascript:` links are removed while headings, paragraphs and safe links remain; require the process route in the public route contract.
- [ ] **Step 2: Run tests and confirm failures** with `pnpm test -- tests/article-safety.test.ts tests/routes.test.ts`.
- [ ] **Step 3: Add `sanitize-html` and its types**, implement the narrow editorial allowlist, and sanitize before `dangerouslySetInnerHTML`.
- [ ] **Step 4: Use the article title as news-card image alternative text** and add the independent Custom Process page using confirmed process facts.
- [ ] **Step 5: Run the targeted tests** and confirm they pass.

### Task 4: Browser icon and delivery records

**Files:**
- Replace: `app/icon.png`
- Modify: `delivery/delivery-report.md`
- External record: Feishu customer delivery row

**Interfaces:**
- Produces: a square small-size brand icon, current evidence identifiers, explicit delivery date and current status.

- [ ] **Step 1: Derive a square CT symbol from the supplied logo** and inspect it at original and favicon sizes.
- [ ] **Step 2: Update the delivery report** with the final audited commit/deployment after verification, the current test count, delivery date and delivery status.
- [ ] **Step 3: Extend and update the Feishu delivery record** with date and explicit status, then read it back through the API without changing A–L values.

### Task 5: Full verification, deployment and final audit

**Files:**
- Modify only files required by failures found during verification.

**Interfaces:**
- Produces: verified local and Production state at the same Git SHA.

- [ ] **Step 1: Run all tests, lint and build** with `pnpm test`, `pnpm lint`, and `pnpm build`.
- [ ] **Step 2: Run content safety and secret scans** across tracked source, fallbacks and customer data without printing secret values.
- [ ] **Step 3: Verify desktop and 390 px pages** for status, H1, broken images, overflow, navigation, forms, process page and favicon.
- [ ] **Step 4: Commit intentionally, authenticate as `luqite-ux`, push and deploy** using the repository company-token procedure.
- [ ] **Step 5: Verify Production SHA, domain, Sitemap, metadata, favicon and all independent pages**, then update the delivery report with the final identifiers.
- [ ] **Step 6: Re-run `docs/交付前终审.md` line by line** and continue fixing any failed item before reporting completion.
