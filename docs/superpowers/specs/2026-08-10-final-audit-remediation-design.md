# Final Audit Remediation Design

## Goal

Close every actionable gap found against `docs/交付前终审.md` without changing the approved bright industrial visual direction or inventing customer facts.

## Architecture

Tenant language configuration becomes the single source of truth. A server-side tenant-config module reads `default_language` and `supported_languages`, normalizes them, and supplies route validation, navigation paths, metadata alternates, and Sitemap generation. English remains the launch language and content fallback; enabling another stored language activates its routes without a schema or routing rewrite.

Product query handling distinguishes three states: missing runtime configuration may use the shipped launch fallback, a database error may use the fallback while emitting diagnostics, and a successful empty or missing-row response must remain empty or 404. Product mapping consumes every required multilingual JSONB field, including `advantages_i18n`.

News cards use descriptive alternative text, and stored article HTML is sanitized before rendering. A separate Custom Process page exposes the already approved process content as an independent SEO page. The browser icon uses a compact square brand mark derived from the supplied logo while the full lockup remains unchanged elsewhere.

## Data and SEO flow

1. Read the current tenant language configuration on the server.
2. Validate `[locale]` requests against the enabled language list.
3. Build locale-aware internal links, canonical URLs, reciprocal `hreflang`, `x-default`, Open Graph URLs and Sitemap entries from that same list.
4. Query active products and published articles in the requested locale, using the established requested-language → default-language → first-non-empty fallback order.
5. Never restore inactive or deleted products from static launch data after a successful database query.

## Error handling

- Missing Supabase runtime configuration keeps the static launch fallback available for local preview and build resilience.
- Product query errors are logged without exposing credentials and fall back to the two approved products.
- Successful empty product queries return an empty list; successful missing product queries return `null`.
- Tenant language query errors fall back to English so the launch site remains available.
- Article HTML sanitization removes executable markup and unsafe URL protocols while preserving ordinary editorial HTML.

## Verification

Regression tests must first fail for new-language activation, localized paths and alternates, product empty-query behavior, `advantages_i18n`, dynamic Sitemap entries, article sanitization, descriptive news image text, and the Custom Process route. Completion requires the full Vitest suite, ESLint, production build, source/content safety scans, browser checks at desktop and 390 px mobile, favicon verification, Production deployment SHA verification, and a fresh pass through `docs/交付前终审.md`.

## Approved scope decisions

- English remains the only currently enabled public language; no empty translated pages or language switcher are exposed at launch.
- No certificate page or certification claim is created because no supporting certificate material was supplied.
- Original product photography remains factually unchanged. Image optimization is limited to safe delivery improvements and does not generate replacement product imagery.
- The unresolved v0 deletion restriction is recorded truthfully; irreversible deletion is not attempted without the mandatory downloadable archive condition.
