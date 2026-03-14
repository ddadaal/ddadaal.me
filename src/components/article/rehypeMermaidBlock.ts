import { visit } from "unist-util-visit";

type HastNode = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: HastNode[]; value?: string };
type HastRoot = { type: "root"; children: HastNode[] };

/**
 * A rehype plugin that extracts mermaid code blocks (```mermaid) and
 * replaces them with a custom <mermaid-diagram> element, so they are
 * not processed by rehype-pretty-code and can be rendered client-side.
 */
export function rehypeMermaidBlock() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: HastNode, index: number | undefined, parent: HastNode | undefined) => {
      if (node.tagName !== "pre" || !parent || index === undefined) return;

      const codeEl = node.children?.find(
        (c) => c.type === "element" && c.tagName === "code",
      );
      if (!codeEl) return;

      const classes = codeEl.properties?.className;
      if (!Array.isArray(classes) || !classes.includes("language-mermaid")) return;

      const code = (codeEl.children ?? [])
        .filter((c) => c.type === "text")
        .map((c) => c.value ?? "")
        .join("");

      parent.children!.splice(index, 1, {
        type: "element",
        tagName: "mermaid-diagram",
        properties: {},
        children: [{ type: "text", value: code }],
      });
    });
  };
}
