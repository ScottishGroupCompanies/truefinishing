import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Doc, Faq } from "./types";
import { isLive } from "./publish";
import { POSTS_PER_PAGE } from "./site";

const CONTENT_DIR = path.join(process.cwd(), "content");

function asString(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (value === undefined || value === null) return "";
  return String(value);
}

function asFaq(value: unknown): Faq[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const faq = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as { q?: unknown; a?: unknown };
      const q = asString(row.q).trim();
      const a = asString(row.a).trim();
      if (!q || !a) return null;
      return { q, a };
    })
    .filter((item): item is Faq => Boolean(item));
  return faq.length ? faq : undefined;
}

function readDoc(file: string): Doc {
  const raw = fs.readFileSync(file, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;
  return {
    type: asString(data.type) as Doc["type"],
    title: asString(data.title),
    description: asString(data.description),
    h1: asString(data.h1),
    path: asString(data.path),
    body: parsed.content.trim(),
    publishDate: asString(data.publishDate) || undefined,
    updated: asString(data.updated) || undefined,
    category: asString(data.category) || undefined,
    hero: asString(data.hero) || undefined,
    faq: asFaq(data.faq),
    directAnswer: asString(data.directAnswer) || undefined,
    noindex: data.noindex === true,
    incomplete: data.incomplete === true,
    scheduled: data.scheduled === true,
    author: asString(data.author) || undefined,
    wpId: typeof data.wpId === "number" ? data.wpId : undefined,
    file: path.relative(CONTENT_DIR, file),
  };
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) return walk(full);
    return name.endsWith(".md") ? [full] : [];
  });
}

let cache: Doc[] | null = null;

export function getAllDocs(): Doc[] {
  if (cache) return cache;
  cache = walk(CONTENT_DIR)
    .map(readDoc)
    .filter((doc) => doc.path)
    .sort((a, b) => a.path.localeCompare(b.path));
  return cache;
}

export function getDoc(docPath: string): Doc | undefined {
  const normalized = docPath.endsWith("/") ? docPath : `${docPath}/`;
  return getAllDocs().find((doc) => doc.path === normalized);
}

export function liveDocs(now = Date.now()): Doc[] {
  return getAllDocs().filter((doc) => isLive(doc, now));
}

export function livePosts(now = Date.now()): Doc[] {
  return liveDocs(now)
    .filter((doc) => doc.type === "post")
    .sort((a, b) => Date.parse(b.publishDate || "") - Date.parse(a.publishDate || ""));
}

export function postsInCategory(slug: string, now = Date.now()): Doc[] {
  return livePosts(now).filter((doc) => doc.category === slug);
}

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
}

export function slicePage<T>(items: T[], page: number): T[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return items.slice(start, start + POSTS_PER_PAGE);
}

const SERVICE_KEYWORDS: { path: string; words: string[] }[] = [
  { path: "/floor-finishings/epoxy-flooring/", words: ["epoxy", "garage", "metallic", "polyaspartic", "flake", "coating"] },
  { path: "/floor-finishings/concrete-polishing/", words: ["polish", "polished"] },
  { path: "/floor-restoration/concrete-leveling/", words: ["level", "leveling", "self-level", "flatness"] },
  { path: "/floor-restoration/concrete-moisture-mitigation/", words: ["moisture", "vapor"] },
  { path: "/floor-restoration/concrete-overlay/", words: ["overlay"] },
  { path: "/floor-finishings/concrete-microtoppings/", words: ["microtop", "microcement"] },
  { path: "/floor-finishings/tile-floor-refinishing/", words: ["tile", "porcelain"] },
  { path: "/floor-finishings/vinyl-floor-finishing/", words: ["vinyl", "lvt", "lvp"] },
  { path: "/floor-finishings/carpet-floor-installation/", words: ["carpet"] },
  { path: "/floor-preparation/", words: ["prep", "grind", "grinding", "shot"] },
];

export function relatedServices(doc: Doc, limit = 4): Doc[] {
  const services = liveDocs().filter((item) => item.type === "service" || item.type === "service_hub");
  const hay = `${doc.title} ${doc.h1} ${doc.path} ${doc.category || ""}`.toLowerCase();
  const scored = services
    .filter((item) => item.path !== doc.path)
    .map((item) => {
      const rule = SERVICE_KEYWORDS.find((entry) => entry.path === item.path);
      const score = rule ? rule.words.reduce((sum, word) => sum + (hay.includes(word) ? 2 : 0), 0) : 0;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || a.item.path.localeCompare(b.item.path));
  const picked = scored.filter((row) => row.score > 0).map((row) => row.item);
  const rest = scored.filter((row) => row.score === 0).map((row) => row.item);
  return [...picked, ...rest].slice(0, limit);
}

export function relatedPosts(doc: Doc, limit = 3): Doc[] {
  const posts = livePosts().filter((item) => item.path !== doc.path);
  const same = posts.filter((item) => doc.category && item.category === doc.category);
  const hay = `${doc.h1} ${doc.path}`.toLowerCase();
  const scored = posts
    .filter((item) => item.category !== doc.category)
    .map((item) => {
      const words = item.h1.toLowerCase().split(/\W+/).filter((word) => word.length > 4);
      const score = words.reduce((sum, word) => sum + (hay.includes(word) ? 1 : 0), 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score);
  return [...same, ...scored.map((row) => row.item)].slice(0, limit);
}

export function cities(): Doc[] {
  return liveDocs()
    .filter((doc) => doc.type === "city")
    .sort((a, b) => a.h1.localeCompare(b.h1));
}

export function caseStudies(): Doc[] {
  return liveDocs()
    .filter((doc) => doc.type === "case_study")
    .sort((a, b) => a.h1.localeCompare(b.h1));
}
