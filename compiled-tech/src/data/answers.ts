// Always-visible answers on the homepage. Not an accordion on purpose: text
// inside a collapsed <details>/state toggle is not in the DOM for crawlers or
// voice assistants, which is the whole point of this section.
//
// Copy rules (the audit measures these): question heading, then a 40-60 word
// plain answer that opens with a definition where possible. Keep sentences
// short and words simple — no jargon a buyer would not say out loud.
export const answers = [
  {
    q: "What is Compiled Tech?",
    a: "Compiled Tech is a software studio that builds web apps, mobile apps, SaaS platforms, and AI automation. A four-person team works with you directly. You get a written scope and a fixed price before work starts, and you keep talking to the developers who write your code.",
  },
  {
    q: "How much does a project cost?",
    a: "A landing page or a simple chatbot starts at $500. A full web app or online store starts at $2,000. Platform and mobile work starts at $10,000. Every quote is fixed in writing after a short call, so you know the price before any work begins.",
  },
  {
    q: "How long does a build take?",
    a: "A landing page takes one to two weeks, a web app three to six weeks, and a SaaS platform or mobile app two to four months. You see a working demo every week, so you always know the real date instead of a hopeful one.",
  },
  {
    q: "Which services do you offer?",
    a: "Compiled Tech builds web and mobile apps, SaaS platforms, online stores, and custom software. On the AI side we build chatbots, document processing, automations, and AI agents. We also run training workshops and look after your product after it goes live.",
  },
  {
    q: "Do you work with clients outside Pakistan?",
    a: "Yes. Most of our clients are in the US, the UK, and Europe. We work over video calls and a shared project board, and we answer within one working day. Work is billed in US dollars, and we agree on timezone overlap before a project starts.",
  },
  {
    q: "What happens after launch?",
    a: "You get the code, the documentation, and a full handover, so you can run the product without us. Our support plan then covers fixes, updates, and new features. You are never locked in, and you can move the work in-house whenever you choose.",
  },
  {
    q: "Who owns the code?",
    a: "You do. The repository, the domain, and every account are yours from day one. We commit to your repository, not a private one. If you ever leave, nothing is held back, and no part of your product stops working because we walked away.",
  },
  {
    q: "How do we start?",
    a: "Send a short message describing what you want to build. We reply within one working day, ask a few questions, and book a call. You leave that call with a written scope, a fixed price, and a delivery date, with no obligation to proceed.",
  },
] as const;

export type Answer = (typeof answers)[number];
