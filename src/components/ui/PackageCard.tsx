import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Mountain, Users } from "lucide-react";
import type { TourPackage } from "@/data/site";
import { cn, formatRs, packageWhatsapp } from "@/lib/utils";
import TiltCard from "./TiltCard";
import { WhatsAppIcon } from "./Icons";

export default function PackageCard({ p }: { p: TourPackage }) {
  const discount = Math.round(((p.priceOld - p.price) / p.priceOld) * 100);
  return (
    <TiltCard className="rounded-[1.75rem]">
      <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink/8 bg-white shadow-[0_30px_60px_-40px_rgba(6,29,21,.55)] transition-shadow duration-500 hover:shadow-[0_40px_80px_-35px_rgba(6,29,21,.6)]">
        <Link href={`/tour-packages/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden" aria-label={`${p.name} details`}>
          <Image
            src={p.image}
            alt={`${p.name} — ${p.location}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-night/70 via-night/0 to-night/10" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2" style={{ transform: "translateZ(40px)" }}>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md",
                p.available ? "bg-pine-700/90 text-white" : "bg-white/85 text-ink",
              )}
            >
              <span className={cn("size-1.5 rounded-full", p.available ? "bg-glacier-300" : "bg-alpen-500")} />
              {p.available ? "Available" : "Not Available"}
            </span>
            {p.hiking && (
              <span className="inline-flex items-center gap-1 rounded-full bg-alpen-400 px-3 py-1 text-xs font-bold text-night">
                <Mountain className="size-3" /> Hiking
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="absolute right-4 top-4 rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-pine-700">
              -{discount}%
            </span>
          )}
          <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 text-xs font-semibold text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-md">
              <CalendarDays className="size-3.5" /> {p.duration} {p.duration === 1 ? "DAY" : "DAYS"}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
              <MapPin className="size-3.5 shrink-0" /> <span className="truncate">{p.location}</span>
            </span>
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-6" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-xl font-extrabold tracking-tight text-ink">
            <Link href={`/tour-packages/${p.slug}`} className="hover:text-pine-700">
              {p.name}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone">{p.short}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-snow p-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone">Starting From</p>
              <p className="mt-1 text-xs text-stone line-through">{formatRs(p.priceOld)}</p>
              <p className="whitespace-nowrap text-lg font-extrabold text-pine-700">{formatRs(p.price)}</p>
              <p className="text-xs font-semibold text-stone">per person</p>
            </div>
            <div className="border-l border-ink/10 pl-3">
              {p.couple ? (
                <>
                  <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-stone">
                    <Users className="size-3" /> Couple
                  </p>
                  <p className="mt-1 text-xs text-stone line-through">{formatRs(p.coupleOld!)}</p>
                  <p className="whitespace-nowrap text-lg font-extrabold text-ink">{formatRs(p.couple)}</p>
                  <p className="text-xs font-semibold text-stone">total for two</p>
                </>
              ) : (
                <>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone">Room Sharing</p>
                  <p className="mt-2 text-sm font-bold text-ink">4–5 people per room</p>
                </>
              )}
            </div>
          </div>

          <div className="mt-auto flex gap-2 pt-5">
            <a href={packageWhatsapp(p)} target="_blank" rel="noreferrer" className="btn btn-green flex-1 min-h-12! px-4! text-sm!">
              <WhatsAppIcon className="size-4" /> Book Now
            </a>
            <Link href={`/tour-packages/${p.slug}`} className="btn btn-outline flex-1 min-h-12! px-4! text-sm! text-ink">
              More Details <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
