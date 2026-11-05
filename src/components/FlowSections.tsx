import Image from "next/image";
import { blocksFromMarkdown, type FlowBlock } from "@/lib/flow";
import { MarkdownBody } from "./MarkdownBody";
import { Reveal } from "./Reveal";

function BlockCopy({ block }: { block: FlowBlock }) {
  return (
    <div>
      {block.heading ? <MarkdownBody source={`## ${block.heading}`} /> : null}
      {block.markdown ? <MarkdownBody source={block.markdown} /> : null}
    </div>
  );
}

function Frame({ image, className = "" }: { image: FlowBlock["images"][number]; className?: string }) {
  return (
    <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink shadow-xl ${className}`}>
      <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 46vw, 100vw" className="object-cover" />
    </div>
  );
}

export function FlowSections({ source }: { source: string }) {
  const blocks = blocksFromMarkdown(source);
  return (
    <div>
      {blocks.map((block, index) => {
        const flip = index % 2 === 1;
        const tone = index % 2 === 0 ? "bg-white" : "bg-base";
        if (block.images.length === 1) {
          return (
            <section key={`${block.heading}-${index}`} className={`${tone} py-14 md:py-20`}>
              <Reveal>
                <div className="mx-auto grid max-w-[1120px] items-center gap-8 px-4 md:grid-cols-2 md:gap-14">
                  <div className={flip ? "md:order-2" : ""}>
                    <BlockCopy block={block} />
                  </div>
                  <Frame image={block.images[0]} className={flip ? "md:-ml-6" : "md:-mr-6"} />
                </div>
              </Reveal>
            </section>
          );
        }
        if (block.images.length > 1) {
          return (
            <section key={`${block.heading}-${index}`} className={`${tone} py-14 md:py-20`}>
              <div className="mx-auto max-w-[1120px] px-4">
                <Reveal>
                  <BlockCopy block={block} />
                </Reveal>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {block.images.map((image, imageIndex) => (
                    <Reveal key={image.src + imageIndex} delay={imageIndex * 70} className={imageIndex === 1 ? "lg:mt-8" : ""}>
                      <Frame image={image} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          );
        }
        return (
          <section key={`${block.heading}-${index}`} className={`${tone} py-12 md:py-16`}>
            <Reveal>
              <div className="prose-wrap mx-auto max-w-[760px] px-4">
                <BlockCopy block={block} />
              </div>
            </Reveal>
          </section>
        );
      })}
    </div>
  );
}
