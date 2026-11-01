#!/usr/bin/env node
/**
 * Local re-check of the SAGE report findings against prerendered HTML.
 *
 * Usage: npm run build && node scripts/seo-audit.mjs [path-to-html]
 *
 * Heuristics mirror what the report complained about, so a fix shows up here
 * before deploy. Not a general SEO tool.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const file = process.argv[2] || resolve(root, ".next/server/app/index.html");
const html = readFileSync(file, "utf8");

const strip = (s) =>
  s
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
const norm = (s) => decode(strip(s)).replace(/\s+/g, " ").trim();
const words = (s) => (s ? s.split(/\s+/).filter(Boolean) : []);

const body = html.split(/<body[^>]*>/i)[1] || html;
const bodyMarkup = body.replace(/<script[\s\S]*?<\/script>/gi, "");
const visible = norm(body);
const sentences = visible.split(/(?<=[.!?])\s+/).filter((s) => words(s).length > 2);
const syllables = (w) =>
  (w.toLowerCase().match(/[aeiouy]+/g) || []).length || 1;
const wordList = words(visible);
const syl = wordList.reduce((n, w) => n + syllables(w), 0);
const asl = wordList.length / Math.max(1, sentences.length);
const asw = syl / Math.max(1, wordList.length);
const flesch = 206.835 - 1.015 * asl - 84.6 * asw;

// Headings
const headings = [...body.matchAll(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
  level: Number(m[1]),
  id: /id="([^"]+)"/.exec(m[2])?.[1] || null,
  text: norm(m[3]),
}));
const headingsWithId = headings.filter((h) => h.id);
const questionHeadings = headings.filter((h) => /\?$/.test(h.text));

// Paragraphs directly after a question heading. Slice by heading position so a
// match cannot swallow the next heading.
const headingPositions = [...body.matchAll(/<h([2-6])([^>]*)>([\s\S]*?)<\/h\1>/gi)];
const questionBlocks = headingPositions.map((m, i) => {
  const start = m.index + m[0].length;
  const end = headingPositions[i + 1]?.index ?? body.length;
  const slice = body.slice(start, end);
  const p = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(slice);
  return { text: norm(m[3]), answer: p ? norm(p[1]) : "" };
});
const questionPerfect = questionBlocks.filter((b) => {
  if (!/\?$/.test(b.text)) return false;
  const w = words(b.answer).length;
  return w >= 40 && w <= 60;
});

// Voice-friendly: paragraphs in the 15-60 word band
const paragraphs = [...bodyMarkup.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
  .map((m) => norm(m[1]))
  .filter((p) => words(p).length >= 6);
const voiceFriendly = paragraphs.filter((p) => {
  const n = words(p).length;
  return n >= 15 && n <= 60;
});

// Images
const imgs = [...body.matchAll(/<img[^>]*>/gi)].map((m) => /src="([^"]+)"/.exec(m[0])?.[1] || "");
const poster = /<video[^>]*poster="([^"]+)"/i.exec(body)?.[1];
const other = [...html.matchAll(/<link[^>]+as="image"[^>]+href="([^"]+)"/gi)].map((m) => m[1]);
const allImgs = [...imgs, ...(poster ? [poster] : []), ...other];
const modern = allImgs.filter((u) => /\.(webp|avif)(\?|$|&)/i.test(decode(u)));

const isModern = (u) => /\.(webp|avif)(\?|$|&)/i.test(decode(u));

// Schema
const ld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      return null;
    }
  })
  .filter(Boolean);
const flat = [];
const walk = (node) => {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) return node.forEach(walk);
  if (node["@type"]) flat.push(node);
  Object.values(node).forEach(walk);
};
ld.forEach(walk);
const types = [...new Set(flat.flatMap((n) => [].concat(n["@type"])))];

const checks = [
  ["text-to-html ratio", `${((visible.length / html.length) * 100).toFixed(1)}%`, visible.length / html.length >= 0.05],
  ["visible text chars", String(visible.length), null],
  ["word count", String(wordList.length), null],
  // No images at all is a pass: nothing to be non-modern about.
  ["image formats modern", allImgs.length ? `${modern.length}/${allImgs.length}` : "no images", modern.length === allImgs.length],
  ["headings with id", `${headingsWithId.length}/${headings.length}`, headings.length > 0 && headingsWithId.length === headings.length],
  ["question headings", String(questionHeadings.length), questionHeadings.length >= 5],
  ["question + 40-60 word answer", String(questionPerfect.length), questionPerfect.length >= 5],
  ["definition patterns", String((visible.match(/\b\w[\w\s&-]{2,40}\b(?:is|refers to|means)\b (?:a|an|the)\b/gi) || []).length), (visible.match(/\b\w[\w\s&-]{2,40}\b(?:is|refers to|means)\b (?:a|an|the)\b/gi) || []).length >= 1],
  ["voice-friendly paragraphs", `${voiceFriendly.length}/${paragraphs.length} (${Math.round((voiceFriendly.length / Math.max(1, paragraphs.length)) * 100)}%)`, voiceFriendly.length / Math.max(1, paragraphs.length) >= 0.5],
  ["reading ease (Flesch)", flesch.toFixed(0), flesch >= 60],
  ["avg syllables/word", asw.toFixed(2), asw <= 1.6],
  [
    "GEO-critical schema types",
    ["Organization", "WebSite", "FAQPage", "HowTo", "Product"].filter((t) => types.includes(t)).join(", "),
    ["Organization", "WebSite", "FAQPage", "HowTo", "Product"].filter((t) => types.includes(t)).length >= 5,
  ],
  ["speakable", types.includes("SpeakableSpecification") || /"speakable"/.test(html) ? "yes" : "no", /"speakable"/.test(html)],
  ["FAQPage", types.includes("FAQPage") ? "yes" : "no", types.includes("FAQPage")],
  ["datePublished", /"datePublished"/.test(html) ? "yes" : "no", /"datePublished"/.test(html)],
  ["render-blocking scripts", String([...html.matchAll(/<script(?![^>]*\b(?:async|defer|type="module"|type="application\/ld\+json")[^>]*)\ssrc="([^"]+)"/gi)].length), ![...html.matchAll(/<script(?![^>]*\b(?:async|defer|type="module"|type="application\/ld\+json")[^>]*)\ssrc="([^"]+)"/gi)].length],
];

console.log(`\n${file}\n`);
for (const [name, value, ok] of checks) {
  const mark = ok === null ? "  " : ok ? "✅" : "❌";
  console.log(`${mark} ${name.padEnd(30)} ${value}`);
}

const failing = checks.filter((c) => c[2] === false);
console.log(`\n${failing.length} failing check(s)\n`);
process.exitCode = failing.length ? 1 : 0;

// Keep the helper referenced so a future edit doesn't silently drop it.
void isModern;
