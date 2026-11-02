"use client";

import { useEffect } from "react";
import { pricingTiers } from "@/data/pricing";
import { answers } from "@/data/answers";
import { siteConfig } from "@/lib/seo";

/**
 * WebMCP: expose real site capabilities to in-browser agents.
 *
 * Only tools that actually do something are registered — no decorative ones.
 * navigator.modelContext is experimental; the guard means browsers without it
 * simply skip this (silent no-op, nothing breaks).
 *
 * ponytail: tools return data already on the page (pricing, contact) rather
 * than hitting the server, so they work offline and cost no round-trip.
 * Upgrade path: add submit_contact (POST /api/contact) once you're happy with
 * agents writing to your leads table.
 */
type ModelContext = {
  registerTool: (tool: {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (args: Record<string, unknown>) => Promise<unknown> | unknown;
  }) => void;
};

export function AgentTools() {
  useEffect(() => {
    const modelContext = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
    if (!modelContext?.registerTool) return;

    try {
      modelContext.registerTool({
        name: "list_pricing",
        description:
          "List Compiled Tech's starting prices for web, app, e-commerce, SaaS and AI development projects.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        execute: () => ({
          currency: "USD",
          note: "Starting prices; final quote depends on scope.",
          tiers: pricingTiers.map((tier) => ({
            name: tier.name,
            from: tier.from,
            timeline: tier.timeline,
            includes: [...tier.includes],
            url: `${siteConfig.url}/pricing`,
          })),
        }),
      });

      modelContext.registerTool({
        name: "get_contact_details",
        description:
          "Get Compiled Tech's contact channels (email, phone, enquiry form) and location.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        execute: () => ({
          email: siteConfig.email,
          phone: siteConfig.phone,
          location: siteConfig.location,
          contactForm: `${siteConfig.url}/contact`,
          pricing: `${siteConfig.url}/pricing`,
        }),
      });

      modelContext.registerTool({
        name: "list_services",
        description:
          "List the services Compiled Tech offers, grouped by pillar, with links.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        execute: () => ({
          servicesUrl: `${siteConfig.url}/services`,
          pillars: [
            { name: "Build", services: ["Web & Mobile App Development", "SaaS & Custom Software Development", "E-commerce Development"] },
            { name: "AI and ML", services: ["Custom AI & Machine Learning", "AI Chatbots & Virtual Assistants", "AI Data & Document Processing"] },
            { name: "Automate and Analyze", services: ["AI Automation & AI Agents"] },
            { name: "Advise and Support", services: ["AI Consulting", "Training Workshops", "Maintenance and Support"] },
          ],
        }),
      });
      // FAQ tools: the audit asks for searchFAQ on a page that carries a
      // FAQPage. Both read the same `answers` array the section renders, so
      // they can never disagree with the visible copy.
      modelContext.registerTool({
        name: "search_faq",
        description:
          "Search Compiled Tech's frequently asked questions about pricing, timelines, ownership, technology and support.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Words to look for in the questions and answers" },
          },
          required: ["query"],
          additionalProperties: false,
        },
        execute: (args) => {
          const q = String(args?.query ?? "").toLowerCase().trim();
          const terms = q.split(/\s+/).filter(Boolean);
          const hits = answers
            .map((item) => {
              const haystack = `${item.q} ${item.a}`.toLowerCase();
              const score = terms.reduce((n, t) => n + (haystack.includes(t) ? 1 : 0), 0);
              return { item, score };
            })
            .filter((hit) => hit.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((hit) => ({
              question: hit.item.q,
              answer: hit.item.a,
              url: `${siteConfig.url}/#${hit.item.q
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")}`,
            }));
          return { query: q, count: hits.length, results: hits };
        },
      });

      modelContext.registerTool({
        name: "submit_question",
        description:
          "Open the Compiled Tech contact form, pre-filled with a question the FAQ could not answer.",
        inputSchema: {
          type: "object",
          properties: {
            question: { type: "string", description: "The question to send to the team" },
          },
          required: ["question"],
          additionalProperties: false,
        },
        execute: (args) => ({
          // Navigation is the honest action: this tool must not post to the
          // leads endpoint behind the user's back.
          url: `${siteConfig.url}/contact`,
          prefill: { details: String(args?.question ?? "") },
          note: "Open the contact form and paste the question into Details.",
        }),
      });
    } catch (error) {
      // An agent host rejecting a tool must not break the site.
      console.error("WebMCP tool registration failed:", error);
    }
  }, []);

  return null;
}
