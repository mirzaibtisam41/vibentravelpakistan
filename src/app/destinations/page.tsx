import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { ArrowDown } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { SplitHeading } from "@/components/ui/Reveal";
import DestinationRows from "@/components/destinations/DestinationRows";

export const metadata: Metadata = pageMeta({
  title: "Destinations",
  path: "/destinations",
  description:
    "Explore Hunza, Skardu, Fairy Meadows, Neelum Valley, and Pakistan’s northern destinations. Find travel inspiration and plan your next adventure with Vibe & Travel Pakistan.",
});

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        image="/images/hunza.webp"
        imageAlt="Dramatic Karakoram mountains and turquoise Hunza Lake"
        eyebrow="Destinations"
        crumbs={[{ label: "Home", href: "/" }, { label: "Destinations" }]}
        title={
          <>
            A world of wonder. <span className="serif-accent text-glacier-300">Closer than you think.</span>
          </>
        }
        text="From Hunza and Skardu to Fairy Meadows and Neelum Valley, the north of Pakistan is full of places worth the drive. Start here and find the one for your next trip."
      >
        <a href="#destinations" className="btn btn-primary">
          Start exploring <ArrowDown className="size-4" />
        </a>
      </PageHero>

      <section id="destinations" className="scroll-mt-20 overflow-hidden bg-snow py-24 sm:py-32">
        <div className="container-x">
          <div className="mb-20 max-w-3xl">
            <span className="eyebrow text-pine-700">Where we go</span>
            <SplitHeading className="heading-lg mt-4">
              Explore Our <span className="serif-accent text-pine-700">Destinations</span>
            </SplitHeading>
          </div>
          <DestinationRows />
          <p className="mt-24 text-center text-sm text-stone">
            Photos are here for inspiration and may not show the exact departures or accommodation on our trips.
          </p>
        </div>
      </section>
    </>
  );
}
