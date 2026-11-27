# Hostinger deployment guide

This project is a Next.js application with server-rendered pages and API
routes. Deploy it as a **Node.js application**, not as a static HTML site.

## 1. Before pushing to GitHub

From the `compiled-tech` directory:

```bash
npm install
npm run lint
npm run build
```

The build must finish successfully. Do not commit `.env.local`, `.next/`, or
`node_modules`. The repository should include `package-lock.json`, because
Hostinger will use it for a reproducible `npm ci` install.

Review the worktree before pushing:

```bash
git status
git diff
```

Commit and push only the application changes:

```bash
git add .
git commit -m "Prepare production deployment"
git push origin main
```

Do not add `.env.local` even if Git reports it as a local file.

## 2. Verify the Resend sender before deployment

Do this before testing the production contact form:

1. Sign in at [resend.com](https://resend.com).
2. Open **Domains** and add the domain you will use in the sender address,
   such as `compiledtech.io`.
3. Add the DNS records Resend provides in Hostinger's DNS zone.
4. Wait for Resend to show the domain as verified.
5. Create a Resend API key with permission to send email.

The sender must use the verified domain. For example:

```text
Compiled Tech <hello@compiledtech.io>
```

You do **not** need to change the source code after this guide. The code reads
the sender from `RESEND_FROM_EMAIL`.

## 3. Create the Hostinger Node.js application

In Hostinger hPanel:

1. Open **Websites** and create or open the target website.
2. Open the **Node.js** application setup. The exact labels may differ by
   hosting plan.
3. Select the Node.js version supported by the plan. Use Node 20 or newer when
   available.
4. Connect the application to the GitHub repository
   `Ubaid123678/Compiled-Tech`.
5. Set the application root to `compiled-tech` if the repository contains the
   parent folder. If you upload the contents of `compiled-tech` directly, use
   that directory as the application root.
6. Set the install command to `npm ci`.
7. Set the build command to `npm run build`.
8. Start the application with:

   ```bash
   node .next/standalone/server.js
   ```

   If Hostinger asks for a startup file instead of a command, use
   `.next/standalone/server.js`.

The build packages `public` and `.next/static` beside the standalone server. For a manual upload, deploy the complete `.next/standalone` directory so the JavaScript, fonts, branding, and media travel with `server.js`.

## 4. Add environment variables in Hostinger

Add these in Hostinger's environment-variable section. Do not put them in
GitHub or commit `.env.local`.

### Server-only variables

```env
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=hello@compiledtech.io
RESEND_FROM_EMAIL=Compiled Tech <hello@compiledtech.io>
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
TURNSTILE_SECRET_KEY=...
```

### Public variables

These are embedded in the browser bundle during the build, so they must be set
before building. The two `NEXT_PUBLIC_SUPABASE_*` values are required for the
`/admin` login; `NEXT_PUBLIC_SITE_URL` sets the canonical origin used by SEO,
the sitemap, and the admin sign-out redirect.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://compiledtech.io
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
NEXT_PUBLIC_CALCOM_URL=https://cal.com/compiled-tech
```

Only variables prefixed with `NEXT_PUBLIC_` are intentionally exposed to the
browser. Never use that prefix for Supabase service keys, Resend keys, or the
Turnstile secret.

After changing environment variables, rebuild and restart the application.
Public variables are embedded during the Next.js build.

## 5. Connect the domain

1. Add the domain to the Hostinger website.
2. Point the domain DNS to Hostinger using the records shown in hPanel.
3. Enable the SSL certificate.
4. Add the final hostname to Cloudflare Turnstile.
5. Confirm the final hostname is allowed in Resend and in any Supabase
   authentication settings you use.

## 6. Production smoke test

Open these URLs on the deployed domain:

```text
/
/services/build
/work
/blog
/contact
/robots.txt
/sitemap.xml
```

Then verify:

- The mobile menu opens and closes.
- The hero shows both mobile buttons.
- The five process steps appear in the correct order on mobile.
- Service, work, and blog slug pages do not horizontally overflow.
- The Cal.com booking panel shows future availability.
- Turnstile loads on the contact form.
- A real test inquiry is saved in Supabase.
- The inquiry email reaches `CONTACT_TO_EMAIL`.
- The auto-reply reaches the submitted email address.
- The newsletter form behaves correctly.
- Admin login works only for an authenticated Supabase user.

## 7. What is ready now

The application is ready to be pushed to GitHub after you review the current
worktree. The production build and lint checks pass, the Next.js standalone
output is configured, and `robots.txt` and `sitemap.xml` are generated.

Deployment still requires your external configuration:

- Resend domain verification and API key
- Supabase project, `leads` table, and service-role key
- Cloudflare Turnstile production site and secret keys
- Hostinger environment variables and domain DNS
- A production contact-form test

This guide does not require sharing credentials. Enter all secret values
directly in Hostinger's protected environment settings.

## Prepare database changes before deploying the review branch

Apply `CONTACT_DELIVERY_MIGRATION.sql` for inquiry delivery tracking, then follow the admin and newsletter setup below. Take a production database backup and test the same release sequence in staging first.

### Admin access

Confirm the approved administrator user IDs in Supabase Authentication. For each approved user, run this SQL with their exact UUID. This preserves their other app metadata.

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"compiled_tech_admin": true}'::jsonb
where id = '<approved-user-uuid>'::uuid;
```

Review the live policies on `work_projects`, `blog_posts`, and `newsletter` for additional broad grants. Apply `ADMIN_AUTHORIZATION_MIGRATION.sql` and have approved administrators sign out and back in to refresh their claims before testing. In staging, verify that an approved account can manage content and an ordinary signed-in account can read only published content and has no subscriber access. Disable public account signup if the project only serves staff. When removing an administrator, revoke their sessions and account access as appropriate, since database policies use the claims in issued tokens until they expire.

## Prepare newsletter confirmation

Apply `NEWSLETTER_CONFIRMATION_MIGRATION.sql` before deploying the signup changes. Set
`NEWSLETTER_SIGNING_SECRET` to a stable, randomly generated value of at least 32
characters in the Hostinger server environment. Keep it private. Rotating it
invalidates existing links. Existing subscribers remain subscribed. Include a
signed unsubscribe link generated with `signNewsletterAction("unsubscribe", subscriber.id)`
in future newsletter emails. Existing subscribers can also request removal by
email. Test confirmation and unsubscribe with a company-controlled address.


## Verify Search Console and Google Analytics after the release

1. Deploy the approved revision to the existing Hostinger production app. Confirm the apex hostname is the site URL and that the HTTPS www hostname redirects to it.
2. Open `https://compiledtech.io/favicon-96.png` and check that it returns the 96 × 96 dark logo on a solid white background with an `image/png` content type. Check that the homepage declares the same stable URL using `rel="icon"`. If Hostinger CDN still serves old artwork or markup, purge the affected favicon or homepage URL.
3. Open `/robots.txt` and `/sitemap.xml`. Confirm that public canonical pages are crawlable, sitemap entries resolve on the apex hostname, and versioned or private action URLs are absent.
4. In the verified [Search Console property](https://search.google.com/search-console), open the Page indexing report and record each affected URL and exclusion reason. Use URL Inspection and Test Live URL to check whether Google can fetch each intended canonical page, whether it can index it, and which canonical Google picked. If the live test reports a Hostinger challenge, HTTP 403, or HTTP 429, review the CDN crawler settings using [Hostinger’s crawler guide](https://www.hostinger.com/support/hostinger-cdn-search-engine-crawlers-and-seo/).
5. Submit the canonical sitemap and request indexing for the homepage and affected public pages whose live checks pass. Review the report as Google reprocesses them. Redirects, duplicates, and deliberately private or removed URLs may be correctly excluded. Google controls when the title, favicon, and search results are refreshed.
6. In GA4, confirm the web data stream uses the configured measurement ID. Under Enhanced measurement, enable history-based page changes for Next.js navigation and disable form interactions if the existing stream is collecting those events. Use [DebugView](https://support.google.com/analytics/answer/7201382) or Tag Assistant to verify one page view per page load and client navigation after opting in. Verify the tag stays unloaded in a fresh session after declining. A test property can be used for staging by setting `NEXT_PUBLIC_GA_MEASUREMENT_ID` before building.
