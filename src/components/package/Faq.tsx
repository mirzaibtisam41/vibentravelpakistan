"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    refs.current.forEach((el, j) => {
      if (!el) return;
      gsap.to(el, { height: j === next ? "auto" : 0, duration: 0.5, ease: "expo.out" });
    });
    setOpen(next);
  };

  return (
    <div className="divide-y divide-ink/8 overflow-hidden rounded-3xl border border-ink/8 bg-white">
      {items.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => toggle(i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-bold transition-colors hover:bg-snow"
          >
            {f.q}
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-full transition-all duration-500",
                open === i ? "rotate-45 bg-pine-700 text-white" : "bg-snow text-pine-700",
              )}
            >
              <Plus className="size-4" />
            </span>
          </button>
          <div ref={(el) => void (refs.current[i] = el)} className="overflow-hidden" style={{ height: i === 0 ? "auto" : 0 }}>
            <p className="px-6 pb-6 leading-relaxed text-ink/70">{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
