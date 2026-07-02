#!/usr/bin/env node
/**
 * Download remote images from post frontmatter to public/images/posts/
 * and rewrite the frontmatter URLs to local paths.
 *
 * Usage: node scripts/download-images.mjs
 *
 * Idempotent — skips images that already exist locally.
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const POSTS_DIR = new URL("../src/content/posts/", import.meta.url).pathname;
const OUT_DIR = new URL("../public/images/posts/", import.meta.url).pathname;
const URL_PREFIX = "/images/posts/";

function hashUrl(url) {
  return createHash("md5").update(url).digest("hex").slice(0, 12);
}

function guessExt(url, contentType) {
  if (contentType?.includes("png")) return ".png";
  if (contentType?.includes("webp")) return ".webp";
  if (contentType?.includes("gif")) return ".gif";
  const match = url.match(/\.(png|jpg|jpeg|webp|gif)/i);
  if (match) return match[0].toLowerCase().replace("jpeg", "jpg");
  return ".jpg";
}

async function downloadImage(url, filename) {
  const dest = join(OUT_DIR, filename);
  if (existsSync(dest)) return;

  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    console.warn(`  SKIP (HTTP ${res.status}): ${url.slice(0, 80)}...`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log(`  Downloaded: ${filename} (${(buf.length / 1024).toFixed(0)} KB)`);
  return true;
}

async function processPost(file) {
  const filepath = join(POSTS_DIR, file);
  let content = await readFile(filepath, "utf-8");

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return;

  const frontmatter = fmMatch[1];
  let changed = false;
  let newFrontmatter = frontmatter;

  const urlRegex = /(https?:\/\/[^\s"']+fbcdn[^\s"']+)/g;
  const urls = [...frontmatter.matchAll(urlRegex)].map((m) => m[1]);

  for (const url of urls) {
    const hash = hashUrl(url);
    const ext = guessExt(url, null);
    const filename = `${file.replace(".md", "")}-${hash}${ext}`;
    const localPath = `${URL_PREFIX}${filename}`;

    const dest = join(OUT_DIR, filename);
    if (!existsSync(dest)) {
      const ok = await downloadImage(url, filename);
      if (ok === false) continue;
    }

    newFrontmatter = newFrontmatter.replace(url, localPath);
    changed = true;
  }

  if (changed) {
    content = content.replace(fmMatch[0], `---\n${newFrontmatter}\n---`);
    await writeFile(filepath, content, "utf-8");
    console.log(`  Updated frontmatter: ${file}`);
  }
}

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith(".md"));
console.log(`Processing ${files.length} posts...\n`);

for (const file of files) {
  console.log(`[${file}]`);
  await processPost(file);
}

console.log("\nDone.");
