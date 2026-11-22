"use client";

import { useSearchParams } from "next/navigation";

export function useCategoryFilter(categories: readonly string[]) {
  const params = useSearchParams();
  const selected = params.get("filter") || "All";
  const activeFilter = categories.includes(selected) ? selected : "All";

  function setActiveFilter(value: string) {
    const url = new URL(window.location.href);
    if (value === "All") url.searchParams.delete("filter");
    else url.searchParams.set("filter", value);
    if (url.href !== window.location.href) window.history.pushState(null, "", url);
  }

  return [activeFilter, setActiveFilter] as const;
}
