"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { ItineraryDay } from "@/data/site";

/** Vertical route line that draws itself as you scroll, lighting up each day's waypoint. */
export default function Itinerary({ days }: { days: ItineraryDay[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".it-line-fill",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 65%", end: "bottom 65%", scrub: true } },
      );
      gsap.utils.toArray<HTMLElement>(".it-item").forEach((item) => {
        const dot = item.querySelector(".it-dot");
        const card = item.querySelector(".it-card");
        gsap.from(card, {
          y: 50,
          rotateX: -14,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: item, start: "top 80%" },
        });
        gsap.to(dot, {
          backgroundColor: "#025f32",
          color: "#ffffff",
          scale: 1.08,
          duration: 0.4,
          scrollTrigger: { trigger: item, start: "top 65%", toggleActions: "play none none reverse" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className="perspective relative space-y-6">
      <span className="absolute bottom-6 left-[1.6rem] top-6 w-0.5 rounded bg-ink/10" aria-hidden />
      <span className="it-line-fill absolute bottom-6 left-[1.6rem] top-6 w-0.5 origin-top rounded bg-linear-to-b from-pine-600 via-glacier-500 to-alpen-400" aria-hidden />
      {days.map((d) => (
        <li key={d.day} className="it-item relative grid grid-cols-[3.25rem_1fr] gap-4 sm:gap-6">
          <div className="it-dot relative z-10 flex size-[3.25rem] flex-col items-center justify-center rounded-2xl border-2 border-pine-700/20 bg-white text-center font-extrabold text-pine-700 shadow-sm">
            <span className="text-[9px] leading-none tracking-widest">DAY</span>
            <span className="mt-1 text-lg leading-none">{String(d.day).padStart(2, "0")}</span>
          </div>
          <div className="it-card rounded-3xl border border-ink/8 bg-white p-6 shadow-[0_20px_50px_-35px_rgba(6,29,21,.5)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-glacier-700">Day {d.day}</p>
            <h3 className="mt-2 text-lg font-extrabold tracking-tight sm:text-xl">{d.title}</h3>
            <p className="mt-3 leading-relaxed text-ink/70">{d.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
