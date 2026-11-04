export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://truefinishing.com";

export const BUSINESS = {
  name: "True Finishing, LLC",
  shortName: "True Finishing",
  phone: "303-761-1012",
  phoneHref: "tel:303-761-1012",
  email: "info@truefinishing.com",
  street: "2290 S Lipan St",
  city: "Denver",
  region: "CO",
  postal: "80223",
  // Homepage and the About page both say the company was established in 2007.
  // The same site also says "30 years" and "three decades". See README TODOs.
  foundingYear: "2007",
} as const;

export const POSTS_PER_PAGE = 10;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const NAV: NavItem[] = [
  { label: "Floor Preparation", href: "/floor-preparation/" },
  {
    label: "Floor Restoration",
    href: "/floor-restoration/",
    children: [
      { label: "Concrete Moisture Mitigation", href: "/floor-restoration/concrete-moisture-mitigation/" },
      { label: "Concrete Leveling", href: "/floor-restoration/concrete-leveling/" },
      { label: "Concrete Overlay", href: "/floor-restoration/concrete-overlay/" },
    ],
  },
  {
    label: "Floor Finishes",
    href: "/floor-finishings/",
    children: [
      { label: "Concrete Polishing", href: "/floor-finishings/concrete-polishing/" },
      { label: "Concrete Microtopping", href: "/floor-finishings/concrete-microtoppings/" },
      { label: "Epoxy", href: "/floor-finishings/epoxy-flooring/" },
      { label: "Vinyl", href: "/floor-finishings/vinyl-floor-finishing/" },
      { label: "Tile", href: "/floor-finishings/tile-floor-refinishing/" },
      { label: "Carpet", href: "/floor-finishings/carpet-floor-installation/" },
    ],
  },
  { label: "Case Studies", href: "/case-studies/" },
  { label: "Cities We Serve", href: "/cities-we-serve/" },
  { label: "Blog", href: "/blog/" },
];

export const SERVICE_LINKS = NAV.flatMap((item) =>
  item.children ? [{ label: item.label, href: item.href }, ...item.children] : [{ label: item.label, href: item.href }],
).filter((item) => item.href.startsWith("/floor"));

export const CATEGORY_META: Record<string, { name: string; title: string; description: string; h1: string }> = {
  uncategorized: {
    name: "Uncategorized",
    h1: "Uncategorized flooring articles",
    title: "Flooring Articles | True Finishing Denver",
    description:
      "Notes from True Finishing on epoxy, polished concrete, leveling, and floor prep in Denver and the Front Range. Browse the article archive.",
  },
  "denver-flooring": {
    name: "Denver Flooring",
    h1: "Denver flooring articles",
    title: "Denver Flooring Articles | True Finishing",
    description:
      "Denver flooring guides from True Finishing: epoxy, polished concrete, moisture, and floor prep for homes, garages, and commercial slabs.",
  },
  "epoxy-flooring": {
    name: "Epoxy Flooring",
    h1: "Epoxy flooring articles",
    title: "Epoxy Flooring Articles | True Finishing",
    description:
      "Epoxy flooring articles from True Finishing in Denver: cost, lifespan, garages, metallic systems, and how Colorado slabs should be prepped.",
  },
  "colorado-springs-flooring": {
    name: "Colorado Springs Flooring",
    h1: "Colorado Springs flooring articles",
    title: "Colorado Springs Flooring Guides | True Finishing",
    description:
      "Flooring guides for Colorado Springs from True Finishing, covering epoxy, prep, and concrete finishes along the southern Front Range.",
  },
  "commercial-flooring": {
    name: "Commercial Flooring",
    h1: "Commercial flooring articles",
    title: "Commercial Flooring Articles | True Finishing",
    description:
      "Commercial flooring articles from True Finishing: epoxy systems, showrooms, kitchens, and concrete finishes for Colorado facilities.",
  },
  "concrete-leveling": {
    name: "Concrete Leveling",
    h1: "Concrete leveling articles",
    title: "Concrete Leveling Articles | True Finishing",
    description:
      "Self-leveling concrete guides from True Finishing in Denver: when a slab needs underlayment, what it costs, and how the pour is done.",
  },
  "floor-finishing": {
    name: "Floor Finishing",
    h1: "Floor finishing articles",
    title: "Floor Finishing Articles | True Finishing",
    description:
      "Floor finishing articles from True Finishing on polished concrete, coatings, sealers, and how Denver-area floors are maintained.",
  },
  "floor-prep": {
    name: "Floor Prep",
    h1: "Floor preparation articles",
    title: "Floor Prep Articles | True Finishing Denver",
    description:
      "Concrete floor preparation articles from True Finishing: grinding, surface profile, and why coatings and tile fail when prep is skipped.",
  },
  "floor-restoration": {
    name: "Floor Restoration",
    h1: "Floor restoration articles",
    title: "Floor Restoration Articles | True Finishing",
    description:
      "Floor restoration articles from True Finishing on overlays, leveling, and bringing worn Colorado concrete back into service.",
  },
  "polished-concrete": {
    name: "Polished Concrete",
    h1: "Polished concrete articles",
    title: "Polished Concrete Articles | True Finishing",
    description:
      "Polished concrete articles from True Finishing in Denver: cost per square foot, gloss levels, slip resistance, and where polishing fits.",
  },
  microtoppings: {
    name: "Microtoppings",
    h1: "Microtopping articles",
    title: "Microtopping Articles | True Finishing Denver",
    description:
      "Microtopping and microcement articles from True Finishing: where a thin cement finish works in Denver and how it differs from polish or epoxy.",
  },
  "moisture-mitigation": {
    name: "Moisture Mitigation",
    h1: "Moisture mitigation articles",
    title: "Concrete Moisture Articles | True Finishing",
    description:
      "Concrete moisture articles from True Finishing: vapor testing, mitigation coatings, and why Denver slabs need a check before floor coverings.",
  },
  "fort-collins-flooring": {
    name: "Fort Collins Flooring",
    h1: "Fort Collins flooring articles",
    title: "Fort Collins Flooring Articles | True Finishing",
    description:
      "Fort Collins flooring articles from True Finishing on epoxy, polished concrete, and floor prep for northern Colorado slabs.",
  },
};

