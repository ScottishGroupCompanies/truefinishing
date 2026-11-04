import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { EstimateForm } from "@/components/EstimateForm";
import { JsonLd } from "@/components/JsonLd";
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

export default function HomePage() {
  const studies = caseStudies().slice(0, 3);
  return (
    <>
      <section className="relative min-h-[560px] bg-ink text-white">
        <Image
          src="/images/tile-carpet-floor-finishings-floor-prep-case-016.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="relative mx-auto flex min-h-[560px] max-w-[1120px] flex-col justify-end px-4 py-16">
          <h1 className="max-w-[18ch] text-4xl font-semibold leading-tight md:text-5xl">
            Denver’s trusted experts in flooring prep, concrete polishing, and concrete finishing.
          </h1>
          <p className="mt-4 max-w-[62ch] text-lg text-white/95">
            At True Finishing, we’re committed to bringing you the best quality in service and products. Floor
            preparation, restoration, and finishings for the Colorado Front Range.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact/#contact" className="btn">
              Get a Free Estimate
            </Link>
            <a href={BUSINESS.phoneHref} className="btn bg-white">
              Call {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 py-14">
        <h2 className="max-w-[24ch] text-3xl font-semibold">
          Leaders in floor preparation, floor restoration, and floor finishings in Denver, Colorado
        </h2>
        <p className="mt-4 max-w-[70ch]">
          At True Finishing, we’ve been Denver’s one-stop shop for floors since 2007. We prepare the slab, level it,
          and finish it. Epoxy, polished concrete, microtoppings, tile, vinyl, and carpet all start with that same
          prep.
        </p>
        <p className="mt-3">
          <Link href="/about/">Get to know us.</Link>
        </p>
      </section>

      <section className="mx-auto grid max-w-[1120px] gap-4 px-4 pb-14 sm:grid-cols-2">
        {services.map((service) => (
          <a key={service.href} href={service.href} className="group overflow-hidden rounded-lg bg-white text-ink no-underline shadow-sm">
            <div className="relative aspect-[16/9]">
              <Image src={service.image} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-[1.02]" />
            </div>
            <div className="p-5">
              <h2 className="text-2xl">{service.title}</h2>
              <p className="mt-2 text-ink/80">{service.text}</p>
            </div>
          </a>
        ))}
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1120px] gap-8 px-4 py-14 md:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted">We’ve installed over</p>
            <p className="mt-1 text-3xl font-semibold">2,000,000 sq ft</p>
            <p className="mt-2 text-sm text-muted">
              For the last 30 years, True has committed the time and expertise to everything flooring.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-muted">Guarantee</p>
            <p className="mt-1 text-3xl font-semibold">25 year warranty</p>
            <p className="mt-2 text-sm text-muted">
              When you moisture mitigate, we can warranty your floor restoration project for 25 years.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-muted">Projects completed</p>
            <p className="mt-1 text-3xl font-semibold">20,000+</p>
            <p className="mt-2 text-sm text-muted">
              Since 2007, we’ve prepped, renovated, and installed floor finishings for clients.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 py-14">
        <h2 className="text-3xl font-semibold">Work across the Front Range</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {studies.map((study) => (
            <li key={study.path}>
              <a href={study.path} className="block rounded-lg bg-white p-4 text-ink no-underline shadow-sm">
                <h3 className="text-xl">{study.h1}</h3>
                <p className="mt-2 text-sm text-ink/80">{study.description}</p>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Link href="/case-studies/">View all case studies</Link>
        </p>
      </section>

      <section className="border-y border-grey bg-white">
        <div className="mx-auto max-w-[1120px] px-4 py-10">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-muted">Clients</h2>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-8">
            {CLIENTS.map((logo) => (
              <li key={logo.src} className="relative h-12 w-28">
                <Image src={logo.src} alt={logo.alt} fill sizes="112px" className="object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 py-14">
        <h2 className="text-3xl font-semibold">Floor preparation, restoration, and finishes</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Link href="/floor-preparation/" className="rounded-lg bg-white p-5 text-ink no-underline">
            <h3 className="text-xl">Concrete floor prep</h3>
            <p className="mt-2">Grinding, shaving, and scarifying so tile, carpet, coatings, and polish have a sound surface.</p>
          </Link>
          <Link href="/floor-restoration/" className="rounded-lg bg-white p-5 text-ink no-underline">
            <h3 className="text-xl">Floor restoration</h3>
            <p className="mt-2">Leveling, moisture control, and overlays before the finished floor goes down.</p>
          </Link>
          <Link href="/floor-finishings/" className="rounded-lg bg-white p-5 text-ink no-underline">
            <h3 className="text-xl">Floor finishes</h3>
            <p className="mt-2">Polished concrete, epoxy, microtoppings, vinyl, tile, and carpet.</p>
          </Link>
        </div>
        <p className="mt-6">
          <Link href="/cities-we-serve/">Cities we serve</Link> across the Front Range, from Fort Collins to Colorado Springs and the mountain towns.
        </p>
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
