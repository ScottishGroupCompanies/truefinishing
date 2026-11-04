import { livePosts } from "@/lib/content";
import { BUSINESS, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const posts = livePosts().slice(0, 50);
  const items = posts
    .map((post) => {
      const url = new URL(post.path, SITE_URL).toString();
      return `<item>
        <title>${escapeXml(post.h1)}</title>
        <link>${escapeXml(url)}</link>
        <guid>${escapeXml(url)}</guid>
        <pubDate>${new Date(post.publishDate || Date.now()).toUTCString()}</pubDate>
        <description>${escapeXml(post.description)}</description>
      </item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(BUSINESS.shortName)} Blog</title>
      <link>${SITE_URL}/blog/</link>
      <description>Flooring articles from ${escapeXml(BUSINESS.name)}.</description>
      ${items}
    </channel>
  </rss>`;
  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
