/**
 * Node's ESM loader eagerly reads `process.stdin` when it syncs the `node:process`
 * builtin's exports. If fd 0 is already a libuv handle (Hostinger's process manager),
 * `uv_pipe_open(0)` returns EEXIST and the request crashes with `open EEXIST`.
 *
 * Only /blog/[slug] hits this: it is the one route that pulls in `next-mdx-remote`,
 * whose MDX pipeline imports `node:process` (vfile/lib/minproc.js). Other routes
 * never load it, which is why only the blog detail returned 500.
 *
 * register() runs once at server start, before any route module is imported, so the
 * guard is installed before that lazy ESM import happens.
 *
 * ponytail: swallows the EEXIST and reports "no stdin" for a web server that never
 * reads stdin. Remove once next-mdx-remote stops importing node:process, or move the
 * render off the standalone server.
 */
export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const descriptor = Object.getOwnPropertyDescriptor(process, "stdin");
  if (!descriptor?.get) return;

  Object.defineProperty(process, "stdin", {
    configurable: true,
    enumerable: descriptor.enumerable,
    get() {
      try {
        return descriptor.get!.call(process);
      } catch (error) {
        if ((error as NodeJS.ErrnoException)?.code === "EEXIST") return null;
        throw error;
      }
    },
  });
}
