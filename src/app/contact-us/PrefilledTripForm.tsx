"use client";

import { useSearchParams } from "next/navigation";
import CustomTripForm from "@/components/forms/CustomTripForm";
import { tripForm } from "@/data/site";

/** Reads ?destination= (from "Plan Your Trip" links) and pre-selects it in the trip form. */
export default function PrefilledTripForm() {
  const dest = useSearchParams().get("destination") ?? undefined;
  // Map destination names that differ slightly from the form's options.
  const first = dest?.toLowerCase().split(" ")[0];
  const match = dest && (tripForm.destinations.find((d) => d.toLowerCase().startsWith(first!)) ?? dest);
  return <CustomTripForm key={match ?? "none"} defaultDestination={match || undefined} />;
}
