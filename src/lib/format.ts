import type { PostCategory } from "../content.config";

const COMMUNITY_TIME_ZONE = "Asia/Taipei";
const ZH_HANT_DATE = new Intl.DateTimeFormat("zh-Hant", {
  timeZone: COMMUNITY_TIME_ZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** Format a Date in Taiwan as zh-Hant long form, e.g. `2026年6月24日`. */
export function formatDateZh(date: Date): string {
  return ZH_HANT_DATE.format(date);
}

const COMMUNITY_MONTH = new Intl.DateTimeFormat("en", {
  timeZone: COMMUNITY_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
});

/** Return the Taiwan calendar month as a sortable `YYYY-MM` filter value. */
export function getCommunityMonth(date: Date): string {
  const parts = COMMUNITY_MONTH.formatToParts(date);
  const year = parts.find((part) => part.type === "year")!.value;
  const month = parts.find((part) => part.type === "month")!.value;
  return `${year}-${month}`;
}

/** Compact thousands formatting for interaction counts, e.g. `1.2k`. */
const THOUSAND = 1000;

export function formatCount(value: number): string {
  if (value < THOUSAND) return String(value);
  const inThousands = value / THOUSAND;
  return `${inThousands.toFixed(1).replace(/\.0$/, "")}k`;
}

/**
 * CSS class suffix for a category, used to drive the accent color of badges.
 * Maps the human-readable category to a stable slug so styling never depends on
 * matching Chinese strings in CSS.
 */
export function categorySlug(category: PostCategory): "knowledge" | "event" {
  if (category === "社群活動") return "event";
  return "knowledge";
}
