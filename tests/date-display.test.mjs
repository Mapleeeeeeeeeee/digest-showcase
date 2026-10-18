import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, rmSync } from "node:fs";
import test from "node:test";

test("Given UTC deployment when posts cross Taiwan date boundaries then cards, details and month filters use Taiwan dates", () => {
  // Regression: UTC deployments displayed Taiwan posts on the previous day or month (Facebook import batch).
  const cases = [
    {
      id: "regression-taiwan-day",
      date: "2026-09-08T16:35:15Z",
      display: "2026年9月9日",
      month: "2026-09",
    },
    {
      id: "regression-taiwan-month",
      date: "2026-09-30T16:35:15Z",
      display: "2026年10月1日",
      month: "2026-10",
    },
  ];
  try {
    for (const item of cases) {
      writeFileSync(
        `src/content/posts/${item.id}.md`,
        `---\ntitle: "${item.id}"\nauthor: "Regression Author"\nauthorId: "regression-taiwan"\ndate: ${item.date}\ncategory: "知識精華"\nsourceUrl: "https://www.facebook.com/share/p/regression/"\nlikes: 0\ncomments: 0\nshares: 0\nimages: []\n---\nTimezone regression fixture.\n`,
      );
    }
    execFileSync(
      "npm",
      ["run", "build", "--", "--outDir", "work/date-regression-dist"],
      { env: { ...process.env, TZ: "UTC" }, stdio: "pipe" },
    );
    const index = readFileSync("work/date-regression-dist/index.html", "utf8");
    for (const item of cases) {
      const detail = readFileSync(
        `work/date-regression-dist/posts/${item.id}/index.html`,
        "utf8",
      );
      assert(
        detail.includes(item.display),
        `${item.id} detail should show ${item.display}`,
      );
      const card = index
        .match(/<article\b[^>]*>[\s\S]*?<\/article>/g)
        ?.find((value) => value.includes(item.id));
      assert(
        card?.includes(item.display),
        `${item.id} card should show ${item.display}`,
      );
      const group =
        index.split("data-month=")[
          1 +
            index
              .split("data-month=")
              .slice(1)
              .findIndex((value) =>
                value.split('<div class="month-section"')[0].includes(item.id),
              )
        ];
      assert(
        group?.startsWith(`"${item.month}"`),
        `${item.id} should appear in ${item.month} section`,
      );
      assert(
        index.includes(`value="${item.month}"`),
        `${item.month} should appear in date filters`,
      );
    }
  } finally {
    for (const item of cases) unlinkSync(`src/content/posts/${item.id}.md`);
    rmSync("work/date-regression-dist", { recursive: true, force: true });
  }
});
