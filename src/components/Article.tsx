import Image from "next/image";
import Link from "next/link";
import { FaqList } from "./FaqList";
import { JsonLd } from "./JsonLd";
import { MarkdownBody } from "./MarkdownBody";
import { RelatedLinks } from "./RelatedLinks";
import { EstimateForm } from "./EstimateForm";
import type { Doc } from "@/lib/types";
import { blogPostingSchema, breadcrumbSchema, caseStudySchema, faqSchema, serviceSchema } from "@/lib/seo";

function crumbs(doc: Doc): { name: string; path: string }[] {
  const home = { name: "Home", path: "/" };
  if (doc.type === "service" || doc.type === "service_hub") {
    if (doc.path.startsWith("/floor-restoration/") && doc.path !== "/floor-restoration/") {
      return [home, { name: "Floor Restoration", path: "/floor-restoration/" }, { name: doc.h1, path: doc.path }];
    }
    if (doc.path.startsWith("/floor-finishings/") && doc.path !== "/floor-finishings/") {
      return [home, { name: "Floor Finishes", path: "/floor-finishings/" }, { name: doc.h1, path: doc.path }];
    }
    return [home, { name: doc.h1, path: doc.path }];
  }
  if (doc.type === "city" || doc.type === "city_hub") {
    if (doc.type === "city_hub") return [home, { name: doc.h1, path: doc.path }];
    return [home, { name: "Cities We Serve", path: "/cities-we-serve/" }, { name: doc.h1, path: doc.path }];
  }
  if (doc.type === "case_study" || doc.type === "case_hub") {
    if (doc.type === "case_hub") return [home, { name: doc.h1, path: doc.path }];
    return [home, { name: "Case Studies", path: "/case-studies/" }, { name: doc.h1, path: doc.path }];
  }
  if (doc.type === "post") {
    const category = doc.category || "uncategorized";
    return [
      home,
      { name: "Blog", path: "/blog/" },
      { name: category.replace(/-/g, " "), path: `/category/${category}/` },
      { name: doc.h1, path: doc.path },
    ];
  }
  if (doc.type === "blog_hub") return [home, { name: "Blog", path: "/blog/" }];
  return [home, { name: doc.h1, path: doc.path }];
}

function visibleBody(doc: Doc): string {
  let body = doc.body;
  if (doc.hero) {
    const hero = doc.hero.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(new RegExp(`^!\\[[^\\]]*\\]\\(${hero}\\)\\s*`), "");
  }
  if (doc.h1) {
    const heading = doc.h1.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(new RegExp(`^##\\s+${heading}\\s*`, "i"), "");
  }
  return body.trim();
}

function showForm(doc: Doc): boolean {
  if (doc.noindex) return false;
  if (doc.type === "post") return false;
  return true;
}

export function Article({ doc }: { doc: Doc }) {
  const trail = crumbs(doc);
  const schema: unknown[] = [breadcrumbSchema(trail)];
  if (doc.type === "service" || doc.type === "service_hub") schema.push(serviceSchema(doc));
  if (doc.type === "city") schema.push(serviceSchema(doc, doc.h1.replace(/ Concrete Floor Finishing$/, "")));
  if (doc.type === "post") schema.push(blogPostingSchema(doc));
  if (doc.type === "case_study") schema.push(caseStudySchema(doc));
  if (doc.faq?.length) schema.push(faqSchema(doc.faq));

  return (
    <>
      <article>
        <nav className="mx-auto max-w-[1120px] px-4 pt-4 text-sm text-muted" aria-label="Breadcrumb">
          {trail.map((item, index) => (
            <span key={item.path}>
              {index > 0 ? <span className="px-1">/</span> : null}
              {index === trail.length - 1 ? <span>{item.name}</span> : <a href={item.path}>{item.name}</a>}
            </span>
          ))}
        </nav>
        <header className="relative mt-4 min-h-[280px] bg-ink text-white">
          {doc.hero ? (
            <Image
              src={doc.hero}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
          ) : null}
          <div className="relative mx-auto flex min-h-[280px] max-w-[1120px] flex-col justify-end px-4 py-10">
            <h1 className="max-w-[18ch] text-4xl font-semibold leading-tight md:text-5xl">{doc.h1}</h1>
            {doc.directAnswer ? (
              <p className="mt-4 max-w-[68ch] text-base text-white/95 md:text-lg">
                <span className="mr-2 rounded-full bg-amber px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-ink">
                  Quick answer
                </span>
                {doc.directAnswer}
              </p>
            ) : null}
          </div>
        </header>
        <div className="mx-auto max-w-[720px] px-4 py-8">
          <MarkdownBody source={visibleBody(doc)} />
        </div>
        {doc.faq?.length ? <FaqList items={doc.faq} /> : null}
        <RelatedLinks doc={doc} />
      </article>
      {showForm(doc) ? <EstimateForm /> : (
        <p className="mx-auto max-w-[720px] px-4 pb-12">
          <Link href="/contact/#contact" className="btn">
            Get a Free Estimate
          </Link>
        </p>
      )}
      <JsonLd data={schema} />
    </>
  );
}
