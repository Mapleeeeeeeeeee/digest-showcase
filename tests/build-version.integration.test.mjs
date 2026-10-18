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
    const html = readFileSync(path, "utf8");
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
