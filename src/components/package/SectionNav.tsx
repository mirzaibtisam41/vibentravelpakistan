"use client";

import { useEffect, useState } from "react";
import { scrollToId } from "@/components/providers/SmoothScroll";
import { visibleById } from "@/lib/dom";
import { cn } from "@/lib/utils";

/** Jump links that highlight the section currently in view. */
export default function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    items.forEach((i) => {
      const el = visibleById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-ink/8 bg-white/85 p-1.5 shadow-[0_15px_40px_-25px_rgba(6,29,21,.5)] backdrop-blur-xl"
    >
      {items.map((i) => (
        <button
          key={i.id}
          onClick={() => {
            setActive(i.id);
            scrollToId(i.id);
          }}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors",
            active === i.id ? "bg-pine-700 text-white" : "text-ink/60 hover:text-ink",
          )}
        >
          {i.label}
        </button>
      ))}
    </nav>
  );
}
