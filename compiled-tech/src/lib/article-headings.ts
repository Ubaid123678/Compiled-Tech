import { slugify } from "./utils";

type MarkdownNode = {
  type: string;
  depth?: number;
  value?: string;
  alt?: string;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, unknown> };
};

export type ArticleHeading = { id: string; text: string; level: number };

function headingText(node: MarkdownNode): string {
  return node.value ?? node.alt ?? node.children?.map(headingText).join("") ?? "";
}

export function collectArticleHeadings(headings: ArticleHeading[]) {
  return () => (tree: MarkdownNode) => {
    const used = new Set<string>();

    function visit(node: MarkdownNode) {
      // Older articles sometimes include their title as a Markdown H1.
      // The page already renders the authoritative title above the article.
      if (node.type === "heading" && node.depth === 1) node.depth = 2;

      if (node.type === "heading" && (node.depth === 2 || node.depth === 3)) {
        const text = headingText(node).trim();
        if (text) {
          const base = slugify(text) || "section";
          let id = base;
          for (let suffix = 2; used.has(id); suffix++) id = `${base}-${suffix}`;
          used.add(id);
          node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
          headings.push({ id, text, level: node.depth });
        }
      }
      for (const child of node.children ?? []) visit(child);
    }

    visit(tree);
  };
}
