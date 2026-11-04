import { MarkdownBody } from "./MarkdownBody";
import type { Faq } from "@/lib/types";

export function FaqList({ items }: { items: Faq[] }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-[720px] px-4 py-8">
      <h2 className="text-2xl font-semibold">Questions we hear</h2>
      <div className="mt-4 divide-y divide-grey border-y border-grey">
        {items.map((item) => (
          <details key={item.q} className="group py-3">
            <summary className="cursor-pointer text-lg font-medium marker:text-amber">{item.q}</summary>
            <div className="pt-2 text-ink">
              <MarkdownBody source={item.a} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
