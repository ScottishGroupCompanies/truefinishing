export type Faq = { q: string; a: string };

export type DocType =
  | "home"
  | "page"
  | "service"
  | "service_hub"
  | "city"
  | "city_hub"
  | "case_study"
  | "case_hub"
  | "blog_hub"
  | "post";

export type Doc = {
  type: DocType;
  title: string;
  description: string;
  h1: string;
  path: string;
  body: string;
  publishDate?: string;
  updated?: string;
  category?: string;
  hero?: string;
  faq?: Faq[];
  directAnswer?: string;
  noindex?: boolean;
  incomplete?: boolean;
  scheduled?: boolean;
  author?: string;
  wpId?: number;
  file: string;
};
