"use client";

import { useRef } from "react";

export function SnapSlider({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function move(direction: number) {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollBy({ left: direction * node.clientWidth * 0.86, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-semibold">{label}</h2>
        <div className="flex gap-2">
          <button type="button" className="slider-btn" onClick={() => move(-1)} aria-label="Previous projects">
            Prev
          </button>
          <button type="button" className="slider-btn" onClick={() => move(1)} aria-label="Next projects">
            Next
          </button>
        </div>
      </div>
      <div ref={ref} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
        {children}
      </div>
    </div>
  );
}
