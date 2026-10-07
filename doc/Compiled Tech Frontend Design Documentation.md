# Compiled Tech Frontend Design Documentation

Oct 7, 2026 · @Ubaid

## 1. Overview

This is the build spec for the Compiled Tech marketing site: what each page says, how it looks, and which tool builds each part. You can build the whole UI from it without more design input.

|  |  |
| --- | --- |
| Goal | Turn visitors into project inquiries |
| Audience | Startup founders, small companies, and technical leads who need web, app, SaaS, or AI work |
| Look | Dark steel palette, wide futuristic headings, one large 3D hero object, quiet motion elsewhere |
| Theme | Dark only for v1 (the PRD's light mode is dropped; see section 12) |
| Stack | Next.js, TypeScript, Tailwind CSS, Framer Motion, Lenis, Three.js or a pre-rendered hero |
| Targets | Lighthouse 90+ on all four scores, LCP under 2.5 s on mobile |

**How to use this document.** Read sections 1 to 4 once, because they set the rules. Build from sections 5 to 8, which list the pages, text, and components. Check sections 9 and 10 before you call a page done. Section 11 gives the setup commands and build order.

## 2. Technology stack

Use Next.js with Tailwind as the base, and add one library per job. Every library below has a single role, so nothing overlaps.

| Layer | Tool | What it does | Used in |
| --- | --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | Routing, SEO, image and font optimization | All pages |
| Styling | Tailwind CSS v4 | Utility classes driven by the tokens in section 3 | Everywhere |
| UI primitives | shadcn/ui (Radix) | Accessible button, input, select, dialog, tabs, accordion | Forms, mobile menu, FAQ |
| Icons | Lucide React | Line icons | Nav, cards, footer |
| Tech logos | simple-icons | Brand marks for the trust strip | Home |
| Component motion and gestures | Framer Motion | Scroll reveals, hover, tilt, drag, layout changes | Everywhere |
| Smooth scroll | Lenis | Inertia scrolling on desktop | Site-wide |
| Pinned scroll scenes | GSAP + ScrollTrigger | Pins the process timeline while steps change | Home, Process |
| Pre-rendered 3D (recommended) | Blender, exported as WebM/MP4 + WebP poster | Hero background loop | Home hero |
| Live 3D (optional) | three, @react-three/fiber, @react-three/drei | Real-time hero object that reacts to the pointer | Home hero (route B) |
| No-code 3D (optional) | Spline + @splinetool/react-spline | Visual 3D editor with embed | Alternative to Blender |
| Forms | React Hook Form + Zod | Validation on client and server | Contact, newsletter |
| Email | Resend | Sends inquiries and auto-replies | Contact API route |
| Database | Supabase (Postgres) | Stores leads | Contact API route |
| Booking | Cal.com embed | Discovery-call scheduling | Contact |
| Content | MDX (@next/mdx) | Blog and case studies as files | Blog, Work |
| Analytics | Plausible | Privacy-friendly events | Layout |
| Hosting | Vercel | Deploys, preview URLs, CDN | All |
| Quality | ESLint, Prettier, Lighthouse CI | Code style and performance checks | CI |

**Rules for choosing.**

- Framer Motion animates components. GSAP is only for the pinned process timeline. Never put both on one element.
- Three.js loads only on the home page, only on desktop, and only after the poster has painted.
- Pick one hero route in section 9 and ship it. Do not build both.

**Install commands**

```bash
npx create-next-app@latest compiled-tech --ts --tailwind --app --eslint --src-dir
cd compiled-tech
npx shadcn@latest init
npm i framer-motion lenis gsap lucide-react simple-icons
npm i react-hook-form zod @hookform/resolvers resend @supabase/supabase-js
npm i @next/mdx @mdx-js/loader @mdx-js/react
# only if you choose the live 3D hero (route B)
npm i three @react-three/fiber @react-three/drei && npm i -D @types/three
```

## 3. Design tokens

The site uses six colors, three fonts, and one spacing scale. Put these in Tailwind once and never type a raw hex value in a component.

**Colors (dark only)**

| Token | Hex | Use | Contrast on Ink |
| --- | --- | --- | --- |
| ink | `#070B11` | Page background | n/a |
| night | `#0D141D` | Cards, sections, form fields | n/a |
| slate | `#1B2735` | Raised surfaces, code chips, hover fills | n/a |
| mist | `#8FA1B5` | Body text, captions, labels | 7.4 : 1 |
| steel | `#B9C6D4` | Subheadings, borders on hover, primary button fill | 11.4 : 1 |
| frost | `#E9EFF6` | Headings, logo, highest-emphasis text | 17.0 : 1 |
| line | `rgba(185,198,212,0.16)` | 1 px borders and dividers | n/a |

All text pairs pass WCAG AA. Mist on slate is the lowest at 5.7 : 1, so do not use mist below 14 px on slate. There is no accent color. Emphasis comes from brightness: frost is loudest, mist is quietest.

**Typography**

| Role | Font | Weights | Use |
| --- | --- | --- | --- |
| Display | Orbitron | 500, 600 | Headlines, nav, buttons, labels. Always uppercase, with letter spacing. |
| Body | Exo 2 | 300, 400, 500 | Paragraphs, forms, lists |
| Code | JetBrains Mono | 400 | Tech chips, code samples, small data labels |

Orbitron is very wide. Use it for short text only, never for paragraphs or text under 12 px.

| Style | Size | Line height | Font | Tracking |
| --- | --- | --- | --- | --- |
| Hero big | clamp(1.8rem, 4vw, 3.7rem) | 1.0 | Orbitron 600 | 0.01em |
| Hero small | clamp(1rem, 2.15vw, 2rem) | 1.1 | Orbitron 500 | 0.12em |
| H2 | clamp(1.5rem, 3.2vw, 2.4rem) | 1.15 | Orbitron 600 | 0.02em |
| H3 | 1.15rem | 1.3 | Orbitron 600 | 0.06em |
| Eyebrow | 0.72rem | 1.4 | Orbitron 500 | 0.22em |
| Body large | 1.125rem | 1.65 | Exo 2 400 | 0 |
| Body | 1rem | 1.6 | Exo 2 400 | 0 |
| Small | 0.875rem | 1.5 | Exo 2 400 | 0.01em |
| Code label | 0.8rem | 1.5 | JetBrains Mono | 0 |

Keep body text under 65 characters per line.

**Spacing, shape, and depth**

- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section padding is 64 on mobile and 104 on desktop.
- Page width: 1200 px max, 16 px side gutter on mobile, 24 on tablet, 64 inside the hero frame.
- Radius: 12 for inputs and chips, 20 for cards, 28 for the hero frame, 999 for pill buttons.
- Borders: 1 px `line`. On hover, raise to `rgba(185,198,212,0.4)`.
- Shadows: none by default. On hover, a soft glow `0 10px 30px rgba(185,198,212,0.25)`.
- Background layers: a vertical gradient from ink to a mid slate-blue behind the hero, flat ink everywhere else, plus a dark vignette on hero edges.

**Motion timing**

| Token | Value | Use |
| --- | --- | --- |
| fast | 150 ms | Color and opacity changes |
| base | 250 ms | Hover lifts, button states |
| slow | 600 ms | Scroll reveals |
| ease | `cubic-bezier(0.22, 1, 0.36, 1)` | All transitions |

**Tailwind v4 setup** (`app/globals.css`)

```css
@import "tailwindcss";

@theme {
  --color-ink: #070B11;
  --color-night: #0D141D;
  --color-slate: #1B2735;
  --color-mist: #8FA1B5;
  --color-steel: #B9C6D4;
  --color-frost: #E9EFF6;
  --color-line: rgb(185 198 212 / 0.16);

  --font-display: var(--font-orbitron), ui-sans-serif, sans-serif;
  --font-body: var(--font-exo), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;

  --radius-chip: 12px;
  --radius-card: 20px;
  --radius-frame: 28px;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}

body { background: var(--color-ink); color: var(--color-mist); }
```

Load the fonts in `app/layout.tsx` with `next/font/google` (Orbitron, Exo\_2, JetBrains\_Mono) and set `display: "swap"`.

## 4. Logo and brand usage

The logo is a hexagon "C" with a slanted "T" crossbar, set beside the name "Compiled Tech". Use the frost version on the dark site.

| File | Background | Where it goes |
| --- | --- | --- |
| `compiled-tech-icon-for-dark-bg.svg` | Ink, night, photos | Header, footer, hero |
| `compiled-tech-icon-for-light-bg.svg` | White or light | Documents, invoices, email signatures |
| `compiled-tech-favicon.svg` | Any | Browser tab. Save as `app/icon.svg` |
| `compiled-tech-app-icon.svg` | Any | Home-screen icon. Export 180 px PNG as `app/apple-icon.png` |

**Placement**

- Header: icon 32 px tall, then the wordmark "COMPILED TECH" in Orbitron 600, 0.95 rem, 0.16em tracking, with 12 px between them.
- Footer: same lockup at 28 px.
- Clear space: keep at least half the icon's width empty on every side.
- Smallest size: 16 px, and only the favicon file. Below 24 px, never use the detailed icon.

**Rules**

- Use only frost, steel, or ink. No gradients, shadows, or outlines on the logo.
- Do not stretch, rotate, or recolor the mark. Do not put it on a busy photo without a dark overlay.
- The icon is the only 3D-looking element near the logo. Keep the area around the header logo flat.

The wordmark font is still open. The mockup used a generic geometric sans. Decide in section 12 before you export the final lockup.

## 5. Site map and navigation

The header has six links and one button. The button is always "Start a Project" and always goes to `/contact`.

**Routes**

| Route | Page | Header | Footer |
| --- | --- | --- | --- |
| `/` | Home | Home | No |
| `/services` | Services overview | Services | Yes |
| `/services/[slug]` | Service detail (4 pillars, then individual services) | No | Yes (pillars) |
| `/work` | Case studies list | Work | Yes |
| `/work/[slug]` | Case study detail | No | No |
| `/process` | How we work | Process | Yes |
| `/about` | About | About | Yes |
| `/blog` | Blog list | Blog | Yes |
| `/blog/[slug]` | Article | No | No |
| `/contact` | Start a project and booking | Button | Yes |
| `/privacy`, `/terms` | Legal | No | Bottom bar |

**Header**

| State | Look |
| --- | --- |
| Over the hero | Transparent. Logo left, links centered, button right. Height 72 px. |
| After 80 px of scroll | Ink at 80% opacity, 14 px backdrop blur, 1 px `line` underneath. Height shrinks to 60 px over 250 ms. |
| Active link | Frost text with a 1 px underline. Other links are mist at 88% opacity and go to frost on hover. |
| Link style | Exo 2, 0.92 rem, 0.04em tracking. 16 to 36 px between links. |
| Button | Pill, steel fill, ink text, Orbitron 600, 0.72 rem, uppercase, small arrow icon. |

**Mobile menu (below 900 px)**

- Links hide. A 44 px hamburger sits top right and morphs into an X when open.
- The drawer fills the screen: ink at 90% with 14 px blur. Links are centered Orbitron, 1.4 to 2 rem, uppercase.
- "Start a Project" sits at the bottom of the drawer. Tapping any link closes it.
- Escape closes it, focus stays inside while open, and the page behind does not scroll.

**Footer**

| Column | Content |
| --- | --- |
| Brand | Logo lockup, one line: "We compile ideas into intelligent software.", social icons (GitHub, LinkedIn, X) |
| Services | Build, AI and ML, Automate and Analyze, Advise and Support |
| Company | About, Process, Work, Blog |
| Contact | Email, WhatsApp, city and country, "Start a Project" button |
| Newsletter | One email field and a "Subscribe" button above the bottom bar |
| Bottom bar | "© 2026 Compiled Tech. Software only." on the left, Privacy and Terms on the right |

Inner pages show breadcrumbs under the header, for example Home / Services / Web Development. The home page has none.

## 6. Home page, section by section

The home page has nine blocks in this order: Hero, Trust strip, Services, Process, Work, AI spotlight, Why Compiled Tech, Final CTA, Footer. Text in quotes is the exact copy to use. Edit it to match how you actually work before launch.

### 6.1 Hero

**Layout.** One rounded frame (28 px radius, 1 px `line` border) inside a 16 px page margin. Height is clamp(620 px, 56vw, 800 px) on desktop and 680 px on phones. Layers from back to front: background (video or poster), dark vignette, headline, header, bottom row.

**Text.**

- Left headline: "COMPILE" (Hero big) over "IDEAS" (Hero small, steel).
- Right headline: "INTO" (Hero big) over "INTELLIGENCE" (Hero small, steel).
- Together they read "Compile ideas into intelligence". Keep a visually hidden line in the `h1`: "Compiled Tech builds software and AI for startups and growing teams".
- Bottom left: three text links GH, IN, TW (Orbitron 0.8 rem).
- Bottom center: "Web, apps, SaaS and AI. Software only." (uppercase, 0.82 rem, mist). Hide on screens under 900 px.
- Bottom right: primary button "Start a Project" and a ghost button "See Our Work".

**Phone layout.** Headline halves stack: "COMPILE IDEAS" at the top, "INTO INTELLIGENCE" at the bottom, with the 3D object between them. Buttons stack full width.

**Components.** `Header`, `HeroMedia`, `HeadlineSplit`, `SocialLinks`, `Button`.

**Motion.** On load, the object scales from 80% to 100% over 700 ms and each headline half slides 24 px toward the center while fading in. The background moves a few pixels with the pointer (section 9).

### 6.2 Trust strip

**Layout.** Full width, 96 px tall, 1 px `line` above and below.

**Text.** Label "BUILT WITH" (eyebrow style), then logos: React, Next.js, TypeScript, Node.js, Python, Flutter, React Native, Angular, Laravel, MongoDB, MySQL, PostgreSQL.

**Components.** `Marquee`, `TechLogo`.

**Motion.** Logos scroll left at 40 seconds per loop, pause on hover. With reduced motion, show a static wrapped grid.

### 6.3 Services

**Layout.** Eyebrow, H2, lead, then a four-column grid of cards (two columns on tablet, one on phone). Under it, a dashed-border "Plus" strip.

**Text.**

- Eyebrow: "SERVICES"
- H2: "Four ways we ship software"
- Lead: "Pick one pillar or combine them. Every project is software only."

| Card | One line | List |
| --- | --- | --- |
| Build | Websites, apps, and SaaS products that load fast and scale. | Web development; App development (React and Flutter); SaaS products; E-commerce; APIs and backend |
| AI and ML | Models, chatbots, and document tools trained on your data. | Machine learning projects; Model training and fine-tuning; RAG systems; Chatbots; Extractor and document processing |
| Automate and Analyze | Workflows and dashboards that remove manual work. | AI automation workflows; Data dashboards; Analytics and reporting |
| Advise and Support | Guidance, training, and care after launch. | AI consulting; Training workshops; Maintenance and support |

Each card ends with a text link "View services" and an arrow. Card label above the title: "PILLAR 1" to "PILLAR 4" in code style.

- Plus strip, left: "PLUS: Graphic design and UI/UX design"
- Plus strip, right: "SOFTWARE ONLY: No hardware, import/export, or physical infrastructure"

**Components.** `SectionHeading`, `PillarCard` (built on `TiltCard`), `PlusStrip`.

**Motion.** Cards reveal with a 80 ms stagger. On hover, a card tilts up to 6 degrees toward the pointer and a soft light follows the cursor inside it. On touch screens there is no tilt.

### 6.4 Process

**Layout.** On desktop, a horizontal line with five nodes. The section pins to the screen while the user scrolls, and the large text on the right changes with the active node (about 60vh of scroll per step). On phones it is a plain vertical list with no pinning.

**Text.**

- Eyebrow: "HOW WE WORK"
- H2: "From first call to live product"

| Step | Title | Text |
| --- | --- | --- |
| 1 | Discover | We learn your goals, users, and limits, then agree on scope and price. |
| 2 | Design | Wireframes and a clickable design that you approve before any code. |
| 3 | Build | Regular demos, so you see real progress and not status reports. |
| 4 | Launch | Testing, deployment, and a handover you can run without us. |
| 5 | Support | Fixes, updates, and new features after go-live. |

**Components.** `ProcessTimeline`, `StepNode`, `StepPanel`.

**Motion.** GSAP ScrollTrigger pins the section. The active node fills with frost and the line draws up to it. Step text fades and slides 16 px over 400 ms.

### 6.5 Featured work

**Layout.** Eyebrow, H2, lead, then three cards in a row (one column on phones). Each card has a 16:10 image, a category chip, a title, one line of text, and stack chips. Under the row: a link "View all work".

**Text.**

- Eyebrow: "WORK"
- H2: "Selected projects"
- Lead: "Sample projects are shown until client work is published."

| Card | Category | Title | Line | Stack chips |
| --- | --- | --- | --- | --- |
| 1 | Mobile | Service marketplace app | Customers book local services and track them in real time. | React Native, Node.js, MongoDB |
| 2 | AI | Document extractor | Turns invoices and forms into structured data. | Python, FastAPI, Next.js |
| 3 | Web | SaaS analytics dashboard | Live charts and reports for a subscription product. | Next.js, PostgreSQL, Tailwind |

Every sample card carries a small badge "SAMPLE PROJECT". Replace them with your own finished projects, for example your final year project, as soon as you can show them.

**Components.** `CaseCard`, `Chip`, `Badge`.

**Motion.** Image zooms 4% on hover over 400 ms. The arrow in the title nudges right.

### 6.6 AI spotlight

**Layout.** Two columns on desktop: text on the left, a demo window on the right. The window has two tabs. On phones the window sits under the text.

**Text.**

- Eyebrow: "AI"
- H2: "See what we build"
- Lead: "Try a short demo of the AI tools we ship for clients."
- Tab 1 "Chatbot": three suggestion chips: "What services do you offer?", "How long does an app take?", "Can you add AI to my existing site?". Clicking a chip types the answer into the chat window.
- Tab 2 "Extractor": a sample invoice image on the left, and four extracted fields on the right: Vendor, Invoice number, Date, Total. Boxes on the invoice highlight one by one.
- Under the window: a small note "Demo with sample data".

In v1 the answers are pre-written and typed out with an animation. Connect the live chatbot route in build phase 6 (section 11).

**Components.** `AIDemoWindow`, `ChatDemo`, `ExtractorDemo`, `Tabs`.

### 6.7 Why Compiled Tech

**Layout.** Four short items in a row (two by two on tablet, stacked on phones). Each item has a line icon, an H3, and one sentence. No cards, only a 1 px top border.

**Text.**

| Title | Text |
| --- | --- |
| Software only | We build web, apps, and AI. Nothing else, so we do it well. |
| Direct access | You talk to the developers who build your product. |
| Clear scope | You get a written scope and price before work starts. |
| Built to last | Clean code, documentation, and a proper handover. |

Confirm that each line is true for your agency before launch. Reserve a testimonials slot under this block, but keep it hidden until you have real quotes from real clients. Do not invent quotes.

**Components.** `WhyItem`, `TestimonialCard` (hidden at launch).

### 6.8 Final CTA

**Layout.** Full-width band inside a rounded frame, with the hero's dark gradient and a faint copy of the hexagon mark behind the text. Centered.

**Text.**

- H2: "Have an idea? Let's compile it."
- Lead: "Tell us what you want to build. We reply within one working day."
- Buttons: "Start a Project" (primary) and "Book a Call" (ghost, links to `/contact#book`).

Check that you can keep the one-working-day promise before you publish it.

**Components.** `CTABand`, `Button`.

## 7. Other pages

Every inner page starts with the same `PageHero`: breadcrumbs, an H1 in Orbitron, a one-line lead in mist, and no 3D object. It is 280 px tall on desktop, on the ink background with the faint hexagon mark at the right edge. Every inner page ends with the `CTABand` from 6.8.

### 7.1 Services (`/services` and `/services/[slug]`)

- H1: "Services". Lead: "Software and AI, grouped into four pillars."
- Body: four stacked sections, one per pillar. Each has the pillar name, one paragraph, and a grid of service tiles (icon, name, one line). Then the Plus strip.
- Detail pages use four slugs: `build`, `ai-ml`, `automate-analyze`, `advise-support`. Each service is an anchored section on its pillar page.

| Service | Pillar | Tile line |
| --- | --- | --- |
| Web development | Build | Fast, search-friendly websites and web apps. |
| App development | Build | iOS and Android apps in React and Flutter. |
| SaaS product development | Build | From first version to paying customers. |
| E-commerce | Build | Stores and platforms that take payments. |
| APIs and backend | Build | Secure services that power your apps. |
| Machine learning projects | AI and ML | Models built for your data and goal. |
| Model training and fine-tuning | AI and ML | Adapt a model to your field. |
| RAG systems | AI and ML | Answers grounded in your own documents. |
| Chatbots | AI and ML | Assistants for support and sales. |
| Extractor | AI and ML | Pull data out of documents and web pages. |
| AI-powered document processing | AI and ML | Classify, read, and route documents. |
| AI automation workflows | Automate and Analyze | Replace repeated manual steps. |
| Data dashboards and analytics | Automate and Analyze | See your numbers in one place. |
| AI consulting and training workshops | Advise and Support | Plan and learn before you build. |
| Maintenance and support | Advise and Support | Updates, fixes, and monitoring. |

**Pillar page template:** PageHero, service sections, "How it works" (3 short steps), "Tech we use" chips, 1 or 2 related `CaseCard`s, FAQ accordion (3 to 5 questions), CTABand.

### 7.2 Work (`/work` and `/work/[slug]`)

- H1: "Work". Lead: "Projects we have built and shipped."
- Filter chips: All, Web, Mobile, AI. Filtering is client-side and animates the grid with a layout transition.
- Grid of `CaseCard`s, three columns on desktop, two on tablet, one on phones.
- Detail page order: header (title, category, year, your role, stack chips), hero image, "The problem", "What we built", "Result", screenshot gallery (drag to scroll), "Stack", "Next project" link, CTABand.
- Write numbers in "Result" only if they are real. Label any placeholder project "SAMPLE PROJECT" in the header.

### 7.3 About (`/about`)

- H1: "About Compiled Tech". Lead: "A software and AI studio that turns ideas into products people use."
- Sections in order: Story, Mission, Values, Approach, Team, CTABand.
- Story and Mission need your own words. Write two short paragraphs: why you started the agency, and who you build for. Do not copy the placeholders below.
- Values (four tiles, suggested): "Ship early", "Say it plainly", "Own the result", "Keep learning". Each has one sentence.
- Approach: three lines on how you work (talk to the developer, written scope, handover).
- Team: one card per person with photo (square, grayscale until hover), name, role, and one line. Start with the founder only. Do not add fake team members.

### 7.4 Process (`/process`)

- H1: "How we work". Lead: "Five steps, the same on every project."
- Body: the five steps from 6.4, each as a full-width row with a number, a title, what happens, what you receive, and a typical length. Then a short FAQ.

| Step | What you receive | Typical length (confirm) |
| --- | --- | --- |
| Discover | Written scope, price, and plan | 3 to 5 days |
| Design | Approved wireframes and clickable design | 1 to 2 weeks |
| Build | Working builds to review at each demo | 4 to 12 weeks |
| Launch | Live product, test report, handover notes | About 1 week |
| Support | Monthly fixes and updates | Ongoing |

### 7.5 Contact (`/contact`)

- H1: "Start a project". Lead: "Tell us what you want to build. We reply within one working day."
- Desktop layout: form on the left (about 60%), details and booking on the right. On phones the form comes first, then details, then booking.
- Right column: email, WhatsApp number, city and country (all to be added by you), then the Cal.com booking embed under the heading "Prefer a call?" with the id `book`.

| Field | Type | Rule |
| --- | --- | --- |
| Name | Text | Required |
| Email | Email | Required, valid format |
| Company | Text | Optional |
| Service | Select | Web development, App development, SaaS, AI and ML, Chatbot or RAG, Automation, UI/UX design, Not sure |
| Budget | Select | Not sure yet, Under $2,000, $2,000 to $10,000, $10,000 to $25,000, $25,000 and above |
| Timeline | Select | As soon as possible, 1 to 3 months, 3 months or more, Flexible |
| Details | Textarea | Required, at least 20 characters |
| Website | Hidden text | Spam trap. Must stay empty. |
| Turnstile | Widget | Cloudflare Turnstile token |

**Messages.**

- Field errors: "Enter your name", "Enter a valid email address", "Tell us a little more (at least 20 characters)".
- Sending: button reads "Sending..." and is disabled.
- Success: "Thanks, {name}. We got your message and will reply within one working day. A copy is on its way to your email."
- Failure: "Something went wrong. Try again, or email us at {email}."

Budget ranges are in US dollars. Change them if you price in another currency.

### 7.6 Blog (`/blog` and `/blog/[slug]`)

- H1: "Insights". Lead: "Notes on software and AI from the Compiled Tech team."
- Category chips: All, AI, Web, Mobile, Engineering. First post is a wide featured card, the rest a three-column grid of `ArticleCard`s (image, category, title, date, read time).
- Article page: breadcrumbs, title, date, read time, author, sticky table of contents on desktop (hidden on phones), body at 720 px max width, related posts (3), CTABand.
- Body components for MDX: H2, H3, paragraph, list, link, inline code, code block with copy button, callout, image with caption, table.
- Starter article ideas: "What RAG is and when you need it", "Next.js or Flutter: choosing for your first app", "How to scope a software project".

### 7.7 Legal (`/privacy`, `/terms`)

- Plain text page, 720 px max width, H1, "Last updated" date, H2 per clause with anchor links. No hero art.
- Have the text reviewed or generated for your country before launch. Mention analytics and the contact form data you store.

### 7.8 Not found (`/not-found`)

- H1: "Page not found". Text: "That page does not exist. Go back home or start a project." Buttons: "Back Home" and "Start a Project".

## 8. Component inventory

The site has 63 components. 11 come ready-made from shadcn/ui, and 2 exist only if you choose the live 3D hero, so you build 50 on the recommended route. Put them in `components/` using the groups below.

| Group | Components | Count |
| --- | --- | --- |
| Layout | Header, MobileDrawer, Footer, Container, Section, PageHero, Breadcrumbs | 7 |
| UI primitives (shadcn) | Button, Input, Textarea, Select, Label, Accordion, Tabs, Dialog, Badge, Toast (Sonner), Tooltip | 11 |
| Brand and motion | Logo, TiltCard, Reveal, Marquee, SmoothScroll, HeroMedia, HeadlineSplit, ScrollProgress | 8 |
| 3D (route B only) | HeroScene, SceneLoader | 2 |
| Home sections | Hero, TrustStrip, ServicesSection, ProcessTimeline, FeaturedWork, AISpotlight, WhyUs, CTABand | 8 |
| Cards and items | PillarCard, ServiceTile, CaseCard, ArticleCard, WhyItem, TestimonialCard, TeamCard, ValueTile, StepNode, StepPanel | 10 |
| Content and small parts | SectionHeading, Chip, TechLogo, SocialLinks, PlusStrip, FilterChips, FAQ, Callout, CodeBlock, TableOfContents | 10 |
| Demos | AIDemoWindow, ChatDemo, ExtractorDemo | 3 |
| Forms | ContactForm, NewsletterForm, BookingEmbed, FormField | 4 |
| Total |  | 63 |

**Key components**

| Component | Props | Behavior |
| --- | --- | --- |
| `Button` | variant (primary, ghost, link), size (md 44 px, lg 48 px), href, icon, loading | Primary: steel fill, ink text. Ghost: 1 px line border, frost text. Hover: lifts 2 px, glow, primary fill goes to frost. Focus: 2 px steel outline, 3 px offset. Disabled: 50% opacity, no lift. Loading: spinner, disabled. |
| `TiltCard` | maxTilt (6), glare (true), as | Pointer position drives rotateX and rotateY through a spring (stiffness 150, damping 15). Children can sit at different depths with translateZ. Off on touch and with reduced motion. |
| `Reveal` | delay, y (24), once (true), amount (0.2) | Fades and slides children in when 20% is visible. Siblings stagger by 80 ms. With reduced motion, renders with no animation. |
| `HeroMedia` | poster, videoWebm, videoMp4, scene (optional) | Shows the poster first (this is the LCP image, loaded with priority). Starts the video or scene only after the page load event, on screens 900 px and wider, with no reduced-motion preference and no data-saver. Adds a pointer parallax. |
| `PillarCard` | index, title, line, items, href | Card on `TiltCard`. Label "PILLAR n", title in Orbitron, list with 6 px dash markers. |
| `CaseCard` | title, category, line, stack, image, href, sample | 16:10 image that zooms 4% on hover. Category chip top left. Shows the "SAMPLE PROJECT" badge when `sample` is true. |
| `FormField` | label, name, type, error, hint | Label above in uppercase 0.78 rem. Input has night fill, 1 px line border, 12 px radius, 46 px height. |

**States every interactive part needs**

| State | Look |
| --- | --- |
| Hover | Border or fill brightens, 250 ms |
| Focus visible | 2 px steel outline, 3 px offset, never removed |
| Active | Press down 1 px |
| Disabled | 50% opacity, no hover |
| Error (forms) | Border and message in the error color from section 3 |
| Loading | Spinner, button disabled, label changes to the doing word ("Sending...") |
| Empty (filters) | "No projects in this category yet." |

## 9. Motion and 3D

Use one big 3D moment (the hero) and small, quiet motion everywhere else. Pick route A for v1.

|  | Route A: pre-rendered (recommended) | Route B: live 3D |
| --- | --- | --- |
| How | Render in Blender, play as a looping video | Three.js scene in the browser |
| Look | Film quality: real materials, depth of field, haze | Good, but simpler lighting |
| Interaction | Pointer parallax on layers | Object leans toward the pointer, drag to spin |
| Weight | Poster 120 KB, video 1.5 MB, loaded after paint | About 150 KB of gzipped JavaScript plus the scene |
| Skill needed | Blender basics | Three.js or React Three Fiber |
| Mobile | Poster image only | Poster image only |

The reference mood (soft steel sphere on dark dunes) is a rendered image, so route A is the one that can match it.

**Route A specs**

- Render 1920 x 1080 at 24 fps, a seamless loop of 6 to 8 seconds, no audio.
- Export WebM (VP9) and MP4 (H.264). Desktop file at most 1.5 MB. Optional 1280 x 720 file at most 700 KB.
- Poster: the first frame as WebP, 1920 px wide at most 120 KB, plus an 828 px version for phones. The poster is the LCP element.
- Markup: `<video muted loop playsinline preload="none" poster="...">`. Call `play()` after the window load event, only on desktop.
- Pointer parallax with three layers: background moves up to 10 px, the 3D object up to 16 px, the headline up to 4 px the opposite way. Use a spring so it eases.

**Scene brief for Blender**

- Object: a sphere built from a lattice of thin bars with irregular holes (Wireframe modifier or Geometry Nodes, with random holes and a slight twist). Brushed metal material in steel (`#B9C6D4`), a soft rim light in cool blue.
- Ground: a dark displaced plane (Noise texture) for dunes, in night (`#0D141D`).
- Sky: gradient from ink at the top to a pale slate-blue at the horizon, with light haze.
- Camera: slightly low, depth of field focused on the sphere, vignette at the edges. Keep the center 30% clear so the headline can sit on each side.
- Motion: slow rotation of the sphere (one full turn in the loop) and a gentle float of 4% of its height.

**Route B specs (only if you choose it)**

- Load with `dynamic(() => import("./HeroScene"), { ssr: false })` after the poster has painted and the browser is idle.
- Camera field of view 35, distance 7. Sphere is an instanced lattice of bars and joints. Cap pixel ratio at 1.75. Pause rendering when the hero is off screen.
- Pointer: the object leans up to 0.45 radians on Y and 0.22 on X, smoothed. Dragging spins it with inertia that settles back to the idle spin.
- No WebGL, a phone, reduced motion, or data saver: show the poster only.

**Motion table**

| Element | Trigger | Effect | Time and easing | Tool |
| --- | --- | --- | --- | --- |
| Hero object | Page load | Scale 0.8 to 1, fade in | 700 ms, ease-out | Framer Motion |
| Headline halves | Page load | Slide 24 px toward center, fade in, 80 ms stagger | 600 ms | Framer Motion |
| Hero layers | Pointer move | Parallax as above | Spring | Framer Motion |
| Header | Scroll past 80 px | Blur background, height 72 to 60 px | 250 ms | CSS |
| Nav links | Hover | Opacity 0.88 to 1, underline grows from left | 150 ms | CSS |
| Buttons | Hover, press | Lift 2 px with glow, press down 1 px | 250 ms | CSS |
| Section content | Enters view | Slide up 24 px, fade in, 80 ms stagger | 600 ms | Framer Motion |
| Cards | Pointer over | Tilt up to 6 degrees, light follows cursor | Spring | Framer Motion |
| Trust logos | Always | Scroll left, pause on hover | 40 s per loop | CSS |
| Process timeline | Scroll | Pinned, line draws, step text swaps | Scrubbed | GSAP |
| Case image | Hover | Zoom 4% | 400 ms | CSS |
| Filter grid | Chip click | Cards reorder with a layout animation | 300 ms | Framer Motion |
| AI demo | Chip click | Answer types at 20 ms per character | n/a | Framer Motion |
| Gallery | Drag | Horizontal drag with snap | Spring | Framer Motion |
| Mobile menu | Tap | Fade in, links slide up 16 px, 50 ms stagger | 300 ms | Framer Motion |
| Page scroll | Wheel | Smooth inertia (lerp 0.1) | n/a | Lenis |

Button, link, and menu micro-motion stays at or under 300 ms. Scroll reveals use 600 ms on purpose.

**Gestures.** Hover, tap (scale to 0.97), drag (gallery and, on route B, the sphere), pointer parallax, and scroll. Pinch and swipe libraries are not needed in v1.

**Fallbacks**

| Condition | What changes |
| --- | --- |
| Reduced motion | No parallax, tilt, marquee motion, Lenis, or video. Poster only. Reveals appear instantly. |
| Phones and tablets under 900 px | Poster only, no tilt, no pinned process, no Lenis |
| Data saver or slow connection | Poster only |
| No JavaScript | All text and the poster still show. Content never starts at opacity 0 in the HTML. |

## 10. Responsive rules, accessibility, and performance

Design phone first, then add layout at each breakpoint. Do not call a page done until it passes the checks in this section.

**Breakpoints** (Tailwind): `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536 px. The header switches between hamburger and full nav at 900 px, so add a custom `min-[900px]` rule for it. Never allow sideways page scroll at any width.

| Block | Phone (under 640) | Tablet (640 to 1023) | Desktop (1024 and up) |
| --- | --- | --- | --- |
| Header | Hamburger | Hamburger below 900, full nav above | Full nav |
| Hero | Stacked headline, 680 px tall, poster | Same as phone, wider | Split headline, video or 3D |
| Services grid | 1 column | 2 columns | 4 columns |
| Process | Vertical list | Vertical list | Pinned horizontal timeline |
| Work grid | 1 column | 2 columns | 3 columns |
| Why us | 1 column | 2 columns | 4 columns |
| AI demo | Stacked | Stacked | Two columns |
| Contact | Form, details, booking in a stack | Same | Two columns (60 / 40) |
| Footer | 1 column | 2 columns | 4 columns |
| Blog grid | 1 column | 2 columns | 3 columns, sticky table of contents on articles |

**Accessibility checklist** (target WCAG 2.1 AA)

- [ ] Text contrast passes AA (the section 3 tokens already do)
- [ ] One H1 per page, headings in order, no skipped levels
- [ ] Visible focus ring on every interactive part
- [ ] A "Skip to content" link is the first focusable item
- [ ] Menu, tabs, accordion, and filters work with the keyboard only
- [ ] Touch targets are at least 44 x 44 px
- [ ] Informative images have alt text. Decorative images and the hero video are hidden from screen readers.
- [ ] Form labels are linked to inputs, and errors are announced with `aria-live="polite"`
- [ ] The mobile drawer traps focus and closes on Escape
- [ ] Reduced motion is respected everywhere (section 9)
- [ ] `lang="en"` is set and every page has a unique title
- [ ] The layout still works at 200% text zoom
- [ ] Run axe DevTools and a keyboard-only pass on every page

**Performance budget**

| Metric | Target | How to hit it |
| --- | --- | --- |
| Lighthouse (mobile) | 90 or more on all four scores | Check every page before merging |
| LCP | Under 2.5 s on mobile | Hero poster loaded with `priority`, WebP, sized correctly |
| CLS | Under 0.1 | Fixed sizes for all media, `next/font` for fonts |
| INP | Under 200 ms | No heavy work on click, lazy-load below-the-fold sections |
| JavaScript, first load | 170 KB gzipped or less on non-3D routes | Import only used icons, split by route |
| Hero poster | 120 KB or less | WebP, 1920 px wide |
| Hero video | 1.5 MB or less, desktop only | Load after the window load event |
| Fonts | 5 font files at most | Orbitron 500 and 600, Exo 2 400 and 500, JetBrains Mono 400, with `display: swap` |
| Third-party scripts | Plausible on every page. Turnstile and Cal.com only on `/contact`. | Load them on that route only |

**SEO and sharing.** Each page sets its own title and description with the Next.js Metadata API. Add an Open Graph image (1200 x 630 px, logo on ink), `sitemap.xml`, `robots.txt`, and JSON-LD for Organization, Service, and Article. Keep URLs lowercase with hyphens.

## 11. Folder structure, text, and build order

**Folder structure**

```text
compiled-tech/
  public/
    hero/        poster.webp, poster-828.webp, hero.webm, hero.mp4
    logo/        the four SVG files from section 4
    og.png       1200 x 630 sharing image
  src/
    app/
      layout.tsx  page.tsx  globals.css  not-found.tsx
      icon.svg  apple-icon.png  sitemap.ts  robots.ts
      services/page.tsx  services/[slug]/page.tsx
      work/page.tsx      work/[slug]/page.tsx
      process/page.tsx   about/page.tsx
      blog/page.tsx      blog/[slug]/page.tsx
      contact/page.tsx   privacy/page.tsx  terms/page.tsx
      api/contact/route.ts  api/newsletter/route.ts
    components/
      layout/  ui/  motion/  sections/  cards/  demos/  forms/  content/
    content/
      blog/*.mdx   work/*.mdx
    data/
      site.ts  nav.ts  services.ts  process.ts  work.ts  faq.ts
    lib/
      utils.ts  motion.ts  validation.ts
```

**Where the text lives.** Components never contain copy. All text sits in `src/data/*.ts` (short text, lists, nav) and `src/content/*.mdx` (blog posts and case studies). To change a headline, a service, or a menu link, edit one data file and every page updates.

```ts
// src/data/services.ts
export const pillars = [
  {
    slug: "build",
    title: "Build",
    line: "Websites, apps, and SaaS products that load fast and scale.",
    items: ["Web development", "App development (React and Flutter)", "SaaS products", "E-commerce", "APIs and backend"],
  },
  // ai-ml, automate-analyze, advise-support follow the same shape
]
```

```ts
// src/data/nav.ts
export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
]
export const cta = { label: "Start a Project", href: "/contact" }
```

**Environment variables** (`.env.local`, never commit it)

```text
RESEND_API_KEY=
CONTACT_TO_EMAIL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

**Build order.** Do the steps in this order. Each one ends with a check.

1. **Setup and tokens.** Create the app, load the fonts, add the Tailwind tokens, run `shadcn init`, add the Lenis provider. Done when a blank page shows the ink background and an Orbitron heading.
2. **Layout.** Header, MobileDrawer, Footer, Container, Section. Done when the navigation works at 375, 768, and 1440 px.
3. **Hero with the poster only.** Use a plain gradient until the render is ready. Deploy to Vercel now and keep deploying after every step. Done when the mobile Lighthouse score is 90 or more.
4. **Home sections.** Trust strip, Services, Process (no pinning yet), Work, Why us, CTA band.
5. **Contact.** Form, `/api/contact`, Resend, Supabase, Turnstile, Cal.com embed. Done when a test submission reaches your inbox and the database.
6. **Inner pages.** Services, Work, About, Process, Privacy, Terms, 404.
7. **Blog.** MDX setup, list page, article page, table of contents.
8. **Motion pass.** Reveals, tilt, parallax, the pinned process timeline, Lenis. Check reduced motion.
9. **AI demos.** Scripted chat and extractor first. Then the live chatbot route, with rate limiting and a spending cap.
10. **Finish.** Swap in the real hero video (or the live 3D scene), real case studies, SEO files, accessibility checks, performance checks, then launch.
