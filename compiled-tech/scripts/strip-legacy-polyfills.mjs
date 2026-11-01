#!/usr/bin/env node
/**
 * Remove the legacy `nomodule` polyfill chunk from the build output.
 *
 * Next always emits static/chunks/polyfills-*.js and a
 * `<script src=... noModule>` tag for it. Modern browsers never fetch a
 * nomodule script, so it costs real visitors nothing — but audits that only
 * look for async/defer report it as render-blocking, and it is dead weight for
 * a site whose baseline is Chrome 111+ / Safari 16.4+ (all module-capable).
 *
 * The tag is baked into prerendered HTML and the RSC payload at build time, so
 * it has to be removed after the build, not at request time.
 *
 * ponytail: this deletes legacy-browser polyfills. If you ever need to support
 * a browser without ES module support, drop this script from `npm run build`
 * rather than trying to patch it back.
 *
 * Runs automatically as part of `npm run build`.
 */
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const nextDir = join(root, ".next");

/** Every text file in .next that can contain the tag: html, rsc, json manifests. */
async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "cache" || entry.name === "static") continue;
      out.push(...(await walk(path)));
    } else if (/\.(html|rsc|json)$/.test(entry.name)) {
      out.push(path);
    }
  }
  return out;
}

const POLYFILL_TAG = /<script[^>]*src="[^"]*\/polyfills-[a-z0-9]+\.js"[^>]*><\/script>/g;

async function main() {
  if (!(await stat(nextDir).then(() => true, () => false))) {
    console.log("webp/polyfill post-build: no .next directory, skipping");
    return;
  }

  let changed = 0;

  // 1. The tag itself, wherever it was prerendered.
  for (const file of await walk(nextDir)) {
    const source = await readFile(file, "utf8");
    if (!source.includes("polyfills-")) continue;
    const next = source.replace(POLYFILL_TAG, "");
    if (next !== source) {
      await writeFile(file, next);
      changed += 1;
    }
  }

  // 2. The manifest entry, so runtime rendering stops injecting it too.
  for (const manifest of [
    join(nextDir, "build-manifest.json"),
    join(nextDir, "standalone", ".next", "build-manifest.json"),
  ]) {
    const source = await readFile(manifest, "utf8").catch(() => null);
    if (!source) continue;
    const data = JSON.parse(source);
    if (Array.isArray(data.polyfillFiles) && data.polyfillFiles.length) {
      data.polyfillFiles = [];
      await writeFile(manifest, JSON.stringify(data));
      changed += 1;
    }
  }

  console.log(`post-build: removed legacy polyfill references from ${changed} file(s)`);
}

main().catch((error) => {
  console.error("post-build failed:", error.message);
  process.exit(1);
});
