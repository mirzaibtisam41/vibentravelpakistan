"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { nav, site } from "@/data/site";
import { LogoMark, InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { cn, generalWhatsapp } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 300 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(menuRef.current, { display: "flex" })
        .fromTo(
          menuRef.current,
          { clipPath: "circle(0% at calc(100% - 44px) 40px)" },
          { clipPath: "circle(150% at calc(100% - 44px) 40px)", duration: 0.9, ease: "power3.inOut" },
        )
        .from(".m-link", { yPercent: 110, opacity: 0, stagger: 0.06, duration: 0.7 }, "-=0.45")
        .from(".m-foot", { y: 20, opacity: 0, duration: 0.5 }, "-=0.4");
    },
    { scope: menuRef },
  );

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
      document.documentElement.style.overflow = "hidden";
    } else {
      tl.current.timeScale(1.6).reverse();
      document.documentElement.style.overflow = "";
    }
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className="container-x pt-3">
          <nav
            className={cn(
              "flex items-center justify-between gap-4 rounded-full px-3 py-2 pl-4 text-white transition-all duration-500",
              scrolled
                ? "border border-white/10 bg-pine-950/75 shadow-[0_20px_50px_-25px_rgba(0,0,0,.7)] backdrop-blur-xl"
                : "border border-transparent bg-transparent",
            )}
          >
            <Link href="/" onClick={() => setOpen(false)} className="group flex items-center gap-3" aria-label="Vibe & Travel Pakistan — Home">
              <span className="grid size-10 place-items-center rounded-xl bg-pine-700 shadow-inner shadow-white/10 transition-transform duration-500 group-hover:rotate-[120deg]">
                <LogoMark className="size-6 text-white" />
              </span>
              <span className="leading-none">
                <span className="block text-[15px] font-extrabold tracking-tight">Vibe &amp; Travel</span>
                <span className="block text-[10px] font-bold tracking-[0.42em] text-alpen-300">PAKISTAN</span>
              </span>
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                      isActive(n.href) ? "bg-white/12 text-white" : "text-white/75 hover:text-white",
                    )}
                  >
                    {n.label}
                    {isActive(n.href) && (
                      <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-alpen-400" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <Link href="/contact-us#custom-trip-quote" className="btn btn-primary hidden min-h-11! px-5! text-sm! sm:inline-flex">
                Plan a Custom Trip <ArrowUpRight className="size-4" />
              </Link>
              <button
                onClick={() => setOpen((o) => !o)}
                className="grid size-11 place-items-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20 lg:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div
        ref={menuRef}
        className="fixed inset-0 z-40 hidden flex-col justify-between bg-pine-950 px-6 pb-10 pt-28 text-white lg:hidden!"
        style={{ clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
      >
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-glacier-500/20 blur-3xl" />
        <ul className="relative space-y-1">
          {nav.map((n, i) => (
            <li key={n.href} className="overflow-hidden">
              <Link
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "m-link flex items-baseline gap-4 py-2 text-[2.4rem] font-extrabold tracking-tight",
                  isActive(n.href) ? "text-alpen-400" : "text-white",
                )}
              >
                <span className="text-xs font-bold text-white/40">0{i + 1}</span>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="m-foot relative space-y-5">
          <Link href="/contact-us#custom-trip-quote" onClick={() => setOpen(false)} className="btn btn-primary w-full">
            Plan a Custom Trip <ArrowUpRight className="size-4" />
          </Link>
          <div className="flex items-center justify-between text-sm text-white/70">
            <a href={`tel:+${site.phoneRaw}`}>{site.phone}</a>
            <div className="flex gap-3">
              <a href={generalWhatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-10 place-items-center rounded-full bg-white/10">
                <WhatsAppIcon className="size-5" />
              </a>
              <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-10 place-items-center rounded-full bg-white/10">
                <InstagramIcon className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
