import Link from "next/link";
import { FaqList } from "./FaqList";
import { FlowSections } from "./FlowSections";
import { HeroMedia } from "./HeroMedia";
import { JsonLd } from "./JsonLd";
import { MarkdownBody } from "./MarkdownBody";
import { RelatedLinks } from "./RelatedLinks";
import { EstimateForm } from "./EstimateForm";
import { Reveal } from "./Reveal";
import { StickyCta } from "./StickyCta";
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

function marketingPage(doc: Doc): boolean {
  return doc.type !== "post";
}

export function Article({ doc }: { doc: Doc }) {
  const trail = crumbs(doc);
  const schema: unknown[] = [breadcrumbSchema(trail)];
  if (doc.type === "service" || doc.type === "service_hub") schema.push(serviceSchema(doc));
  if (doc.type === "city") schema.push(serviceSchema(doc, doc.h1.replace(/ Concrete Floor Finishing$/, "")));
  if (doc.type === "post") schema.push(blogPostingSchema(doc));
  if (doc.type === "case_study") schema.push(caseStudySchema(doc));
  if (doc.faq?.length) schema.push(faqSchema(doc.faq));

  const marketing = marketingPage(doc);

  return (
    <>
      <article className={marketing ? "pb-20" : ""}>
        <header className="relative isolate flex min-h-[78vh] items-end overflow-hidden bg-ink text-white">
          {doc.hero ? <HeroMedia src={doc.hero} /> : null}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/25" />
          <div className="relative mx-auto w-full max-w-[1120px] px-4 py-16 md:py-24">
            <nav className="text-sm text-white/80" aria-label="Breadcrumb">
              {trail.map((item, index) => (
                <span key={item.path}>
                  {index > 0 ? <span className="px-1">/</span> : null}
                  {index === trail.length - 1 ? (
                    <span>{item.name}</span>
                  ) : (
                    <Link href={item.path} className="text-white hover:text-amber">
                      {item.name}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
            <h1 className="mt-4 max-w-[16ch] text-4xl font-semibold leading-tight md:text-6xl">{doc.h1}</h1>
            {doc.directAnswer ? (
              <p className="mt-5 max-w-[62ch] text-base text-white md:text-lg">
                <span className="mr-2 inline-block rounded-full bg-amber px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-ink">
                  Quick answer
                </span>
                {doc.directAnswer}
              </p>
            ) : null}
          </div>
        </header>
        {marketing ? (
          <FlowSections source={visibleBody(doc)} />
        ) : (
          <div className="mx-auto max-w-[760px] px-4 py-12">
            <MarkdownBody source={visibleBody(doc)} />
          </div>
        )}
        {doc.faq?.length ? (
          <div className="bg-white">
            <Reveal>
              <FaqList items={doc.faq} />
            </Reveal>
          </div>
        ) : null}
        <RelatedLinks doc={doc} />
      </article>
      {showForm(doc) ? (
        <EstimateForm />
      ) : (
        <section className="bg-amber">
          <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-4 py-10">
            <h2 className="text-2xl font-semibold text-ink">Get a Free Estimate</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact/#contact" className="btn btn-ink">
                Get a Free Estimate
              </Link>
              <a href="tel:303-761-1012" className="btn bg-white">
                Call 303-761-1012
              </a>
            </div>
          </div>
        </section>
      )}
      {marketing ? <StickyCta /> : null}
      <JsonLd data={schema} />
    </>
  );
}
