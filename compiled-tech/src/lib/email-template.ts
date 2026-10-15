import { siteConfig } from "@/lib/seo";

/**
 * Branded email templates for the contact form. Inline styles only — Gmail and
 * Outlook strip <style> tags and ignore flex/grid; tables are the only reliable
 * email CSS. Palette matches globals.css.
 *
 * All dynamic values MUST be pre-escaped (escapeHtml) by the caller — these
 * functions build HTML, they do not sanitize.
 *
 * ponytail: the logo is a bordered-cell wordmark, not an <img>. The repo logo is
 * SVG, which Gmail/Outlook refuse to render, and there is no raster asset.
 * Drop in a hosted PNG <img> when one exists; keep the wordmark as fallback.
 */

const C = {
  ink: "#070B11",
  night: "#0D141D",
  slate: "#1B2735",
  mist: "#8FA1B5",
  steel: "#B9C6D4",
  frost: "#E9EFF6",
  line: "#2A3846", // --color-line (rgba in CSS) flattened — email clients don't do rgba borders reliably
  dim: "#5C6B7A",
} as const;

const FONT = "font-family:Arial,Helvetica,sans-serif;";

/** One label/value pair inside the slate detail box. */
function row(label: string, value: string, href?: string) {
  return `
    <tr>
      <td style="${FONT}width:110px;padding:10px 0 10px 24px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.steel};vertical-align:top;">${label}</td>
      <td style="${FONT}padding:10px 24px 10px 12px;font-size:15px;line-height:1.6;color:${C.frost};">${href ? `<a href="${href}" style="color:${C.steel};text-decoration:underline;">${value}</a>` : value}</td>
    </tr>`;
}

/** The slate box holding all inquiry fields. */
function fieldRows(fields: Array<{ label: string; value: string; href?: string }>) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.slate};border-radius:12px;">
      ${fields.map((f) => row(f.label, f.value, f.href)).join("")}
    </table>`;
}

/** Full dark-brand email shell: wordmark logo, header text, body, footer. */
function shell(header: string, body: string, footer: string, preheader: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>${header}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.ink};">
  <!-- preheader: hidden preview text shown by clients in the inbox list -->
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.ink};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${C.night};border:1px solid ${C.line};border-radius:16px;">
          <tr>
            <td style="padding:32px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="${FONT}width:36px;height:36px;border:2px solid ${C.steel};border-radius:8px;text-align:center;vertical-align:middle;font-size:15px;font-weight:bold;color:${C.frost};" align="center">&lt;/&gt;</td>
                  <td style="${FONT}padding-left:12px;font-size:16px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:${C.frost};">Compiled Tech</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="${FONT}padding:28px 32px 0 32px;font-size:20px;font-weight:600;color:${C.frost};">${header}</td>
          </tr>
          <tr>
            <td style="padding:16px 32px 32px 32px;">${body}</td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};">
                <tr>
                  <td style="${FONT}padding-top:16px;font-size:12px;line-height:1.8;color:${C.dim};">
                    ${footer}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="${FONT}margin:14px 0 0 0;font-size:12px;color:${C.dim};">
          Compiled Tech · ${siteConfig.location} ·
          <a href="${siteConfig.url}" style="color:${C.dim};text-decoration:none;">${siteConfig.url.replace(/^https:\/\//, "")}</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Auto-reply sent to the person who filled in the form. */
export function inquiryReceivedEmail(input: {
  name: string; // pre-escaped
  service: string;
  budget: string;
  timeline: string;
  details: string; // pre-escaped, newlines already -> <br>
}) {
  const body = `
    <p style="${FONT}margin:0 0 16px 0;font-size:15px;line-height:1.7;color:${C.mist};">
      Thanks, <span style="color:${C.frost};font-weight:bold;">${input.name}</span> — we got your message and will reply within one working day.
    </p>
    <p style="${FONT}margin:0 0 20px 0;font-size:13px;line-height:1.6;color:${C.mist};">
      A copy of your inquiry is below. If anything looks wrong, just reply to this email.
    </p>
    ${fieldRows([
      { label: "Service", value: input.service },
      { label: "Budget", value: input.budget },
      { label: "Timeline", value: input.timeline },
      { label: "Details", value: input.details },
    ])}`;

  return shell(
    "We received your message",
    body,
    `You're receiving this because you submitted the contact form at ${siteConfig.url.replace(/^https:\/\//, "")}.<br>
     The Compiled Tech team · <a href="${siteConfig.url}" style="color:${C.steel};text-decoration:none;">${siteConfig.url.replace(/^https:\/\//, "")}</a> · <a href="mailto:${siteConfig.email}" style="color:${C.steel};text-decoration:none;">${siteConfig.email}</a>`,
    "Thanks for reaching out — we'll reply within one working day."
  );
}

/** Internal notification sent to CONTACT_TO_EMAIL. */
export function inquiryAdminEmail(input: {
  name: string; // pre-escaped
  email: string; // pre-escaped
  company: string; // pre-escaped
  service: string;
  budget: string;
  timeline: string;
  details: string; // pre-escaped, newlines already -> <br>
}) {
  const body = `
    <p style="${FONT}margin:0 0 20px 0;font-size:15px;line-height:1.7;color:${C.mist};">
      New project inquiry from <span style="color:${C.frost};font-weight:bold;">${input.name}</span>.
    </p>
    ${fieldRows([
      { label: "Name", value: input.name },
      { label: "Email", value: input.email, href: `mailto:${input.email}` },
      { label: "Company", value: input.company },
      { label: "Service", value: input.service },
      { label: "Budget", value: input.budget },
      { label: "Timeline", value: input.timeline },
      { label: "Details", value: input.details },
    ])}`;

  return shell(
    "New project inquiry",
    body,
    `Reply directly to this client, or open the lead in the admin panel.`,
    `New inquiry from ${input.name} — ${input.service}`
  );
}
