# Compiled Tech website review

Reviewed 22 November 2026 (Asia/Karachi). Review only; no application, database, or deployment changes.

## Assessment

The site has a coherent visual identity, visible pricing, real published portfolio entries, and clear contact options. The public pages reviewed loaded successfully. Reliability, authorization, navigation, and content accuracy need attention before further visual polishing.

This is an engineering and user-experience review, not a legal compliance assessment or penetration test. Production readiness remains conditional on inquiry delivery and authorization verification.

## Scope and checks

- Opened the live homepage, Services, Pricing, Work, Process, About, Blog, Contact, Privacy, and Terms.
- Opened all four service detail routes, all three currently listed project pages, and both currently listed blog articles.
- Checked desktop homepage appearance, titles/canonicals on main pages, and mobile layout at a 390 × 844 viewport. Tested mobile menu opening and closing. The detail-page samples measured did not horizontally overflow.
- Inspected contact/newsletter handlers, admin authentication and privileged endpoints, supplied database policies, content loading, SEO generation, deployment configuration, and shared components.
- `npm run lint`: passed, zero errors; one existing Google Analytics script warning in `src/app/layout.tsx:82`.
- `tsc --noEmit --incremental false`: passed.
- No contact inquiries, subscriptions, emails, bookings, account creation, or database writes were submitted.
- No production build, Lighthouse performance run, field Core Web Vitals review, complete external-link crawl, authenticated admin session, or deployed database-policy inspection was performed. Image checks were point-in-time observations, not proof that every lazy-loaded image loads.
- The direct HTTP/web-fetch routes could not access the domain in this environment. The alternate browser successfully loaded the site after its initial browser-check screen. This does not establish a DNS outage.

## Prioritized findings

### 1. High — Admin authorization checks only whether a user is signed in

Evidence: `compiled-tech/src/middleware.ts`; `src/app/api/admin/upload/route.ts:15`; `src/app/api/admin/reorder/route.ts:18`. The upload and reorder handlers then use the service-role client. Supplied SQL grants all authenticated users project/blog management and subscriber reads (`doc/WORK_SUPABASE_SCHEMA.sql`, `doc/BLOG_SUPABASE_SCHEMA.sql`, `doc/NEWSLETTER_SUPABASE_SCHEMA.sql`).

Impact: an ordinary authenticated account could receive administrative powers. Exploitability depends on deployed policies, account provisioning, and signup settings, which were not inspected. No unauthorized access was attempted.

Fix: explicitly authorize approved administrators in middleware, every privileged handler, and database policies. Verify that an ordinary authenticated account cannot upload, reorder, modify content, or read subscriber data. Prioritize inspection of the actual production policies rather than assuming the supplied SQL matches them.

### 2. High — Inquiry success does not confirm email acceptance

Evidence: `compiled-tech/src/app/api/contact/route.ts:87–117` awaits both Resend sends without examining their returned `error` fields, then responds with success. `src/components/forms/ContactForm.tsx` promises that an email copy is on its way. Newsletter welcome mail has the same unchecked-result pattern.

Impact: a saved inquiry can appear successful even when provider acceptance failed, leaving the team unaware of the inquiry. Conversely, a thrown error after the database insert reports failure despite having saved the lead; a retry can duplicate it.

Fix: handle provider-returned errors, record delivery state separately from lead persistence, and design retries to avoid duplicate leads and messages. Verify team notification and customer auto-reply independently with an approved test inquiry. Provider acceptance still does not prove inbox delivery.

