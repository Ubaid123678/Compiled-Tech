// Pricing bands shown on /pricing and emitted as Offer schema.
// Source of truth: the budget ranges in data/contact.ts, expanded into what
// each band actually buys. Change the numbers here and both stay in sync.
// ponytail: starting prices only ("from"), not fixed quotes — real projects
// vary. Swap for a proper product table if you ever sell fixed-price packages.
export const pricingTiers = [
  {
    name: "Starter Build",
    from: 500,
    currency: "USD",
    summary: "A single website, landing page, or a focused AI chatbot.",
    includes: [
      "One small site or landing page",
      "Template AI chatbot on your content",
      "Mobile-responsive, SEO-ready",
      "Delivered in 1-2 weeks",
    ],
    timeline: "1-2 weeks",
  },
  {
    name: "Business Build",
    from: 2000,
    currency: "USD",
    summary: "A real product: web app, e-commerce store, or custom chatbot.",
    includes: [
      "Web app or online store",
      "Custom AI chatbot trained on your data",
      "Admin panel and database",
      "Payments, forms, integrations",
      "Delivered in 3-6 weeks",
    ],
    timeline: "3-6 weeks",
    popular: true,
  },
  {
    name: "Platform Build",
    from: 10000,
    currency: "USD",
    summary: "SaaS platforms, mobile apps, and AI automation at scale.",
    includes: [
      "SaaS platform or mobile app (iOS + Android)",
      "AI automation, agents, or document processing",
      "Scalable architecture and cloud deployment",
      "Ongoing support available",
      "Delivered in 2-4 months",
    ],
    timeline: "2-4 months",
  },
] as const;

export type PricingTier = (typeof pricingTiers)[number];
