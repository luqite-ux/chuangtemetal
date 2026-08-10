# ChuangTe Metal delivery report

- Formal domain: `https://chuangtecasting.com`
- Corporate email: `info@chuangtecasting.com`
- Customer repository: `https://github.com/luqite-ux/chuangtemetal`
- Customer commit: `5162e58e4fbbb0e6d4d5e3b2669d0df480eb9f09`
- Vercel project: `prj_Eb3B7MQpYtMFhy6TQuEGpLr2euT7`
- Production deployment: `dpl_AG67Kku13K6Sw9cRXCnLvYUXpvcm`
- Tenant ID: `993d7d80-4466-4f38-8a93-078e32bc1627`
- Admin group: `2`
- Launch locale: English (`en`); extensible locale data and routes retained

## Delivered scope

- Independent homepage, products, two product detail pages, capabilities, industries, factory, about, news, FAQ, contact and RFQ pages.
- Bright industrial visual system, responsive navigation, reduced-motion support and uploaded ChuangTe logo/favicon.
- Supabase product and article data layers with multilingual JSONB fallbacks.
- Real contact and RFQ inquiry writes plus private engineering-file upload.
- Customer `/admin` login handoff to the unified administration center.
- Dynamic product/article metadata, canonical URLs, Open Graph, Twitter Card, JSON-LD, robots and Sitemap.
- GitHub, Vercel, Cloudflare DNS, HTTPS and permanent `www` to apex redirect.

## Verification evidence

- Unit/integration tests: 24 passed.
- ESLint: passed.
- Next.js 16.2.11 production build: passed; 23 generated routes.
- Browser QA: desktop and 390 px mobile; mobile menu; zero customer-site console errors and warnings.
- Lighthouse: Accessibility `1.00`, SEO `1.00`, color contrast `1.00` with zero contrast failures.
- Online SEO scan: 12/12 independent pages returned 200; unique titles; descriptions; matching canonical and Open Graph URLs; Sitemap 12 URLs.
- Product database: exactly two active products; all launch images are absolute R2 URLs.
- News database: empty after successful create/translate/publish/render/delete verification.
- One-click translation: product and article translated from English to Chinese, manually edited, saved and reopened successfully; launch language restored to English-only while translated JSONB remains available.
- Inquiry verification: contact and RFQ submissions appeared in the customer backend; RFQ attachment upload succeeded; two test inquiries, one test attachment and one test article were deleted; residue count is zero.
- Content safety: no warranty/guarantee terms found in source, database or online independent pages.
- Cloudflare: active Zone with authoritative nameservers `eleanor.ns.cloudflare.com` and `sterling.ns.cloudflare.com`; Vercel-specific apex A and `www` CNAME records verified.
- Corporate email DNS: six Cloudflare mail-related records were backed up and all six verified publicly; two public MX and two apex TXT answers were confirmed.

## Privacy cleanup note

The attempted v0 generation produced no downloadable source version. Its empty online project/chat therefore cannot be deleted under the mandatory download-before-delete rule until irreversible deletion is explicitly approved or a downloadable archive exists. The delivered production source is complete in the company GitHub repository and local customer repository.