Reference: [Resend's Next.js example explicitly checks the returned error](https://resend.com/docs/send-with-nextjs).

### 3. High — Portfolio errors can publish demo case studies as real work

Evidence: `compiled-tech/src/lib/work.ts:41–110,152–186` contains placeholder projects and unverified claims such as $2M GMV, 500 providers, and extraction accuracy. Query failures return these objects to public portfolio views and potentially the sitemap.

Impact: a database/configuration problem changes public business claims rather than showing a recoverable error. The live portfolio currently showed Glommi, VapeGala, and the health-monitoring project; the demo fallback was not observed live.

Fix: remove public demo fallbacks; use an honest unavailable state or a last-known-good cache of verified published projects, and log failures.

### 4. High — Privacy disclosures do not match the analytics implementation

Evidence: `compiled-tech/src/app/privacy/page.tsx:89,143,178` describes Plausible and says no advertising/tracking cookies are used. `src/app/layout.tsx:82–88` unconditionally loads and configures Google Analytics. Google Maps is also embedded on Contact and is absent from the policy's provider list.

Impact: visitors receive inaccurate information about third-party processing. This review does not determine jurisdiction-specific consent obligations.

Fix: choose the intended analytics setup, verify its actual storage/network behavior, and align the policy, provider list, and any required consent behavior with it.

### 5. Medium — Blog table-of-contents links have no heading targets

Live confirmation: on `/blog/hire-a-software-developer-you-can-trust`, all nine generated table-of-contents hashes lacked corresponding element IDs.

Evidence: `compiled-tech/src/app/blog/[slug]/page.tsx` extracts heading slugs for the table of contents but does not install a heading-ID transformation for MDX. `src/components/mdx/MDXComponents.tsx` only forwards an existing `id`.

Fix: generate stable heading IDs with the same slugging rules used by the table of contents, including duplicate-heading handling. Verify each published article's links scroll to the right heading.

### 6. Medium — Inner-page skip links point to a missing main target

Live confirmation: Work, Blog, Contact, a service detail, and the inspected article lacked `id="main"`; the shared skip link points to `#main`. The homepage does have a main landmark.

Fix: provide one `main` landmark with the expected target on every public page and verify keyboard focus moves to the content.

### 7. Medium — Privacy and Terms inherit the homepage canonical

Live confirmation: `/privacy` and `/terms` both declare `https://compiledtech.io/` as their canonical URL.

Evidence: their metadata overrides only title and description, inheriting the root canonical and social metadata.

Fix: generate route-specific metadata with canonical paths `/privacy` and `/terms`, and verify the rendered head.

### 8. Medium — Project and article titles render twice as H1

Live confirmation: each of the three project detail pages and both articles renders two H1 elements with the same title. This is also visibly repetitive content, not just a heading-count concern.

Evidence: `PageHero` renders the first H1, followed by another H1 in `src/app/work/[slug]/page.tsx:127` and `src/app/blog/[slug]/page.tsx:191`.

Fix: use one primary title and a compact metadata block, then give subsequent sections appropriate headings.

### 9. Medium — Blog/project category links and advertised search ignore URL state

Evidence: detail breadcrumbs link to `/blog?filter=Guides` and `/work?filter=…`, but the grids initialize their filter to `All` and the index pages do not read these parameters. `src/lib/seo.ts:243–246` advertises a `/blog?q=…` SearchAction, but no corresponding query-driven search is implemented in the inspected index/grid.

Fix: synchronize filters with the URL, validate categories, and either implement the advertised search or remove the SearchAction.

### 10. Medium — Newsletter endpoint has no application-level abuse protection

Evidence: `compiled-tech/src/app/api/newsletter/route.ts` validates an email and inserts/sends directly, without a CAPTCHA, honeypot, rate limit, or confirmation flow. The provided SQL also permits direct anonymous inserts. Hosting-level protections were not inspected.

Impact: automated signups can pollute the list and trigger unwanted welcome messages. The policy promises an unsubscribe option, but no unsubscribe route or welcome-email link was found in the inspected implementation.

Fix: establish rate limiting and subscription confirmation; make unsubscribing discoverable and functional; restrict direct writes as appropriate to the chosen subscription flow.

### 11. Medium — Contact retry and verification recovery need work

Evidence: `src/components/forms/ContactForm.tsx:89,98` uses the visitor's own email as the fallback support address. After success it clears the local Turnstile token without resetting the widget. A failed request can also leave a consumed token available for reuse. This repeat-submission behavior was identified from code, not exercised live.

Fix: use the company's contact address, explicitly reset verification when needed, preserve form values on recoverable failures, and verify success, provider failure, expired verification, and a second submission.

### 12. Medium — Data failures can look like empty content or missing articles

Evidence: `src/lib/blog.ts` converts query failures to empty lists/null. Article rendering turns null and MDX compilation failures into `notFound()`.

Impact: visitors can see an empty blog or a missing article during a dependency outage, without a useful recovery state. Monitoring cannot readily distinguish an intentionally missing item from an outage by public behavior alone.

Fix: distinguish not-found, no-content, invalid-content, and dependency failure states; add observable error handling and a retry path.

### 13. Low — Homepage copy and links need an editorial pass

- Live hero typo: “BUSSINESS”; source: `src/data/site.ts:6`.
- The prominent visual headline is a slogan; the more explicit explanation of what the company builds is screen-reader-only, while the desktop service tagline is hidden on mobile. Add a short visible mobile value proposition.
- Homepage studio, payment, and communication sections repeat adjacent statements. Shorten these so visitors reach evidence and the inquiry action sooner.
- The footer location links to `#` rather than the real map, although Contact has a useful Maps link.
- Service FAQ grammar includes “a ai and ml project.” Review generated service-specific phrasing.
- Homepage ownership language says accounts/code are yours “from day one,” while Terms describes custom-work ownership after full payment. Clarify access versus ownership consistently; this is an editorial observation, not legal advice.

### 14. Medium — Motion preference does not control the hero video

Evidence: `src/components/hero/HeroMedia.tsx` always autoplays and loops the background video. The reduced-motion CSS shortens CSS animations but does not pause video, and no pause control appears in the inspected hero.

Fix: respect reduced-motion preferences for the video and provide a way to stop persistent background movement. Review Framer Motion behavior separately.

## Suggested step-by-step work order

1. Verify production admin roles, signup settings, and database policies; close authorization gaps.
2. Repair inquiry delivery/retries and verify the full contact flow.
3. Remove public demo fallbacks and improve database failure states.
4. Align analytics behavior and privacy disclosures.
5. Fix table-of-contents targets, main landmarks, URL filters, repeated titles, and legal-page metadata.
6. Improve newsletter protections and unsubscribe behavior.
7. Polish homepage/service copy and motion behavior.
8. Run production build and desktop/mobile regression checks; measure performance and field metrics before choosing optimizations.

Recommended first implementation step: admin authorization verification and hardening. Its production exposure is not yet established, so inspect deployed settings first and preserve existing approved administrator access.
