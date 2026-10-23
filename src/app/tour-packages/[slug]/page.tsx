import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TiltCard from "@/components/ui/TiltCard";
import {
  BedDouble,
  Bus,
  CalendarDays,
  Check,
  CircleAlert,
  MapPin,
  Mountain,
  Clock,
  UtensilsCrossed,
  X,
  Backpack,
  ArrowRight,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import PackageCard from "@/components/ui/PackageCard";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/Icons";
import Itinerary from "@/components/package/Itinerary";
import Faq from "@/components/package/Faq";
import SectionNav from "@/components/package/SectionNav";
import { getPackage, packages } from "@/data/site";
import { formatMeals, formatRs, generalWhatsapp, packageWhatsapp } from "@/lib/utils";

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tour-packages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPackage(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `Explore ${p.name}, a ${p.duration}-day trip with Vibe & Travel Pakistan. Review the itinerary, room-sharing prices, inclusions, and departure information.`,
    openGraph: { images: [p.image] },
  };
}

function SectionTitle({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <span className="eyebrow text-pine-700">{eyebrow}</span>
      <SplitHeading className="heading-md mt-3">{children}</SplitHeading>
    </div>
  );
}

// Every package is generated at build time (generateStaticParams), so the page renders in full
// with no loading fallback; this opts the segment out of instant-navigation validation.
export const instant = false;

