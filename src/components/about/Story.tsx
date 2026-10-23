"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, tilt, useGSAP } from "@/lib/gsap";
import { site } from "@/data/site";
import { SplitHeading } from "@/components/ui/Reveal";
import { InstagramIcon, LogoMark } from "@/components/ui/Icons";

/** "Our Story" with a layered 3D photo stack that unfolds on scroll. */
export default function Story() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".st-stack", start: "top 85%", end: "center 40%", scrub: 1 } });
      tl.fromTo(".st-back", { rotateY: 0, x: 0, rotateZ: 0 }, { rotateY: tilt(-18), x: "-9%", rotateZ: -6, ease: "none" }, 0)
        .fromTo(".st-front", { rotateY: tilt(25), rotateX: tilt(10), y: 60 }, { rotateY: tilt(-6), rotateX: 0, y: 0, ease: "none" }, 0)
        .fromTo(".st-badge", { z: 0, scale: 0.6, opacity: 0 }, { z: 120, scale: 1, opacity: 1, ease: "none" }, 0.2);
      gsap.from(".st-copy > p, .st-copy > a, .st-founder", { y: 30, opacity: 0, stagger: 0.12, scrollTrigger: { trigger: ".st-copy", start: "top 80%" } });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-snow py-24 sm:py-32">
      <div className="container-x grid items-center gap-16 lg:grid-cols-2">
        <div className="st-copy">
          <span className="eyebrow text-pine-700">Our Story</span>
          <SplitHeading className="heading-lg mt-4">
            For The Places. <span className="serif-accent text-pine-700">For The People.</span> For The Experience.
          </SplitHeading>
          <p className="mt-6 text-lg leading-relaxed text-ink/75">
            Vibe &amp; Travel Pakistan is about discovering Pakistan beyond the everyday — from mountain escapes and scenic road trips to trekking
            adventures and journeys shared with new people.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">
            Every journey starts with a conversation. Tell us where you want to go, when you want to travel, and what matters to you. We’ll help you
            explore the possibilities.
          </p>
          <Link href="/contact-us#custom-trip-quote" className="btn btn-green mt-8">
            Plan A Custom Trip <ArrowUpRight className="size-4" />
          </Link>

          <div className="st-founder mt-12 flex items-center gap-4 rounded-3xl border border-ink/8 bg-white p-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
              <Image src={site.founder.image} alt="Ali Malik" fill sizes="64px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold">{site.founder.name}</p>
              <p className="text-sm text-stone">{site.founder.role}</p>
            </div>
            <a href={site.founder.instagram} target="_blank" rel="noreferrer" aria-label="Founder on Instagram" className="grid size-11 place-items-center rounded-full bg-snow text-pine-700 transition-colors hover:bg-pine-700 hover:text-white">
              <InstagramIcon className="size-5" />
            </a>
          </div>
        </div>

        <div className="st-stack perspective relative mx-auto aspect-[4/5] w-full max-w-[480px]">
          <div className="st-back preserve-3d absolute inset-0 overflow-hidden rounded-[2rem] shadow-2xl">
            <Image src="/images/skardu.webp" alt="" fill sizes="480px" className="object-cover" />
            <div className="absolute inset-0 bg-night/30" />
          </div>
          <div className="st-front preserve-3d absolute inset-0 overflow-hidden rounded-[2rem] shadow-[0_50px_90px_-40px_rgba(6,29,21,.8)]">
            <Image src="/images/fairy-meadows.webp" alt="Fairy Meadows and the mountain landscape of northern Pakistan" fill sizes="480px" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-night/85 via-night/10 to-transparent" />
            <div className="absolute inset-x-7 bottom-7 text-white">
              <p className="text-xs font-bold tracking-[0.25em] text-glacier-300">MADE FOR THE JOURNEY</p>
              <p className="mt-1 text-xs font-bold tracking-[0.25em] text-white/70">DISCOVER PAKISTAN</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight">
                Find Your <span className="serif-accent text-alpen-300">Vibe.</span>
              </p>
              <p className="mt-3 text-[11px] text-white/50">Illustrative destination imagery.</p>
            </div>
          </div>
          <div className="st-badge absolute -right-4 -top-6 grid size-28 place-items-center rounded-full bg-pine-700 shadow-xl sm:-right-8">
            <LogoMark className="size-12 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
