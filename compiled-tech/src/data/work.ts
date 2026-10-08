export const featuredWork = [
  {
    slug: "service-marketplace",
    category: "Mobile",
    title: "Service marketplace app",
    line: "Customers book local services and track them in real time.",
    stack: ["React Native", "Node.js", "MongoDB"],
    image: "/hero/poster.svg",
    sample: true,
  },
  {
    slug: "document-extractor",
    category: "AI",
    title: "Document extractor",
    line: "Turns invoices and forms into structured data.",
    stack: ["Python", "FastAPI", "Next.js"],
    image: "/hero/poster.svg",
    sample: true,
  },
  {
    slug: "saas-analytics",
    category: "Web",
    title: "SaaS analytics dashboard",
    line: "Live charts and reports for a subscription product.",
    stack: ["Next.js", "PostgreSQL", "Tailwind"],
    image: "/hero/poster.svg",
    sample: true,
  },
] as const;

export const workFilters = ["All", "Web", "Mobile", "AI"] as const;