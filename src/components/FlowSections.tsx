import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { allImages, blocksFromMarkdown, leadSentences, type FlowBlock, type FlowImage } from "@/lib/flow";
import { MarkdownBody } from "./MarkdownBody";
import { Reveal } from "./Reveal";

function Copy({ block }: { block: FlowBlock }) {
  return (
    <div>
      {block.heading ? <MarkdownBody source={`## ${block.heading}`} /> : null}
      {block.markdown ? <MarkdownBody source={block.markdown} /> : null}
    </div>
  );
}

function Frame({ image, className = "" }: { image: FlowImage; className?: string }) {
  return (
    <div className={`relative min-h-[280px] overflow-hidden rounded-2xl bg-ink shadow-xl ${className}`}>
      <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 48vw, 100vw" className="object-cover" />
    </div>
  );
}

function Caption({ children }: { children: string }) {
  if (!children.trim()) return null;
  return <figcaption className="mt-2 text-sm leading-snug text-ink/80">{children}</figcaption>;
}

function GraphicPanel({ title }: { title: string }) {
  return (
    <div className="flex min-h-[280px] items-end rounded-2xl bg-ink p-8 text-white shadow-xl">
      <p className="text-3xl font-semibold leading-tight md:text-4xl">{title || "True Finishing"}</p>
    </div>
  );
}

