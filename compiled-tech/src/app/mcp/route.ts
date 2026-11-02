import { siteConfig } from "@/lib/seo";
import { pillars } from "@/data/services";
import { pricingTiers } from "@/data/pricing";
import { answers } from "@/data/answers";

export const dynamic = "force-static";

/**
 * Minimal MCP server over Streamable HTTP (JSON-RPC 2.0, POST only).
 * Read-only tools — same data the site already exposes via llms.txt and
 * the WebMCP registrations, so all surfaces stay consistent.
 *
 * ponytail: stateless single-POST transport, no session/SSE — enough for
 * read-only tools. Swap for @modelcontextprotocol/sdk if a client ever
 * needs subscriptions or prompts.
 */

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
};

const PROTOCOL_VERSION = "2025-06-18";

function textResult(id: JsonRpcRequest["id"], text: string) {
  return Response.json({
    jsonrpc: "2.0",
    id,
    result: { content: [{ type: "text", text }] },
  });
}

function errorResult(id: JsonRpcRequest["id"], code: number, message: string) {
  return Response.json({ jsonrpc: "2.0", id, error: { code, message } }, { status: 400 });
}

const TOOLS = [
  {
    name: "list_services",
    description: "List the services Compiled Tech offers, grouped by pillar.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_pricing",
    description: "Starting prices for web, app, e-commerce, SaaS and AI projects.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_contact_details",
    description: "Contact channels (email, phone, form) and location.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "search_faq",
    description: "Search the frequently asked questions about pricing, timelines, ownership, technology and support.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string", description: "Words to look for" } },
      required: ["query"],
      additionalProperties: false,
    },
  },
] as const;

function runTool(name: string, args: Record<string, unknown> = {}): string {
  if (name === "list_services") {
    return pillars
      .map((p) => `${p.title}:\n` + p.services.map((s) => `- ${s.name}: ${s.line}`).join("\n"))
      .join("\n\n") + `\n\nDetails: ${siteConfig.url}/services`;
  }
  if (name === "list_pricing") {
    return (
      pricingTiers
        .map((t) => `${t.name}: from $${t.from.toLocaleString("en-US")} ${t.currency} (${t.timeline}) — ${t.summary}`)
        .join("\n") + `\n\nDetails: ${siteConfig.url}/pricing`
    );
  }
  if (name === "get_contact_details") {
    return `Email: ${siteConfig.email}\nPhone: ${siteConfig.phone}\nLocation: ${siteConfig.location}\nForm: ${siteConfig.url}/contact`;
  }
  if (name === "search_faq") {
    // Same array the homepage renders, so the agent and the page can never
    // disagree. Falls back to the full list when the query is empty.
    const terms = String(args.query ?? "").toLowerCase().split(/\s+/).filter(Boolean);
    const hits = answers
      .map((item) => {
        const hay = `${item.q} ${item.a}`.toLowerCase();
        return { item, score: terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0) };
      })
      .filter((hit) => terms.length === 0 || hit.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    if (!hits.length) return `No FAQ entry matched "${args.query}". Contact: ${siteConfig.url}/contact`;
    return (
      hits.map((hit) => `Q: ${hit.item.q}\nA: ${hit.item.a}`).join("\n\n") +
      `\n\nMore: ${siteConfig.url}/#answers`
    );
  }
  return `Unknown tool: ${name}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as JsonRpcRequest | null;

  if (!body || body.jsonrpc !== "2.0" || typeof body.method !== "string") {
    return errorResult(body?.id ?? null, -32600, "Invalid Request");
  }
  const { id, method } = body;

  // Notifications (no id) get no response body per JSON-RPC 2.0.
  if (id === undefined || id === null) {
    if (method.startsWith("notifications/")) return new Response(null, { status: 202 });
    return errorResult(null, -32600, "Invalid Request");
  }

  if (method === "initialize") {
    return Response.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: {
          name: "compiled-tech",
          title: siteConfig.name,
          version: "1.0.0",
        },
      },
    });
  }

  if (method === "tools/list") {
    return Response.json({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
  }

  if (method === "tools/call") {
    const name = typeof body.params?.name === "string" ? body.params.name : "";
    const tool = TOOLS.find((t) => t.name === name);
    if (!tool) return errorResult(id, -32602, `Unknown tool: ${name}`);
    return textResult(id, runTool(name, (body.params?.arguments as Record<string, unknown>) ?? {}));
  }

  return errorResult(id, -32601, `Method not found: ${method}`);
}

// Simple clients also probe GET; confirm the endpoint exists.
export async function GET() {
  return Response.json({
    jsonrpc: "2.0",
    result: {
      server: "compiled-tech",
      version: "1.0.0",
      protocolVersion: PROTOCOL_VERSION,
      hint: "POST JSON-RPC 2.0 here: initialize, tools/list, tools/call",
    },
  });
}
