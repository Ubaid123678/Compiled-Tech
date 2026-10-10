export const contactFields = {
  service: [
    "Web & Mobile App Development",
    "E-commerce Development",
    "SaaS & Custom Software Development",
    "AI Automation & AI Agents",
    "AI Chatbots & Virtual Assistants",
    "AI Data & Document Processing",
    "UI/UX 5. Custom AI & Machine Learning",
    "Not sure",
  ] as const,
  budget: [
    "Not sure yet",
    "Under $2,000",
    "$2,000 to $10,000",
    "$10,000 to $25,000",
    "$25,000 and above",
  ] as const,
  timeline: [
    "As soon as possible",
    "1 to 3 months",
    "3 months or more",
    "Flexible",
  ] as const,
} as const;

export const contactInfo = {
  email: "hello@compiledtech.io",
  whatsapp: "https://wa.me/923107349552?text=Hi%20Compiled%20Tech%2C%20I%27d%20like%20to%20discuss%20a%20project.",
  location: "Hasilpur, Punjab, Pakistan",
  calComUrl: process.env.NEXT_PUBLIC_CALCOM_URL ?? "",
} as const;