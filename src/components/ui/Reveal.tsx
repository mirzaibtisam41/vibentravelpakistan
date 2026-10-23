"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, isRich, SplitText, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/components/layout/Preloader";

type SplitProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Animate on mount (after preloader) instead of on scroll. */
  immediate?: boolean;
  delay?: number;
};

/** Heading that rises word by word out of masked lines, tilting in 3D as it lands. */
export function SplitHeading({ as: Tag = "h2", className, children, immediate, delay = 0 }: SplitProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      let cleanup = () => {};
      const run = () => {
        // Phones/tablets: slide whole lines (few elements). Desktop: words tilt in individually.
        const rich = isRich();
        const split = SplitText.create(el, {
          type: rich ? "lines,words" : "lines",
          mask: "lines",
          linesClass: "split-line",
          wordsClass: "split-word",
          autoSplit: true,
          onSplit(self) {
            if (!rich)
              return gsap.from(self.lines, {
                yPercent: 105,
                stagger: 0.08,
                duration: 1,
                delay,
                ease: "expo.out",
                scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%" },
              });
            return gsap.from(self.words, {
              yPercent: 110,
              rotateX: -55,
              opacity: 0,
              transformOrigin: "50% 100% -30px",
              stagger: 0.045,
              duration: 1.1,
              delay,
              ease: "expo.out",
              scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%" },
            });
          },
        });
        gsap.set(el, { autoAlpha: 1 });
        cleanup = () => split.revert();
      };
      const off = immediate ? onIntroDone(run) : (run(), () => {});
      return () => {
        off();
        cleanup();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} style={{ visibility: "hidden", perspective: 600 }}>
      {children}
    </Tag>
  );
}

type RevealProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  y?: number;
  stagger?: number;
  /** CSS selector for children to stagger; defaults to direct children. */
  selector?: string;
  start?: string;
};

/** Fades & lifts its children in sequence when scrolled into view. */
export function Reveal({ as: Tag = "div", className, children, y = 40, stagger = 0.1, selector, start = "top 85%" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const targets = selector ? el.querySelectorAll(selector) : el.children;
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 1,
        stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start },
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
