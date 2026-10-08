# /work Screen Implementation Document

**Status:** Deferred — implement after `/about`
**Based on:** Compiled Tech Frontend Design Documentation (Sections 6.5, 7.2, 8)

---

## 1. Pages to Build

| Route | Type | Description |
|-------|------|-------------|
| `/work` | List | Filterable grid of case studies |
| `/work/[slug]` | Detail | Full case study with gallery |

---

## 2. Data Model (`src/data/work.ts`)

Extend current `featuredWork` with full detail fields:

```ts
export const featuredWork = [
  {
    slug: "service-marketplace",
    category: "Mobile",           // "Web" | "Mobile" | "AI"
    title: "Service marketplace app",
    line: "Customers book local services and track them in real time.",
    stack: ["React Native", "Node.js", "MongoDB"],
    image: "/work/service-marketplace-hero.webp",     // 16:10 hero
    thumbnail: "/work/service-marketplace-thumb.webp", // grid thumbnail
    sample: true,
    // --- ADD FOR DETAIL PAGE ---
    year: 2024,
    role: "Full-cycle development",
    heroImage: "/work/service-marketplace-hero.webp",
    problem: "Local service providers lacked a platform to manage bookings, dispatch, and real-time tracking. Customers had no visibility into provider ETA.",
    solution: "Built a React Native app with Node.js backend and MongoDB. Features: real-time GPS tracking, automated dispatch, in-app chat, payment integration, provider dashboard.",
    result: "500+ providers onboarded in 3 months. 40% reduction in customer wait time. 4.8★ app store rating.",
    galleryImages: [
      "/work/service-marketplace-1.webp",
      "/work/service-marketplace-2.webp",
      "/work/service-marketplace-3.webp",
    ],
    fullStack: ["React Native", "Node.js", "MongoDB", "Redis", "Socket.io", "Stripe", "AWS"],
  },
  // ... repeat for document-extractor, saas-analytics
] as const;

export const workFilters = ["All", "Web", "Mobile", "AI"] as const;
```

---

## 3. Components to Create

### `FilterChips` (`components/content/FilterChips.tsx`)
- **Props**: `activeFilter`, `onChange`, `filters` (from `workFilters`)
- **Behavior**: Client-side filter, Framer Motion `AnimatePresence` + `layout` for grid transition
- **A11y**: `role="group"`, `aria-label="Filter projects"`, keyboard navigable

### `Gallery` (`components/cards/Gallery.tsx`)
- **Props**: `images` (string[])
- **Behavior**: Horizontal drag-to-scroll, snap to image, Framer Motion drag
- **Desktop**: Mouse drag + scroll wheel
- **Touch**: Native scroll + snap
- **A11y**: Keyboard arrows, `aria-label="Screenshot gallery"`

### `ValueTile` (`components/cards/ValueTile.tsx`) — *shared with /about*
- **Props**: `title`, `text`, `icon`
- **Style**: Top border only, icon + H3 + sentence

### `TeamCard` (`components/cards/TeamCard.tsx`) — *shared with /about*
- **Props**: `name`, `role`, `line`, `image`
- **Style**: Square photo, grayscale filter → color on hover

---

## 4. Page Layouts

### `/work` (List) — `app/work/page.tsx`
```
PageHero: H1 "Work", Lead "Projects we have built and shipped."
FilterChips: [All, Web, Mobile, AI]
Grid: CaseCard (3-col desktop, 2 tablet, 1 mobile)
CTABand
Footer
```

### `/work/[slug]` (Detail) — `app/work/[slug]/page.tsx`
```
PageHero: title, category, year, role, stack chips
HeroImage: 16:10, full width
Section: "The problem"
Section: "What we built"
Section: "Result" (real numbers only; sample = "SAMPLE PROJECT" badge)
Gallery: drag-to-scroll screenshots
Stack: Chip list (fullStack)
NextProject: Link to adjacent case study
CTABand
Footer
```

---

## 5. CaseCard (Already Exists — Verify Props)

Current `CaseCard` in `components/cards/CaseCard.tsx` needs these props for detail page header:
```ts
type CaseCardProps = {
  slug: string;
  // For detail page header:
  year?: number;
  role?: string;
  fullStack?: string[];
}
```

---

## 6. Animations

| Element | Animation |
|---------|-----------|
| FilterChips → Grid | Framer Motion `layout` + `AnimatePresence` (300ms) |
| CaseCard hover | Image zoom 4% (CSS transition 400ms) |
| Gallery | Drag + snap (Framer Motion `drag="x"`, `dragSnapToOrigin`) |
| Page content | Reveal on scroll (80ms stagger, 600ms) |

---

## 7. Responsive Grid

| Breakpoint | Columns |
|------------|---------|
| < 640px | 1 |
| 640–1023px | 2 |
| ≥ 1024px | 3 |

---

## 8. Checklist

- [ ] Extend `src/data/work.ts` with full detail fields
- [ ] Create `FilterChips` component
- [ ] Create `Gallery` component
- [ ] Update `CaseCard` for detail header props
- [ ] Build `app/work/page.tsx` (list + filter)
- [ ] Build `app/work/[slug]/page.tsx` (detail)
- [ ] Add `loading.tsx` for instant navigation
- [ ] Add Reveal animations
- [ ] Test filter animation, gallery drag, keyboard a11y
- [ ] Verify sample projects labeled "SAMPLE PROJECT"

---

## 9. Assets Needed

| Asset | Path | Spec |
|-------|------|------|
| Hero images | `/public/work/*-hero.webp` | 16:10, ≤200KB |
| Thumbnails | `/public/work/*-thumb.webp` | 16:10, ≤50KB |
| Gallery images | `/public/work/*-1.webp` | 16:10, ≤150KB each |

---

## 10. Notes

- **No fake data** — only real projects or clearly labeled "SAMPLE PROJECT"
- **Result numbers** — only real metrics; otherwise omit
- **Next project link** — circular (last → first)
- **SEO** — Each detail page needs unique title, description, OG image