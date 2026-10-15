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

The build output uses Next.js standalone mode. When deploying by file upload,
copy `public` and `.next/static` into the standalone directory beside
`server.js`. A Git-based Hostinger integration may handle this differently, so
confirm that `public` and `.next/static` are present after the build.

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
