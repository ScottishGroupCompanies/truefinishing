import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CONTENT = path.join(ROOT, "content");

const hour = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Denver",
  hour: "numeric",
  hourCycle: "h23",
}).format(new Date("2026-11-05T17:00:00Z"));
assert.equal(hour, "10");
assert.ok(Date.parse("2026-11-05T10:00:00-07:00") > Date.parse("2026-11-04T12:00:00-07:00"));

function walk(dir) {
  return fs.readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) return walk(full);
    return name.endsWith(".md") ? [full] : [];
  });
}

const docs = walk(CONTENT).map((file) => {
  const parsed = matter(fs.readFileSync(file, "utf8"));
  return { file, data: parsed.data, body: parsed.content };
});

const errors = [];
const paths = new Set(docs.map((doc) => doc.data.path));
const titles = new Map();
const descriptions = new Map();

for (const doc of docs) {
  const { title, description, h1, path: docPath, type } = doc.data;
  const label = doc.file.replace(ROOT + "/", "");
  if (!title) errors.push(`${label} missing title`);
  if (!description) errors.push(`${label} missing description`);
  if (!h1) errors.push(`${label} missing h1`);
  if (!docPath) errors.push(`${label} missing path`);
  if (title) {
    if (titles.has(title)) errors.push(`duplicate title: ${title}`);
    titles.set(title, label);
  }
  if (description) {
    if (descriptions.has(description)) errors.push(`duplicate description on ${label}`);
    descriptions.set(description, label);
  }
  if (type === "post" && doc.data.incomplete !== true && !doc.data.publishDate) {
    errors.push(`${label} post missing publishDate`);
  }
  if (/^# /m.test(doc.body)) errors.push(`${label} has an H1 in the body`);
}

const allowed = new Set([
  ...paths,
  "/",
  "/blog/",
  "/feed/",
  "/contact/",
  "/about/",
  "/privacy-policy/",
  "/case-studies/",
  "/cities-we-serve/",
  "/floor-preparation/",
  "/floor-restoration/",
  "/floor-finishings/",
]);
for (const doc of docs) {
  if (doc.data.category) allowed.add(`/category/${doc.data.category}/`);
}

const broken = new Set([
  "/epoxy-floors/",
  "/garage-floors/",
  "/garage-coatings/",
  "/metallic-floors/",
  "/polyaspartic-floors/",
  "/basement-floors/",
  "/commercial-floors/",
  "/concrete-coatings/",
  "/lakewood/",
  "/parker/",
  "/wheat-ridge/",
  "/cities-we-serve/monument/",
  "/cities-we-serve/denver/",
  "/cities-we-serve/denver-co/",
]);

for (const doc of docs) {
  const links = doc.body.matchAll(/\]\((\/[^)\s]+)\)/g);
  for (const match of links) {
    const href = match[1].split("#")[0];
    const withSlash = href.endsWith("/") ? href : `${href}/`;
    if (broken.has(withSlash)) errors.push(`${doc.data.path} still links to ${withSlash}`);
    if (withSlash.startsWith("/images/") || withSlash.startsWith("/brand/")) continue;
    const base = withSlash.replace(/page\/\d+\/$/, "");
    if (allowed.has(withSlash) || allowed.has(base) || paths.has(withSlash)) continue;
    if (/^\/blog\/page\/\d+\/$/.test(withSlash)) continue;
    if (/^\/category\/[a-z0-9-]+\/(page\/\d+\/)?$/.test(withSlash)) continue;
    errors.push(`${doc.data.path} broken internal link ${withSlash}`);
  }
  const images = doc.body.matchAll(/\]\((\/images\/[^)\s]+)\)/g);
  for (const match of images) {
    const imagePath = path.join(ROOT, "public", match[1]);
    if (!fs.existsSync(imagePath)) errors.push(`missing image ${match[1]} from ${doc.data.path}`);
  }
}

const livePosts = docs.filter((doc) => doc.data.type === "post" && doc.data.incomplete !== true);
const scheduled = docs.filter((doc) => doc.data.incomplete === true);
if (livePosts.length < 230) errors.push(`expected about 232 posts, found ${livePosts.length}`);
if (scheduled.length < 18) errors.push(`expected 18 scheduled stubs, found ${scheduled.length}`);

if (errors.length) {
  console.error(errors.slice(0, 40).join("\n"));
  console.error(`\n${errors.length} content errors`);
  process.exit(1);
}
console.log(`validated ${docs.length} docs, ${livePosts.length} live posts, ${scheduled.length} scheduled stubs`);
