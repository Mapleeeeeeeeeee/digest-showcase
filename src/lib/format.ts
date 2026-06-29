import type { PostCategory } from "../content.config";

const ZH_HANT_DATE = new Intl.DateTimeFormat("zh-Hant", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** Format a Date as zh-Hant long form, e.g. `2026年6月24日`. */
export function formatDateZh(date: Date): string {
  return ZH_HANT_DATE.format(date);
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
