#!/usr/bin/env node
/**
 * Make sharp's native libvips loadable in the Next.js standalone bundle.
 *
 * Why this exists: the standalone output nests sharp's libvips package at
 * node_modules/@img/sharp-linux-x64/node_modules/@img/sharp-libvips-linux-x64,
 * but libvips-cpp.so's RPATH only looks for a FLAT
 * node_modules/@img/sharp-libvips-linux-x64. The loader never finds it, sharp
 * throws, and Next's image optimizer catches the error and silently returns the
 * full-size original — so every /_next/image request served an 80KB 1267px
 * photo into a 384px slot, and the image-format audit saw no optimisation at
 * all.
 *
 * This copies the (already-present) package to where the RPATH looks. Copies,
 * never moves, so a failed lookup can't make things worse.
 *
 * ponytail: a symlink would be tidier but Hostinger's deploy step resolves
 * nothing and the file is ~7MB either way; a copy survives any archive format.
 * Remove this script if Next ever emits a flat @img layout.
 *
 * Runs automatically as part of `npm run build`.
 */
import { cp, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const standaloneModules = join(root, ".next", "standalone", "node_modules", "@img");

const exists = (path) => stat(path).then(() => true, () => false);

async function main() {
  if (!(await exists(standaloneModules))) {
    console.log("post-build: no standalone @img directory, skipping sharp fix");
    return;
  }

  const entries = await readdir(standaloneModules);
  const libvipsDir = entries.find((name) => name.startsWith("sharp-libvips-"));
  if (libvipsDir) {
    console.log("post-build: sharp libvips already flat, nothing to do");
    return;
  }

  // Find the nested copy produced by tracing.
  const platformDir = entries.find((name) => /^sharp-(linux|darwin|win32)/.test(name));
  if (!platformDir) {
    console.log("post-build: no sharp platform package found, skipping");
    return;
  }

  const nestedBase = join(standaloneModules, platformDir, "node_modules", "@img");
  if (!(await exists(nestedBase))) {
    console.log("post-build: no nested @img package, skipping");
    return;
  }

  const nested = (await readdir(nestedBase)).filter((name) => name.startsWith("sharp-libvips-"));
  if (!nested.length) {
    console.log("post-build: no nested libvips package, skipping");
    return;
  }

  for (const name of nested) {
    await cp(join(nestedBase, name), join(standaloneModules, name), { recursive: true });
    console.log(`post-build: flattened @img/${name} so libvips-cpp.so resolves`);
  }
}

main().catch((error) => {
  console.error("post-build sharp fix failed:", error.message);
  process.exit(1);
});
