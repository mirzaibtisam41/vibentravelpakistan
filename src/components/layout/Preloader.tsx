"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { LogoMark } from "@/components/ui/Icons";

declare global {
  interface Window {
    __vtReady?: boolean;
  }
}

/** Runs `cb` once the intro curtain has lifted (immediately on later navigations). */
export function onIntroDone(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if (window.__vtReady) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener("vt:ready", h, { once: true });
  return () => window.removeEventListener("vt:ready", h);
}

export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const signalReady = () => {
        window.__vtReady = true;
        // Dispatch outside this GSAP context so listeners' selectors aren't scoped to the preloader.
        setTimeout(() => window.dispatchEvent(new Event("vt:ready")), 0);
      };
      // Returning visitor in this session: the overlay is already hidden by CSS, start right away.
      if (document.documentElement.dataset.visited) {
        signalReady();
        setGone(true);
        return;
      }
      try {
        sessionStorage.setItem("vt-visited", "1");
      } catch {}

      const counter = { v: 0 };
      const num = ref.current!.querySelector(".pl-num")!;
      const tl = gsap.timeline({
        onComplete: () => {
          setGone(true);
        },
      });
      tl.from(".pl-mark path", { scale: 0, rotate: -90, opacity: 0, transformOrigin: "50% 50%", stagger: 0.1, duration: 0.6, ease: "back.out(1.8)" })
        .from(".pl-word", { yPercent: 120, stagger: 0.05, duration: 0.5 }, "-=0.35")
        .to(counter, { v: 100, duration: 0.9, ease: "power2.inOut", onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, "0")) }, 0)
        .to(".pl-bar", { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0)
        .to(".pl-inner", { y: -40, opacity: 0, duration: 0.35, ease: "power2.in" }, "+=0.05")
        .add(signalReady)
        .to(ref.current, { yPercent: -100, duration: 0.85, ease: "expo.inOut" }, "<")
        .to(".pl-panel", { yPercent: -100, duration: 0.85, ease: "expo.inOut" }, "<0.06");
    },
    { scope: ref },
  );

  if (gone) return null;

  return (
    <div ref={ref} className="vt-preloader fixed inset-0 z-100 grid place-items-center bg-night text-white" aria-hidden>
      <div className="pl-panel absolute inset-x-0 top-full h-full bg-alpen-400" />
      <div className="pl-inner flex flex-col items-center">
        <LogoMark className="pl-mark size-20 text-alpen-400" />
        <div className="mt-6 flex gap-2 overflow-hidden text-2xl font-extrabold tracking-tight">
          {["Find", "Your", "Vibe."].map((w) => (
            <span key={w} className="pl-word inline-block">
              {w}
            </span>
          ))}
        </div>
        <div className="mt-8 h-px w-48 overflow-hidden bg-white/15">
          <div className="pl-bar h-full origin-left scale-x-0 bg-glacier-400" />
        </div>
        <span className="pl-num mt-3 font-mono text-xs tracking-[0.3em] text-white/50">000</span>
      </div>
    </div>
  );
}
