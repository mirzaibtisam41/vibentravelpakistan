"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { canUseWebGL, subscribeNoop } from "@/lib/device";
import { LogoMark } from "@/components/ui/Icons";
import { ArrowRight, Compass, MessageCircle, Users } from "lucide-react";
import { gsap, isRich, tilt, useGSAP } from "@/lib/gsap";
import { values } from "@/data/site";
import { SplitHeading } from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

const FloatingIsland = dynamic(() => import("@/components/three/FloatingIsland"), { ssr: false });

const icons = [Compass, Users, MessageCircle];

export default function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  const canvasBox = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false); // mount once it approaches the viewport
  const [visible, setVisible] = useState(false); // render frames only while on screen
  const webgl = useSyncExternalStore(subscribeNoop, canUseWebGL, () => false);

  // Warm up the 3D module while the browser is idle so it doesn't load mid-scroll.
  useEffect(() => {
    if (!webgl) return;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const id = ric(() => void import("@/components/three/FloatingIsland"), { timeout: 4000 });
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id);
  }, [webgl]);

  useEffect(() => {
    const el = canvasBox.current!;
    const ioNear = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "600px" });
    const ioVis = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    ioNear.observe(el);
    ioVis.observe(el);
    return () => {
      ioNear.disconnect();
      ioVis.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      gsap.from(".why-card", {
        y: 90,
        rotateX: tilt(-30),
        opacity: 0,
        stagger: 0.14,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".why-cards", start: "top 85%" },
      });
      gsap.from(".why-canvas", {
        scale: 0.6,
        opacity: 0,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
      // Phone fallback: the photo card tilts gently as it scrolls through (2D transforms only).
      if (ref.current!.querySelector(".why-photo"))
        gsap.fromTo(
          ".why-photo",
          { rotate: -6, y: 40 },
          { rotate: 3, y: -20, ease: "none", scrollTrigger: { trigger: ".why-canvas", start: "top bottom", end: "bottom top", scrub: true } },
        );
      gsap.from(".why-copy > p, .why-copy > a", { y: 24, opacity: 0, stagger: 0.12, scrollTrigger: { trigger: ".why-copy", start: "top 80%" } });
    },
    // Revert before re-running: `webgl` flips to true right after hydration, and a second from() would
    // otherwise capture the first one's half-faded values as its end state and leave the section faded.
    { scope: ref, dependencies: [webgl], revertOnUpdate: true },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-sand py-24 sm:py-32">
      <div className="pointer-events-none absolute right-0 top-0 size-[36rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-alpen-300/30 blur-3xl" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
        <div className="why-copy">
          <span className="eyebrow text-pine-700">Why travel with us</span>
          <SplitHeading className="heading-lg mt-4">
            More Than a Trip. <span className="serif-accent text-pine-700">Your Kind of Adventure.</span>
          </SplitHeading>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
            From a quiet mountain escape to a road trip with your favourite people, start with what matters to you. We’ll discuss the route,
            room sharing, transport, and budget before you decide.
          </p>
          <Link href="/about-us" className="group mt-8 inline-flex items-center gap-3 font-bold text-pine-700">
            Get to know Vibe &amp; Travel
            <span className="grid size-11 place-items-center rounded-full bg-pine-700 text-white transition group-hover:translate-x-1">
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
        <div ref={canvasBox} className="why-canvas relative aspect-square w-full max-w-[560px] justify-self-center">
          <div className="absolute inset-[12%] rounded-full bg-linear-to-br from-glacier-300/50 to-pine-100 blur-2xl" />
          {webgl ? (
            near && <FloatingIsland active={visible} lowPower={!isRich()} />
          ) : (
            <div className="why-photo absolute inset-[10%] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-35px_rgba(6,29,21,.7)]">
              <Image src="/images/fairy-meadows.webp" alt="Fairy Meadows and the mountain landscape of northern Pakistan" fill sizes="80vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-night/70 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 grid size-14 place-items-center rounded-2xl bg-pine-700 shadow-lg">
                <LogoMark className="size-8 text-white" />
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="why-cards container-x perspective relative mt-16 grid gap-5 md:grid-cols-3">
        {values.map((v, i) => {
          const Icon = icons[i];
          return (
            <div key={v.title} className="why-card">
              <TiltCard className="rounded-3xl">
                <div className="group h-full rounded-3xl border border-ink/8 bg-white/80 p-7 backdrop-blur transition-colors duration-500 hover:bg-pine-700 hover:text-white">
                  <div className="flex items-center justify-between">
                    <span className="grid size-14 place-items-center rounded-2xl bg-pine-50 text-pine-700 transition-colors duration-500 group-hover:bg-white/15 group-hover:text-alpen-300">
                      <Icon className="size-6" />
                    </span>
                    <span className="font-mono text-sm text-stone group-hover:text-white/50">0{i + 1}</span>
                  </div>
                  <h3 className="mt-8 text-xl font-extrabold tracking-tight">{v.title}</h3>
                  <p className="mt-2 text-ink/65 transition-colors group-hover:text-white/75">{v.text}</p>
                </div>
              </TiltCard>
            </div>
          );
        })}
      </div>
    </section>
  );
}
