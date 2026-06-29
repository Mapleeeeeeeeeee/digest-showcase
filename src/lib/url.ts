/**
 * Internal-link helper.
 *
 * Astro exposes the configured base path as `import.meta.env.BASE_URL` (always
 * with a trailing slash, e.g. "/" or "/digest-showcase/"). Building internal
 * links through this helper means setting `base` in astro.config.mjs for GitHub
 * Pages will NOT require rewriting every link.
 */

const BASE_URL = import.meta.env.BASE_URL;

/**
 * Join the configured base path with an app-relative path.
 * Accepts paths with or without a leading slash and collapses the seam so the
 * result never contains a double slash.
 */
export function buildUrl(path: string): string {
  const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

/** Canonical route for a single post page, keyed by its collection entry id. */
export function postUrl(id: string): string {
  return buildUrl(`/posts/${id}`);
}

/** Canonical route for an author page, keyed by the author's stable id. */
export function authorUrl(authorId: string): string {
  return buildUrl(`/authors/${authorId}/`);
}
