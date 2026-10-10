This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contact form setup

For the complete setup walkthrough, see [CONTACT_SETUP.md](./CONTACT_SETUP.md).

Copy `.env.example` to `.env.local` and fill in the following values before testing a
submission:

- `RESEND_API_KEY`: create an API key in the Resend dashboard.
- `CONTACT_TO_EMAIL`: the inbox that should receive new project inquiries.
- `SUPABASE_URL`: the project URL from Supabase project settings.
- `SUPABASE_SERVICE_ROLE_KEY`: the server-only service role key from Supabase API settings.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: the public site key from a Cloudflare Turnstile widget.
- `TURNSTILE_SECRET_KEY`: the matching private Turnstile secret key.

The service role key and Turnstile secret must only exist in server environment variables.
Never expose them through `NEXT_PUBLIC_*` variables or commit `.env.local`.

The contact route writes to a Supabase table named `leads` with columns for `name`,
`email`, `company`, `service`, `budget`, `timeline`, `details`, and `created_at`.
Create that table with appropriate text/timestamp columns before sending a live
submission. Replace the placeholder contact details and Cal.com URL in
`src/data/contact.ts` with your real email, WhatsApp link, location, and booking URL.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Production deployment on Hostinger

This project uses server-rendered pages and API routes, so it must run as a
**Node.js application** on Hostinger. Do not use a static HTML deployment.

1. In Hostinger, create a Node.js application using the Node version supported by
   the current hosting plan.
2. Add every variable from `.env.example` in Hostinger's environment-variable
   settings. Keep secrets server-side and set `NEXT_PUBLIC_CALCOM_URL` to the
   public Cal.com URL.
3. Deploy the repository without `.env.local` and without `node_modules`.
4. Run:

   ```bash
   npm ci
   npm run build
   ```

5. Set the application startup file to:

   ```text
   .next/standalone/server.js
   ```

6. Set the application port to the port provided by Hostinger. The standalone
   server reads the `PORT` and `HOSTNAME` environment variables.
7. Point the domain to the Node.js application, enable SSL, and submit a real
   contact form after configuring Resend, Supabase, and Turnstile.

The production build creates a self-contained `.next/standalone` directory.
When deploying manually, keep the `public` and `.next/static` directories
available beside the standalone server.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
