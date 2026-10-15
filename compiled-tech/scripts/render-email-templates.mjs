/**
 * Renders the two provider-ready templates with {{{PLACEHOLDER}}} variables
 * (the syntax the user's email provider interpolates) into doc/email-templates/.
 * Run: node scripts/render-email-templates.mjs  (from compiled-tech/)
 */
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

// Bundle the template module (aliases @ -> ./src like tsconfig paths).
execSync(
  "npx esbuild src/lib/email-template.ts --bundle --platform=node --outfile=/tmp/opencode/email-preview/tpl.cjs --alias:@=./src",
  { stdio: "pipe" }
);
const tpl = (await import("/tmp/opencode/email-preview/tpl.cjs")).default ?? (await import("/tmp/opencode/email-preview/tpl.cjs"));

// Placeholder values — the provider replaces {{{X}}} at send time. Values here
// only affect the layout of the *sample* rows; keep every placeholder intact.
const fields = {
  name: "{{{CUSTOMER_NAME}}}",
  email: "{{{CUSTOMER_EMAIL}}}",
  company: "{{{COMPANY}}}",
  service: "{{{SERVICE}}}",
  budget: "{{{BUDGET}}}",
  timeline: "{{{TIMELINE}}}",
  details: "{{{DETAILS}}}",
};

const client = tpl.inquiryReceivedEmail({
  name: fields.name,
  service: fields.service,
  budget: fields.budget,
  timeline: fields.timeline,
  details: fields.details,
});

const admin = tpl.inquiryAdminEmail({
  name: fields.name,
  email: fields.email,
  company: fields.company,
  service: fields.service,
  budget: fields.budget,
  timeline: fields.timeline,
  details: fields.details,
});

mkdirSync("doc/email-templates", { recursive: true });
writeFileSync("doc/email-templates/client-auto-reply.html", client);
writeFileSync("doc/email-templates/admin-notification.html", admin);
console.log("wrote doc/email-templates/client-auto-reply.html and admin-notification.html");
