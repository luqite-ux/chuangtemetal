# ChuangTe Metal delivery report

- Formal domain: `https://chuangtecasting.com`
- Corporate email: `info@chuangtecasting.com`
- Customer repository: `https://github.com/luqite-ux/chuangtemetal`
- Audited implementation: the current `luqite-ux/chuangtemetal` `main` revision, verified against Vercel Production during the final audit
- Vercel project: `prj_Eb3B7MQpYtMFhy6TQuEGpLr2euT7`
- Production deployment: the current READY Production deployment for the Vercel project below; the exact deployment ID is recorded in the final audit handoff
- Tenant ID: `993d7d80-4466-4f38-8a93-078e32bc1627`
- Admin group: `2`
- Launch locale: English (`en`); extensible locale data and routes retained
- Delivery date: `2026-08-11`
- Current status: completed; GitHub `main`, Vercel Production, formal domains and Feishu readback were verified on `2026-08-11`

## Delivered scope

- Independent homepage, products, two product detail pages, capabilities, custom process, quality and documentation, industries, factory, about, news, FAQ, contact and RFQ pages.
- Bright industrial visual system, responsive navigation, reduced-motion support and uploaded ChuangTe logo/favicon.
- Supabase product and article data layers with tenant-driven locale routing, complete multilingual JSONB mapping and state-aware product fallbacks.
- Real contact and RFQ inquiry writes plus private engineering-file upload.
- Customer-domain `/admin` proxy with local login, protected session, product/article/settings writes and logout enforcement.
- Dynamic product/article metadata, canonical URLs, Open Graph, Twitter Card, Organization/Product/NewsArticle/Breadcrumb/FAQ JSON-LD, robots and database-driven Sitemap.
- GitHub, Vercel, Cloudflare DNS, HTTPS and permanent `www` to apex redirect.

## Verification evidence

- Unit/integration tests: 43 passed.
- ESLint: passed.
- Next.js 16.2.11 production build: passed; all static, ISR, dynamic detail, administration and API routes generated successfully.
- Browser QA: all 14 Sitemap pages opened on desktop and 390 px mobile; one `h1` per page, no broken images, no remaining horizontal overflow, and mobile navigation verified.
- Lighthouse on the final quality page: Accessibility `1.00`, SEO `1.00`, color contrast `1.00` with zero contrast failures; the previously audited homepage has the same scores.
- Online SEO scan: all 14 independent pages are included in the release verification; titles, descriptions, canonical and Open Graph URLs are locale-aware.
- Sitemap: 14 canonical English launch URLs, including the independent Custom Process page; active products are database-driven and use their actual Supabase `updated_at` values; deleted test articles are absent.
- Product database: exactly two active products; all launch images are absolute R2 URLs.
- News database: empty after successful create/translate/publish/render/delete verification.
- One-click translation: product and article translated from English to Chinese, manually edited, saved and reopened successfully; launch language restored to English-only while translated JSONB remains available.
- Inquiry verification: contact and RFQ submissions appeared in the customer backend; RFQ attachment upload succeeded; two test inquiries, one test attachment and one test article were deleted; residue count is zero.
- Content safety: no warranty/guarantee terms found in source, database or online independent pages.
- Customer administration: unauthenticated `/admin` redirects to `/admin/login`; formal account login remains on `chuangtecasting.com`; product, article and settings writes passed through the proxy; logout clears `hq_admin_session` and protected access returns to the customer login page.
- Shared administration origin allowlist already includes both `chuangtecasting.com` and `www.chuangtecasting.com`.
- Vercel: formal apex, `www` redirect and project domain verified; all six required environment variables are configured for Development, Preview and Production.
- Feishu: customer row `1ae2e0!A32:L32` was updated without creating a duplicate and read back through the API; all twelve delivery columns remain populated, and column L records tenant `993d7d80-4466-4f38-8a93-078e32bc1627`, delivery date `2026-08-11` and current status `已完成`.
- Cloudflare: active Zone with authoritative nameservers `eleanor.ns.cloudflare.com` and `sterling.ns.cloudflare.com`; Vercel-specific apex A and `www` CNAME records verified.
- Corporate email DNS: six Cloudflare mail-related records were backed up and all six verified publicly; two public MX and two apex TXT answers were confirmed.

## Final remediation notes

- Tenant `default_language` and `supported_languages` now drive route validation, internal links, optional language switching, canonical URLs, reciprocal `hreflang`, `x-default` and Sitemap language entries. English remains the only enabled launch language.
- Successful empty product queries and missing active product rows remain empty or 404; they are no longer replaced by static products. Runtime database failures remain observable and may use the two approved launch fallbacks.
- `advantages_i18n` is mapped and rendered with the established locale fallback order.
- Published article HTML is sanitized before rendering and news image alternative text uses the article title.
- The browser icon is a compact square CT mark derived from the supplied customer logo; the full brand lockup remains unchanged in the site header and footer.
- The header and footer lockup use a dedicated transparent CT mark, so the logo no longer introduces a white image rectangle on light or dark backgrounds.
- Chrome opened the audited page with `/icon.png` as its selected icon declaration. The Windows tab-strip screenshot interface returned a window-handle error, so this report does not misrepresent that failed screenshot as a visual tab-strip confirmation.

## Privacy cleanup note

The attempted v0 generation produced no downloadable source version. Its empty online project/chat therefore cannot be deleted under the mandatory download-before-delete rule until irreversible deletion is explicitly approved or a downloadable archive exists. The delivered production source is complete in the company GitHub repository and local customer repository.
