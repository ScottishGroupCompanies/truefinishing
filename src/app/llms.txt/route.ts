import { liveDocs } from "@/lib/content";
import { BUSINESS, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export function GET() {
  const pages = liveDocs().filter((doc) => doc.type !== "post" && !doc.noindex);
  const lines = [
    `# ${BUSINESS.name}`,
    "",
    `> Denver concrete flooring contractor. Floor preparation, restoration, and finishings.`,
    "",
    `Address: ${BUSINESS.street}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postal}`,
    `Phone: ${BUSINESS.phone}`,
    `Email: ${BUSINESS.email}`,
    "",
    "## Pages",
    ...pages.map((doc) => `- [${doc.h1 || doc.title}](${new URL(doc.path, SITE_URL)})`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
