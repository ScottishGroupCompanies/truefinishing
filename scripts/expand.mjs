import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cities } from "./city-local.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CONTENT = path.join(ROOT, "content");

const REWRITES = {
  "/epoxy-floors/": "/floor-finishings/epoxy-flooring/",
  "/garage-floors/": "/floor-finishings/epoxy-flooring/",
  "/garage-coatings/": "/floor-finishings/epoxy-flooring/",
  "/metallic-floors/": "/floor-finishings/epoxy-flooring/",
  "/polyaspartic-floors/": "/floor-finishings/epoxy-flooring/",
  "/basement-floors/": "/floor-finishings/epoxy-flooring/",
  "/commercial-floors/": "/floor-finishings/epoxy-flooring/",
  "/concrete-coatings/": "/floor-finishings/",
  "/lakewood/": "/cities-we-serve/lakewood-concrete-floor-finishing/",
  "/parker/": "/cities-we-serve/parker-concrete-floor-finishing/",
  "/wheat-ridge/": "/cities-we-serve/",
  "/cities-we-serve/monument/": "/cities-we-serve/",
  "/cities-we-serve/denver/": "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/",
  "/cities-we-serve/denver-co/": "/cities-we-serve/floor-finishing-concrete-polishing-denver-co/",
  "/cities-we-serve/aurora/": "/cities-we-serve/aurora-concrete-floor-finishing/",
  "/cities-we-serve/aurora-co/": "/cities-we-serve/aurora-concrete-floor-finishing/",
  "/floor-finishings/microtopping-micro-cement-floors/": "/floor-finishings/concrete-microtoppings/",
  "/cities-we-serve/arvada/": "/cities-we-serve/arvada-concrete-floor-finishing/",
  "/cities-we-serve/boulder/": "/cities-we-serve/boulder-concrete-floor-finishing/",
  "/cities-we-serve/castle-rock/": "/cities-we-serve/castle-rock-concrete-floor-finishing/",
  "/cities-we-serve/centennial/": "/cities-we-serve/centennial-concrete-floor-finishing/",
  "/cities-we-serve/colorado-springs/": "/cities-we-serve/colorado-springs-concrete-floor-finishing/",
  "/cities-we-serve/englewood/": "/cities-we-serve/englewood-concrete-floor-finishing/",
  "/cities-we-serve/fort-collins/": "/cities-we-serve/fort-collins-concrete-floor-finishing/",
  "/cities-we-serve/lakewood/": "/cities-we-serve/lakewood-concrete-floor-finishing/",
  "/cities-we-serve/lakewood-co/": "/cities-we-serve/lakewood-concrete-floor-finishing/",
  "/cities-we-serve/littleton/": "/cities-we-serve/littleton-concrete-floor-finishing/",
  "/cities-we-serve/littleton-co/": "/cities-we-serve/littleton-concrete-floor-finishing/",
  "/cities-we-serve/thornton/": "/cities-we-serve/thornton-concrete-floor-finishing/",
};

const CITY_NAMES = Object.values(cities).map((city) => city.h1.replace(/ Concrete Floor Finishing$/, "").toLowerCase());

function walk(dir) {
  return fs.readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) return walk(full);
    return name.endsWith(".md") ? [full] : [];
  });
}

function rewriteLinks(markdown) {
  return markdown.replace(/\]\((\/[^)\s]+)\)/g, (full, href) => {
    const hashIndex = href.indexOf("#");
    const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
    const pathname = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
    const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
    const next = REWRITES[withSlash];
    return next ? `](${next}${hash})` : full;
  });
}

function write(file, data, body) {
  const cleaned = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === "") continue;
    cleaned[key] = value;
  }
  fs.writeFileSync(file, matter.stringify(`${body.trim()}\n`, cleaned));
}

function faq(pairs) {
  return pairs.map(([q, a]) => ({ q, a }));
}

const priceTodo =
  "TODO(Jenny): add a price range only if True Finishing wants that number published. This page does not invent one.";
const lifeTodo =
  "TODO(Jenny): add a lifespan you are willing to quote. The site does not give a single number of years for this system.";