export const NEARBY: Record<string, string[]> = {
  "/cities-we-serve/arvada-concrete-floor-finishing/": [
    "/cities-we-serve/westminster-concrete-floor-finishing/",
    "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/",
    "/cities-we-serve/lakewood-concrete-floor-finishing/",
  ],
  "/cities-we-serve/aspen-concrete-floor-finishing/": [
    "/cities-we-serve/glenwood-springs-concrete-floor-finishing/",
    "/cities-we-serve/vail-concrete-floor-finishing/",
    "/cities-we-serve/evergreen-concrete-floor-finishing/",
  ],
  "/cities-we-serve/aurora-concrete-floor-finishing/": [
    "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/",
    "/cities-we-serve/centennial-concrete-floor-finishing/",
    "/cities-we-serve/parker-concrete-floor-finishing/",
  ],
  "/cities-we-serve/boulder-concrete-floor-finishing/": [
    "/cities-we-serve/broomfield-concrete-floor-finishing/",
    "/cities-we-serve/longmont-concrete-floor-finishing/",
    "/cities-we-serve/westminster-concrete-floor-finishing/",
  ],
  "/cities-we-serve/broomfield-concrete-floor-finishing/": [
    "/cities-we-serve/boulder-concrete-floor-finishing/",
    "/cities-we-serve/westminster-concrete-floor-finishing/",
    "/cities-we-serve/thornton-concrete-floor-finishing/",
  ],
  "/cities-we-serve/castle-rock-concrete-floor-finishing/": [
    "/cities-we-serve/parker-concrete-floor-finishing/",
    "/cities-we-serve/centennial-concrete-floor-finishing/",
    "/cities-we-serve/littleton-concrete-floor-finishing/",
  ],
  "/cities-we-serve/centennial-concrete-floor-finishing/": [
    "/cities-we-serve/littleton-concrete-floor-finishing/",
    "/cities-we-serve/englewood-concrete-floor-finishing/",
    "/cities-we-serve/parker-concrete-floor-finishing/",
  ],
  "/cities-we-serve/colorado-springs-concrete-floor-finishing/": [
    "/cities-we-serve/pueblo-concrete-floor-finishing/",
    "/cities-we-serve/castle-rock-concrete-floor-finishing/",
    "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/",
  ],
  "/cities-we-serve/englewood-concrete-floor-finishing/": [
    "/cities-we-serve/littleton-concrete-floor-finishing/",
    "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/",
    "/cities-we-serve/lakewood-concrete-floor-finishing/",
  ],
  "/cities-we-serve/evergreen-concrete-floor-finishing/": [
    "/cities-we-serve/lakewood-concrete-floor-finishing/",
    "/cities-we-serve/vail-concrete-floor-finishing/",
    "/cities-we-serve/boulder-concrete-floor-finishing/",
  ],
  "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/": [
    "/cities-we-serve/aurora-concrete-floor-finishing/",
    "/cities-we-serve/lakewood-concrete-floor-finishing/",
    "/cities-we-serve/englewood-concrete-floor-finishing/",
  ],
  "/cities-we-serve/fort-collins-concrete-floor-finishing/": [
    "/cities-we-serve/loveland-concrete-floor-finishing/",
    "/cities-we-serve/greeley-concrete-floor-finishing/",
    "/cities-we-serve/longmont-concrete-floor-finishing/",
  ],
  "/cities-we-serve/glenwood-springs-concrete-floor-finishing/": [
    "/cities-we-serve/aspen-concrete-floor-finishing/",
    "/cities-we-serve/vail-concrete-floor-finishing/",
    "/cities-we-serve/evergreen-concrete-floor-finishing/",
  ],
  "/cities-we-serve/greeley-concrete-floor-finishing/": [
    "/cities-we-serve/fort-collins-concrete-floor-finishing/",
    "/cities-we-serve/loveland-concrete-floor-finishing/",
    "/cities-we-serve/thornton-concrete-floor-finishing/",
  ],
  "/cities-we-serve/lakewood-concrete-floor-finishing/": [
    "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/",
    "/cities-we-serve/englewood-concrete-floor-finishing/",
    "/cities-we-serve/arvada-concrete-floor-finishing/",
  ],
  "/cities-we-serve/littleton-concrete-floor-finishing/": [
    "/cities-we-serve/englewood-concrete-floor-finishing/",
    "/cities-we-serve/centennial-concrete-floor-finishing/",
    "/cities-we-serve/castle-rock-concrete-floor-finishing/",
  ],
  "/cities-we-serve/longmont-concrete-floor-finishing/": [
    "/cities-we-serve/boulder-concrete-floor-finishing/",
    "/cities-we-serve/loveland-concrete-floor-finishing/",
    "/cities-we-serve/broomfield-concrete-floor-finishing/",
  ],
  "/cities-we-serve/loveland-concrete-floor-finishing/": [
    "/cities-we-serve/fort-collins-concrete-floor-finishing/",
    "/cities-we-serve/longmont-concrete-floor-finishing/",
    "/cities-we-serve/greeley-concrete-floor-finishing/",
  ],
  "/cities-we-serve/parker-concrete-floor-finishing/": [
    "/cities-we-serve/centennial-concrete-floor-finishing/",
    "/cities-we-serve/castle-rock-concrete-floor-finishing/",
    "/cities-we-serve/aurora-concrete-floor-finishing/",
  ],
  "/cities-we-serve/pueblo-concrete-floor-finishing/": [
    "/cities-we-serve/colorado-springs-concrete-floor-finishing/",
    "/cities-we-serve/castle-rock-concrete-floor-finishing/",
    "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/",
  ],
  "/cities-we-serve/thornton-concrete-floor-finishing/": [
    "/cities-we-serve/westminster-concrete-floor-finishing/",
    "/cities-we-serve/broomfield-concrete-floor-finishing/",
    "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/",
  ],
  "/cities-we-serve/vail-concrete-floor-finishing/": [
    "/cities-we-serve/glenwood-springs-concrete-floor-finishing/",
    "/cities-we-serve/aspen-concrete-floor-finishing/",
    "/cities-we-serve/evergreen-concrete-floor-finishing/",
  ],
  "/cities-we-serve/westminster-concrete-floor-finishing/": [
    "/cities-we-serve/arvada-concrete-floor-finishing/",
    "/cities-we-serve/broomfield-concrete-floor-finishing/",
    "/cities-we-serve/thornton-concrete-floor-finishing/",
  ],
};

export function nearbyFor(path: string): string[] {
  if (NEARBY[path]) return NEARBY[path];
  const all = [
    "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/",
    "/cities-we-serve/boulder-concrete-floor-finishing/",
    "/cities-we-serve/aurora-concrete-floor-finishing/",
    "/cities-we-serve/lakewood-concrete-floor-finishing/",
    "/cities-we-serve/fort-collins-concrete-floor-finishing/",
    "/cities-we-serve/colorado-springs-concrete-floor-finishing/",
  ];
  return all.filter((href) => href !== path).slice(0, 3);
}

export const CLIENTS = [
  { src: "/images/chick-fil-a-logo-png-transparent-1.webp", alt: "Chick-fil-A logo" },
  { src: "/images/denver_international_airport_logo.svg-1.webp", alt: "Denver International Airport logo" },
  { src: "/images/denver-museum-of-nature-and-science-logo.webp", alt: "Denver Museum of Nature and Science logo" },
  { src: "/images/ge-johnson-holding-company-logo_black-1.webp", alt: "GE Johnson logo" },
  { src: "/images/lockheed-martin-logo-black-and-white-1.webp", alt: "Lockheed Martin logo" },
  { src: "/images/nrel-logo-footer-2.webp", alt: "NREL logo" },
];
