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
    <ul className="divide-y divide-grey border-y border-grey">
      {posts.map((post) => (
        <li key={post.path} className="py-5">
          <p className="text-xs uppercase tracking-wide text-muted">{formatDate(post.publishDate)}</p>
          <h2 className="mt-1 text-2xl font-semibold">
            <a href={post.path}>{post.h1}</a>
          </h2>
          <p className="mt-2 text-ink/80">{post.description}</p>
        </li>
      ))}
    </ul>
  );
}

export function Pager({ base, page, pages }: { base: string; page: number; pages: number }) {
  if (pages < 2) return null;
  const href = (n: number) => (n <= 1 ? base : `${base}page/${n}/`);
  return (
    <nav className="mt-8 flex items-center justify-between text-sm" aria-label="Pagination">
      {page > 1 ? <a href={href(page - 1)}>Previous</a> : <span />}
      <span>
        Page {page} of {pages}
      </span>
      {page < pages ? <a href={href(page + 1)}>Next</a> : <span />}
    </nav>
  );
}