const services = {
  "floor-restoration.md": {
    h1: "Floor Restoration in Denver",
    title: "Floor Restoration & Concrete Leveling Denver | True Finishing",
    description:
      "Denver floor restoration: pumped self-leveling, moisture mitigation, and concrete overlays. True Finishing preps the slab before the finish goes down.",
    directAnswer:
      "Floor restoration at True Finishing means making an existing slab ready for a new finish: pumped self-leveling underlayment, moisture mitigation, or a concrete overlay. It is not a separate structural slab-jacking service.",
    extra: `<!-- tf-expanded -->

## What floor restoration includes

The three services under this hub are the work that happens before, or instead of, a new floor covering.

- [Concrete leveling](/floor-restoration/concrete-leveling/) is pumped self-leveling underlayment. The leveling page describes an Ardex system, a pump rate, and the hours until the floor can be walked on. It is an underlayment, not mudjacking or foam lifting.
- [Concrete moisture mitigation](/floor-restoration/concrete-moisture-mitigation/) is testing vapor and, when needed, an epoxy moisture-control coat. The page states warranties of up to 15 years and, in some cases, 25 years. Ask which warranty applies to the system on your slab.
- [Concrete overlay](/floor-restoration/concrete-overlay/) covers a worn slab with a new cementitious finish, including microtoppings.

“Concrete lifting” on this site means bringing a low or uneven floor up to a flat surface with that pumped underlayment. TODO(Jenny): if you also perform mudjacking or polyurethane slab lifting, say so here. The current leveling page does not describe that work.

## How a restoration job is chosen

A walkthrough looks at flatness, moisture, and what the finished floor has to do. A warehouse that will be polished may only need grinding. A room getting large-format tile usually needs leveling. A slab that fails a moisture test needs mitigation before carpet, vinyl, tile, or a coating. The [floor preparation](/floor-preparation/) page covers grinding and surface profile, which almost every restoration job includes.

Related reading: the [self-leveling guide](/concrete-leveling/self-leveling-concrete-guide/), the [Sierra Trading Post](/case-study/sierra-trading-post/) leveling project, and the [Highlands Ranch Recreation Center](/case-study/highlands-ranch-recreation-center/) moisture project.

## Pros and cons

Restoration keeps the existing slab, which avoids a full replacement. It also means the result depends on that slab. Self-leveler can make a floor flat and still leave a crack if the slab underneath keeps moving. An overlay hides damage and adds thickness. Moisture mitigation protects the finish and does not dry the soil under the building.

${priceTodo} Cost factors are square footage, thickness, how much old flooring has to come off, and whether a moisture system is required.
`,
    faq: [
      ["What is the difference between self-leveling and slab lifting?", "Self-leveling, which is what the leveling page describes, is a cementitious underlayment pumped over the slab to make it flat. Slab lifting, mudjacking, and foam injection raise a sunken slab from below. TODO(Jenny): confirm whether True Finishing wants slab lifting described as a service. It is not described on the leveling page."],
      ["How much does floor restoration cost?", `There is no single price on this hub. The self-leveling guide gives a 2026 Front Range range for that one service. Moisture systems and overlays are scoped separately. ${priceTodo}`],
      ["How long does a restored floor last?", lifeTodo],
      ["What is the process?", "Test or inspect the slab, remove what cannot stay, grind, then level, mitigate moisture, or overlay. The finish, if there is a separate one, goes on after that."],
      ["Which Denver projects show this work?", "Sierra Trading Post is the published leveling project. Highlands Ranch Recreation Center is the published moisture project."],
    ],
  },
  "carpet-floor-installation.md": {
    h1: "Carpet Floor Installation in Denver",
    title: "Carpet Installation in Denver | True Finishing",
    description:
      "Commercial and residential carpet installation in Denver, including carpet tile and broadloom, after the slab is flat and dry. See the Epsilon project.",
    directAnswer:
      "True Finishing installs carpet tile and broadloom in Denver after the concrete is flat and dry. The Epsilon case study is a commercial example with gym, office, and hallway carpet.",
    extra: `<!-- tf-expanded -->

## When carpet is the right finish

Carpet is a covering, not a change to the concrete itself. It makes sense in offices, gyms, and rooms where sound and a softer surface matter. It is a poor choice for a wet commercial kitchen or a garage that takes road salt. Those rooms belong on the [epoxy](/floor-finishings/epoxy-flooring/) page.

The existing page distinguishes carpet tile from broadloom. Tile is the usual commercial choice because a damaged square can be replaced. Broadloom is a continuous roll, stretched and trimmed, and it is more common in a single residential room.

## What has to happen before the carpet

The slab has to be flat enough for the cushion or adhesive, and dry enough that the adhesive will hold. [Concrete leveling](/floor-restoration/concrete-leveling/) is the flatness step. [Moisture mitigation](/floor-restoration/concrete-moisture-mitigation/) is the vapor step. Skipping either one is how a new carpet wrinkles or releases. [Floor preparation](/floor-preparation/) removes old adhesive ridges that would telegraph through.

## Process

1. Walk the space and confirm tile versus broadloom.
2. Remove the old floor and grind high spots or adhesive.
3. Level and, if the test calls for it, mitigate moisture.
4. Install cushion or adhesive, then the carpet, and stretch broadloom so it stays tight.
5. Trim, seam, and set transitions.

The [Epsilon case study](/case-study/epsilon/) is the published commercial carpet project: gym, golf simulator, office, and hallway, listed at 4,200+ square feet.

## Pros and cons

Carpet is quieter and warmer underfoot than polished concrete or epoxy. It also stains, holds moisture, and has to be replaced. A hard floor is the better long-term surface in a wet or oily room. In a dry office, carpet tile is often the practical choice.

${priceTodo} ${lifeTodo}
`,
    faq: [
      ["How much does carpet installation cost in Denver?", `Price depends on the carpet, the cushion or adhesive, and how much concrete work is required first. ${priceTodo}`],
      ["How long does commercial carpet last?", lifeTodo],
      ["What are the pros and cons?", "Quieter and softer, and easier to replace by the tile. It stains, holds dirt, and fails if the slab is wet or uneven. Hard finishes win in wet rooms."],
      ["What is the process?", "Remove the old floor, flatten and dry the slab, then install carpet tile or stretched broadloom. Epsilon is the published example."],
      ["Do you install both tile and roll carpet?", "Yes. The service page covers carpet tile and broadloom. The right one depends on the room."],
    ],
  },
  "floor-finishings.md": {
    h1: "Floor Finishes in Denver",
    title: "Floor Finishes in Denver | True Finishing",
    description:
      "Denver floor finishes from True Finishing: polished concrete, microtoppings, epoxy, vinyl, tile, and carpet, after the slab is prepared.",
    directAnswer:
      "True Finishing installs the finished floor in Denver: polished concrete, microtoppings, epoxy, vinyl, tile, and carpet. The finish is chosen after prep, flatness, and moisture are known.",
    extra: `<!-- tf-expanded -->

## Choosing a finish

The finish is the surface people walk on. The slab underneath decides which ones are even possible.

- [Polished concrete](/floor-finishings/concrete-polishing/) grinds and densifies the slab. There is nothing to peel if the prep is right.
- [Microtoppings](/floor-finishings/concrete-microtoppings/) add a thin cement layer when the existing concrete cannot be polished as it is.
- [Epoxy](/floor-finishings/epoxy-flooring/) is a resin coating for garages, kitchens, and industrial rooms.
- [Vinyl](/floor-finishings/vinyl-floor-finishing/), [tile](/floor-finishings/tile-floor-refinishing/), and [carpet](/floor-finishings/carpet-floor-installation/) are coverings. They need a flat, dry substrate, which is [leveling](/floor-restoration/concrete-leveling/) and [moisture control](/floor-restoration/concrete-moisture-mitigation/).

## How to compare them

Use the room, not a catalog photo. A garage that sees magnesium chloride wants a coating that can be cleaned. A lobby that should look like the building’s concrete wants polish. A tenant who needs a replaceable floor wants carpet tile or vinyl. Wet rooms and food service rarely want carpet.

Our published cost notes are on the blog, not on this hub: [epoxy cost](/epoxy-flooring/epoxy-flooring-cost-per-square-foot/), [polished concrete cost](/polished-concrete/polished-concrete-cost-per-square-foot/), and [self-leveling cost](/concrete-leveling/self-leveling-concrete-guide/). ${priceTodo}

## Pros and cons, in short

Polish and epoxy stay for years if the prep was real, and they show every defect in the slab. Coverings hide the slab and can be replaced, and they fail when the slab is wet. Microtoppings add color and texture the existing concrete does not have, in a thin layer that still depends on the substrate.
`,
    faq: [
      ["Which floor finish should I pick?", "Match the room. Coatings for wet or salty floors, polish when the slab can be the finish, coverings when you need something replaceable or soft."],
      ["How much do floor finishes cost?", `Epoxy, polish, and self-leveling each have a 2026 guide linked above. Vinyl, tile, carpet, and microtoppings do not have a published range on this site. ${priceTodo}`],
      ["How long do they last?", lifeTodo],
      ["What is the process?", "Inspect, test moisture, grind, level if needed, then install the finish. Prep is the shared step."],
      ["Where are the project examples?", "Case studies cover Moxy Boulder, Sierra Trading Post, Epsilon, Shelby American, and Highlands Ranch Recreation Center."],
    ],
  },
  "vinyl-floor-finishing.md": {
    h1: "Vinyl Floor Finishing in Denver",
    title: "Luxury Vinyl Flooring in Denver | True Finishing",
    description:
      "Luxury vinyl tile installation in Denver for commercial and residential floors, including wall tile to match. The slab has to be flat and dry first.",
    directAnswer:
      "True Finishing installs luxury vinyl tile in Denver, in commercial rooms and houses, sometimes with matching wall tile. The concrete under it has to be flat and dry or the vinyl will show every ridge.",
    extra: `<!-- tf-expanded -->

## What this service is

The page is luxury vinyl tile, not a coating. LVT is a manufactured plank or tile glued or clicked over the substrate. The site also notes that installations can be paired with tile on the walls when a room should read as one material.

Vinyl hides a slab that is too rough or too stained to polish. It does not hide a slab that is out of flat or wet. Dips telegraph through, and moisture breaks adhesive. [Leveling](/floor-restoration/concrete-leveling/) and [moisture mitigation](/floor-restoration/concrete-moisture-mitigation/) are the usual prep. The [Sierra Trading Post](/case-study/sierra-trading-post/) project is the published example of leveling before luxury vinyl and tile.

## Where vinyl fits, and where it does not

It fits offices, retail, apartments, and houses that want a wood or stone look without the upkeep of those materials. It is the wrong surface for a chemical-heavy shop floor. That is an [epoxy](/floor-finishings/epoxy-flooring/) decision. If the concrete itself is sound and the look you want is concrete, [polishing](/floor-finishings/concrete-polishing/) skips the covering.

## Process

Someone measures the room, which the existing FAQ already commits to. Old flooring comes off. The slab is ground, leveled, and tested for moisture. Then the vinyl goes down, with transitions at doors and, when specified, tile on the walls.

## Pros and cons

Vinyl is quieter than bare concrete, available in many patterns, and replaceable by the plank. It can dent, the seams can open if the floor moves, and a wet slab will push it up. It is not a structural repair.

${priceTodo} ${lifeTodo}
`,
    faq: [
      ["How much does vinyl installation cost?", `The price is the material plus the concrete work under it. Leveling can cost as much as the vinyl. ${priceTodo}`],
      ["How long does luxury vinyl last?", lifeTodo],
      ["What are the pros and cons?", "Many looks, softer than concrete, and replaceable. It dents, and it fails on a wet or uneven slab. Shops and garages are usually better as epoxy."],
      ["What is the process?", "Measure, remove the old floor, flatten and dry the concrete, then install the vinyl. Wall tile is optional and is already part of this service."],
      ["Will someone measure before the job?", "Yes. The original FAQ says a person comes out to review dimensions."],
    ],
  },
  "tile-floor-refinishing.md": {
    h1: "Tile Floor Installation in Denver",
    title: "Tile Floor Installation in Denver | True Finishing",
    description:
      "Porcelain and ceramic tile installation in Denver, including flatness, moisture control, and layout. See the Shelby American Car Museum project.",
    directAnswer:
      "True Finishing sets tile in Denver, including porcelain that needs a flat slab. The Shelby American Car Museum case study is the published project: prep, a moisture barrier, and porcelain tile.",
    extra: `<!-- tf-expanded -->

## What tile demands from the slab

Large porcelain moves less than people expect and shows lippage immediately if the floor is not flat. The [Shelby American](/case-study/shelby-american-car-museum/) case study describes curling and unevenness corrected in prep, then a moisture vapor barrier, then the tile. That sequence is the job: [leveling](/floor-restoration/concrete-leveling/), [moisture mitigation](/floor-restoration/concrete-moisture-mitigation/), then setting.

Layout, thinset coverage, and grout joints are the setting work. A walkthrough before installation is already promised in the FAQ on this page.

## Tile, vinyl, or polish

Tile is the hard, grouted surface. [Vinyl](/floor-finishings/vinyl-floor-finishing/) is the alternative the existing FAQ already points to when a continuous, lighter floor is a better fit. [Polished concrete](/floor-finishings/concrete-polishing/) removes the covering question entirely when the slab can be the finish. Wet commercial floors sometimes belong in [epoxy](/floor-finishings/epoxy-flooring/) instead of grout lines that hold grease.

## Pros and cons

Tile handles water and traffic better than carpet or vinyl, and a single cracked tile can sometimes be cut out. It is unforgiving of an uneven slab, the grout needs maintenance, and a bad moisture condition will loosen the floor from below.

${priceTodo} ${lifeTodo}
`,
    faq: [
      ["How much does tile installation cost in Denver?", `Material, layout complexity, and the concrete prep drive the number. The Shelby project needed leveling and a moisture barrier before any tile was set. ${priceTodo}`],
      ["How long does a tile floor last?", lifeTodo],
      ["What are the pros and cons?", "Hard, water-tolerant, and repairable by the tile. It needs a flat, dry slab, and grout is a maintenance item. Vinyl or polish is sometimes the simpler floor."],
      ["What is the process?", "Walk the room, remove the old floor, flatten and dry the slab, lay out the tile, set it, then grout. Someone reviews dimensions before work starts."],
      ["Where can I see a project?", "The Shelby American Car Museum case study documents porcelain tile after prep and moisture control."],
    ],
  },
  "concrete-microtoppings.md": {
    h1: "Concrete Microtoppings in Denver",
    title: "Concrete Microtoppings in Denver | True Finishing",
    description:
      "Thin concrete microtoppings in Denver for a new cement surface over an existing floor, including wood-look and seamless finishes.",
    directAnswer:
      "A microtopping is a thin cement layer over an existing floor. True Finishing uses it in Denver when you want a new concrete look and the slab itself is not a candidate for polish.",
    extra: `<!-- tf-expanded -->

## What a microtopping is

Microtopping, sometimes called microcement, is a thin cementitious coat troweled over a prepared floor. The photos on this page show wood-look color and seamless interiors. It is closer to an [overlay](/floor-restoration/concrete-overlay/) than to [polished concrete](/floor-finishings/concrete-polishing/). Polish grinds the slab you already have. A microtopping covers it.

Thickness is the reason people choose it: it can go over a sound floor without building the height of a new structural slab. It still needs a clean, sound, and usually dry substrate. [Floor preparation](/floor-preparation/) and a [moisture check](/floor-restoration/concrete-moisture-mitigation/) come first. A floor that is out of flat may need [leveling](/floor-restoration/concrete-leveling/) before a thin finish, because a skim coat will follow the dips.

## Where it works

Interiors that want a continuous cement look, including rooms where the existing concrete is patched, stained, or already covered with a topping that cannot be polished cleanly. It is a design finish. A forklift aisle or a garage full of tire salt is usually an [epoxy](/floor-finishings/epoxy-flooring/) problem instead.

## Pros and cons

You get color and a seamless surface the old slab did not have, at a low added thickness. The finish is only as stable as the floor under it. Cracks in the substrate can telegraph. It is not a way to fix a heaving slab.

${priceTodo} ${lifeTodo}
`,
    faq: [
      ["How much does a microtopping cost?", `The price depends on the prep, the number of coats, and the color work. There is no published range on this site. ${priceTodo}`],
      ["How long does a microtopping last?", lifeTodo],
      ["What are the pros and cons?", "Thin, seamless, and able to change the look of a floor that cannot be polished. It can telegraph cracks, and it is a poor substitute for an industrial coating."],
      ["How is it installed?", "Prepare and, if needed, level and dry the floor. Trowel the microtopping, then seal it. The existing photos on this page show the kinds of color the system can take."],
      ["How is it different from polishing?", "Polish is the existing concrete, ground and densified. A microtopping is a new layer on top."],
    ],
  },
  "concrete-leveling.md": {
    h1: "Concrete Floor Leveling in Denver",
    title: "Concrete Floor Leveling in Denver | True Finishing",
    description:
      "Pumped self-leveling underlayment in Denver for flat floors before tile, vinyl, carpet, or coatings. Ardex system, not mudjacking. See the 2026 cost guide.",
    directAnswer:
      "True Finishing levels Denver floors with pumped self-leveling underlayment, an Ardex system, not mudjacking. The 2026 guide puts typical work around $3 to $8 per square foot. Most jobs are walkable in 2 to 3 hours.",
    extra: `<!-- tf-expanded -->

## Self-leveling, not slab jacking

Search results for “concrete leveling Denver” mix two different trades. This page is the first one: a cementitious underlayment pumped over the slab so the surface is flat. The page names the CUBE pumping system, an Ardex preferred-partner install, thicknesses from a featheredge to 1.5 inches and up to 5 inches with aggregate, about 4,100 psi, foot traffic in 2 to 3 hours, and floor coverings after 16 hours.

Mudjacking and foam injection lift a sunken slab from underneath. TODO(Jenny): add that service only if you perform it. Nothing on this page describes it.

The published cost note is in the [self-leveling guide](/concrete-leveling/self-leveling-concrete-guide/): about $3 to $8 per square foot on the Front Range in 2026, depending on depth and prep. That guide also explains that the material corrects flatness and is not structural concrete.

## Where it is used

Before tile, vinyl, carpet, or a thin coating, and anywhere two slabs meet at different heights. The [Sierra Trading Post](/case-study/sierra-trading-post/) project is the published Denver example, leveling before luxury vinyl and tile. Basements are called out in the existing FAQ as one of the most common requests.

## Process

1. Survey the flatness and the finished floor.
2. Remove coverings that cannot stay. The Ardex note on this page lists concrete, tile, wood, and certain old adhesives as substrates.
3. Prime, then pump. The page states a rate of 7,500 square feet per hour with the CUBE system.
4. Let it take foot traffic in the stated 2 to 3 hours. Wait the stated 16 hours before coverings.

## Pros and cons

A large floor can be flattened in hours instead of weeks of patching, and the surface is smooth enough for thin finishes. The underlayment does not stop a slab that is still moving, and deep fills use more material. It is the wrong tool if the real problem is a sunken structure.

${lifeTodo}
`,
    faq: [
      ["How much does concrete leveling cost in Denver?", "The 2026 self-leveling guide on this site says about $3 to $8 per square foot, depending on depth and prep. Read that guide for what changes the number. It is not a quote."],
      ["How long does self-leveling underlayment last?", `${lifeTodo} The page does state that the material is meant not to shrink or spall, and that coverings can go down after 16 hours.`],
      ["What are the pros and cons versus mudjacking?", "Self-leveling makes the top of the floor flat and is what this company publishes. Mudjacking lifts the slab. They solve different problems. TODO(Jenny): say if you offer the second one."],
      ["What is the process?", "Remove what cannot stay, prime, pump the underlayment, then wait 2 to 3 hours for foot traffic and 16 hours for coverings, per this page."],
      ["Do you level basement floors?", "Yes. The existing FAQ lists unlevel basements as a common Denver request, and says the company has provided the service since 2007."],
    ],
  },
  "epoxy-flooring.md": {
    h1: "Epoxy Flooring in Denver",
    title: "Epoxy Flooring Contractor in Denver | True Finishing",
    description:
      "Epoxy and polyaspartic floors in Denver for garages, commercial kitchens, and industrial slabs. Ground, moisture-checked, then coated. See the 2026 cost guide.",
    directAnswer:
      "True Finishing installs epoxy and polyaspartic floors in Denver after diamond grinding or shot blasting and a moisture check. The 2026 cost guide puts typical Front Range epoxy at about $4 to $12 per square foot.",
    extra: `<!-- tf-expanded -->

## Direct answers

**Cost.** The [2026 epoxy cost guide](/epoxy-flooring/epoxy-flooring-cost-per-square-foot/) says professionally installed epoxy is about $4 to $12 per square foot on the Front Range. Garage flake systems, metallic floors, and heavy industrial mortars sit in different parts of that range. Those figures are the guide’s, not a quote for your slab.

**Lifespan.** ${lifeTodo} What this service page does say is that failure usually starts with moisture, a weak surface, or dust left after grinding. The homepage states a 25-year warranty when a restoration project includes moisture mitigation. That warranty is not a universal epoxy lifespan.

**Pros.** A continuous surface, chemical resistance when the right system is chosen, and a floor that can be cleaned. The page lists solid, decorative, and functional systems, and jobs from about 1,000 to 100,000 square feet.

**Cons.** Epoxy is only as good as the prep. A wet slab or a contaminated surface will peel. Dark metallic floors show scratches. A garage that is not ground will not match a photo of one that was.

**Process.** Inspect the slab, including moisture and whether a vapor barrier exists. Diamond-grind or shot-blast. Remove the dust. Install the system the use of the floor calls for, including a moisture-vapor treatment when the test requires it. Details are in the sections above and on the [floor preparation](/floor-preparation/) page.
`,
    faq: [
      ["How much does epoxy flooring cost in Denver?", "About $4 to $12 per square foot as a typical 2026 Front Range range in our epoxy cost guide, with garages, metallic floors, and industrial systems spread across that range. The guide explains what moves the price. It is not a bid."],
      ["How long does an epoxy floor last?", lifeTodo],
      ["What are the pros and cons?", "Continuous, cleanable, and chemical-resistant when the system matches the room. It peels if the slab is wet or dirty, and decorative floors show wear. Prep is the difference."],
      ["What is the installation process?", "Inspect, test moisture, grind or shot-blast, remove dust, then coat. The page states that every epoxy floor gets that mechanical prep."],
      ["Do you coat garages and commercial floors?", "Yes. The page covers garage systems, commercial kitchens, and industrial resinous floors. There is no separate garage URL. This is the page those requests use."],
    ],
  },
  "concrete-polishing.md": {
    h1: "Polished Concrete in Denver",
    title: "Polished Concrete Contractor in Denver | True Finishing",
    description:
      "Polished concrete in Denver: grinding, densifying, and gloss levels. The 2026 guide puts most floors at about $3 to $8 per square foot. See Moxy Boulder.",
    directAnswer:
      "Polished concrete is the slab, ground and densified. True Finishing does that work in Denver. The 2026 cost guide puts most floors at about $3 to $8 per square foot, and more when the aggregate is heavily exposed.",
    extra: `<!-- tf-expanded -->

## Cost, life, and how it compares to epoxy

The [2026 polished concrete cost guide](/polished-concrete/polished-concrete-cost-per-square-foot/) says most commercial and residential floors land around $3 to $8 per square foot, and about $8 to $14 or more when the work exposes heavy aggregate, adds dye, or repairs a lot of slab. Gloss level and the concrete you already have move the number more than the polish itself.

${lifeTodo} Polish does not peel the way a coating can, because there is no film. It can etch from acids and it will show cracks that were already in the slab.

**Versus epoxy.** Polish is the right finish when you want the concrete and the slab is sound. [Epoxy](/floor-finishings/epoxy-flooring/) is the right finish when you need to hide repairs, resist chemicals, or give a garage a flake surface. The cost guide’s comparison is the longer version.

**Process.** Grind through the required grits, densify, and polish to the agreed gloss. Stains, coatings, and adhesive come off first, which is [floor preparation](/floor-preparation/). [Moxy Boulder](/case-study/university-hotel-boulder-custom-concrete-prep-polish/) is the published prep-and-polish project.

## Pros and cons

Low maintenance and no floor covering to replace. The look depends on the slab’s aggregate and flatness. A bad slab becomes a more expensive polish, or it becomes an overlay instead.
`,
    faq: [
      ["How much does polished concrete cost in Denver?", "About $3 to $8 per square foot for most floors in the 2026 guide, and about $8 to $14 or more for heavy exposure or dye. Read the guide for the gloss levels. It is not a quote."],
      ["How long does polished concrete last?", lifeTodo],
      ["What are the pros and cons versus epoxy?", "Polish has no film to peel and shows the real concrete. Epoxy hides the slab and adds chemical resistance. A damaged or heavily patched slab is often easier to coat than to polish uniform."],
      ["What is the process?", "Remove coatings, grind, densify, and polish to the specified gloss. Moxy Boulder is the published example."],
      ["Is polished concrete slippery?", "Higher gloss can be smoother. Slip resistance depends on the grit and any sealer. TODO(Jenny): publish the coefficient you are willing to quote. A scheduled article on slip was not available from the public site."],
    ],
  },
  "concrete-moisture-mitigation.md": {
    h1: "Concrete Moisture Mitigation in Denver",
    title: "Concrete Moisture Mitigation in Denver | True Finishing",
    description:
      "Concrete moisture testing and Ardex mitigation in Denver before coatings, tile, or carpet. Warranties of up to 15 years, and 25 in some cases.",
    directAnswer:
      "True Finishing tests concrete moisture in Denver and installs an Ardex mitigation coat when vapor is too high for the finish. The page states warranties up to 15 years and, in some cases, 25 years.",
    extra: `<!-- tf-expanded -->

## Cost, warranty, and process

${priceTodo} What changes the number is the test result, whether the system is one coat or two, and the sand broadcast the page describes.

The warranty language already on this page is specific: up to 15-year warranties and, in certain cases, a 25-year warranty covering material, labor, and downtime. A separate FAQ answer says the Ardex systems come with a 25-year guarantee. TODO(Jenny): publish one clear warranty statement so those two sentences cannot be read as a conflict. The homepage’s “25 year warranty” line is limited to projects that include moisture mitigation.

**Lifespan.** The warranty term is not the same thing as how long the floor covering above it lasts. ${lifeTodo}

**Process.** Test the vapor transmission, then apply the Ardex MC system the page describes: a one- or two-coat epoxy, with or without sand. The page says the system can go on concrete that is seven days old. The [Highlands Ranch Recreation Center](/case-study/highlands-ranch-recreation-center/) case study is the published project. The about page states more than 2,000,000 square feet of Ardex moisture systems with no failures recorded by the company.

**Pros and cons.** Mitigation lets a finish go down on a slab that would otherwise wait months to dry, or never dry. It is an extra step and an extra cost, and it does not fix drainage outside the building.
`,
    faq: [
      ["How much does moisture mitigation cost?", priceTodo],
      ["How long is it warranted?", "This page says up to 15 years and, in some cases, 25 years, and a FAQ answer says 25 years for the Ardex system. TODO(Jenny): reconcile those sentences. Ask which warranty applies before you rely on a number."],
      ["What are the pros and cons?", "You can finish a damp slab on a construction schedule. You pay for a system the dry slab would not have needed, and exterior water still has to be handled separately."],
      ["What is the process?", "Test, then install the one- or two-coat Ardex system described above. Coverings and coatings follow once that coat is ready."],
      ["When is it required?", "Before carpet, tile, vinyl, or coatings when the vapor test says the slab is too wet for that finish."],
    ],
  },
  "concrete-overlay.md": {
    h1: "Concrete Overlay in Denver",
    title: "Concrete Overlay Services in Denver | True Finishing",
    description:
      "Concrete overlays and microtoppings in Denver to cover a worn slab with a new cement finish. Prep and flatness come first. Since 2007.",
    directAnswer:
      "A concrete overlay covers a worn Denver slab with a new cement finish, including microtoppings. True Finishing uses it when the existing concrete cannot simply be polished.",
    extra: `<!-- tf-expanded -->

## Overlay versus replacement and versus polish

An overlay stays on the building you have. Replacement removes the slab. Polish grinds the slab you have and only works when that concrete is sound enough to be the finish. The overlay page is the middle path: cover the damage and design the new surface.

[Microtoppings](/floor-finishings/concrete-microtoppings/) are the thin end of that family. Thicker overlays fill more damage and add more height, which matters at doors. [Floor preparation](/floor-preparation/) and, where the floor must be flat first, [leveling](/floor-restoration/concrete-leveling/) come before the decorative layer. [Moxy Boulder](/case-study/university-hotel-boulder-custom-concrete-prep-polish/) used overlays as part of a prep-and-polish scope.

## Pros and cons

You keep the structure and change the look. The new layer can still crack if the slab under it moves. It is not a coating for a chemical plant floor. That remains [epoxy](/floor-finishings/epoxy-flooring/).

${priceTodo} ${lifeTodo}

## Process

Look at the damage and the height you can add. Remove loose material, grind, repair, then place the overlay or microtopping and finish it. Moisture is checked when the overlay will be covered or sealed. The moisture page is the test.
`,
    faq: [
      ["How much does a concrete overlay cost?", priceTodo],
      ["How long does an overlay last?", lifeTodo],
      ["What are the pros and cons versus replacing the slab?", "You avoid demolition and keep the structure. You inherit whatever movement that slab still has. Replacement is the other conversation, and this page does not price it."],
      ["What is the process?", "Repair and grind, check height and moisture, then place the overlay or microtopping and finish the surface."],
      ["Is a microtopping an overlay?", "Yes. It is the thin version. The microtopping page shows the looks. This page is the restoration decision."],
    ],
  },
  "floor-preparation.md": {
    h1: "Concrete Floor Preparation in Denver",
    title: "Concrete Floor Preparation in Denver | True Finishing",
    description:
      "Concrete grinding, shot blasting, and surface prep in Denver before polish, epoxy, tile, vinyl, or carpet. Dust-controlled equipment, since 2007.",
    directAnswer:
      "Floor preparation at True Finishing is the grinding, shot blasting, and cleaning that makes a Denver slab ready for polish, epoxy, tile, vinyl, or carpet. Coatings fail when this step is skipped.",
    extra: `<!-- tf-expanded -->

## Why prep decides the finish

Every finish page on this site points back here. Epoxy is diamond-ground or shot-blasted. Polish is a grind. Tile and vinyl need ridges and adhesive gone. The epoxy page states that dust left after grinding is a cause of peeling, and that the company runs grinders, shot blasters, and dust collection.

## Process

1. Identify the existing floor: coating, adhesive, tile, carpet, or bare concrete.
2. Choose the mechanical method. Grinding and shot blasting are the ones named on the service pages.
3. Remove the dust.
4. Confirm flatness and moisture before the finish. Those are [leveling](/floor-restoration/concrete-leveling/) and [moisture mitigation](/floor-restoration/concrete-moisture-mitigation/) when the tests say so.

## Pros and cons

Mechanical prep is loud and dusty even with collection equipment, and it is why a floor can be coated the right way. Skipping it is cheaper on bid day and is the usual reason a floor fails. There is no chemical shortcut on these pages that replaces grinding for a professional coating.

${priceTodo} ${lifeTodo} Prep is not a wear surface. Its “life” is the life of the finish installed on it.
`,
    faq: [
      ["How much does floor preparation cost?", `It is usually priced inside the finish, because grinding is most of the labor. ${priceTodo}`],
      ["How long does preparation take?", "It depends on the covering being removed and the square footage. TODO(Jenny): add a typical production rate if you want one published. The leveling page is the only place a pump rate is stated."],
      ["What are the pros and cons of grinding versus a sealer over a dirty floor?", "Grinding gives a coating something to hold. Coating over contamination is how floors peel. The downside is time, dust, and noise during the work."],
      ["What is the process?", "Remove the old surface mechanically, clean the dust, then test flatness and moisture before the finish."],
      ["Which finishes require it?", "Epoxy, polish, overlays, and any covering going over adhesive or old tile. The individual service pages say how."],
    ],
  },
};

