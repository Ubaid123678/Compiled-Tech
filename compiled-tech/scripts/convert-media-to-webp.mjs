#!/usr/bin/env node
/**
 * Ensure every project/blog image referenced in Supabase is WebP.
 *
 * Why: images were stored as .jpeg. Next's optimizer rewrites them to
 * /_next/image?url=...jpeg, so the served URL keeps the original extension and
 * image-format audits (correctly) report 0% modern formats. Fixing the stored
 * object fixes it for every consumer, not just one code path.
 *
 * Safe by construction:
 *   - idempotent: any URL that already resolves 200 is left alone
 *   - originals are never deleted or overwritten
 *   - the new object is written beside the original as <name>.webp
 *   - reverting is a URL edit back to .jpeg/.png
 *
 * Requires: ffmpeg with libwebp, SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in
 * the environment or .env.local.
 *
 * Usage:
 *   node scripts/convert-media-to-webp.mjs           # dry run
 *   node scripts/convert-media-to-webp.mjs --apply
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const run = promisify(execFile);
const apply = process.argv.includes("--apply");
const BUCKET = "admin-media";
const MARKER = `/storage/v1/object/public/${BUCKET}/`;

async function loadEnv() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    const text = await readFile(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of text.split("\n")) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // fall back to the real environment
  }
}

const headers = () => ({
  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
});

const isWebp = (url) => /\.webp$/i.test(url.split("?")[0]);

/** Object key inside the bucket: "projects/foo.jpeg". */
function keyFromUrl(url) {
  const index = url.indexOf(MARKER);
  return index === -1 ? null : decodeURIComponent(url.slice(index + MARKER.length));
}

async function exists(url) {
  const res = await fetch(url, { method: "HEAD" });
  return res.ok;
}

async function uploadWebp(base, key, buffer) {
  const res = await fetch(`${base}/storage/v1/object/${BUCKET}/${key}`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "image/webp", "x-upsert": "true" },
    body: buffer,
  });
  if (!res.ok) throw new Error(`upload ${key}: ${res.status} ${await res.text()}`);
}

/** Convert one source URL to WebP beside itself. Returns the new public URL. */
async function convert(base, sourceUrl) {
  const sourceKey = keyFromUrl(sourceUrl);
  if (!sourceKey) return null;
  const targetKey = sourceKey.replace(/\.[^.]+$/, ".webp");
  const targetUrl = `${base}${MARKER}${targetKey}`;

  // Already converted on a previous run (or by hand) — nothing to do.
  if (await exists(targetUrl)) return targetUrl;

  const res = await fetch(sourceUrl);
  if (!res.ok) {
    console.warn(`  source missing (${res.status}): ${sourceKey}`);
    return null;
  }

  const dir = await mkdtemp(join(tmpdir(), "webp-"));
  try {
    const source = join(dir, "in");
    const target = join(dir, "out.webp");
    await writeFile(source, Buffer.from(await res.arrayBuffer()));
    await run("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", source,
      "-c:v", "libwebp", "-quality", "82", "-compression_level", "6",
      target,
    ]);
    const buffer = await readFile(target);

    if (!apply) return targetUrl;
    await uploadWebp(base, targetKey, buffer);
    console.log(`  uploaded ${targetKey}`);
    return targetUrl;
  } catch (error) {
    console.warn(`  convert failed for ${sourceKey}: ${error.message.split("\n")[0]}`);
    return null;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const targets = [
  { table: "work_projects", single: ["image", "thumbnail"], multi: ["gallery_images"] },
  { table: "blog_posts", single: ["image"], multi: [] },
];

async function main() {
  await loadEnv();
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }
  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  let converted = 0;
  let fixed = 0;

  for (const target of targets) {
    const select = ["id", "slug", ...target.single, ...target.multi].join(",");
    const res = await fetch(`${base}/rest/v1/${target.table}?select=${select}`, { headers: headers() });
    if (!res.ok) throw new Error(`${target.table}: ${res.status} ${await res.text()}`);
    const rows = await res.json();

    for (const row of rows) {
      const patch = {};

      for (const column of target.single) {
        const url = row[column];
        if (!url) continue;
        // A .webp URL can still be broken (a bad earlier run); repair it too.
        if (isWebp(url)) {
          if (await exists(url)) continue;
          const original = url.replace(/\.webp$/i, "");
          for (const ext of [".jpeg", ".jpg", ".png"]) {
            const candidate = await convert(base, original + ext);
            if (candidate) {
              patch[column] = candidate;
              fixed += 1;
              break;
            }
          }
          continue;
        }
        const next = await convert(base, url);
        if (next) {
          patch[column] = next;
          converted += 1;
        }
      }

      for (const column of target.multi) {
        const urls = row[column];
        if (!Array.isArray(urls) || !urls.length) continue;
        // Build the whole array once; converting in place per element is what
        // made an earlier version overwrite its own edits.
        const next = [];
        let changed = false;
        for (const url of urls) {
          const source = isWebp(url) ? url.replace(/\.webp$/i, ".jpeg") : url;
          const out = await convert(base, source);
          next.push(out || url);
          if (out && out !== url) changed = true;
          if (out) converted += 1;
        }
        if (changed) patch[column] = next;
      }

      if (!apply || !Object.keys(patch).length) continue;
      const update = await fetch(`${base}/rest/v1/${target.table}?id=eq.${row.id}`, {
        method: "PATCH",
        headers: { ...headers(), "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify(patch),
      });
      if (!update.ok) throw new Error(`PATCH ${target.table}/${row.slug}: ${await update.text()}`);
      console.log(`updated ${target.table}/${row.slug}`);
    }
  }

  console.log(`\n${apply ? "converted" : "would convert"}: ${converted}, repaired broken .webp rows: ${fixed}`);
  if (!apply && converted) console.log("Re-run with --apply to upload and update rows.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
