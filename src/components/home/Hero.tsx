"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, ArrowUpRight, MapPin, MousePointer2 } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { heroSlides, site } from "@/data/site";
import { onIntroDone } from "@/components/layout/Preloader";
import { SplitHeading } from "@/components/ui/Reveal";
import { canUseWebGL, subscribeNoop } from "@/lib/device";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });
const slideImages = heroSlides.map((s) => s.image);
const N = heroSlides.length;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  // WebGL on desktops/tablets; phones, reduced-motion users and weak CPUs keep the CSS slideshow (see lib/device).
  const use3D = useSyncExternalStore(subscribeNoop, canUseWebGL, () => false);
  // Tablets get a lighter scene (1x resolution, fewer particles).
  const lowPower = useSyncExternalStore(
    subscribeNoop,
    () => window.matchMedia("(pointer: coarse), (max-width: 1023px)").matches,
    () => true,
  );
  const [inView, setInView] = useState(true);
  const [mount3D, setMount3D] = useState(false);
  const [ready3D, setReady3D] = useState(false);

  // Only render the 3D scene (and rotate the deck) while the hero is on screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  // Load the WebGL scene after the intro, when the browser is idle, so it never delays first paint.
  // If the visitor has already scrolled past the hero, wait until they come back to it.
  useEffect(() => {
    if (!use3D || mount3D || !inView) return;
    let idle = 0;
    const off = onIntroDone(() => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle = ric(() => setMount3D(true), { timeout: 1200 });
    });
    return () => {
      off();
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, [use3D, mount3D, inView]);

  // Autoplay through the destinations while the hero is visible; a manual pick restarts the timer.
  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % N), 7000);
    return () => clearTimeout(id);
  }, [inView, active]);

  useGSAP(
    () => {
      const fades = gsap.utils.toArray<HTMLElement>(".hero-fade");
      const deck = gsap.utils.toArray<HTMLElement>(".hero-deck");
      gsap.set(fades, { autoAlpha: 0, y: 30 });
      gsap.set(deck, { autoAlpha: 0, rotateY: -35, x: 120 });
      const off = onIntroDone(() => {
        gsap.to(fades, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 1.1, delay: 0.35, ease: "expo.out" });
        gsap.to(deck, { autoAlpha: 1, rotateY: 0, x: 0, duration: 1.6, delay: 0.5, ease: "expo.out" });
      });

      // Scroll: pushes the photo in (WebGL) and parallaxes the copy away.
      gsap.to(progress, {
        current: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-copy", {
        yPercent: -35,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
      });
      gsap.to(".hero-deck-wrap", {
        yPercent: -60,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return off;
    },
    { scope: root },
  );

  // 3D card deck of upcoming destinations: the front card is the next slide.
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".deck-card");
      cards.forEach((card, i) => {
        const pos = (i - active - 1 + 2 * N) % N;
        gsap.to(card, {
          x: pos * 26,
          y: pos * -14,
          z: pos * -90,
          rotateY: pos * -8,
          rotateZ: pos * 2.5,
          opacity: pos > 3 ? 0 : 1 - pos * 0.18,
          zIndex: cards.length - pos,
          duration: 1,
          ease: "expo.out",
        });
      });
    },
    { scope: root, dependencies: [active] },
  );

  const slide = heroSlides[active];
  const next = heroSlides[(active + 1) % N];

  return (
    <section ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-night text-white">
      {/* Real-photo slideshow: first paint everywhere, and the whole hero on phones.
          The active photo fades in while slowly zooming out (compositor-only transforms). */}
      {heroSlides.map((s, i) => (
        <Image
          key={s.name}
          src={s.image}
          alt={i === active ? `${s.name}, ${s.region}` : ""}
          aria-hidden={i !== active}
          fill
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "low"}
          sizes="100vw"
          className={`object-cover transition-[opacity,transform] ease-out [transition-duration:1.6s,9s] ${
            i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"
          }`}
        />
      ))}
      {mount3D && (
        <div className={`absolute inset-0 transition-opacity duration-[1.4s] ${ready3D ? "opacity-100" : "opacity-0"}`}>
          <HeroScene
            images={slideImages}
            index={active}
            progress={progress}
            active={inView}
            lowPower={lowPower}
            onReady={() => setReady3D(true)}
          />
        </div>
      )}

      {/* Legibility gradients */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-night/70 via-transparent to-night/80" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-night/75 via-night/20 to-transparent" />

      <div className="container-x relative z-10 flex h-full flex-col justify-end pb-10 pt-28 sm:pb-14">
        <div className="grid items-end gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div className="hero-copy">
            {/* Phones/tablets: which destination is on screen (the deck shows this on desktop). */}
            <p className="hero-fade mb-4 flex items-center gap-2 text-sm font-semibold text-white/85 lg:hidden">
              <MapPin className="size-4 text-alpen-300" />
              <span key={slide.name} className="animate-[fadeUp_.6s_ease-out]">
                {slide.name}, {slide.region.replace(", Pakistan", "")}
              </span>
              <span className="font-mono text-xs text-white/50">
                {String(active + 1).padStart(2, "0")}/{String(N).padStart(2, "0")}
              </span>
            </p>
            <span className="hero-fade eyebrow text-alpen-300">Your Next Adventure Starts Here</span>
            <SplitHeading as="h1" immediate delay={0.2} className="heading-xl mt-5 max-w-4xl">
              Find Your Vibe. <span className="serif-accent text-glacier-300">Explore</span> Pakistan.
            </SplitHeading>
            <p className="hero-fade mt-6 max-w-xl text-lg text-white/80 sm:text-xl">
              Extraordinary places, unforgettable journeys. Discover Pakistan your way.
            </p>
            <div className="hero-fade mt-8 flex flex-wrap gap-3">
              <Link href="/tour-packages" className="btn btn-primary min-h-14! px-7! text-base">
                Explore Tour Packages <ArrowRight className="size-5" />
              </Link>
              <Link href="/contact-us#custom-trip-quote" className="btn btn-glass min-h-14! px-7! text-base">
                Plan A Custom Trip <ArrowUpRight className="size-5" />
              </Link>
            </div>

            <div className="hero-fade mt-10 flex items-center gap-4">
              <div className="relative size-14 overflow-hidden rounded-full ring-2 ring-alpen-400 ring-offset-2 ring-offset-night/50">
                <Image src={site.founder.image} alt="Ali Malik" fill sizes="56px" className="object-cover" />
              </div>
              <div>
                <a href={site.founder.instagram} target="_blank" rel="noreferrer" className="font-bold hover:text-alpen-300">
                  {site.founder.name}
                </a>
                <p className="text-sm text-white/60">{site.founder.role}</p>
              </div>
            </div>
          </div>

          {/* 3D destination deck */}
          <div className="hero-deck-wrap hidden justify-end lg:flex">
            <div className="hero-deck perspective w-[340px]">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white/60">Up next</p>
              <button
                onClick={() => setActive((a) => (a + 1) % N)}
                className="preserve-3d relative block h-[230px] w-[320px] cursor-pointer"
                aria-label={`Next destination: ${next.name}`}
              >
                {heroSlides.map((s, i) => (
                  <div
                    key={s.name}
                    className="deck-card backface-hidden absolute inset-0 overflow-hidden rounded-3xl border border-white/20 shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)]"
                    style={{ zIndex: N - i }}
                  >
                    <Image src={s.image} alt={s.name} fill sizes="320px" className="object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-night/85 via-transparent to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 text-left">
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                        <MapPin className="size-3" /> {s.region}
                      </p>
                      <p className="mt-1 text-xl font-extrabold">{s.name}</p>
                    </div>
                  </div>
                ))}
              </button>
              <div className="mt-6 flex items-center justify-between pr-4">
                <div className="text-sm">
                  <span className="font-mono text-alpen-300">{String(active + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-white/40"> / {String(N).padStart(2, "0")}</span>
                  <span className="ml-3 font-semibold">{slide.name}</span>
                </div>
                <div className="flex gap-1.5">
                  {heroSlides.map((s, i) => (
                    <button
                      key={s.name}
                      aria-label={`Show ${s.name}`}
                      onClick={() => setActive(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-7 bg-alpen-400" : "w-1.5 bg-white/40"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 lg:flex">
        <MousePointer2 className="size-4 animate-bounce" />
        Scroll to explore
      </div>
    </section>
  );
}
