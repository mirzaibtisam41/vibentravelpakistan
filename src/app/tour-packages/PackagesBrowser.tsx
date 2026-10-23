"use client";

import { useSearchParams } from "next/navigation";
import { packages } from "@/data/site";
import PackageGrid, { type Filter } from "@/components/ui/PackageGrid";

export default function PackagesBrowser() {
  const params = useSearchParams();
  const d = params.get("duration");
  const initial: Filter = params.get("type") === "hiking" ? "hiking" : d && /^\d+$/.test(d) ? (d as Filter) : "all";

  // Keep the URL shareable without triggering a navigation.
  const sync = (f: Filter) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("duration");
    url.searchParams.delete("type");
    if (f === "hiking") url.searchParams.set("type", "hiking");
    else if (f !== "all") url.searchParams.set("duration", f);
    window.history.replaceState(null, "", url);
  };

  return <PackageGrid key={initial} list={packages} initial={initial} onChange={sync} searchable />;
}
