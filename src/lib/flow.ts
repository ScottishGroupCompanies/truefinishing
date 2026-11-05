export type FlowImage = { alt: string; src: string };

export type FlowStep = {
  title: string;
  markdown: string;
  images: FlowImage[];
};

export type FlowBlock = {
  heading: string;
  markdown: string;
  images: FlowImage[];
  steps: FlowStep[];
  ordered: string[];
  stat: boolean;
};

const IMAGE_RE = /!\[([^\]]*)\]\((\/images\/[^)\s]+)\)/g;

function takeImages(markdown: string): { markdown: string; images: FlowImage[] } {
  const images: FlowImage[] = [];
  const next = markdown
    .replace(IMAGE_RE, (_full, alt: string, src: string) => {
      images.push({ alt, src });
      return "";
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { markdown: next, images };
}

function takeOrdered(markdown: string): { markdown: string; ordered: string[] } {
  const lines = markdown.split("\n");
  const intro: string[] = [];
  const ordered: string[] = [];
  let current = "";
  let inList = false;
  const flush = () => {
    if (current.trim()) ordered.push(current.trim());
    current = "";
  };
  for (const line of lines) {
    const item = line.match(/^\d+\.\s+(.*)$/);
    if (item) {
      flush();
      current = item[1];
      inList = true;
      continue;
    }
    if (inList && /^\s{2,}\S/.test(line)) {
      current = `${current} ${line.trim()}`;
      continue;
    }
    if (inList) {
      flush();
      inList = false;
    }
    intro.push(line);
  }
  flush();
  return { markdown: intro.join("\n").replace(/\n{3,}/g, "\n\n").trim(), ordered };
}

function takeSteps(markdown: string): { markdown: string; steps: FlowStep[] } {
  const parts = markdown.split(/\n(?=### )/);
  if (parts.length < 2 && !markdown.startsWith("### ")) {
    return { markdown, steps: [] };
  }
  const intro: string[] = [];
  const steps: FlowStep[] = [];
  for (const part of parts) {
    const match = part.match(/^###\s+(.+)\n?/);
    if (!match) {
      intro.push(part);
      continue;
    }
    const body = part.slice(match[0].length);
    const taken = takeImages(body);
    steps.push({ title: match[1].trim(), markdown: taken.markdown, images: taken.images });
  }
  if (steps.length < 2) return { markdown, steps: [] };
  return { markdown: intro.join("\n").trim(), steps };
}

function isStat(heading: string, markdown: string): boolean {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  if (words > 45 || words === 0) return false;
  return /\d/.test(markdown) && /install|guarantee|project|sq|warranty|year/i.test(`${heading}\n${markdown}`);
}

export function blocksFromMarkdown(source: string): FlowBlock[] {
  const cleaned = source.replace(/<!--[\s\S]*?-->/g, "").trim();
  if (!cleaned) return [];
  return cleaned
    .split(/\n(?=## )/)
    .map((part) => {
      let raw = part.trim();
      let heading = "";
      const headingMatch = raw.match(/^##\s+(.+)\n?/);
      if (headingMatch) {
        heading = headingMatch[1].trim();
        raw = raw.slice(headingMatch[0].length);
      }
      const stepped = takeSteps(raw.trim());
      const listed = takeOrdered(stepped.markdown);
      const taken = takeImages(listed.markdown);
      const stepImages = stepped.steps.flatMap((step) => step.images);
      return {
        heading,
        markdown: taken.markdown,
        images: [...taken.images, ...stepImages],
        steps: stepped.steps,
        ordered: listed.ordered,
        stat: isStat(heading, taken.markdown) && stepped.steps.length === 0 && listed.ordered.length === 0,
      };
    })
    .filter((block) => block.heading || block.markdown || block.images.length || block.steps.length || block.ordered.length);
}

export function allImages(blocks: FlowBlock[]): FlowImage[] {
  const seen = new Set<string>();
  const images: FlowImage[] = [];
  for (const block of blocks) {
    for (const image of block.images) {
      if (seen.has(image.src)) continue;
      seen.add(image.src);
      images.push(image);
    }
  }
  return images;
}
