"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { visibleById } from "@/lib/dom";

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

const OFFSET = -90;

/** Smoothly scroll to the rendered element with this id. Returns false if it isn't on the page. */
export function scrollToId(id: string, immediate = false) {
  const el = visibleById(id);
  if (!el) return false;
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: OFFSET, immediate });
  else el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  return true;
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // In-page anchor links (e.g. "#packages"): resolve to the visible target, not a hidden route's copy.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || !a.hash || a.origin !== location.origin || a.pathname !== location.pathname) return;
      if (scrollToId(decodeURIComponent(a.hash.slice(1)))) {
        e.preventDefault();
        history.replaceState(history.state, "", a.hash);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // New route: jump to top (or to the hash target) and let ScrollTriggers re-measure.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    let t = 0;
    if (hash) {
      // The new page may still be revealing; retry briefly until the target is rendered.
      let tries = 0;
      const attempt = () => {
        if (scrollToId(hash) || ++tries > 10) return;
        t = window.setTimeout(attempt, 120);
      };
      t = window.setTimeout(attempt, 350);
    } else {
      lenisInstance?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(id);
      clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
