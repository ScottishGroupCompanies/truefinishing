export type FlowImage = { alt: string; src: string };

export type FlowBlock = {
  heading: string;
  markdown: string;
  images: FlowImage[];
};

const IMAGE_RE = /!\[([^\]]*)\]\((\/images\/[^)\s]+)\)/g;

export function blocksFromMarkdown(source: string): FlowBlock[] {
  const cleaned = source.replace(/<!--[\s\S]*?-->/g, "").trim();
  if (!cleaned) return [];
  const parts = cleaned.split(/\n(?=## )/);
  return parts
    .map((part) => {
      let markdown = part.trim();
      let heading = "";
      const headingMatch = markdown.match(/^##\s+(.+)\n?/);
      if (headingMatch) {
        heading = headingMatch[1].trim();
        markdown = markdown.slice(headingMatch[0].length).trim();
      }
      const images: FlowImage[] = [];
      markdown = markdown
        .replace(IMAGE_RE, (_full, alt: string, src: string) => {
          images.push({ alt, src });
          return "";
        })
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      return { heading, markdown, images };
    })
    .filter((block) => block.heading || block.markdown || block.images.length);
}
