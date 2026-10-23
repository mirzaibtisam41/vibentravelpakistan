"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/components/layout/Preloader";
import { SplitHeading } from "./Reveal";

type Props = {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: ReactNode;
  text?: string;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  tall?: boolean;
};

/** Inner-page hero: the photo sits on a 3D plane that follows the pointer and sinks away on scroll. */
export default function PageHero({ image, imageAlt, eyebrow, title, text, crumbs, children, tall }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const plane = ref.current!.querySelector<HTMLElement>(".ph-plane")!;
      const fades = gsap.utils.toArray<HTMLElement>(".ph-fade");
      gsap.set(fades, { autoAlpha: 0, y: 24 });
      const off = onIntroDone(() => {
        gsap.fromTo(plane, { scale: 1.35, rotateX: 12 }, { scale: 1.12, rotateX: 0, duration: 2.2, ease: "expo.out" });
        gsap.to(fades, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 1, delay: 0.3, ease: "expo.out" });
      });

      gsap.to(plane, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".ph-copy", {
        yPercent: -30,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });

      if (!window.matchMedia("(hover: hover)").matches) return off;
      const move = (e: PointerEvent) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        gsap.to(plane, { rotateY: x * 6, rotateX: -y * 5, x: x * -30, duration: 1.2, ease: "power3.out", overwrite: "auto" });
      };
      ref.current!.addEventListener("pointermove", move);
      return () => {
        off();
        ref.current?.removeEventListener("pointermove", move);
      };
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={`relative overflow-hidden bg-night text-white ${tall ? "min-h-[100svh]" : "min-h-[78svh]"}`}>
      <div className="absolute inset-0" style={{ perspective: "1200px" }}>
        <div className="ph-plane absolute -inset-[6%] will-change-transform">
          <Image src={image} alt={imageAlt} fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-night/75 via-night/25 to-night/90" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-night/70 to-transparent" />

      <div className={`ph-copy container-x relative z-10 flex flex-col justify-end pb-16 pt-36 ${tall ? "min-h-[100svh]" : "min-h-[78svh]"}`}>
        {crumbs && (
          <nav aria-label="Breadcrumb" className="ph-fade mb-6 flex flex-wrap items-center gap-1.5 text-sm text-white/65">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <ChevronRight className="size-3.5" />}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <span className="ph-fade eyebrow text-alpen-300">{eyebrow}</span>}
        <SplitHeading as="h1" immediate delay={0.15} className="heading-xl mt-4 max-w-5xl">
          {title}
        </SplitHeading>
        {text && <p className="ph-fade mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">{text}</p>}
        {children && <div className="ph-fade mt-8">{children}</div>}
      </div>
    </section>
  );
}
