import Link from "next/link";

export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-3 px-4 py-3">
        <p className="hidden text-sm text-white sm:block">Get a Free Estimate</p>
        <div className="flex w-full gap-2 sm:w-auto">
          <a href="tel:303-761-1012" className="btn flex-1 bg-white sm:flex-none">
            Call 303-761-1012
          </a>
          <Link href="#contact" className="btn flex-1 sm:flex-none">
            Get a Free Estimate
          </Link>
        </div>
      </div>
    </div>
  );
}
