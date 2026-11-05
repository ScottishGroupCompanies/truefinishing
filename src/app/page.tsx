import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { EstimateForm } from "@/components/EstimateForm";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { SnapSlider } from "@/components/SnapSlider";
import { StatBand } from "@/components/StatBand";
import { caseStudies, getDoc } from "@/lib/content";
import { docMetadata } from "@/lib/seo";
import { BUSINESS, CLIENTS } from "@/lib/site";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const doc = getDoc("/");
  if (!doc) return { title: "True Finishing" };
  return docMetadata({
    ...doc,
    h1: doc.h1 || "Denver’s trusted experts in flooring prep, concrete polishing, and concrete finishing.",
  });
}

const services = [
  {
    title: "Epoxy flooring",
    href: "/floor-finishings/epoxy-flooring/",
    image: "/images/home-true-best-epoxy-finishing.webp",
    text: "A durable, seamless finish for garages, commercial kitchens, and industrial slabs.",
  },
  {
    title: "Polished concrete",
    href: "/floor-finishings/concrete-polishing/",
    image: "/images/home-true-gorgeous-concrete-polishing-denver.webp",
    text: "The slab itself, ground and densified, with a low-maintenance finish.",
  },
  {
    title: "Concrete leveling",
    href: "/floor-restoration/concrete-leveling/",
    image: "/images/floor-leveling-true-finishing-colorado-floor-company-001.webp",
    text: "Pumped self-leveling underlayment so the next finish has a flat floor.",
  },
  {
    title: "Moisture mitigation",
    href: "/floor-restoration/concrete-moisture-mitigation/",
    image: "/images/moisture1.webp",
    text: "Test the slab, then stop vapor before coatings, carpet, or tile go down.",
  },
];

const projects = [
  {
    quote: "Excellent professionalism from start to finish. Great Results.",
    title: "Tile Installation: Shelby American Car Museum",
    href: "/case-study/shelby-american-car-museum/",
    image: "/images/tile-floor-finishings-floor-prep-case-001.webp",
    alt: "gorgeous black porcelain tile floors boulder museum floor installation",
  },
  {
    quote: "Resolved all problems, delivered excellent finishes.",
    title: "Concrete Floor Leveling: Sierra Trading Post",
    href: "/case-study/sierra-trading-post/",
    image: "/images/sierra-trading-post-case-study-hero-compressed.webp",
    alt: "full-service floor prep and floor finishing case study demo of sierra trading post floors",
  },
  {
    quote: "Gorgeous floors. Large square feet. Diverse finishings.",
    title: "Moisture Mitigation: Highlands Ranch Recreation Center",
    href: "/case-study/highlands-ranch-recreation-center/",
    image: "/images/highlands-ranch-rec-center-floors-case-study-true-finishing-floor-finishing.webp",
    alt: "Floor finishing case study denver highlands ranch recreation center detail",
  },
];

const hubs = [
  {
    href: "/floor-preparation/",
    title: "Concrete floor prep",
    text: "Grinding, shaving, and scarifying so tile, carpet, coatings, and polish have a sound surface.",
  },
  {
    href: "/floor-restoration/",
    title: "Floor restoration",
    text: "Leveling, moisture control, and overlays before the finished floor goes down.",
  },
  {
    href: "/floor-finishings/",
    title: "Floor finishes",
    text: "Polished concrete, epoxy, microtoppings, vinyl, tile, and carpet.",
  },
];

