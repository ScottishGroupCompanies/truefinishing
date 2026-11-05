import Image from "next/image";
import Link from "next/link";
import type { Doc } from "@/lib/types";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function PostList({ posts }: { posts: Doc[] }) {
  if (!posts.length) {
    return <p className="text-muted">No articles are published in this section yet.</p>;
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.path}>
          <Link href={post.path} className="service-card flex h-full flex-col overflow-hidden rounded-2xl bg-white text-ink no-underline shadow-sm">
            {post.hero ? (
              <div className="relative aspect-[16/10]">
                <Image src={post.hero} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
            ) : (
              <div className="h-2 bg-amber" />
            )}
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs uppercase tracking-wide text-muted">{formatDate(post.publishDate)}</p>
              <h2 className="mt-2 text-xl font-semibold">{post.h1}</h2>
              <p className="mt-2 text-sm text-ink/80">{post.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Pager({ base, page, pages }: { base: string; page: number; pages: number }) {
  if (pages < 2) return null;
  const href = (n: number) => (n <= 1 ? base : `${base}page/${n}/`);
  return (
    <nav className="mt-10 flex items-center justify-between text-sm" aria-label="Pagination">
      {page > 1 ? <Link href={href(page - 1)} className="btn">Previous</Link> : <span />}
      <span>
        Page {page} of {pages}
      </span>
      {page < pages ? <Link href={href(page + 1)} className="btn">Next</Link> : <span />}
    </nav>
  );
}
