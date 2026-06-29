// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Static output is Astro's default — emits a fully pre-rendered site to dist/.
  //
  // GitHub Pages TODO: when deploying under a repository subpath
  // (e.g. https://<user>.github.io/digest-showcase/), set both fields below.
  // Internal links already route through src/lib/url.ts -> buildUrl(), which
  // prefixes import.meta.env.BASE_URL, so flipping `base` here will NOT require
  // rewriting any template links.
  //
  // site: 'https://<user>.github.io',
  // base: '/digest-showcase',
});
