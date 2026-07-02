import { buildUrl } from "./url";

/**
 * Image-source seam.
 *
 * Local images live in public/images/ and are referenced with paths like
 * "/images/posts/xxx.jpg". Remote URLs (https://) are passed through as-is.
 */

export function getImageSrc(url: string): string {
  if (url.startsWith("/")) return buildUrl(url);
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
