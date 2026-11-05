import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Article } from "@/components/Article";
import { EstimateForm } from "@/components/EstimateForm";
import { Pager, PostList } from "@/components/PostList";
import { getAllDocs, getDoc, livePosts, pageCount, postsInCategory, slicePage } from "@/lib/content";
import { isLive } from "@/lib/publish";
import { docMetadata, pageMetadata } from "@/lib/seo";
import { CATEGORY_META, POSTS_PER_PAGE } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { slug: string[] };

function joinPath(slug: string[]): string {
  return `/${slug.join("/")}/`;
}

export function generateStaticParams() {
  const params: { slug: string[] }[] = [];
  for (const doc of getAllDocs()) {
    if (!isLive(doc) || doc.path === "/") continue;
    params.push({ slug: doc.path.split("/").filter(Boolean) });
  }
  const posts = livePosts();
  const blogPages = pageCount(posts.length);
  for (let page = 2; page <= blogPages; page += 1) {
    params.push({ slug: ["blog", "page", String(page)] });
  }
  const categories = new Set(posts.map((post) => post.category).filter(Boolean) as string[]);
  for (const category of categories) {
    params.push({ slug: ["category", category] });
    const pages = pageCount(postsInCategory(category).length);
    for (let page = 2; page <= pages; page += 1) {
      params.push({ slug: ["category", category, "page", String(page)] });
    }
  }
  return params;
}

function listingMeta(title: string, description: string, path: string, page: number, pages: number): Metadata {
  const pagedTitle = page > 1 ? `${title.replace(/ \| True Finishing$/, "")} – Page ${page} of ${pages} | True Finishing` : title;
  const meta = pageMetadata({ title: pagedTitle, description, path });
  const prev = page > 1 ? (page === 2 ? path.replace(/page\/\d+\/$/, "") : path.replace(/page\/\d+\/$/, `page/${page - 1}/`)) : undefined;
  const next = page < pages ? `${path.replace(/page\/\d+\/$/, "")}page/${page + 1}/` : undefined;
  return {
    ...meta,
    pagination: { previous: prev, next },
  };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const listing = resolveListing(slug);
  if (listing) {
    return listingMeta(listing.title, listing.description, listing.path, listing.page, listing.pages);
  }
  const doc = getDoc(joinPath(slug));
  if (!doc || !isLive(doc)) return { title: "Not found" };
  return docMetadata(doc);
}

type Listing = {
  kind: "blog" | "category";
  title: string;
  description: string;
  h1: string;
  path: string;
  page: number;
  pages: number;
  posts: ReturnType<typeof livePosts>;
  intro?: string;
};

function resolveListing(slug: string[]): Listing | null {
  if (slug[0] === "blog" && (slug.length === 1 || (slug[1] === "page" && slug.length === 3))) {
    const page = slug.length === 1 ? 1 : Number(slug[2]);
    if (!Number.isInteger(page) || page < 1) return null;
    const posts = livePosts();
    const pages = pageCount(posts.length);
    if (page > pages) return null;
    const doc = getDoc("/blog/");
    return {
      kind: "blog",
      title: doc?.title || "Concrete Flooring Blog | True Finishing Denver",
      description: doc?.description || "Flooring articles from True Finishing in Denver.",
      h1: doc?.h1 || "Blog",
      path: page === 1 ? "/blog/" : `/blog/page/${page}/`,
      page,
      pages,
      posts: slicePage(posts, page),
      intro: doc?.body,
    };
  }
  if (slug[0] === "category" && (slug.length === 2 || (slug.length === 4 && slug[2] === "page"))) {
    const category = slug[1];
    const meta = CATEGORY_META[category];
    if (!meta) return null;
    const page = slug.length === 2 ? 1 : Number(slug[3]);
    if (!Number.isInteger(page) || page < 1) return null;
    const posts = postsInCategory(category);
    if (!posts.length) return null;
    const pages = pageCount(posts.length);
    if (page > pages) return null;
    return {
      kind: "category",
      title: meta.title,
      description: meta.description,
      h1: meta.h1,
      path: page === 1 ? `/category/${category}/` : `/category/${category}/page/${page}/`,
      page,
      pages,
      posts: slicePage(posts, page),
    };
  }
  return null;
}

export default async function CatchAllPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (slug[0] === "blog" && slug[1] === "page" && slug[2] === "1") permanentRedirect("/blog/");
  if (slug[0] === "category" && slug[2] === "page" && slug[3] === "1") permanentRedirect(`/category/${slug[1]}/`);

  const listing = resolveListing(slug);
  if (listing) {
    const base = listing.kind === "blog" ? "/blog/" : `/category/${slug[1]}/`;
    const intro =
      listing.page === 1 && listing.intro
        ? listing.intro
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/^#+\s+/gm, "")
            .replace(/\s+/g, " ")
            .trim()
        : listing.description;
    return (
      <>
        <section className="bg-ink text-white">
          <div className="mx-auto max-w-[1120px] px-4 py-12 md:py-16">
            <h1 className="max-w-[14ch] text-5xl font-semibold leading-[0.92] tracking-tight md:text-7xl">{listing.h1}</h1>
            <p className="mt-4 max-w-[62ch] text-lg text-white/90">{intro}</p>
          </div>
        </section>
        <section className="mark py-12">
          <div className="mx-auto max-w-[1120px] px-4">
          <PostList posts={listing.posts} />
          <Pager base={base} page={listing.page} pages={listing.pages} />
          <p className="mt-8 text-sm text-muted">{POSTS_PER_PAGE} articles per page, newest first.</p>
          </div>
        </section>
        {listing.kind === "blog" && listing.page === 1 ? <EstimateForm /> : null}
      </>
    );
  }

  const doc = getDoc(joinPath(slug));
  if (!doc || !isLive(doc)) notFound();
  if (doc.path === "/blog/") {
    const posts = livePosts();
    return (
      <section className="mx-auto max-w-[720px] px-4 py-12">
        <h1 className="text-4xl font-semibold">{doc.h1 || "Blog"}</h1>
        <p className="mt-4">{doc.description}</p>
        <div className="mt-8">
          <PostList posts={slicePage(posts, 1)} />
          <Pager base="/blog/" page={1} pages={pageCount(posts.length)} />
        </div>
      </section>
    );
  }
  return <Article doc={doc} />;
}
