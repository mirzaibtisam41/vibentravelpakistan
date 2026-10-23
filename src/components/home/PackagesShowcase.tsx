import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { packages } from "@/data/site";
import PackageGrid from "@/components/ui/PackageGrid";
import { SplitHeading } from "@/components/ui/Reveal";

export default function PackagesShowcase() {
  return (
    <section className="relative bg-white py-24 sm:py-32">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow text-pine-700">Our trips</span>
            <SplitHeading className="heading-lg mt-4">
              Explore Our <span className="serif-accent text-pine-700">Tour Packages</span>
            </SplitHeading>
          </div>
          <Link href="/tour-packages" className="group inline-flex items-center gap-2 font-bold text-pine-700">
            View All Tour Packages
            <span className="grid size-10 place-items-center rounded-full border border-pine-700/30 transition-colors group-hover:bg-pine-700 group-hover:text-white">
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
        <PackageGrid list={packages} />
      </div>
    </section>
  );
}
