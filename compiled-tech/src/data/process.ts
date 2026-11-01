export const processSteps = [
  {
    number: 1,
    title: "Discover",
    text: "We learn your goals, users, and limits, then agree on scope and price.",
    whatHappens: "We learn your goals, users, and constraints, then agree on scope and price.",
    whatYouReceive: "Written scope, price, and plan",
    typicalLength: "3 to 5 days",
  },
  {
    number: 2,
    title: "Design",
    text: "We send wireframes and a clickable design. You approve them before we write any code.",
    whatHappens: "Wireframes and a clickable prototype you approve before any code.",
    whatYouReceive: "Approved wireframes and clickable design",
    typicalLength: "1 to 2 weeks",
  },
  {
    number: 3,
    title: "Build",
    text: "Regular demos, so you see real progress and not status reports.",
    whatHappens: "Regular demos, testing, deployment, and a handover you can run without us.",
    whatYouReceive: "Working builds to review at each demo",
    typicalLength: "4 to 12 weeks",
  },
  {
    number: 4,
    title: "Launch",
    text: "Testing, deployment, and a handover you can run without us.",
    whatHappens: "Testing, deployment, and a handover you can run without us.",
    whatYouReceive: "Live product, test report, handover notes",
    typicalLength: "About 1 week",
  },
  {
    number: 5,
    title: "Support",
    text: "Fixes, updates, and new features after go-live.",
    whatHappens: "Fixes, updates, and new features after go-live.",
    whatYouReceive: "Monthly fixes and updates",
    typicalLength: "Ongoing",
  },
] as const;

export const processFAQ = [
  {
    q: "What if scope changes mid-project?",
    a: "We agree on a change process upfront. New scope = new timeline and price, documented before work continues.",
  },
  {
    q: "How do you handle communication?",
    a: "Weekly syncs, a shared project board, and direct access to developers. No middlemen.",
  },
  {
    q: "What happens after launch?",
    a: "Our Support pillar covers monitoring, fixes, and iterative improvements. You are not left alone.",
  },
  {
    q: "Do you work with existing codebases?",
    a: "Yes. We can audit, refactor, and extend your current product.",
  },
] as const;