import Link from "next/link";
import { cities, relatedPosts, relatedServices } from "@/lib/content";
import { nearbyFor } from "@/lib/site";
import type { Doc } from "@/lib/types";
import { Reveal } from "./Reveal";

function Card({ href, title, kicker }: { href: string; title: string; kicker: string }) {
  return (
    <Link href={href} className="service-card block rounded-2xl bg-white p-5 text-ink no-underline shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{kicker}</p>
      <p className="mt-2 text-lg font-semibold">{title}</p>
    </Link>
  );
}

export function RelatedLinks({ doc }: { doc: Doc }) {
  const services = relatedServices(doc, doc.type === "post" ? 2 : 4);
  const posts = relatedPosts(doc, 3);
  const cityLinks =
    doc.type === "city"
      ? nearbyFor(doc.path)
          .map((href) => cities().find((city) => city.path === href))
          .filter((city): city is Doc => Boolean(city))
      : cities().slice(0, 4);

  return (
    <aside className="mark py-16">
      <div className="mx-auto max-w-[1120px] px-4">
        <Reveal>
          <h2 className="text-3xl font-semibold">Keep reading</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item, index) => (
            <Reveal key={item.path} delay={index * 40}>
              <Card href={item.path} title={item.h1} kicker="Service" />
            </Reveal>
          ))}
          {cityLinks.map((item, index) => (
            <Reveal key={item.path} delay={index * 40}>
              <Card href={item.path} title={item.h1} kicker={doc.type === "city" ? "Nearby city" : "City"} />
            </Reveal>
          ))}
          {posts.map((item, index) => (
            <Reveal key={item.path} delay={index * 40}>
              <Card href={item.path} title={item.h1} kicker="From the blog" />
            </Reveal>
          ))}
        </div>
      </div>
    </aside>
  );
}
