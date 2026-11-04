import type { MetadataRoute } from "next";
import { liveDocs, livePosts, pageCount, postsInCategory } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = Date.now();
  const docs = liveDocs(now).filter((doc) => !doc.noindex && doc.path !== "/blog/");
  const entries: MetadataRoute.Sitemap = docs.map((doc) => ({
    url: new URL(doc.path, SITE_URL).toString(),
    lastModified: doc.updated || doc.publishDate || undefined,
  }));
  entries.push({ url: new URL("/blog/", SITE_URL).toString() });
  const posts = livePosts(now);
  const categories = new Set(posts.map((post) => post.category).filter(Boolean) as string[]);
  for (const category of categories) {
    entries.push({ url: new URL(`/category/${category}/`, SITE_URL).toString() });
    const pages = pageCount(postsInCategory(category, now).length);
    for (let page = 2; page <= pages; page += 1) {
      entries.push({ url: new URL(`/category/${category}/page/${page}/`, SITE_URL).toString() });
    }
  }
  const blogPages = pageCount(posts.length);
  for (let page = 2; page <= blogPages; page += 1) {
    entries.push({ url: new URL(`/blog/page/${page}/`, SITE_URL).toString() });
  }
  entries.push({ url: new URL("/feed/", SITE_URL).toString() });
  return entries;
}
