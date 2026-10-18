import assert from "node:assert/strict";
import test from "node:test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import config from "../astro.config.mjs";

test("Given original post punctuation when Markdown renders then source characters remain unchanged", async () => {
  // Regression: original Facebook ellipses rendered as a different Unicode character (Facebook full-text restoration).
  const processor = await createMarkdownProcessor(config.markdown);
  const original = '狀況可能滿嚴重的... "Claude" -- 完整原文';
  const rendered = await processor.render(original);
  assert.equal(rendered.code, `<p>${original}</p>`);
});
