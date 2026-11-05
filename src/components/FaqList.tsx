import { MarkdownBody } from "./MarkdownBody";
import type { Faq } from "@/lib/types";

export function FaqList({ items }: { items: Faq[] }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-[1120px] px-4 py-16">
      <h2 className="text-3xl font-semibold">Questions we hear</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <details key={item.q} className="rounded-2xl border border-grey bg-base p-5">
            <summary className="cursor-pointer text-lg font-medium marker:text-amber">{item.q}</summary>
            <div className="pt-3 text-ink">
              <MarkdownBody source={item.a} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
