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

/** Returns the first photo, then the first available video poster, or null. */
export function getThumbnail(
  images: string[],
  videos: { poster?: string }[] = [],
): string | null {
  const source = images[0] || videos.find((video) => video.poster)?.poster;
  return source ? getImageSrc(source) : null;
}
