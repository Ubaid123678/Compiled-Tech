// Canonical portfolio categories — one per sellable service line (see data/services.ts):
// Build → Web / Mobile / E-commerce, SaaS & Custom Software, AI pillar → AI.
// Single source for the admin "New/Edit Project" forms and the Work page filter chips.
// ponytail: one flat list; AI sub-services (chatbots, agents, doc processing) all file
// under "AI" — split only if filtering that finely is ever actually wanted.
export const workCategories = ["Web", "Mobile", "E-commerce", "SaaS", "AI"] as const;
export type WorkCategory = (typeof workCategories)[number];
