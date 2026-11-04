/**
 * Pull published content from the public WordPress REST API and sitemap,
 * convert it to Markdown, and self-host images as WebP.
 *
 * Future-dated posts are not exposed by the public API (status=future is
 * forbidden). Their metadata is taken from the inventory JSON when present.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import matter from "gray-matter";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const IMAGE_DIR = path.join(ROOT, "public", "images");
const BRAND_DIR = path.join(ROOT, "public", "brand");
const SITE = "https://truefinishing.com";
const INVENTORY =
  process.env.INVENTORY_JSON ||
  "/home/ubuntu/.cursor/projects/workspace/uploads/inventory_eb0c.json";

const UA =
  "Mozilla/5.0 (compatible; TrueFinishingMigration/1.0; +https://truefinishing.com)";

const LINK_REWRITES = {
  "/epoxy-floors/": "/floor-finishings/epoxy-flooring/",
  "/garage-floors/": "/floor-finishings/epoxy-flooring/",
  "/garage-coatings/": "/floor-finishings/epoxy-flooring/",
  "/metallic-floors/": "/floor-finishings/epoxy-flooring/",
  "/polyaspartic-floors/": "/floor-finishings/epoxy-flooring/",
  "/basement-floors/": "/floor-finishings/epoxy-flooring/",
  "/commercial-floors/": "/floor-finishings/epoxy-flooring/",
  "/concrete-coatings/": "/floor-finishings/",
  "/lakewood/": "/cities-we-serve/lakewood-concrete-floor-finishing/",
  "/parker/": "/cities-we-serve/parker-concrete-floor-finishing/",
  "/wheat-ridge/": "/cities-we-serve/",
  "/cities-we-serve/monument/": "/cities-we-serve/",
  "/cities-we-serve/denver/":
    "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/",
  "/cities-we-serve/denver-co/":
    "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/",
  "/cities-we-serve/aurora/":
    "/cities-we-serve/aurora-concrete-floor-finishing/",
  "/cities-we-serve/aurora-co/":
    "/cities-we-serve/aurora-concrete-floor-finishing/",
};

const CATEGORY_SLUGS = {
  "Commercial Flooring": "commercial-flooring",
  "Epoxy Flooring": "epoxy-flooring",
  "Floor Finishing": "floor-finishing",
  "Floor Prep": "floor-prep",
  "Floor Restoration": "floor-restoration",
  Microtoppings: "microtoppings",
  "Moisture Mitigation": "moisture-mitigation",
  "Polished Concrete": "polished-concrete",
};

const imageJobs = new Map();

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${url} ${text.slice(0, 180)}`);
  }
  return { json: await res.json(), headers: res.headers };
}

async function fetchAll(base) {
  const all = [];
  let page = 1;
  for (;;) {
    const join = base.includes("?") ? "&" : "?";
    const url = `${base}${join}per_page=50&page=${page}`;
    const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" } });
    if (res.status === 400) break;
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    const total = Number(res.headers.get("x-wp-totalpages") || "1");
    process.stdout.write(`\r  ${all.length} from ${base.split("?")[0].split("/").pop()} (page ${page}/${total})`);
    if (page >= total) break;
    page += 1;
  }
  process.stdout.write("\n");
  return all;
}

function decode(text) {
  return text
    .replace(/&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripTags(html) {
  return decode(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).trim();
}

function isoWithOffset(dateStr, gmtStr) {
  if (!dateStr) return "";
  const local = dateStr.replace(" ", "T").replace(/Z$/, "");
  if (!gmtStr) return `${local}-07:00`;
  const gmt = gmtStr.replace(" ", "T").replace(/Z$/, "");
  const diffMin = Math.round((Date.parse(`${gmt}Z`) - Date.parse(`${local}Z`)) / 60000);
  const sign = diffMin >= 0 ? "-" : "+";
  const abs = Math.abs(diffMin);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${local}${sign}${hh}:${mm}`;
}

function normalizePath(pathname) {
  let p = pathname || "/";
  if (!p.startsWith("/")) p = `/${p}`;
  if (!p.endsWith("/")) p = `${p}/`;
  return p;
}

function pathFromLink(link) {
  const u = new URL(link);
  return normalizePath(u.pathname);
}

function rewriteHref(href) {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return href;
  let url;
  try {
    url = new URL(href, SITE);
  } catch {
    return href;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "truefinishing.com") return href;
  if (url.searchParams.get("page_id") === "353") return "/about/";
  if (url.searchParams.get("page_id") === "1530") return "";
  let p = normalizePath(url.pathname);
  if (LINK_REWRITES[p]) p = LINK_REWRITES[p];
  return p + (url.hash || "");
}

function safeName(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function queueImage(src) {
  if (!src || src.startsWith("data:")) return "";
  let abs;
  try {
    abs = new URL(src, SITE).href;
  } catch {
    return "";
  }
  if (!/truefinishing\.com/i.test(abs)) return "";
  if (/spinner\.svg|gravatar|emoji/i.test(abs)) return "";
  const full = abs.replace(/-\d+x\d+(?=\.(jpe?g|png|webp|gif))/i, "");
  const base = safeName(path.basename(new URL(full).pathname).replace(/\.[a-z0-9]+$/i, ""));
  if (!base) return "";
  const isSvg = /\.svg$/i.test(new URL(full).pathname);
  const local = isSvg ? `/images/${base}.svg` : `/images/${base}.webp`;
  if (!imageJobs.has(local)) imageJobs.set(local, full);
  return local;
}

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    bulletListMarker: "-",
  });
  td.use(gfm);
  td.remove(["script", "style", "noscript", "form", "iframe", "svg", "button"]);
  td.addRule("figure", {
    filter: "figure",
    replacement: (_content, node) => {
      const img = node.querySelector("img");
      const cap = node.querySelector("figcaption");
      if (!img) return "";
      const local = queueImage(img.getAttribute("src") || "");
      if (!local) return "";
      const alt = (img.getAttribute("alt") || "").replace(/[\[\]]/g, "");
      const caption = cap ? stripTags(cap.textContent || "") : "";
      const md = `![${alt}](${local})`;
      return caption ? `\n\n${md}\n\n*${caption}*\n\n` : `\n\n${md}\n\n`;
    },
  });
  td.addRule("img", {
    filter: "img",
    replacement: (_content, node) => {
      const local = queueImage(node.getAttribute("src") || "");
      if (!local) return "";
      const alt = (node.getAttribute("alt") || "").replace(/[\[\]]/g, "");
      return `\n\n![${alt}](${local})\n\n`;
    },
  });
  td.addRule("anchors", {
    filter: (node) => node.nodeName === "A" && node.getAttribute("href"),
    replacement: (content, node) => {
      const href = rewriteHref(node.getAttribute("href") || "");
      const text = content.replace(/\s+/g, " ").trim();
      if (!href || !text) return text;
      return `[${text}](${href})`;
    },
  });
  return td;
}

const turndown = makeTurndown();

function htmlToMarkdown(html) {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<form[\s\S]*?<\/form>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const dom = new JSDOM(`<body>${cleaned}</body>`);
  const md = turndown.turndown(dom.window.document.body);
  dom.window.close();
  return md
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/^# /gm, "## ")
    .trim();
}

function classifyPage(docPath) {
  if (docPath === "/") return { type: "home", file: "pages/home.md" };
  if (docPath === "/blog/") return { type: "blog_hub", file: "pages/blog.md" };
  if (docPath === "/case-studies/") return { type: "case_hub", file: "pages/case-studies.md" };
  if (docPath === "/about/") return { type: "page", file: "pages/about.md" };
  if (docPath === "/contact/") return { type: "page", file: "pages/contact.md" };
  if (docPath === "/privacy-policy/") return { type: "page", file: "pages/privacy-policy.md" };
  if (docPath === "/thank-you-for-contacting-us/")
    return { type: "page", file: "pages/thank-you.md" };
  if (docPath === "/cities-we-serve/") return { type: "city_hub", file: "pages/cities-we-serve.md" };
  if (
    docPath === "/floor-finishings/" ||
    docPath === "/floor-preparation/" ||
    docPath === "/floor-restoration/"
  ) {
    const slug = docPath.split("/").filter(Boolean)[0];
    return { type: "service_hub", file: `services/${slug}.md` };
  }
  if (docPath.startsWith("/floor-finishings/") || docPath.startsWith("/floor-restoration/")) {
    const slug = docPath.split("/").filter(Boolean).pop();
    return { type: "service", file: `services/${slug}.md` };
  }
  if (docPath.startsWith("/cities-we-serve/")) {
    const slug = docPath.split("/").filter(Boolean).pop();
    return { type: "city", file: `cities/${slug}.md` };
  }
  return { type: "page", file: `pages/${docPath.replace(/\//g, "") || "page"}.md` };
}

function firstImage(markdown) {
  const m = markdown.match(/!\[[^\]]*\]\((\/images\/[^)]+)\)/);
  return m ? m[1] : "";
}

function descriptionFrom(text, title) {
  let t = text.replace(/\s+/g, " ").trim();
  const baseTitle = title.replace(/\s+[|\-–—]\s+True Finishing.*$/i, "").trim();
  if (t.length < 90) {
    t = `${baseTitle} by True Finishing, a Denver concrete flooring contractor serving the Colorado Front Range. Floor preparation, restoration, and finishings.`;
  }
  if (t.length > 155) {
    const cut = t.slice(0, 152);
    const last = cut.lastIndexOf(" ");
    t = `${(last > 100 ? cut.slice(0, last) : cut).replace(/[.,;:]+$/, "")}.`;
    if (t.length > 155) t = `${t.slice(0, 152).replace(/\s+\S*$/, "")}.`;
  }
  if (t.length < 140) {
    const extra = " Call 303-761-1012 for an estimate.";
    if (t.length + extra.length <= 160) t = `${t.replace(/\.$/, "")}.${extra}`.trim();
  }
  return t;
}

function writeDoc(rel, data, body) {
  const file = path.join(CONTENT, rel);
  ensureDir(path.dirname(file));
  const cleaned = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null || v === "") continue;
    cleaned[k] = v;
  }
  fs.writeFileSync(file, matter.stringify(`${body.trim()}\n`, cleaned));
}

function yoast(item) {
  return item.yoast_head_json || {};
}

async function downloadImages() {
  ensureDir(IMAGE_DIR);
  const entries = [...imageJobs.entries()];
  console.log(`Downloading ${entries.length} images…`);
  let done = 0;
  let failed = 0;
  const queue = entries.slice();
  async function worker() {
    for (;;) {
      const job = queue.shift();
      if (!job) return;
      const [local, url] = job;
      const dest = path.join(ROOT, "public", local);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
        done += 1;
        continue;
      }
      try {
        const res = await fetch(url, { headers: { "user-agent": UA } });
        if (!res.ok) throw new Error(String(res.status));
        const buf = Buffer.from(await res.arrayBuffer());
        ensureDir(path.dirname(dest));
        if (local.endsWith(".svg")) {
          fs.writeFileSync(dest, buf);
        } else {
          await sharp(buf, { failOn: "none", animated: false })
            .rotate()
            .resize({ width: 1800, withoutEnlargement: true })
            .webp({ quality: 78 })
            .toFile(dest);
        }
      } catch (err) {
        failed += 1;
        console.error(`\n  image fail ${url}: ${err.message}`);
      }
      done += 1;
      if (done % 25 === 0) process.stdout.write(`\r  images ${done}/${entries.length}`);
    }
  }
  await Promise.all(Array.from({ length: 6 }, () => worker()));
  process.stdout.write("\n");
  console.log(`Images saved. failed=${failed}`);
}

async function downloadBrand() {
  ensureDir(BRAND_DIR);
  const files = [
    ["https://truefinishing.com/wp-content/uploads/2024/09/true-logo-black.svg", "true-logo-black.svg"],
    ["https://truefinishing.com/wp-content/uploads/2024/10/true_logo_white.svg", "true-logo-white.svg"],
  ];
  for (const [url, name] of files) {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) throw new Error(`logo ${res.status} ${url}`);
    fs.writeFileSync(path.join(BRAND_DIR, name), Buffer.from(await res.arrayBuffer()));
  }
}

function loadScheduled() {
  if (!fs.existsSync(INVENTORY)) {
    console.warn("Inventory JSON not found; scheduled posts will be skipped.");
    return [];
  }
  const data = JSON.parse(fs.readFileSync(INVENTORY, "utf8"));
  return data.urls.filter((u) => u.type === "post_scheduled");
}

async function main() {
  console.log("Fetching WordPress content…");
  const [posts, pages, studies, categories] = await Promise.all([
    fetchAll(`${SITE}/wp-json/wp/v2/posts`),
    fetchAll(`${SITE}/wp-json/wp/v2/pages`),
    fetchAll(`${SITE}/wp-json/wp/v2/case-study`),
    fetchAll(`${SITE}/wp-json/wp/v2/categories`),
  ]);

  const catById = new Map(categories.map((c) => [c.id, c]));
  ensureDir(CONTENT);
  fs.writeFileSync(
    path.join(CONTENT, "categories.json"),
    JSON.stringify(
      categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: decode(c.name),
        count: c.count,
        description: stripTags(c.description || ""),
      })),
      null,
      2,
    ),
  );

  const counts = { posts: 0, pages: 0, caseStudies: 0, scheduled: 0 };

  for (const item of pages) {
    const docPath = pathFromLink(item.link);
    const kind = classifyPage(docPath);
    const y = yoast(item);
    const title = decode(y.title || item.title?.rendered || "");
    const body = htmlToMarkdown(item.content?.rendered || "");
    const plain = stripTags(item.content?.rendered || "");
    const description = y.description
      ? decode(y.description)
      : descriptionFrom(plain, title);
    const h1Source = decode(item.title?.rendered || title);
    writeDoc(
      kind.file,
      {
        type: kind.type,
        title,
        description,
        h1: kind.type === "home" ? "" : h1Source,
        path: docPath,
        publishDate: isoWithOffset(item.date, item.date_gmt),
        updated: isoWithOffset(item.modified, item.modified_gmt),
        hero: queueImage((y.og_image && y.og_image[0] && y.og_image[0].url) || "") || firstImage(body),
        noindex: docPath === "/thank-you-for-contacting-us/" ? true : undefined,
        wpId: item.id,
      },
      body || plain,
    );
    counts.pages += 1;
  }

  for (const item of studies) {
    const docPath = pathFromLink(item.link);
    const slug = item.slug;
    const y = yoast(item);
    const title = decode(y.title || item.title?.rendered || "");
    const body = htmlToMarkdown(item.content?.rendered || "");
    const plain = stripTags(item.excerpt?.rendered || item.content?.rendered || "");
    writeDoc(
      `case-studies/${slug}.md`,
      {
        type: "case_study",
        title,
        description: y.description ? decode(y.description) : descriptionFrom(plain, title),
        h1: decode(item.title?.rendered || title),
        path: docPath,
        publishDate: isoWithOffset(item.date, item.date_gmt),
        updated: isoWithOffset(item.modified, item.modified_gmt),
        hero: queueImage((y.og_image && y.og_image[0] && y.og_image[0].url) || "") || firstImage(body),
        wpId: item.id,
      },
      body,
    );
    counts.caseStudies += 1;
  }

  for (const item of posts) {
    const docPath = pathFromLink(item.link);
    const parts = docPath.split("/").filter(Boolean);
    const categorySlug = parts.length > 1 ? parts[0] : "uncategorized";
    const slug = item.slug;
    const y = yoast(item);
    const title = decode(y.title || item.title?.rendered || "");
    const body = htmlToMarkdown(item.content?.rendered || "");
    const excerpt = stripTags(item.excerpt?.rendered || "");
    const cat = catById.get(item.categories?.[0]);
    writeDoc(
      `posts/${categorySlug}/${slug}.md`,
      {
        type: "post",
        title,
        description: y.description ? decode(y.description) : descriptionFrom(excerpt || stripTags(item.content?.rendered || ""), title),
        h1: decode(item.title?.rendered || ""),
        path: docPath,
        category: cat?.slug || categorySlug,
        publishDate: isoWithOffset(item.date, item.date_gmt),
        updated: isoWithOffset(item.modified, item.modified_gmt),
        hero: queueImage((y.og_image && y.og_image[0] && y.og_image[0].url) || "") || firstImage(body),
        wpId: item.id,
        author: "True Finishing",
      },
      body,
    );
    counts.posts += 1;
  }

  for (const item of loadScheduled()) {
    const categoryName = item.category || "Uncategorized";
    const category = CATEGORY_SLUGS[categoryName] || categoryName.toLowerCase().replace(/\s+/g, "-");
    const raw = String(item.url || "");
    const slug = raw.split("/").filter(Boolean).pop();
    if (!slug) continue;
    const docPath = `/${category}/${slug}/`;
    const title = item.title || slug;
    const description = item.meta_description || descriptionFrom("", title);
    const body = [
      item.meta_description || "",
      "",
      "<!-- TODO(Jenny): full article body was not migrated.",
      "WordPress does not expose future/scheduled posts on the public REST API",
      "(status=future returns 401), and the source file",
      "/workspace/truefinishing/november/posts.json was not in this environment.",
      "Paste the scheduled post body here before the publish date.",
      "This file stays unpublished (incomplete: true) until that TODO is removed",
      "and incomplete is set to false. -->",
    ].join("\n");
    writeDoc(
      `posts/${category}/${slug}.md`,
      {
        type: "post",
        title: title.includes("True Finishing") ? title : `${title} | True Finishing`,
        description,
        h1: title,
        path: docPath,
        category,
        publishDate: item.published,
        hero: "",
        author: "True Finishing",
        incomplete: true,
        scheduled: true,
      },
      body,
    );
    counts.scheduled += 1;
  }

  await downloadBrand();
  // Queue a few brand/client assets used by the homepage even if the converter missed them.
  [
    "https://truefinishing.com/wp-content/uploads/2024/10/tile-carpet-floor-finishings-floor-prep-case-016.jpg",
    "https://truefinishing.com/wp-content/uploads/2024/10/floor-finishing-microtoppings-case-001.jpeg",
    "https://truefinishing.com/wp-content/uploads/2024/09/home-true-best-epoxy-finishing.jpg",
    "https://truefinishing.com/wp-content/uploads/2024/09/home-true-gorgeous-concrete-polishing-denver.png",
    "https://truefinishing.com/wp-content/uploads/2024/09/flooring-with-shadows-artistic.png",
    "https://truefinishing.com/wp-content/uploads/2024/09/chick-fil-a-logo-png-transparent-1.png",
    "https://truefinishing.com/wp-content/uploads/2024/09/Denver_International_Airport_Logo.svg-1.png",
    "https://truefinishing.com/wp-content/uploads/2024/09/denver-museum-of-nature-and-science-logo.png",
    "https://truefinishing.com/wp-content/uploads/2024/09/GE-Johnson-Holding-Company-Logo_black-1.png",
    "https://truefinishing.com/wp-content/uploads/2024/09/lockheed-martin-logo-black-and-white-1.png",
    "https://truefinishing.com/wp-content/uploads/2024/09/nrel-logo-footer-2.png",
    "https://truefinishing.com/wp-content/uploads/2024/10/ContactTop.jpg",
    "https://truefinishing.com/wp-content/uploads/2024/10/Moisture1-1024x768.jpg",
    "https://truefinishing.com/wp-content/uploads/2024/09/true-finishing-floor-preparation-sample-1024x768.jpg",
    "https://truefinishing.com/wp-content/uploads/2024/10/floor-leveling-true-finishing-colorado-floor-company-001.jpg",
  ].forEach((url) => queueImage(url));

  await downloadImages();

  fs.writeFileSync(
    path.join(CONTENT, "migration-counts.json"),
    JSON.stringify({ ...counts, images: imageJobs.size, generated: new Date().toISOString() }, null, 2),
  );
  console.log(counts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
