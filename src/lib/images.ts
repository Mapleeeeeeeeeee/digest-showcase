/**
 * Image-source seam.
 *
 * Today image URLs come straight from the post frontmatter (remote Facebook CDN
 * URLs, which expire). Every template MUST resolve image sources through this
 * module rather than reading `images[0]` inline, so that a future migration to
 * "download once and serve locally" changes exactly one file.
 */

/**
 * Resolve the renderable `src` for a single image URL.
 * Currently identity; the seam exists so the resolution strategy can change
 * (e.g. rewrite to a locally cached asset path) without touching callers.
 */
export function getImageSrc(url: string): string {
  return url;
}

/**
 * Pick the thumbnail source for a post from its image list.
 * Returns null when the post has no images, so callers can render a tasteful
 * placeholder instead of a broken image.
 */
export function getThumbnail(images: string[]): string | null {
  const [first] = images;
  if (!first) return null;
  return getImageSrc(first);
}
