import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { load } from "js-yaml";

// Run after npm run build; this checks the actual content-to-HTML integration.
const expectedVideos = [
  ["keelung-planet-game", "1419543886990222"],
  ["keelung-planet-game", "1190414266847037"],
  ["stocktown-park-update", "2125783635034823"],
  ["interactive-ocean-model-comparison", "1105890245184243"],
  ["minecraft-ai-demo", "1866371757683140"],
  ["clawdminer-esp32-token-pet", "2078583039678384"],
  ["esp32-token-speedometer", "1536167618555622"],
];

for (const [slug, videoId] of expectedVideos) {
  test(`Given Journey 1 ${videoId} when ${slug} renders then a local controllable player and original video link are available`, () => {
    const html = readFileSync(`dist/posts/${slug}/index.html`, "utf8");
    const player = html
      .match(/<video\b[^>]*>[\s\S]*?<\/video>/g)
      ?.find((value) => value.includes(`${videoId}.mp4`));
    assert.ok(player, `Missing local player for Facebook video ${videoId}`);
    const openingTag = player.match(/<video\b[^>]*>/)?.[0];
    assert.match(openingTag, /\bcontrols(?:\s|>|=)/);
    assert.match(openingTag, /\bplaysinline(?:\s|>|=)/);
    assert.match(openingTag, /\bpreload="metadata"/);
    assert.doesNotMatch(openingTag, /\b(?:autoplay|muted)(?:\s|>|=)/);
    assert.ok(
      player.includes(`/digest-showcase/videos/posts/${slug}-${videoId}.mp4`),
    );
    assert.match(
      html,
      new RegExp(
        `<a\\b[^>]*href="https://www\\.facebook\\.com/[^" ]*${videoId}[^" ]*"[^>]*>`,
      ),
    );
  });
}

test("Given Journey 1 mixed Keelung attachments when rendered then source photo and video order is preserved", () => {
  const html = readFileSync(
    "dist/posts/keelung-planet-game/index.html",
    "utf8",
  );
  const gallery = html.match(
    /<section\b[^>]*class="post__gallery"[^>]*>([\s\S]*?)<\/section>/,
  )?.[1];
  assert.ok(gallery);
  assert.deepEqual(
    [...gallery.matchAll(/<(source|img)\b[^>]*src="([^"]+)"/g)].map((match) => [
      match[1] === "source" ? "video" : "image",
      match[2],
    ]),
    [
      [
        "video",
        "/digest-showcase/videos/posts/keelung-planet-game-1419543886990222.mp4",
      ],
      [
        "image",
        "/digest-showcase/images/posts/keelung-planet-game-02-10245121800484805.jpg",
      ],
      [
        "image",
        "/digest-showcase/images/posts/keelung-planet-game-03-10245121799724786.jpg",
      ],
      [
        "video",
        "/digest-showcase/videos/posts/keelung-planet-game-1190414266847037.mp4",
      ],
      [
        "image",
        "/digest-showcase/images/posts/keelung-planet-game-05-10245121797844739.jpg",
      ],
      [
        "image",
        "/digest-showcase/images/posts/keelung-planet-game-06-10245121777284225.jpg",
      ],
      [
        "image",
        "/digest-showcase/images/posts/keelung-planet-game-07-10245121798924766.jpg",
      ],
    ],
  );
});

test("Given Journey 1 existing articles when media renders then all original photos retain their order and lightbox hooks", () => {
  for (const slug of readdirSync("dist/posts")) {
    const markdown = readFileSync(`src/content/posts/${slug}.md`, "utf8");
    const frontmatter = load(markdown.split("---")[1]);
    const html = readFileSync(`dist/posts/${slug}/index.html`, "utf8");
    const gallery =
      html.match(
        /<section\b[^>]*class="post__gallery"[^>]*>([\s\S]*?)<\/section>/,
      )?.[1] ?? "";
    const images = [
      ...gallery.matchAll(/<img\b[^>]*class="post__image"[^>]*src="([^"]+)"/g),
    ].map((match) => match[1]);
    assert.deepEqual(
      images,
      frontmatter.images.map((src) =>
        src.startsWith("/") ? `/digest-showcase${src}` : src,
      ),
      slug,
    );
    if (!expectedVideos.some(([videoSlug]) => videoSlug === slug)) {
      assert.doesNotMatch(gallery, /<video\b/, slug);
    }
    if (frontmatter.images.length === 0 && !frontmatter.videos?.length) {
      assert.equal(gallery, "", `${slug} should not have an empty gallery`);
    }
  }
});
