"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1 });
}

/** Desktop-class device (fine pointer, wide screen): gets the full 3D treatment. */
export const isRich = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (min-width: 1024px)").matches;

/** 3D tilt angle for entrance animations; flat on phones/tablets to keep scrolling light. */
export const tilt = (deg: number) => (isRich() ? deg : 0);

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
