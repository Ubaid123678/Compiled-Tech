import "react";

/**
 * WebMCP declarative tool attributes.
 *
 * These are not in React's or TypeScript's DOM typings yet (the spec is still
 * experimental), so they are declared here. They let an agent understand a form
 * from the server-rendered HTML alone, before any JavaScript has run — which is
 * the whole point: the imperative registerTool() calls only exist post-hydration.
 *
 * Drop this file once @types/react ships the attributes.
 */
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    /** Machine-readable tool name for this form. */
    toolname?: string;
    /** What the tool does, in one sentence, for an agent to decide whether to call it. */
    tooldescription?: string;
    /** What a single input expects. Applies to the control, not the form. */
    toolparamdescription?: string;
  }
}
