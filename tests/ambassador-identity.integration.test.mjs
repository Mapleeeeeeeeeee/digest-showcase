import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { load } from "js-yaml";

const verifiedAuthors = new Map([
  ["627625202", { name: "林楓", sourceUrl: "https://luma.com/claude-taipei-10" }],
  [
    "100002197226424",
    { name: "蕭晊莛", sourceUrl: "https://www.digitimes.com.tw/seminar/DevDaysAsia2026/speakers_en.html" },
  ],
]);
const posts = readdirSync("src/content/posts").map((file) => ({
  id: file.replace(/\.md$/, ""),
  data: load(readFileSync(`src/content/posts/${file}`, "utf8").split("---")[1]),
}));
const homepage = readFileSync("dist/index.html", "utf8");

for (const { id, data } of posts) {
  test(`Given ${data.author}'s ${id} when reading its card and article then role evidence matches the exact author`, () => {
    const source = verifiedAuthors.get(String(data.authorId));
    const card = homepage
      .match(/<article\b[^>]*class="card"[\s\S]*?<\/article>/g)
      ?.find((value) => value.includes(`/posts/${id}\"`));
    assert.ok(card, id);
    const article = readFileSync(`dist/posts/${id}/index.html`, "utf8");
    assert.equal(card.includes('data-ambassador="true"'), Boolean(source));
    assert.equal(card.includes('class="ambassador-badge"'), Boolean(source));
    assert.equal(article.includes('class="ambassador-badge"'), Boolean(source));
    if (source) {
      for (const html of [card, article]) {
        assert.ok(html.includes(`href="${source.sourceUrl}"`));
        assert.ok(html.includes("Claude Community Ambassador"));
        assert.ok(html.includes(`aria-label="${source.name}：Claude Community Ambassador，查看身分來源"`));
      }
    }
  });
}

for (const authorId of new Set(
  posts.map(({ data }) => String(data.authorId)),
)) {
  test(`Given author ${authorId} when opening their profile then their role is displayed only with verified evidence`, () => {
    const html = readFileSync(`dist/authors/${authorId}/index.html`, "utf8");
    const header = html
      .match(/<header\b[\s\S]*?<\/header>/g)
      ?.find((value) => value.includes('class="author__header"'));
    assert.ok(header);
    const badge = header.match(
      /<a\b[^>]*class="ambassador-badge"[^>]*>[\s\S]*?<\/a>/,
    )?.[0];
    const source = verifiedAuthors.get(authorId);
    assert.equal(Boolean(badge), Boolean(source));
    if (source) {
      assert.equal(badge.match(/\bhref="([^"]*)"/)?.[1], source.sourceUrl);
      assert.equal(badge.match(/\baria-label="([^"]*)"/)?.[1], `${source.name}：Claude Community Ambassador，查看身分來源`);
      const visibleText = badge.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
      assert.match(visibleText, /Claude Community Ambassador/);
    }
  });
}

test("Given the homepage when choosing an author role then Ambassador remains separate from existing categories", () => {
  assert.match(homepage, /data-filter="true" data-filter-type="ambassador"/);
  assert.match(homepage, /data-filter="知識精華" data-filter-type="category"/);
  assert.match(homepage, /data-filter="社群活動" data-filter-type="category"/);
  assert.equal((homepage.match(/data-ambassador="true"/g) ?? []).length, 22);
});

for (const id of [
  "claude-founders-meetup-announcement",
  "claude-meetup-gaming-announcement",
]) {
  test(`Given the archived ${id} announcement when browsing published collections then readers see recaps instead of the invitation`, () => {
    const archivedPost = readFileSync(`content/archived-posts/${id}.md`, "utf8");
    const archivedData = load(archivedPost.split("---")[1]);
    assert.match(archivedData.sourceUrl, /^https:\/\/www\.facebook\.com\/groups\//);
    assert.ok(archivedPost.split("---").slice(2).join("---").trim().length > 0);
    for (const html of [
      homepage,
      readFileSync("dist/authors/627625202/index.html", "utf8"),
    ]) {
      assert.ok(!html.includes(`/posts/${id}`));
      assert.ok(html.includes("/posts/claude-meetup-gaming-recap"));
      assert.ok(html.includes("/posts/tammy-ai-native-operations-recap"));
    }
  });
}
