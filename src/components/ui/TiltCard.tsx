"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Pointer-driven 3D tilt with a moving light glare. Inert on touch devices. */
export default function TiltCard({ children, className, max = 9 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (!window.matchMedia("(hover: hover)").matches) return;
      const glare = el.querySelector<HTMLElement>(".tilt-glare");
      const tilt = (x: number, y: number) =>
        gsap.to(el, { rotateX: x, rotateY: y, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tilt(-py * max, px * max);
        if (glare) gsap.to(glare, { opacity: 1, x: px * r.width * 0.6, y: py * r.height * 0.6, duration: 0.5, overwrite: "auto" });
      };
      const leave = () => {
        tilt(0, 0);
        if (glare) gsap.to(glare, { opacity: 0, duration: 0.6, overwrite: "auto" });
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <div className="h-full [@media(hover:hover)]:[perspective:1200px]">
      <div ref={ref} className={cn("relative h-full [@media(hover:hover)]:[transform-style:preserve-3d]", className)}>
        {children}
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden rounded-[inherit] [@media(hover:hover)]:block">
          <div className="tilt-glare absolute left-1/2 top-1/2 size-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.35),transparent_55%)] opacity-0 mix-blend-soft-light" />
        </div>
      </div>
    </div>
  );
}
