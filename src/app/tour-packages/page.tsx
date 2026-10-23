import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowDown } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { SplitHeading } from "@/components/ui/Reveal";
import PackageGrid from "@/components/ui/PackageGrid";
import { packages } from "@/data/site";
import PackagesBrowser from "./PackagesBrowser";

export const metadata: Metadata = {
  title: "Tour Packages",
  description:
    "Explore Pakistan tour packages with Vibe & Travel Pakistan. Discover Hunza, Skardu, Fairy Meadows, Neelum Valley, and northern Pakistan trips. Compare itineraries, check prices, and enquire about departures.",
};

export default function TourPackagesPage() {
  return (
    <>
      <PageHero
        image="/images/hunza.webp"
        imageAlt="Dramatic Karakoram mountains and turquoise Hunza Lake"
        eyebrow="Tour Packages"
        crumbs={[{ label: "Home", href: "/" }, { label: "Tour Packages" }]}
        title={
          <>
            Make time for <span className="serif-accent text-glacier-300">the mountains.</span>
          </>
        }
        text="Find your next escape in Pakistan. Browse our trips, compare itineraries, and message us to check prices, seats and departure dates."
      >
        <a href="#packages" className="btn btn-primary">
          Browse all {packages.length} trips <ArrowDown className="size-4" />
        </a>
      </PageHero>

      <section id="packages" className="scroll-mt-20 bg-white py-20 sm:py-28">
        <div className="container-x">
          <span className="eyebrow text-pine-700">All trips</span>
          <SplitHeading className="heading-lg mb-10 mt-4">
            Explore <span className="serif-accent text-pine-700">Tour Packages</span>
          </SplitHeading>
          <Suspense fallback={<PackageGrid list={packages} searchable />}>
            <PackagesBrowser />
          </Suspense>
        </div>
      </section>
    </>
  );
}
