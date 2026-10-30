"use client";

import { useEffect } from "react";
import { pricingTiers } from "@/data/pricing";
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
    } catch (error) {
      // An agent host rejecting a tool must not break the site.
      console.error("WebMCP tool registration failed:", error);
    }
  }, []);

  return null;
}
