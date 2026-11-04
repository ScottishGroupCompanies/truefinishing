"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-grey/70 bg-base/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1120px] items-center gap-4 px-4 py-3">
        <Link href="/" className="shrink-0" aria-label="True Finishing home">
          {/* SVG wordmark from the live site. next/image blocks SVG unless dangerouslyAllowSVG is on. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/true-logo-black.svg" alt="True Finishing" width={150} height={62} className="h-12 w-auto" />
        </Link>
        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <a href={item.href} className="inline-flex items-center rounded-full px-3 py-2 text-sm text-ink hover:bg-white">
                  {item.label}
                </a>
                <div className="invisible absolute left-0 top-full z-20 min-w-64 rounded-lg border border-grey bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <a key={child.href} href={child.href} className="block rounded-md px-3 py-2 text-sm text-ink hover:bg-base">
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm text-ink hover:bg-white">
                {item.label}
              </a>
            ),
          )}
          <Link href="/contact/#contact" className="btn ml-2">
            Get a Free Estimate
          </Link>
        </nav>
        <button
          type="button"
          className="ml-auto rounded-full border border-ink px-3 py-2 text-sm lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-grey bg-base px-4 py-3 lg:hidden" aria-label="Mobile">
          {NAV.map((item) => (
            <div key={item.href} className="border-b border-grey/60 py-2">
              <a href={item.href} className="font-medium text-ink" onClick={() => setOpen(false)}>
                {item.label}
              </a>
              {item.children ? (
                <div className="mt-1 flex flex-col pl-3">
                  {item.children.map((child) => (
                    <a key={child.href} href={child.href} className="py-1 text-sm text-ink" onClick={() => setOpen(false)}>
                      {child.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <Link href="/contact/#contact" className="btn mt-3" onClick={() => setOpen(false)}>
            Get a Free Estimate
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
