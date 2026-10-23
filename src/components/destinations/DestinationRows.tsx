"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { destinations, packages } from "@/data/site";

const keyFor = (name: string) => name.toLowerCase().split(" ")[0];

/** Editorial rows: each photo swings in from a 3D angle and settles flat as it scrolls through. */
export default function DestinationRows() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".dr-row").forEach((row, i) => {
        const dir = i % 2 ? -1 : 1;
        gsap.fromTo(
          row.querySelector(".dr-img"),
          { rotateY: 28 * dir, rotateX: 8, scale: 0.85 },
          { rotateY: -6 * dir, rotateX: -3, scale: 1, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: 1 } },
        );
        gsap.fromTo(row.querySelector(".dr-inner"), { scale: 1.3 }, { scale: 1.05, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from(row.querySelectorAll(".dr-copy > *"), { y: 40, opacity: 0, stagger: 0.08, scrollTrigger: { trigger: row, start: "top 75%" } });
        gsap.from(row.querySelector(".dr-num"), { yPercent: 100, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 75%" } });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="space-y-24 sm:space-y-36">
      {destinations.map((d, i) => {
        const related = packages.filter((p) => `${p.name} ${p.location}`.toLowerCase().includes(keyFor(d.name)));
        return (
          <article key={d.name} className={`dr-row grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="perspective">
              <Link
                href={`/contact-us?destination=${encodeURIComponent(d.name)}#custom-trip-quote`}
                className="dr-img preserve-3d group relative block aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_50px_90px_-45px_rgba(6,29,21,.75)]"
              >
                <div className="dr-inner absolute inset-0">
                  <Image src={d.image} alt={`${d.name} landscape`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-night/60 via-transparent to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-white backdrop-blur-md">EXPLORE</span>
                <span className="absolute bottom-5 right-5 grid size-12 place-items-center rounded-full bg-alpen-400 text-night transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
            </div>
            <div className="dr-copy">
              <div className="overflow-hidden">
                <span className="dr-num block text-[5.5rem] font-extrabold leading-none tracking-tighter text-pine-700/15 sm:text-[8rem]">0{i + 1}</span>
              </div>
              <p className="eyebrow mt-2 text-glacier-700">{d.tag}</p>
              <h2 className="heading-lg mt-3">{d.name}</h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/70">{d.description}</p>
              {related.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {related.map((p) => (
                    <Link key={p.slug} href={`/tour-packages/${p.slug}`} className="chip min-h-9! text-xs!">
                      {p.name} · {p.duration}D
                    </Link>
                  ))}
                </div>
              )}
              <Link href={`/contact-us?destination=${encodeURIComponent(d.name)}#custom-trip-quote`} className="btn btn-green mt-8">
                Plan Your Trip <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
