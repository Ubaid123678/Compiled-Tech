export const pillars = [
  {
    slug: "build",
    title: "Build",
    line: "Web, mobile, and SaaS products that load fast and scale.",
    items: [
      "Web & Mobile App Development",
      "SaaS & Custom Software Development",
      "E-commerce Development",
    ],
    services: [
      {
        name: "Web & Mobile App Development",
        line: "Websites, web applications, and mobile apps.",
      },
      {
        name: "SaaS & Custom Software Development",
        line: "Build scalable software products, business platforms, and SaaS applications.",
      },
      {
        name: "E-commerce Development",
        line: "Build online stores, custom e-commerce platforms, and integrations.",
      },
    ],
  },
  {
    slug: "ai-ml",
    title: "AI and ML",
    line: "Custom models, intelligent agents, and document intelligence.",
    items: [
      "Custom AI & Machine Learning",
      "AI Chatbots & Virtual Assistants",
      "AI Data & Document Processing",
    ],
    services: [
      {
        name: "Custom AI & Machine Learning",
        line: "Develop and customize AI/ML models for specialized business requirements, including training and fine-tuning.",
      },
      {
        name: "AI Chatbots & Virtual Assistants",
        line: "Customer-support and business assistants that understand your company's information and communicate with users.",
      },
      {
        name: "AI Data & Document Processing",
        line: "Automatically extract, organize, and process information from invoices, PDFs, forms, websites, and other data sources.",
      },
    ],
  },
  {
    slug: "automate-analyze",
    title: "Automate and Analyze",
    line: "Workflows and agents that remove manual work.",
    items: [
      "AI Automation & AI Agents",
    ],
    services: [
      {
        name: "AI Automation & AI Agents",
        line: "Automate business processes and build AI systems that can perform tasks and workflows.",
      },
    ],
  },
  {
    slug: "advise-support",
    title: "Advise and Support",
    line: "Guidance, training, and care after launch.",
    items: [
      "AI Consulting",
      "Training Workshops",
      "Maintenance and Support",
    ],
    services: [
      {
        name: "AI Consulting",
        line: "Strategic guidance on AI adoption, model selection, and implementation.",
      },
      {
        name: "Training Workshops",
        line: "Hands-on training for your team on AI tools and workflows.",
      },
      {
        name: "Maintenance and Support",
        line: "Updates, fixes, monitoring, and ongoing optimization.",
      },
    ],
  },
] as const;

export const plusStrip = {
  left: "PLUS: Graphic design and UI/UX design",
  right: "SOFTWARE ONLY: No hardware, import/export, or physical infrastructure",
} as const;

// Homepage copy. Written short and plain on purpose: it is read aloud by
// voice assistants and lifted into search snippets, so each line is one idea
// in everyday words. Keep that rule if you edit these.
export const coreServices = [
  {
    title: "Web & Mobile App Development",
    description: "We build websites, web apps, and mobile apps that load fast and work on every screen.",
  },
  {
    title: "AI Automation & AI Agents",
    description: "We automate the repeat work inside your business, and build AI agents that carry out real tasks.",
  },
  {
    title: "AI Chatbots & Virtual Assistants",
    description: "We build chatbots that learn your own company information and then answer your customers for you.",
  },
  {
    title: "AI Data & Document Processing",
    description: "We pull data out of invoices, PDFs, and forms, and file it into your systems without typing.",
  },
  {
    title: "Custom AI & Machine Learning",
    description: "We train and tune models for your own problem, instead of forcing a general tool to fit.",
  },
  {
    title: "SaaS & Custom Software Development",
    description: "We build the product itself: accounts, billing, admin panels, and the parts that must not break.",
  },
  {
    title: "E-commerce Development",
    description: "We build online stores with payments, stock, and shipping wired up, plus the tools to run them.",
  },
] as const;

export const industries = [
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Real estate",
  "Logistics",
  "Automotive",
  "Hospitality",
  "Government",
  "Startups",
  "Enterprise",
] as const;