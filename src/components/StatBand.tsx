"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  {
    kicker: "We’ve installed over",
    target: 2_000_000,
    render: (n: number) => `${n.toLocaleString("en-US")} sq ft`,
    note: "For the last 30 years, True has committed the time and expertise to everything flooring.",
  },
  {
    kicker: "Guarantee",
    target: 25,
    render: (n: number) => `${n} year warranty`,
    note: "When you moisture mitigate, we can warranty your floor restoration project for 25 years.",
  },
  {
    kicker: "Projects completed",
    target: 20_000,
    render: (n: number) => `${n.toLocaleString("en-US")}+`,
    note: "Since 2007, we’ve prepped, renovated, and installed floor finishings for clients.",
  },
];

function useCount(target: number, active: boolean) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const duration = 1100;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);
  return value;
}

function Stat({ item, active }: { item: (typeof STATS)[number]; active: boolean }) {
  const value = useCount(item.target, active);
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl">
      <p className="text-sm uppercase tracking-wide text-muted">{item.kicker}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{item.render(value)}</p>
      <p className="mt-3 text-sm text-muted">{item.note}</p>
    </div>
  );
}

export function StatBand() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid gap-4 md:grid-cols-3">
      {STATS.map((item) => (
        <Stat key={item.kicker} item={item} active={active} />
      ))}
    </div>
  );
}
