import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Story from "@/components/about/Story";
import WhyUs from "@/components/home/WhyUs";
import Moments from "@/components/home/Moments";

export const metadata: Metadata = pageMeta({
  title: "About Us",
  path: "/about-us",
  description:
    "Get to know Vibe & Travel Pakistan. Discover our approach to exploring Pakistan through mountain escapes, meaningful experiences, and thoughtfully planned journeys.",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        image="/images/hunza.webp"
        imageAlt="Dramatic Karakoram mountains and turquoise Hunza Lake"
        eyebrow="About Us"
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        title={
          <>
            Adventure is better when it <span className="serif-accent text-glacier-300">feels like you.</span>
          </>
        }
        text="Mountain escapes, meaningful moments, and the freedom to explore Pakistan your way."
      >
        <Link href="/tour-packages" className="btn btn-primary">
          Explore Tour Packages <ArrowUpRight className="size-4" />
        </Link>
      </PageHero>
      <Story />
      <WhyUs />
      <Moments />
    </>
  );
}
