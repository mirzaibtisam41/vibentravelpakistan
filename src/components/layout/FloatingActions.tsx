"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { getLenis } from "@/components/providers/SmoothScroll";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { cn, generalWhatsapp } from "@/lib/utils";

const RING = 2 * Math.PI * 23; // circumference of the progress ring (r = 23)
const SHOW_AFTER = 600; // px scrolled before the back-to-top button appears

/** Bottom-right stack: back-to-top (with scroll-progress ring) above the WhatsApp button. */
export default function FloatingActions() {
  // Package pages have a mobile booking bar pinned to the bottom; sit above it there.
  const onPackage = usePathname().startsWith("/tour-packages/");
  const [showTop, setShowTop] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setShowTop(y > SHOW_AFTER); // React skips re-render when the value is unchanged
      if (ring.current) ring.current.style.strokeDashoffset = String(RING * (1 - (max > 0 ? Math.min(1, y / max) : 0)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toTop = (e: MouseEvent<HTMLButtonElement>) => {
    const keyboard = e.detail === 0; // Enter/Space rather than a pointer click
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = getLenis();
    const done = () => {
      // Keyboard users land on the first link in the header instead of losing their place.
      if (keyboard) document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
    };
    if (lenis && !reduce) {
      lenis.scrollTo(0, { duration: 1.3, easing: (t) => 1 - Math.pow(1 - t, 4), onComplete: done });
    } else {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      done();
    }
  };

  return (
    <div
      className={cn(
        "fixed right-5 z-30 flex flex-col items-end gap-3 transition-[bottom] duration-500",
        onPackage ? "bottom-24 lg:bottom-5" : "bottom-5",
      )}
    >
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        className={cn(
          "group relative grid size-[3.25rem] place-items-center rounded-full bg-white/90 text-pine-700 shadow-[0_12px_30px_-10px_rgba(6,29,21,.45)] backdrop-blur-md transition-[opacity,transform,background-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:bg-pine-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alpen-400",
          showTop ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-75 opacity-0",
        )}
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 52 52" aria-hidden>
          <circle cx="26" cy="26" r="23" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="2.5" />
          <circle
            ref={ring}
            cx="26"
            cy="26"
            r="23"
            fill="none"
            stroke="var(--color-alpen-400)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING}
          />
        </svg>
        <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </button>

      <a
        href={generalWhatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp Us"
        className="group relative flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_15px_40px_-10px_rgba(37,211,102,.7)] transition-all duration-500 hover:pr-5"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s] [animation-iteration-count:4]" />
        <WhatsAppIcon className="size-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-500 group-hover:max-w-32">
          WhatsApp Us
        </span>
      </a>
    </div>
  );
}