function dedupeCities() {
  const files = fs.readdirSync(path.join(CONTENT, "cities")).filter((name) => name.endsWith(".md"));
  const docs = files.map((name) => {
    const file = path.join(CONTENT, "cities", name);
    const parsed = matter(fs.readFileSync(file, "utf8"));
    return { file, data: parsed.data, body: parsed.content };
  });
  const counts = new Map();
  for (const doc of docs) {
    for (const paragraph of doc.body.split(/\n\n+/)) {
      if (paragraph.includes("![") || paragraph.trim().startsWith("#") || paragraph.trim().length < 140) continue;
      let key = paragraph.toLowerCase().replace(/\s+/g, " ");
      for (const name of CITY_NAMES) key = key.replaceAll(name, "city");
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  for (const doc of docs) {
    const slug = path.basename(doc.file, ".md");
    const local = cities[slug];
    if (!local) {
      console.warn("No local copy for", slug);
      continue;
    }
    let source = doc.body;
    if (source.includes("<!-- tf-local -->")) {
      const localText = local.body.trim();
      const at = source.indexOf(localText);
      source = (source.slice(0, source.indexOf("<!-- tf-local -->")) + (at >= 0 ? source.slice(at + localText.length) : "")).trim();
    }
    const kept = source
      .split(/\n\n+/)
      .filter((paragraph) => {
        if (paragraph.includes("![") || paragraph.trim().startsWith("#") || paragraph.trim().length < 140) return true;
        let key = paragraph.toLowerCase().replace(/\s+/g, " ");
        for (const name of CITY_NAMES) key = key.replaceAll(name, "city");
        return (counts.get(key) || 0) < 4;
      })
      .join("\n\n");
    doc.data.h1 = local.h1;
    doc.data.title = local.title;
    doc.data.description = local.description;
    doc.data.directAnswer = local.directAnswer;
    doc.data.faq = faq(local.faq);
    write(doc.file, doc.data, `<!-- tf-local -->\n\n${local.body}\n\n${kept}`);
  }
}

function expandServices() {
  for (const [name, extra] of Object.entries(services)) {
    const file = path.join(CONTENT, "services", name);
    const parsed = matter(fs.readFileSync(file, "utf8"));
    parsed.data.h1 = extra.h1;
    parsed.data.title = extra.title;
    parsed.data.description = extra.description;
    parsed.data.directAnswer = extra.directAnswer;
    parsed.data.faq = faq(extra.faq);
    let body = parsed.content;
    if (!body.includes("<!-- tf-expanded -->")) body = `${body.trim()}\n\n${extra.extra.trim()}\n`;
    write(file, parsed.data, body);
  }
}

function patchPages() {
  const home = path.join(CONTENT, "pages", "home.md");
  const homeDoc = matter(fs.readFileSync(home, "utf8"));
  homeDoc.data.h1 = "Denver’s trusted experts in flooring prep, concrete polishing, and concrete finishing.";
  homeDoc.data.description =
    "Denver concrete floor finishes, polished concrete, and epoxy from True Finishing. Floor prep, restoration, and finishings for the Front Range.";
  write(home, homeDoc.data, homeDoc.content);

  const contact = path.join(CONTENT, "pages", "contact.md");
  const contactDoc = matter(fs.readFileSync(contact, "utf8"));
  contactDoc.data.h1 = "Contact True Finishing";
  contactDoc.data.title = "Contact True Finishing in Denver | Estimates";
  contactDoc.data.description =
    "Contact True Finishing at 2290 S Lipan St, Denver, CO 80223, or call 303-761-1012. Send the estimate form and we reply by email.";
  contactDoc.data.directAnswer =
    "Call 303-761-1012 or use the form. The shop is at 2290 S Lipan St, Denver, CO 80223. Email is info@truefinishing.com.";
  const contactBody = `True Finishing, LLC
2290 S Lipan St
Denver, CO 80223

Call [303-761-1012](tel:303-761-1012) or email [info@truefinishing.com](mailto:info@truefinishing.com).

The form asks for your name, email, a confirmation of that email, and comments about the floor. That is the same request used across the site.

<!-- TODO(Jenny): publish opening hours if you want them here. The WordPress site did not list hours, so none are shown. -->

[Map and directions](https://maps.google.com/?q=2290+S+Lipan+St+Denver+CO+80223)
`;
  write(contact, contactDoc.data, contactBody);

  const blog = path.join(CONTENT, "pages", "blog.md");
  const blogDoc = matter(fs.readFileSync(blog, "utf8"));
  blogDoc.data.h1 = "Concrete flooring blog";
  blogDoc.data.title = "Concrete Flooring Blog | True Finishing Denver";
  blogDoc.data.description =
    "Flooring articles from True Finishing in Denver: epoxy, polished concrete, leveling, moisture, and floor prep for Colorado slabs.";
  write(
    blog,
    blogDoc.data,
    "Articles from the True Finishing crew on epoxy, polished concrete, self-leveling, moisture, and how Front Range slabs are prepared. The list below is rendered on the server, newest first.",
  );

  const tile = path.join(CONTENT, "services", "tile-floor-refinishing.md");
  const tileDoc = matter(fs.readFileSync(tile, "utf8"));
  tileDoc.content = tileDoc.content.replace(
    /Carpet selection involves more than just picking a color[\s\S]*?stress-free installation experience\./,
    "Tile is its own installation. Layout, lippage, thinset coverage, and a flat substrate decide whether the floor looks right. Large porcelain needs the slab leveled first, and a moisture test before the tile is set. The walkthrough promised below is where those steps get explained for the specific room.",
  );
  write(tile, tileDoc.data, tileDoc.content);
}

function rewriteAll() {
  for (const file of walk(CONTENT)) {
    const parsed = matter(fs.readFileSync(file, "utf8"));
    const next = rewriteLinks(parsed.content);
    if (next !== parsed.content) write(file, parsed.data, next);
  }
}

dedupeCities();
expandServices();
patchPages();
rewriteAll();
console.log("expanded");
