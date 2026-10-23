"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { destinations } from "@/data/site";
import { SplitHeading } from "@/components/ui/Reveal";

const N = destinations.length;
const STEP = 360 / N;

export default function DestinationsRing() {
  const ref = useRef<HTMLElement>(null);
  const [front, setFront] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const ring = ref.current!.querySelector(".ring")!;
        gsap.set(ring, { rotateY: 0 });
        gsap.to(ring, {
          rotateY: -STEP * (N - 1),
          ease: "none",
          // The stage is CSS-sticky inside a tall section, so no JS pinning (and no layout shift).
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            snap: { snapTo: 1 / (N - 1), duration: 0.6, ease: "power2.inOut" },
            onUpdate: (self) => setFront(Math.round(self.progress * (N - 1))),
          },
        });
      });
      gsap.from(".ring-intro > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const active = destinations[front];

  return (
    <section ref={ref} className="relative bg-night text-white md:h-[320svh]">
      <div className="ring-stage relative flex flex-col overflow-hidden py-24 md:sticky md:top-0 md:h-svh md:py-0">
        {/* Ambient backdrop of the front destination */}
        <div className="absolute inset-0 hidden md:block">
          {destinations.map((d, i) => (
            <Image
              key={d.name}
              src={d.image}
              alt=""
              fill
              sizes="160px"
              className={`scale-110 object-cover blur-lg transition-opacity duration-1000 ${i === front ? "opacity-35" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-linear-to-b from-night via-night/40 to-night" />
        </div>

        <div className="container-x relative z-10 md:pt-24">
          <div className="ring-intro flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow text-glacier-300">Where we go</span>
              <SplitHeading className="heading-lg mt-4">
                Explore Our <span className="serif-accent text-alpen-300">Destinations</span>
              </SplitHeading>
            </div>
            <Link href="/destinations" className="group inline-flex items-center gap-2 font-bold text-white/85 hover:text-white">
              View All Destinations
              <span className="grid size-10 place-items-center rounded-full border border-white/25 transition-colors group-hover:bg-white group-hover:text-night">
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </div>
        </div>

        {/* Desktop: 3D rotating ring */}
        <div className="relative z-10 hidden flex-1 items-center justify-center md:flex">
          {destinations.map((d, i) => (
            <div
              key={d.name}
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center text-[11vw] font-extrabold uppercase leading-none tracking-[-0.05em] text-white/5 transition-opacity duration-700 ${i === front ? "opacity-100" : "opacity-0"}`}
            >
              {d.name}
            </div>
          ))}
          <div className="relative h-[420px] w-[300px]" style={{ perspective: "1700px", perspectiveOrigin: "50% 15%" }}>
            <div className="preserve-3d absolute inset-0" style={{ transform: "translateZ(-460px)" }}>
            <div className="ring preserve-3d absolute inset-0">
              {destinations.map((d, i) => (
                <Link
                  key={d.name}
                  href={`/contact-us?destination=${encodeURIComponent(d.name)}#custom-trip-quote`}
                  className="group backface-hidden absolute inset-0 overflow-hidden rounded-[1.75rem] border border-white/15 shadow-[0_40px_80px_-30px_rgba(0,0,0,.9)]"
                  style={{ transform: `rotateY(${i * STEP}deg) translateZ(460px)` }}
                >
                  <Image src={d.image} alt={`${d.name} landscape`} fill sizes="280px" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-linear-to-t from-night via-night/20 to-transparent" />
                  <div className="absolute inset-x-5 top-5 flex justify-between text-xs font-bold">
                    <span className="rounded-full bg-night/45 px-3 py-1">0{i + 1}</span>
                    <span className="rounded-full bg-night/45 px-3 py-1 tracking-[0.2em]">EXPLORE</span>
                  </div>
                  <div className="absolute inset-x-5 bottom-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-glacier-300">{d.tag}</p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight">{d.name}</p>
                  </div>
                </Link>
              ))}
            </div>
            </div>
          </div>
        </div>

        {/* Active destination caption (desktop) */}
        <div className="container-x relative z-10 hidden pb-10 md:block">
          <div className="flex items-end justify-between gap-8">
            <div key={active.name} className="max-w-md animate-[fadeUp_.8s_cubic-bezier(.16,1,.3,1)]">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-alpen-300">
                0{front + 1} · {active.tag}
              </p>
              <p className="mt-2 text-white/75">{active.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {destinations.map((d, i) => (
                <span key={d.name} className={`h-1 rounded-full transition-all duration-500 ${i === front ? "w-10 bg-alpen-400" : "w-4 bg-white/25"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: swipeable cards */}
        <div className="no-scrollbar relative z-10 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:hidden">
          {destinations.map((d, i) => (
            <Link
              key={d.name}
              href={`/contact-us?destination=${encodeURIComponent(d.name)}#custom-trip-quote`}
              className="relative h-[420px] w-[78vw] shrink-0 snap-center overflow-hidden rounded-[1.75rem]"
            >
              <Image src={d.image} alt={`${d.name} landscape`} fill sizes="80vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-night via-night/20 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-md">0{i + 1}</span>
              <div className="absolute inset-x-5 bottom-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-glacier-300">{d.tag}</p>
                <p className="mt-1 text-2xl font-extrabold">{d.name}</p>
                <p className="mt-2 text-sm text-white/75">{d.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-alpen-300">
                  Plan Your Trip <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="container-x relative z-10 mt-8 pb-4 text-xs text-white/40 md:mt-0">
          Photos are here for inspiration and may not show the exact departures or accommodation on our trips.
        </p>
      </div>
    </section>
  );
}
