import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

test("Given the built Pages artifact when pages check deployment then every page targets its own version endpoint under the site base", () => {
  const output = process.env.BUILD_OUTPUT_DIR ?? "dist";
  const endpoint = JSON.parse(
    readFileSync(join(output, "version.json"), "utf8"),
  );
  assert.equal(typeof endpoint.version, "string");
  assert.notEqual(endpoint.version.trim(), "");
  const pages = htmlFiles(output);
  assert(
    pages.includes(join(output, "index.html")),
    "The built home page must exist",
  );
  for (const path of pages) {
    let html = readFileSync(path, "utf8");
    if (
      path === join(output, "posts/mandala-life-timeline-origin/index.html")
    ) {
      const refresh = html
        .match(/<meta\b[^>]*>/gi)
        ?.find((tag) => /\bhttp-equiv=["']refresh["']/i.test(tag));
      assert.ok(
        refresh,
        `${path} must refresh to its preserved source section`,
      );
      const content = refresh.match(/\bcontent=["']([^"']*)["']/i)?.[1];
      const destination = content?.match(/;\s*url\s*=\s*(.+)$/i)?.[1];
      assert.equal(
        destination,
        "/digest-showcase/posts/get-a-life-mandala-tool#source-mandala-life-timeline-origin",
        `${path} must redirect to the known local topic source`,
      );
      html = readFileSync(
        join(output, "posts/get-a-life-mandala-tool/index.html"),
        "utf8",
      );
      assert.match(
        html,
        /\bid="source-mandala-life-timeline-origin"/,
        "The redirect destination must retain the original source section",
      );
    }
    const version = html.match(/\bdata-site-version="([^"]*)"/)?.[1];
    const endpointPath = html.match(/\bdata-version-endpoint="([^"]*)"/)?.[1];
    assert.equal(
      version,
      endpoint.version,
      `${path} must share the deployed endpoint version`,
    );
    assert.equal(
      endpointPath,
      "/digest-showcase/version.json",
      `${path} must fetch inside the GitHub Pages site base`,
    );
  }
});
