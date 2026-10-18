import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { load } from "js-yaml";
import config from "../astro.config.mjs";
import { primaryId, secondaryId, sourceHtml } from "./helpers/topic-pages.mjs";
const originals = [secondaryId, primaryId].map((id) => {
  const markdown = readFileSync(`src/content/posts/${id}.md`, "utf8");
  return {
    id,
    data: load(markdown.split("---")[1]),
    body: markdown.split("---").slice(2).join("---"),
  };
});
const topic = readFileSync(`dist/posts/${primaryId}/index.html`, "utf8");
const home = readFileSync("dist/index.html", "utf8");
const cards = (html) =>
  html.match(/<article\b[^>]*class="card"[\s\S]*?<\/article>/g) ?? [];

test("Given Journey 1 both original subjects when browsing then one topic card represents both on home and original author pages", () => {
  assert.equal(cards(home).length, 53);
  for (const html of [
    home,
    ...originals.map(({ data }) =>
      readFileSync(`dist/authors/${data.authorId}/index.html`, "utf8"),
    ),
  ]) {
    const matches = cards(html).filter((card) =>
      card.includes(`/posts/${primaryId}"`),
    );
    assert.equal(matches.length, 1);
    assert.match(matches[0], /Get-a-Life：生活規劃工具與開發歷程/);
    assert.match(matches[0], /2 篇原文/);
    assert.match(matches[0], /最新分享/);
  }
  const wrapper = home.slice(
    home.lastIndexOf(
      '<div class="reveal"',
      home.indexOf(`/posts/${primaryId}"`),
    ),
    home.indexOf(`/posts/${primaryId}"`),
  );
  for (const { data } of originals)
    assert.ok(wrapper.includes(data.title.toLowerCase()), data.title);
});

for (const { id, data, body } of originals) {
  test(`Given Journey 2 ${id} when reading the topic then its exact body, source, individual metrics and all original pictures survive`, async () => {
    const html = sourceHtml(id);
    const processor = await createMarkdownProcessor(config.markdown);
    const rendered = (await processor.render(body)).code;
    assert.ok(
      html.replace(/>\s+</g, "><").includes(rendered.replace(/>\s+</g, "><")),
      `${id}: original rendered Markdown`,
    );
    assert.ok(html.includes(data.title));
    assert.ok(html.includes(`href="${data.sourceUrl}"`));
    for (const [name, value] of [
      ["favorite", data.likes],
      ["chat_bubble", data.comments],
      ["share", data.shares],
    ]) {
      assert.match(html, new RegExp(`${name}[\\s\\S]*?>${value}<`));
    }
    const images = [
      ...html.matchAll(/<img\b[^>]*class="post__image"[^>]*src="([^"]+)"/g),
    ].map((m) => m[1]);
    assert.deepEqual(
      images,
      data.images.map((src) => `/digest-showcase${src}`),
    );
  });
}

test("Given Journey 3 comment resources when opened then verified destinations and original evidence are available", () => {
  assert.match(topic, /href="https:\/\/github.com\/dowiosamuelu\/get-a-life"/);
  for (const { data } of originals)
    for (const resource of data.resources) {
      assert.ok(
        topic.includes(`href="${resource.sourceUrl.replaceAll("&", "&amp;")}"`),
      );
      const internalSource = originals.find(
        ({ data }) =>
          new URL(data.sourceUrl).pathname.replace("/permalink/", "/posts/") ===
            new URL(resource.url).pathname.replace("/permalink/", "/posts/") &&
          !new URL(resource.url).search,
      );
      const expected = internalSource
        ? `#source-${internalSource.id}`
        : resource.url;
      assert.ok(
        topic.includes(`href="${expected.replaceAll("&", "&amp;")}"`),
        expected,
      );
    }
});

test("Given Journey 4 the old initial article URL when opened then static redirect points at its preserved original section", () => {
  const redirect = readFileSync(`dist/posts/${secondaryId}/index.html`, "utf8");
  const refresh = redirect
    .match(/<meta\b[^>]*>/gi)
    ?.find((tag) => /\bhttp-equiv=["']refresh["']/i.test(tag));
  assert.ok(refresh, "The legacy URL must trigger a browser refresh redirect");
  const content = refresh.match(/\bcontent=["']([^"']*)["']/i)?.[1];
  const destination = content?.match(/;\s*url\s*=\s*(.+)$/i)?.[1];
  assert.equal(
    destination,
    "/digest-showcase/posts/get-a-life-mandala-tool#source-mandala-life-timeline-origin",
    "The browser refresh must open the preserved initial source section",
  );
  assert.ok(topic.includes(`id="source-${secondaryId}"`));
  for (const slug of readdirSync("dist/posts")) {
    if (slug === secondaryId) continue;
    const html = readFileSync(`dist/posts/${slug}/index.html`, "utf8");
    const navigation =
      html.match(/<nav\b[^>]*class="post-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
    assert.ok(!navigation.includes(`/posts/${secondaryId}"`));
  }
  assert.equal((topic.match(/class="post__image"/g) ?? []).length, 6);
});
