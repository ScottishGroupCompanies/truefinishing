export const redirects = [
  // Existing city shortcuts. Aurora used to land on a blog post; it now goes to the city page.
  ["/cities-we-serve/arvada", "/cities-we-serve/arvada-concrete-floor-finishing"],
  ["/cities-we-serve/aurora", "/cities-we-serve/aurora-concrete-floor-finishing"],
  ["/cities-we-serve/aurora-co", "/cities-we-serve/aurora-concrete-floor-finishing"],
  ["/cities-we-serve/boulder", "/cities-we-serve/boulder-concrete-floor-finishing"],
  ["/cities-we-serve/castle-rock", "/cities-we-serve/castle-rock-concrete-floor-finishing"],
  ["/cities-we-serve/centennial", "/cities-we-serve/centennial-concrete-floor-finishing"],
  ["/cities-we-serve/colorado-springs", "/cities-we-serve/colorado-springs-concrete-floor-finishing"],
  ["/cities-we-serve/englewood", "/cities-we-serve/englewood-concrete-floor-finishing"],
  ["/cities-we-serve/fort-collins", "/cities-we-serve/fort-collins-concrete-floor-finishing"],
  ["/cities-we-serve/lakewood", "/cities-we-serve/lakewood-concrete-floor-finishing"],
  ["/cities-we-serve/lakewood-co", "/cities-we-serve/lakewood-concrete-floor-finishing"],
  ["/cities-we-serve/littleton", "/cities-we-serve/littleton-concrete-floor-finishing"],
  ["/cities-we-serve/littleton-co", "/cities-we-serve/littleton-concrete-floor-finishing"],
  ["/cities-we-serve/thornton", "/cities-we-serve/thornton-concrete-floor-finishing"],
  ["/floor-finishings/microtopping-micro-cement-floors", "/floor-finishings/concrete-microtoppings"],

  // Broken internal targets. No new city or service pages were added, so these
  // land on the closest page that already exists.
  ["/epoxy-floors", "/floor-finishings/epoxy-flooring"],
  ["/garage-floors", "/floor-finishings/epoxy-flooring"],
  ["/garage-coatings", "/floor-finishings/epoxy-flooring"],
  ["/metallic-floors", "/floor-finishings/epoxy-flooring"],
  ["/polyaspartic-floors", "/floor-finishings/epoxy-flooring"],
  ["/basement-floors", "/floor-finishings/epoxy-flooring"],
  ["/commercial-floors", "/floor-finishings/epoxy-flooring"],
  ["/concrete-coatings", "/floor-finishings"],
  ["/lakewood", "/cities-we-serve/lakewood-concrete-floor-finishing"],
  ["/parker", "/cities-we-serve/parker-concrete-floor-finishing"],
  ["/wheat-ridge", "/cities-we-serve"],
  ["/cities-we-serve/monument", "/cities-we-serve"],
  ["/cities-we-serve/denver", "/cities-we-serve/floor-finishing-concrete-polishing-denver-co"],
  ["/cities-we-serve/denver-co", "/cities-we-serve/floor-finishing-concrete-polishing-denver-co"],

  // Legacy Squarespace-era URLs.
  ["/self-leveling", "/floor-restoration/concrete-leveling"],
  ["/concrete-stains", "/floor-finishings"],
  ["/concrete-overlays", "/floor-restoration/concrete-overlay"],
  ["/epoxy-overlays", "/floor-restoration/concrete-overlay"],
  ["/microtoppings2", "/floor-finishings/concrete-microtoppings"],
  ["/moisture-remediation", "/floor-restoration/concrete-moisture-mitigation"],
  ["/projects", "/case-studies"],
  ["/safety", "/floor-preparation"],
  ["/substrate", "/floor-preparation"],
  ["/Floor", "/"],
  ["/floor", "/"],

  ["/feed/rss", "/feed"],
  ["/feed/rss2", "/feed"],
  ["/feed/atom", "/feed"],
  ["/comments/feed", "/feed"],
].map(([source, destination]) => ({
  source,
  destination: destination.endsWith("/") || destination === "/" ? destination : `${destination}/`,
  statusCode: 301,
}));

redirects.push({
  source: "/new-blog-1/:path*",
  destination: "/case-studies/",
  statusCode: 301,
});

redirects.push({
  source: "/:path*",
  has: [{ type: "host", value: "www.truefinishing.com" }],
  destination: "https://truefinishing.com/:path*",
  statusCode: 301,
});

redirects.push({
  source: "/",
  has: [{ type: "host", value: "www.truefinishing.com" }],
  destination: "https://truefinishing.com/",
  statusCode: 301,
});
