import { cities, relatedPosts, relatedServices } from "@/lib/content";
import { nearbyFor } from "@/lib/site";
import type { Doc } from "@/lib/types";

export function RelatedLinks({ doc }: { doc: Doc }) {
  const services = relatedServices(doc, doc.type === "post" ? 2 : 4);
  const posts = doc.type === "post" ? relatedPosts(doc, 3) : relatedPosts(doc, 3);
  const cityLinks =
    doc.type === "city"
      ? nearbyFor(doc.path)
          .map((href) => cities().find((city) => city.path === href))
          .filter((city): city is Doc => Boolean(city))
      : cities().slice(0, 4);

  return (
    <aside className="mx-auto max-w-[720px] px-4 py-8">
      <h2 className="text-2xl font-semibold">Keep reading</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Services</h3>
          <ul className="mt-2 space-y-1">
            {services.map((item) => (
              <li key={item.path}>
                <a href={item.path}>{item.h1}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            {doc.type === "city" ? "Nearby cities" : "Cities"}
          </h3>
          <ul className="mt-2 space-y-1">
            {cityLinks.map((item) => (
              <li key={item.path}>
                <a href={item.path}>{item.h1}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {posts.length ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">From the blog</h3>
          <ul className="mt-2 space-y-1">
            {posts.map((item) => (
              <li key={item.path}>
                <a href={item.path}>{item.h1}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