function CtaBand() {
  return (
    <section className="bg-amber">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-4 py-8">
        <p className="text-2xl font-semibold text-ink">Get a Free Estimate</p>
        <div className="flex flex-wrap gap-3">
          <a href="tel:303-761-1012" className="btn bg-white">
            Call 303-761-1012
          </a>
          <Link href="#contact" className="btn btn-ink">
            Get a Free Estimate
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatStrip({ blocks }: { blocks: FlowBlock[] }) {
  return (
    <section className="bg-ink py-14 text-white">
      <div className="mx-auto grid max-w-[1120px] gap-8 px-4 md:grid-cols-3">
        {blocks.map((block) => {
          const [lead, ...rest] = block.markdown.split(/\n\n+/);
          return (
            <Reveal key={block.heading}>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber">{block.heading}</p>
              <p className="mt-3 text-4xl font-semibold leading-none">{lead}</p>
              {rest.length ? (
                <div className="mt-3 text-sm text-white/80 [&_.prose]:text-white/80 [&_p]:text-white/80">
                  <MarkdownBody source={rest.join("\n\n")} />
                </div>
              ) : null}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function StepCards({ block }: { block: FlowBlock }) {
  const comparison = block.steps.length >= 2 && block.steps.every((step) => /before|during|after/i.test(step.title));
  return (
    <section className="mark py-16">
      <div className="mx-auto max-w-[1120px] px-4">
        <Reveal>
          <Copy block={{ ...block, steps: [], ordered: [] }} />
        </Reveal>
        <div className={`mt-8 grid gap-5 ${comparison ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {block.steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 60} className={!comparison && index % 3 === 1 ? "lg:mt-8" : ""}>
              <article className="service-card h-full overflow-hidden rounded-2xl border border-grey bg-white">
                {step.images[0] ? (
                  <div className="relative aspect-[4/3]">
                    <Image src={step.images[0].src} alt={step.images[0].alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-ink px-5 py-4 text-white">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-amber text-sm font-semibold text-ink">{index + 1}</span>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>
                )}
                <div className="p-5">
                  {step.images[0] ? <h3 className="text-xl font-semibold">{step.title}</h3> : null}
                  {step.markdown ? <MarkdownBody source={step.markdown} /> : null}
                  {!step.markdown && (step.images[0]?.alt || leadSentences(block.markdown, 1)) ? (
                    <p className="mt-2 text-sm leading-snug text-ink/80">
                      {step.images[0]?.alt || leadSentences(block.markdown, 1)}
                    </p>
                  ) : null}
                  {step.images.slice(1).map((image) => (
                    <div key={image.src} className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl">
                      <Image src={image.src} alt={image.alt} fill sizes="33vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessBand({ block }: { block: FlowBlock }) {
  return (
    <section className="mark mark-right py-16">
      <div className="mx-auto max-w-[1120px] px-4">
        {block.heading || block.markdown ? (
          <Reveal>
            <Copy block={{ ...block, ordered: [] }} />
          </Reveal>
        ) : null}
        <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {block.ordered.map((item, index) => (
            <li key={item.slice(0, 40)} className="service-card rounded-2xl bg-white p-5 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-amber text-sm font-semibold text-ink">{index + 1}</span>
              <div className="mt-3">
                <MarkdownBody source={item} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Split({ block, image, flip }: { block: FlowBlock; image?: FlowImage; flip: boolean }) {
  return (
    <section className={`mark py-14 md:py-20 ${flip ? "mark-right" : ""}`}>
      <Reveal>
        <div className="mx-auto grid max-w-[1120px] items-center gap-8 px-4 md:grid-cols-2 md:gap-16">
          <div className={flip ? "md:order-2" : ""}>
            <Copy block={block} />
          </div>
          <div className={flip ? "md:-ml-8" : "md:-mr-8"}>
            {image ? <Frame image={image} className="aspect-[4/3]" /> : <GraphicPanel title={block.heading} />}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function FlowSections({ source }: { source: string }) {
  const blocks = blocksFromMarkdown(source);
  const pool = allImages(blocks);
  let imageCursor = 0;
  let proseCount = 0;
  const nodes: ReactNode[] = [];

  for (let index = 0; index < blocks.length; ) {
    if (blocks[index].stat) {
      const group: FlowBlock[] = [];
      while (index < blocks.length && blocks[index].stat) {
        group.push(blocks[index]);
        index += 1;
      }
      nodes.push(<StatStrip key={`stat-${index}`} blocks={group} />);
      continue;
    }
    const block = blocks[index];
    if (block.steps.length >= 2) {
      nodes.push(<StepCards key={`steps-${index}`} block={block} />);
    } else if (block.ordered.length >= 3) {
      nodes.push(<ProcessBand key={`process-${index}`} block={block} />);
    } else {
      const own = block.images[0];
      const image = own || pool[imageCursor % Math.max(pool.length, 1)];
      if (!own && pool.length) imageCursor += 1;
      nodes.push(<Split key={`split-${index}`} block={block} image={pool.length ? image : undefined} flip={proseCount % 2 === 1} />);
      if (block.images.length > 1) {
        const extraLead = leadSentences(block.markdown, 1);
        nodes.push(
          <section key={`grid-${index}`} className="mark pb-16">
            <div className="mx-auto max-w-[1120px] px-4">
              {block.heading ? <h2 className="text-3xl font-semibold">{block.heading}</h2> : null}
              {extraLead ? <p className="mt-3 max-w-3xl">{extraLead}</p> : null}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {block.images.slice(1).map((imageItem, imageIndex) => (
                  <Reveal key={imageItem.src} delay={imageIndex * 50}>
                    <figure>
                      <Frame image={imageItem} className="aspect-[4/3]" />
                      <Caption>{imageItem.alt}</Caption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>,
        );
      }
      proseCount += 1;
      if (proseCount % 2 === 0) nodes.push(<CtaBand key={`cta-${index}`} />);
    }
    index += 1;
  }

  if (pool.length >= 3) {
    const sourceBlock = blocks.find(
      (block) => !block.stat && block.heading && leadSentences(block.markdown, 1),
    );
    const galleryTitle = sourceBlock?.heading || blocks.find((block) => block.heading)?.heading || "";
    const galleryText = leadSentences(sourceBlock?.markdown || "", 2);
    nodes.push(
      <section key="gallery" className="mark py-16">
        <div className="mx-auto max-w-[1120px] px-4">
          {galleryTitle ? <h2 className="text-3xl font-semibold">{galleryTitle}</h2> : null}
          {galleryText ? <p className="mt-3 max-w-3xl">{galleryText}</p> : null}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pool.map((image, imageIndex) => (
              <Reveal key={image.src} delay={(imageIndex % 3) * 50} className={imageIndex % 3 === 1 ? "lg:mt-8" : ""}>
                <figure>
                  <Frame image={image} className="aspect-[4/3]" />
                  <Caption>{image.alt}</Caption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>,
    );
  }

  return <div className="marketing-flow">{nodes}</div>;
}
