import { readFileSync } from "node:fs";
export const primaryId = "get-a-life-mandala-tool";
export const secondaryId = "mandala-life-timeline-origin";
export function displayId(id) {
  return id === secondaryId ? primaryId : id;
}
export function sourceHtml(id) {
  const html = readFileSync(`dist/posts/${displayId(id)}/index.html`, "utf8");
  if (![primaryId, secondaryId].includes(id)) return html;
  const start = html.indexOf(`<section id="source-${id}"`);
  if (start < 0) throw new Error(`Missing original source section ${id}`);
  const next = html.indexOf('<section id="source-', start + 1);
  return html.slice(start, next < 0 ? undefined : next);
}
