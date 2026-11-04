import type { Metadata } from "next";
import type { Doc, Faq } from "./types";
import { BUSINESS, LOGO, SITE_URL } from "./site";

export function absolute(docPath: string): string {
  if (docPath.startsWith("http")) return docPath;
  return new URL(docPath, SITE_URL).toString();
}

export function stripMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const image = input.image || LOGO.header;
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    robots: input.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.path,
      siteName: BUSINESS.shortName,
      type: input.type || "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}

export function docMetadata(doc: Doc): Metadata {
  return pageMetadata({
    title: doc.title,
    description: doc.description,
    path: doc.path,
    image: doc.hero,
    noindex: doc.noindex,
    type: doc.type === "post" ? "article" : "website",
  });
}

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    url: `${SITE_URL}/`,
    telephone: "+1-303-761-1012",
    email: BUSINESS.email,
    image: absolute(LOGO.header),
    logo: absolute(LOGO.header),
    foundingDate: BUSINESS.foundingYear,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postal,
      addressCountry: "US",
    },
    areaServed: [
      "Denver",
      "Aurora",
      "Lakewood",
      "Boulder",
      "Fort Collins",
      "Colorado Springs",
      "Colorado Front Range",
    ],
    // TODO(Jenny): add openingHours and sameAs (Google Business Profile, BBB, Yelp, Houzz) when confirmed.
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function faqSchema(faq: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: stripMarkdown(item.a) },
    })),
  };
}

export function serviceSchema(doc: Doc, areaName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: doc.h1,
    description: doc.description,
    url: absolute(doc.path),
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: {
      "@type": areaName ? "City" : "AdministrativeArea",
      name: areaName || "Denver, Colorado",
    },
  };
}

export function blogPostingSchema(doc: Doc) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: doc.h1,
    description: doc.description,
    datePublished: doc.publishDate,
    dateModified: doc.updated || doc.publishDate,
    author: { "@type": "Organization", name: doc.author || BUSINESS.shortName },
    publisher: { "@id": `${SITE_URL}/#business` },
    image: doc.hero ? absolute(doc.hero) : absolute(LOGO.header),
    mainEntityOfPage: absolute(doc.path),
  };
}

export function caseStudySchema(doc: Doc) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.h1,
    description: doc.description,
    datePublished: doc.publishDate,
    dateModified: doc.updated || doc.publishDate,
    author: { "@id": `${SITE_URL}/#business` },
    image: doc.hero ? absolute(doc.hero) : undefined,
    mainEntityOfPage: absolute(doc.path),
  };
}
