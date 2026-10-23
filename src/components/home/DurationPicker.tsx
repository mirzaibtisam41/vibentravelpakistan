"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { gsap, tilt, useGSAP } from "@/lib/gsap";
import { durations, packages } from "@/data/site";
import { SplitHeading } from "@/components/ui/Reveal";

export default function DurationPicker() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".dur-tile", {
        rotateY: tilt(-100),
        rotateX: tilt(20),
        z: tilt(-200),
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: ".dur-grid", start: "top 85%" },
      });
      gsap.from(".dur-sub", { y: 24, opacity: 0, duration: 1, scrollTrigger: { trigger: ref.current, start: "top 75%" } });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-snow py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-10 size-[30rem] rounded-full bg-glacier-300/25 blur-3xl" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow text-pine-700">Your Time. Your Adventure.</span>
          <SplitHeading className="heading-lg mt-4">
            Find Your Kind <span className="serif-accent text-pine-700">Of Escape.</span>
          </SplitHeading>
          <p className="dur-sub mt-5 text-lg text-stone">
            A quick reset or a longer journey? Start with the time you have.
          </p>
        </div>

        <div className="dur-grid perspective mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {durations.map((d, i) => {
            const count = packages.filter((p) => p.duration === d).length;
            return (
              <Link
                key={d}
                href={`/tour-packages?duration=${d}`}
                className={`dur-tile group perspective relative h-44 sm:h-52 ${i === durations.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
              >
                <div className="preserve-3d relative size-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]">
                  {/* front */}
                  <div className="backface-hidden absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border border-ink/8 bg-white p-5 shadow-[0_20px_40px_-28px_rgba(6,29,21,.5)]">
                    <div className="flex items-center justify-between">
                      <Clock className="size-5 text-pine-600" />
                      {/* Touch screens can't hover-flip, so show the trip count up front. */}
                      <span className="relative z-10 rounded-full bg-pine-700 px-2.5 py-1 text-[11px] font-bold text-white [@media(hover:hover)]:hidden">
                        {count} {count === 1 ? "trip" : "trips"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-6xl font-extrabold leading-none tracking-tighter text-ink sm:text-7xl">
                        {String(d).padStart(2, "0")}
                      </span>
                      <span className="mt-1 block text-sm font-bold uppercase tracking-[0.2em] text-stone">
                        {d === 1 ? "Day" : "Days"}
                      </span>
                    </div>
                    <span className="absolute -right-6 -top-6 size-20 rounded-full bg-glacier-300/30 transition-transform duration-700 group-hover:scale-150" />
                  </div>
                  {/* back */}
                  <div className="backface-hidden absolute inset-0 hidden flex-col justify-between rounded-3xl bg-linear-to-br from-pine-700 to-pine-900 p-5 text-white [transform:rotateY(180deg)] [@media(hover:hover)]:flex">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-glacier-300">
                      {d} {d === 1 ? "Day" : "Days"}
                    </span>
                    <div>
                      <span className="block text-4xl font-extrabold">{count}</span>
                      <span className="text-sm text-white/75">{count === 1 ? "trip" : "trips"} available</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-alpen-300">
                      View trips <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
