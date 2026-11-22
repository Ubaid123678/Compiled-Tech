import { cp, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = new URL("../", import.meta.url);
const standalone = new URL(".next/standalone/", source);

await mkdir(fileURLToPath(new URL(".next/", standalone)), { recursive: true });
await Promise.all(
  ["public", ".next/static"].map((path) =>
    cp(fileURLToPath(new URL(path, source)), fileURLToPath(new URL(path, standalone)), { recursive: true }),
  ),
);
console.log("post-build: packaged public assets and Next.js static files");
