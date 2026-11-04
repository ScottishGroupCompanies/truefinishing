import type { Doc } from "./types";

/** A post is public only after its timestamp, and only if the body was actually imported. */
export function isLive(doc: Doc, now = Date.now()): boolean {
  if (doc.type !== "post") return true;
  if (doc.incomplete) return false;
  if (!doc.publishDate) return false;
  const at = Date.parse(doc.publishDate);
  if (Number.isNaN(at)) return false;
  return at <= now;
}

/** Hour in America/Denver, 0–23. Used by the publish cron. */
export function denverHour(now = new Date()): number {
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    hour: "numeric",
    hourCycle: "h23",
  }).format(now);
  return Number(hour);
}
