import type { TourPackage } from "@/data/site";
import { site } from "@/data/site";

export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

export const formatRs = (n: number) => `Rs. ${n.toLocaleString("en-US")}`;

/** "5 breakfasts / 4 dinners" -> "5 breakfasts, 4 dinners"; drops "0 dinners". */
export const formatMeals = (m: string) =>
  m
    .split("/")
    .map((s) => s.trim())
    .filter((s) => !/^0\s/.test(s))
    .join(", ");

export const daysLabel = (n: number) => `${n} ${n === 1 ? "Day" : "Days"}`;

export const whatsappLink = (text: string) =>
  `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(text)}`;

export const generalWhatsapp = whatsappLink(
  "Hello Vibe & Travel Pakistan, I would like information about your tour packages.",
);

// Same message wording the original site sends for each package state.
export function packageWhatsapp(p: TourPackage) {
  const base = `Hello Vibe & Travel Pakistan, `;
  const label = `${p.name} (${p.duration} days)`;
  if (!p.available)
    return whatsappLink(
      `${base}I am interested in ${label}. Please let me know about future departures or similar alternatives.`,
    );
  if (p.hiking)
    return whatsappLink(
      `${base}I am interested in ${label}. Please share the trekking itinerary, difficulty level, prices, inclusions, and upcoming departure dates.`,
    );
  return whatsappLink(
    `${base}I would like to inquire about ${label}. Please share room-sharing prices and upcoming departures.`,
  );
}
