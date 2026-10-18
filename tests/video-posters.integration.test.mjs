import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { load } from "js-yaml";

// Regression: video-only Minecraft cards displayed a text placeholder (fae6873).
for (const page of [
  "dist/index.html",
  "dist/authors/100009184694454/index.html",
]) {
  test(`Given a video-only article when browsing ${page} then its card shows a real video frame`, () => {
    const html = readFileSync(page, "utf8");
    const card = html
      .match(/<article\b[^>]*class="card"[\s\S]*?<\/article>/g)
      ?.find((value) => value.includes('/posts/minecraft-ai-demo"'));
    assert.ok(card, "Minecraft article must be discoverable");
    assert.match(
      card,
      /<img\b[^>]*class="card__thumb"[^>]*src="\/digest-showcase\/images\/video-posters\/minecraft-ai-demo-1866371757683140.jpg"/,
    );
  });
}

test("Given archived videos when their article renders then every player displays a locally available poster", () => {
  for (const file of readdirSync("src/content/posts")) {
    const data = load(
      readFileSync(`src/content/posts/${file}`, "utf8").split("---")[1],
    );
    if (!data.videos?.length) continue;
    const html = readFileSync(
      `dist/posts/${file.replace(/\.md$/, "")}/index.html`,
      "utf8",
    );
    for (const video of data.videos) {
      const expectedPoster = `/images/video-posters/${video.src
        .split("/")
        .at(-1)
        .replace(/\.mp4$/, ".jpg")}`;
      const player = html
        .match(/<video\b[^>]*>[\s\S]*?<\/video>/g)
        ?.find((value) => value.includes(video.src));
      assert.ok(player, video.src);
      assert.ok(
        player.includes(`poster="/digest-showcase${expectedPoster}"`),
        video.src,
      );
      const jpeg = readFileSync(`dist${expectedPoster}`);
      assert.equal(jpeg.readUInt16BE(0), 0xffd8, expectedPoster);
    }
  }
});
