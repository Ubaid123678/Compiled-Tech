export const aboutData = {
  hero: {
    title: "About Compiled Tech",
    lead: "Three co-founders from Hasilpur, Punjab, building software you can trust.",
  },
  story: [
    "Compiled Tech was started by three friends who met in the same BSCS class and kept hearing the same story. A client waits three months and gets a site that breaks. A developer disappears, or a client stops paying before the work is done. Trust fails on both sides, and the project fails with it.",
    "We built Compiled Tech to remove that risk. Scope, price, and delivery date are agreed before work starts. You talk directly to the developers who write your code. You receive a complete, working product, and we stay available after it goes live.",
  ],
  mission: [
    "Our mission is to make hiring a software team something you can trust. We deliver what we agreed, on the date we agreed, and we explain every decision in plain language.",
    "We work with startups, small businesses, and local and international clients, from web and mobile apps to AI automation and chatbots. We want to be the team you can reach, the team that finishes the job, and the team that is still there after launch.",
  ],
  values: [
    {
      title: "Honesty first",
      text: "We tell you what is possible, what it costs, and what could go wrong before you commit.",
      icon: "shield",
    },
    {
      title: "Always reachable",
      text: "You speak directly to the developers building your product, not to a layer of middlemen.",
      icon: "users",
    },
    {
      title: "Finish the job",
      text: "We deliver complete, working software on the agreed date and never leave work half done.",
      icon: "check-circle",
    },
    {
      title: "Stay after launch",
      text: "We keep supporting your product once it is live, with fixes, updates, and help when you need it.",
      icon: "wrench",
    },
  ],
  approach: [
    "Scope, price, and delivery date are agreed in writing before work starts.",
    "You can contact the developers directly at any point in the project.",
    "You receive complete, working software and help after it goes live.",
  ],
  team: [
    {
      name: "Ubaidullah Akram",
      role: "Founder & CEO, Full Stack Developer",
      line: "Leads product and engineering. Builds web, mobile, and AI systems.",
      image: "/team/ubaid.jpg",
      linkedin: "https://linkedin.com/in/ubaidullahakram",
      github: "https://github.com/ubaidullahakram",
    },
    {
      name: "Muhammad Faraz",
      role: "Co-founder, Full Stack Developer",
      line: "Architects backend and infrastructure. Scales SaaS and platforms.",
      image: "/team/faraz.jpg",
      linkedin: "https://linkedin.com/in/mfaraz",
      github: "https://github.com/mfaraz",
    },
    {
      name: "Muhammad Saqib",
      role: "Co-founder, AI Automation & Chatbots",
      line: "Designs ML pipelines, RAG systems, and conversational agents.",
      image: "/team/saqib.jpg",
      linkedin: "https://linkedin.in/msaqib",
      github: "https://github.com/msaqib",
    },
  ],
  closing: "Three co-founders. One promise: your project gets finished.",
} as const;

export type AboutData = typeof aboutData;