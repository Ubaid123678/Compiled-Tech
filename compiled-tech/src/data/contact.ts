export const contactFields = {
  service: [
    "Web development",
    "App development",
    "SaaS",
    "AI and ML",
    "Chatbot or RAG",
    "Automation",
    "UI/UX design",
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
  email: "hello@compiled.tech",
  whatsapp: "https://wa.me/15550000000",
  location: "San Francisco, USA",
  calComUrl: "https://cal.com/compiled-tech", // Replace with your Cal.com link
} as const;