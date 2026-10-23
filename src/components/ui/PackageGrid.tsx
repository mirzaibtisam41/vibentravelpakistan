"use client";

import { useRef, useState } from "react";
import { Mountain, Search } from "lucide-react";
import { Flip, gsap, tilt, useGSAP } from "@/lib/gsap";
import { durations, type TourPackage } from "@/data/site";
import PackageCard from "./PackageCard";

export type Filter = "all" | "hiking" | `${number}`;

export function filterPackages(list: TourPackage[], f: Filter) {
  if (f === "all") return list;
  if (f === "hiking") return list.filter((p) => p.hiking);
  return list.filter((p) => p.duration === Number(f));
}

export default function PackageGrid({
  list,
  initial = "all",
  onChange,
  searchable,
}: {
  list: TourPackage[];
  initial?: Filter;
  onChange?: (f: Filter) => void;
  searchable?: boolean;
}) {
  const [filter, setFilter] = useState<Filter>(initial);
  const [query, setQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const tabs: { label: string; value: Filter; count: number }[] = [
    { label: "All Packages", value: "all", count: list.length },
    ...durations.map((d) => ({
      label: `${d} ${d === 1 ? "Day" : "Days"}`,
      value: String(d) as Filter,
      count: list.filter((p) => p.duration === d).length,
    })),
  ];
  const hikingCount = list.filter((p) => p.hiking).length;

  const select = (f: Filter) => {
    if (f === filter) return;
    flipState.current = Flip.getState(gridRef.current!.querySelectorAll(".pkg-item"));
    setFilter(f);
    onChange?.(f);
  };

  // Animate layout change with FLIP after React commits the new list.
  useGSAP(
    () => {
      if (!flipState.current) return;
      Flip.from(flipState.current, {
        targets: gridRef.current!.querySelectorAll(".pkg-item"),
        duration: 0.8,
        ease: "expo.out",
        absolute: true,
        scale: true,
        stagger: 0.03,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85, rotateX: tilt(-25), y: 40 }, { opacity: 1, scale: 1, rotateX: 0, y: 0, duration: 0.8, stagger: 0.05 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.4 }),
      });
      flipState.current = null;
    },
    { dependencies: [filter, query], scope: gridRef },
  );

  const search = (q: string) => {
    flipState.current = Flip.getState(gridRef.current!.querySelectorAll(".pkg-item"));
    setQuery(q);
  };

  // First reveal on scroll
  useGSAP(
    () => {
      gsap.from(".pkg-item", {
        y: 80,
        rotateX: tilt(-18),
        opacity: 0,
        stagger: { each: 0.08, grid: "auto" },
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
      });
    },
    { scope: gridRef },
  );

  const q = query.trim().toLowerCase();
  const shown = filterPackages(list, filter).filter(
    (p) => !q || `${p.name} ${p.location} ${p.short}`.toLowerCase().includes(q),
  );

  return (
    <div>
      {searchable && (
        <label className="relative mb-6 block max-w-xl">
          <span className="sr-only">Search by trip or destination</span>
          <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-stone" />
          <input
            type="search"
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder="Search by trip or destination, e.g. Hunza"
            className="field min-h-14! rounded-full! pl-13! shadow-[0_15px_40px_-25px_rgba(6,29,21,.5)]"
          />
        </label>
      )}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {tabs.map((t) => (
          <button key={t.value} className="chip shrink-0" data-active={filter === t.value} onClick={() => select(t.value)} disabled={t.count === 0}>
            {t.label}
            <span className="rounded-full bg-current/10 px-1.5 text-[11px] opacity-80">{t.count}</span>
          </button>
        ))}
        <button className="chip shrink-0" data-active={filter === "hiking"} onClick={() => select("hiking")}>
          <Mountain className="size-4" /> Hiking Trips
          <span className="rounded-full bg-current/10 px-1.5 text-[11px] opacity-80">{hikingCount}</span>
        </button>
      </div>

      <div ref={gridRef} className="perspective mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <div key={p.slug} className="pkg-item" data-flip-id={p.slug}>
            <PackageCard p={p} />
          </div>
        ))}
      </div>
      {shown.length === 0 && <p className="py-16 text-center text-stone">No trips match that search. Try another destination or pick a different filter.</p>}
    </div>
  );
}
