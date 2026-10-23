"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, tilt, useGSAP } from "@/lib/gsap";
import { site } from "@/data/site";
import { InstagramIcon } from "@/components/ui/Icons";
import { SplitHeading } from "@/components/ui/Reveal";

const photos = [
  { src: "/images/group-1.webp", alt: "Vibe & Travel Pakistan travelers enjoying a group trip together" },
  { src: "/images/group-2.webp", alt: "A small group of travelers enjoying a scenic mountain lake" },
];

/** Two polaroid-style photos that swing apart in 3D as you scroll through. */
export default function Moments() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".m-stage", start: "top 85%", end: "bottom 30%", scrub: 1 },
      });
      tl.fromTo(".m-photo-0", { rotateY: tilt(35), rotateZ: -14, x: "18%", y: 80 }, { rotateY: tilt(-8), rotateZ: -5, x: "0%", y: 0, ease: "none" }, 0).fromTo(
        ".m-photo-1",
        { rotateY: tilt(-35), rotateZ: 14, x: "-18%", y: 140 },
        { rotateY: tilt(8), rotateZ: 4, x: "0%", y: 30, ease: "none" },
        0,
      );
      gsap.from(".m-copy > *", { y: 30, opacity: 0, stagger: 0.12, scrollTrigger: { trigger: ".m-copy", start: "top 80%" } });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-pine-950 py-24 text-white sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[40rem] -translate-x-1/2 rounded-full bg-glacier-500/15 blur-3xl" />
      <div className="container-x relative grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="m-copy">
          <span className="eyebrow text-glacier-300">Travel Together</span>
          <SplitHeading className="heading-lg mt-4">
            The Moments <span className="serif-accent text-alpen-300">We Share.</span>
          </SplitHeading>
          <p className="mt-5 max-w-md text-lg text-white/70">New places, new friendships, and memories that stay with us.</p>
          <a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn-primary mt-8">
            <InstagramIcon className="size-5" /> Follow on Instagram
          </a>
        </div>

        <div className="m-stage perspective relative grid grid-cols-2 gap-4 sm:gap-6">
          {photos.map((p, i) => (
            <figure
              key={p.src}
              className={`m-photo-${i} preserve-3d relative rounded-[1.5rem] bg-white p-2.5 pb-12 shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] sm:p-3 sm:pb-14`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem]">
                <Image src={p.src} alt={p.alt} fill sizes="(max-width:1024px) 50vw, 30vw" className="object-cover" />
              </div>
              <figcaption className="absolute inset-x-4 bottom-3.5 flex items-center justify-between text-xs font-bold text-ink sm:bottom-4">
                <span className="text-stone">{site.instagramHandle}</span>
                <InstagramIcon className="size-4 text-pine-700" />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
