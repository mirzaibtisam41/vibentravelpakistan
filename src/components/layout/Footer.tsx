"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { nav, site } from "@/data/site";
import { LogoMark, InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { generalWhatsapp } from "@/lib/utils";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".wa-card", {
        y: 80,
        rotateX: -18,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: { trigger: ".wa-card", start: "top 90%" },
      });
      gsap.from(".foot-giant", {
        yPercent: 60,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ".foot-giant", start: "top 100%" },
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="relative overflow-hidden bg-night text-white">
      {/* WhatsApp group CTA */}
      <div className="container-x perspective relative z-10 pt-20">
        <div className="wa-card grain relative overflow-hidden rounded-[2rem] bg-linear-to-br from-pine-700 via-pine-800 to-pine-900 p-8 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-20 -top-28 size-[28rem] rounded-full bg-glacier-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-10 size-[22rem] rounded-full bg-alpen-400/20 blur-3xl" />
          <LogoMark className="pointer-events-none absolute -bottom-16 -right-10 size-72 rotate-12 text-white/[0.06]" />
          <div className="relative grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="eyebrow text-glacier-300">Stay in the loop</span>
              <h2 className="heading-lg mt-4 max-w-2xl">
                Get exclusive trip discounts <span className="serif-accent text-alpen-300">and travel updates.</span>
              </h2>
              <p className="mt-4 max-w-xl text-white/75">
                Join our WhatsApp group to hear about special offers and upcoming departures before anyone else.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <a href={site.whatsappGroup} target="_blank" rel="noreferrer" className="btn btn-primary min-h-14! px-7! text-base">
                <WhatsAppIcon className="size-5" /> Join Our WhatsApp Group
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x relative z-10 grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-pine-700">
              <LogoMark className="size-7 text-white" />
            </span>
            <span className="leading-none">
              <span className="block text-lg font-extrabold">Vibe &amp; Travel</span>
              <span className="block text-[11px] font-bold tracking-[0.42em] text-alpen-300">PAKISTAN</span>
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-lg text-white/80">
            {site.tagline}
            <br />
            <span className="text-white/55">{site.taglineSub}</span>
          </p>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition-colors hover:border-alpen-400 hover:text-alpen-300"
          >
            <InstagramIcon className="size-4" /> {site.instagramHandle}
          </a>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/45">Explore</h3>
          <ul className="mt-5 space-y-3">
            {nav.slice(1).map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="group inline-flex items-center gap-2 text-lg font-semibold text-white/85 hover:text-white">
                  {n.label}
                  <ArrowUpRight className="size-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/45">Let’s Talk Travel</h3>
          <p className="mt-5 text-white/75">
            Planning your next mountain escape?
            <br />
            Let’s figure it out together.
          </p>
          <a href={`tel:+${site.phoneRaw}`} className="mt-5 flex items-center gap-3 text-2xl font-extrabold tracking-tight hover:text-alpen-300">
            <Phone className="size-5 text-glacier-400" /> {site.phone}
          </a>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact-us#custom-trip-quote" className="btn btn-primary">
              Plan a Custom Trip
            </Link>
            <a href={generalWhatsapp} target="_blank" rel="noreferrer" className="btn btn-glass">
              <WhatsAppIcon className="size-4" /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      <div className="foot-giant pointer-events-none select-none px-4 text-center text-[17vw] font-extrabold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.12)]">
        PAKISTAN
      </div>

      <div className="container-x relative z-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 pb-24 text-sm text-white/50 sm:flex-row sm:pb-6 sm:pr-24">
        <p>© 2026 Vibe &amp; Travel Pakistan. All rights reserved.</p>
        <p>
          Developed by{" "}
          <a href={site.developer.url} target="_blank" rel="noreferrer" className="text-white/80 hover:text-alpen-300">
            {site.developer.name}
          </a>
        </p>
      </div>
    </footer>
  );
}