export default function HomePage() {
  const studies = caseStudies();
  return (
    <>
      <section className="relative isolate flex min-h-[520px] items-end bg-ink text-white md:min-h-[600px]">
        <Image
          src="/images/tile-carpet-floor-finishings-floor-prep-case-016.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/20" />
        <div className="relative mx-auto w-full max-w-[1120px] px-4 pb-24 pt-16">
          <h1 className="max-w-[16ch] text-5xl font-semibold leading-[0.92] tracking-tight md:text-7xl">
            Denver’s trusted experts in flooring prep, concrete polishing, and concrete finishing.
          </h1>
          <p className="mt-5 max-w-[58ch] text-lg text-white">
            At True Finishing, we’re committed to bringing you the best quality in service and products. Floor
            preparation, restoration, and finishings for the Colorado Front Range.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact/#contact" className="btn">
              Get a Free Estimate
            </Link>
            <a href={BUSINESS.phoneHref} className="btn bg-white">
              Call {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-16 max-w-[1120px] px-4">
        <StatBand />
      </div>

      <section className="mark py-16 md:py-20">
        <div className="mx-auto grid max-w-[1120px] items-center gap-10 px-4 md:grid-cols-2">
        <Reveal>
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">
              Leaders in floor preparation, floor restoration, and floor finishings in Denver, Colorado
            </h2>
            <p className="mt-4">
              At True Finishing, we’ve been Denver’s one-stop shop for floors since 2007. We prepare the slab, level it,
              and finish it. Epoxy, polished concrete, microtoppings, tile, vinyl, and carpet all start with that same
              prep.
            </p>
            <p className="mt-4">
              <Link href="/about/" className="btn">
                Get to know us.
              </Link>
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl md:-mr-6">
            <Image
              src="/images/flooring-with-shadows-artistic.webp"
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        </div>
      </section>

      <section className="mark py-16">
        <div className="mx-auto max-w-[1120px] px-4">
          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((service, index) => (
              <Reveal key={service.href} delay={index * 60}>
                <Link href={service.href} className="service-card group block overflow-hidden rounded-2xl bg-base text-ink no-underline">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl">{service.title}</h2>
                    <p className="mt-2 text-ink/80">{service.text}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="marquee border-y border-grey bg-white py-8" aria-label="Clients">
        <h2 className="px-4 text-center text-sm font-semibold uppercase tracking-wide text-muted">Clients</h2>
        <div className="marquee-track mt-6 px-4">
          {[...CLIENTS, ...CLIENTS].map((logo, index) => (
            <div key={`${logo.src}-${index}`} className="relative h-12 w-32 shrink-0">
              <Image src={logo.src} alt={index < CLIENTS.length ? logo.alt : ""} fill sizes="128px" className="object-contain" />
            </div>
          ))}
        </div>
      </section>

      <section className="mark py-16">
        <div className="mx-auto max-w-[1120px] px-4">
        <SnapSlider label="Work across the Front Range">
          {projects.map((project) => (
            <Link
              key={project.href}
              href={project.href}
              className="service-card w-[86%] shrink-0 snap-start overflow-hidden rounded-2xl bg-white text-ink no-underline shadow-md md:w-[48%]"
            >
              <div className="relative aspect-[16/9]">
                <Image src={project.image} alt={project.alt} fill sizes="(min-width: 768px) 40vw, 86vw" className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-lg font-medium">“{project.quote}”</p>
                <p className="mt-3 text-sm font-semibold">{project.title}</p>
              </div>
            </Link>
          ))}
          {studies
            .filter((study) => !projects.some((project) => project.href === study.path))
            .map((study) => (
              <Link
                key={study.path}
                href={study.path}
                className="service-card w-[86%] shrink-0 snap-start overflow-hidden rounded-2xl bg-white text-ink no-underline shadow-md md:w-[48%]"
              >
                <div className="p-6">
                  <h3 className="text-xl">{study.h1}</h3>
                  <p className="mt-2 text-sm text-ink/80">{study.description}</p>
                </div>
              </Link>
            ))}
        </SnapSlider>
        <p className="mt-4">
          <Link href="/case-studies/">View all case studies</Link>
        </p>
        </div>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className="mx-auto max-w-[1120px] px-4">
          <h2 className="text-3xl font-semibold">Floor preparation, restoration, and finishes</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {hubs.map((hub, index) => (
              <Reveal key={hub.href} delay={index * 70} className={index === 1 ? "md:mt-8" : ""}>
                <Link href={hub.href} className="service-card block h-full rounded-2xl bg-white p-6 text-ink no-underline">
                  <h3 className="text-xl">{hub.title}</h3>
                  <p className="mt-3 text-ink/80">{hub.text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-white/90">
            <Link href="/cities-we-serve/" className="text-amber">
              Cities we serve
            </Link>{" "}
            across the Front Range, from Fort Collins to Colorado Springs and the mountain towns.
          </p>
        </div>
      </section>

      <EstimateForm heading="Contact us" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "True Finishing",
          url: "https://truefinishing.com/",
          about: { "@id": "https://truefinishing.com/#business" },
        }}
      />
    </>
  );
}
