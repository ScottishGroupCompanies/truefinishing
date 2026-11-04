import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[720px] px-4 py-20">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="mt-4">
        That address is not on this site, or the article is not published yet. Try the <Link href="/">homepage</Link>, the{" "}
        <Link href="/blog/">blog</Link>, or <Link href="/contact/">contact</Link>.
      </p>
    </section>
  );
}