export default async function PackagePage({ params }: PageProps<"/tour-packages/[slug]">) {
  const { slug } = await params;
  const p = getPackage(slug);
  if (!p) notFound();

  const facts = [
    { icon: Clock, label: "Duration", value: `${p.duration} ${p.duration === 1 ? "day" : "days"}` },
    { icon: Bus, label: "Transport", value: p.transport },
    { icon: BedDouble, label: "Hotel", value: p.hotel },
    { icon: MapPin, label: "Destination", value: p.location },
    ...(p.meals ? [{ icon: UtensilsCrossed, label: "Meals Included", value: formatMeals(p.meals) }] : []),
  ];

  const sections = [
    { id: "overview", label: "Overview" },
    ...(p.itinerary.length ? [{ id: "itinerary", label: "Itinerary" }] : []),
    ...(p.pack.length ? [{ id: "pack", label: "What to Pack" }] : []),
    ...(p.included.length ? [{ id: "inclusions", label: "Inclusions" }] : []),
    ...(p.departures.length ? [{ id: "departures", label: "Departures" }] : []),
    ...(p.faqs.length ? [{ id: "faqs", label: "FAQs" }] : []),
  ];

  const related = packages
    .filter((x) => x.slug !== p.slug)
    .sort((a, b) => Math.abs(a.duration - p.duration) - Math.abs(b.duration - p.duration) || Number(b.hiking === p.hiking) - Number(a.hiking === p.hiking))
    .slice(0, 3);

  const wa = packageWhatsapp(p);

  return (
    <>
      <PageHero
        image={p.image}
        imageAlt={p.name}
        crumbs={[{ label: "Home", href: "/" }, { label: "Tour Packages", href: "/tour-packages" }, { label: p.name }]}
        title={p.name}
      >
        <div className="flex flex-wrap items-center gap-2.5 text-sm font-semibold">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-md">
            <CalendarDays className="size-4 text-alpen-300" /> {p.duration} {p.duration === 1 ? "Day" : "Days"}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-md">
            <MapPin className="size-4 text-alpen-300" /> {p.location}
          </span>
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${p.available ? "bg-pine-700" : "bg-white/85 text-ink"}`}>
            <span className={`size-2 rounded-full ${p.available ? "bg-glacier-300" : "bg-alpen-500"}`} />
            {p.available ? "Enquire for Availability" : "Currently Not Available"}
          </span>
          {p.hiking && (
            <span className="inline-flex items-center gap-2 rounded-full bg-alpen-400 px-4 py-2 text-night">
              <Mountain className="size-4" /> Hiking Trip
            </span>
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white/85">Departs every week</span>
        </div>
      </PageHero>

      <div className="relative bg-snow pb-24">
        {/* Floating quick-facts */}
        <div className="container-x relative z-10 -mt-12">
          <Reveal className="grid grid-cols-1 gap-1 rounded-[1.75rem] min-[420px]:grid-cols-2 min-[420px]:gap-3 border border-ink/8 bg-white p-3 shadow-[0_30px_70px_-40px_rgba(6,29,21,.6)] sm:grid-cols-3 lg:grid-cols-5" y={30} stagger={0.06}>
            {facts.map((f) => (
              <div key={f.label} className="flex min-w-0 items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-snow sm:p-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-pine-50 text-pine-700 sm:size-11">
                  <f.icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-stone">{f.label}</span>
                  <span className="block text-sm font-bold leading-snug sm:text-base">{f.value}</span>
                </span>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="container-x mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0 space-y-20">
            <div className="sticky top-20 z-20 -mx-1">
              <SectionNav items={sections} />
            </div>

            <section id="overview" className="scroll-mt-28">
              <SectionTitle eyebrow="Overview">Trip Overview</SectionTitle>
              <div className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
                <p className="text-lg leading-relaxed text-ink/75">{p.overview}</p>
                <TiltCard className="rounded-3xl">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(6,29,21,.6)]">
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-night/70 to-transparent" />
                    <span className="absolute bottom-4 left-5 text-[11px] font-extrabold tracking-[0.3em] text-white">VIBE &amp; TRAVEL PAKISTAN</span>
                  </div>
                </TiltCard>
              </div>
            </section>

            {p.itinerary.length > 0 && (
              <section id="itinerary" className="scroll-mt-28">
                <SectionTitle eyebrow="Day by Day">Trip Itinerary</SectionTitle>
                <Itinerary days={p.itinerary} />
              </section>
            )}

            {p.pack.length > 0 && (
              <section id="pack" className="scroll-mt-28">
                <SectionTitle eyebrow="Before You Go">What to Pack</SectionTitle>
                {p.packIntro && <p className="-mt-2 mb-6 text-ink/70">{p.packIntro}</p>}
                <Reveal className="grid gap-3 sm:grid-cols-2" y={24} stagger={0.04}>
                  {p.pack.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white p-4">
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-glacier-300/30 text-glacier-700">
                        <Backpack className="size-4" />
                      </span>
                      <span className="text-sm font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </Reveal>
              </section>
            )}

            {p.included.length > 0 && (
              <section id="inclusions" className="scroll-mt-28">
                <SectionTitle eyebrow="Package Details">Inclusions &amp; Exclusions</SectionTitle>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-3xl border border-pine-700/15 bg-pine-50 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-extrabold text-pine-700">
                      <Check className="size-5" /> Included
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {p.included.map((x) => (
                        <li key={x} className="flex gap-3 text-sm leading-relaxed">
                          <Check className="mt-0.5 size-4 shrink-0 text-pine-600" /> {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-alpen-500/20 bg-alpen-400/10 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-extrabold text-alpen-600">
                      <X className="size-5" /> Not Included
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {p.excluded.map((x) => (
                        <li key={x} className="flex gap-3 text-sm leading-relaxed">
                          <X className="mt-0.5 size-4 shrink-0 text-alpen-600" /> {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {p.departures.length > 0 && (
              <section id="departures" className="scroll-mt-28">
                <SectionTitle eyebrow="Schedule">Departure Information</SectionTitle>
                <Reveal className="grid gap-4 sm:grid-cols-2" y={30}>
                  {p.departures.map((d) => (
                    <div key={d.city} className="relative overflow-hidden rounded-3xl bg-linear-to-br from-pine-800 to-pine-950 p-6 text-white">
                      <span className="absolute -right-6 -top-6 size-24 rounded-full bg-glacier-400/20 blur-xl" />
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-glacier-300">From</p>
                      <p className="mt-1 text-2xl font-extrabold">{d.city}</p>
                      <p className="mt-4 flex items-center gap-2 text-white/80">
                        <CalendarDays className="size-4 text-alpen-300" /> {d.schedule}
                      </p>
                    </div>
                  ))}
                </Reveal>
              </section>
            )}

            {p.faqs.length > 0 && (
              <section id="faqs" className="scroll-mt-28">
                <SectionTitle eyebrow="FAQs">Frequently Asked Questions</SectionTitle>
                <Faq items={p.faqs} />
              </section>
            )}

            {p.itinerary.length === 0 && (
              <div className="rounded-3xl border border-ink/8 bg-white p-6">
                <p className="flex items-start gap-3 text-ink/75">
                  <CircleAlert className="mt-0.5 size-5 shrink-0 text-alpen-500" />
                  Get in touch and we’ll share the day-by-day plan and the latest trail conditions.
                </p>
              </div>
            )}
          </div>

          {/* Sticky pricing card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[1.75rem] border border-ink/8 bg-white shadow-[0_40px_80px_-45px_rgba(6,29,21,.65)]">
              <div className="relative bg-linear-to-br from-pine-700 to-pine-900 p-6 text-white">
                <span className="absolute -right-10 -top-10 size-32 rounded-full bg-glacier-400/25 blur-2xl" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-glacier-300">Tour Pricing</p>
                <h2 className="mt-1 text-2xl font-extrabold">Room Sharing &amp; Pricing</h2>
                <p className="text-sm text-white/70">Prices per person</p>
              </div>
              <div className="space-y-3 p-6">
                {(p.pricing.length ? p.pricing : [{ label: "Starting From", sub: "4–5 Persons Sharing", amount: p.price }]).map((r, i) => (
                  <div key={r.label} className={`flex items-center justify-between gap-4 rounded-2xl p-4 ${i === 0 ? "bg-alpen-400/12 ring-1 ring-alpen-400/40" : "bg-snow"}`}>
                    <div>
                      <p className="text-sm font-bold">{r.label}</p>
                      <p className="text-xs text-stone">{r.sub}</p>
                    </div>
                    <p className={`text-right font-extrabold ${i === 0 ? "text-2xl text-pine-700" : "text-lg"}`}>
                      {r.amount ? formatRs(r.amount) : <span className="text-sm text-stone">Ask us for the price</span>}
                    </p>
                  </div>
                ))}
                <a href={wa} target="_blank" rel="noreferrer" className="btn btn-primary mt-2 w-full min-h-14!">
                  <WhatsAppIcon className="size-5" /> Enquire About This Trip
                </a>
                <p className="text-center text-xs leading-relaxed text-stone">
                  Prices are per person. We’ll confirm availability and the final price with you before you book.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-ink/8 px-6 py-4">
                <span className="text-sm font-bold">Questions?</span>
                <a href={generalWhatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-pine-700">
                  <WhatsAppIcon className="size-4" /> WhatsApp Us
                </a>
              </div>
            </div>
            <Link
              href={`/contact-us?destination=${encodeURIComponent(p.name)}#custom-trip-quote`}
              className="mt-4 flex items-center justify-between rounded-2xl border border-ink/8 bg-white p-4 text-sm font-bold transition-colors hover:border-pine-700"
            >
              Want different dates or a different route? Plan a custom trip <ArrowRight className="size-4 text-pine-700" />
            </Link>
          </aside>
        </div>
      </div>

      {/* Related */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow text-pine-700">Keep exploring</span>
              <SplitHeading className="heading-lg mt-4">
                You might <span className="serif-accent text-pine-700">also like</span>
              </SplitHeading>
            </div>
            <Link href="/tour-packages" className="btn btn-outline">
              View All Tour Packages <ArrowRight className="size-4" />
            </Link>
          </div>
          <Reveal className="perspective grid gap-6 sm:grid-cols-2 lg:grid-cols-3" y={60}>
            {related.map((r) => (
              <PackageCard key={r.slug} p={r} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* Mobile booking bar */}
      <div className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white/90 p-3 pl-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,.45)] backdrop-blur-xl lg:hidden">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone">From</p>
          <p className="text-lg font-extrabold text-pine-700">
            {formatRs(p.price)}
            <span className="text-xs text-stone">/person</span>
          </p>
        </div>
        <a href={wa} target="_blank" rel="noreferrer" className="btn btn-green min-h-11! px-4! text-sm!">
          Enquire
        </a>
      </div>
    </>
  );
}

