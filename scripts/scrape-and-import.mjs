#!/usr/bin/env node
/**
 * Scrape a specific Facebook post using Apify and import it into the Astro workspace.
 *
 * Usage: node scripts/scrape-and-import.mjs <fb-post-url>
 */

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { exec } from "node:child_process";
import { promisify } from "node:util";
const execAsync = promisify(exec);

const POSTS_DIR = new URL("../src/content/posts/", import.meta.url).pathname;

// Simple .env parser to avoid external dependencies
function loadEnv() {
  const envPath = new URL("../.env", import.meta.url).pathname;
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || "";
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  }
}

// Simple slugify helper supporting English and Chinese chars
function generateSlug(text, backupId) {
  if (!text) return backupId;
  const firstLine = text.split("\n")[0].trim();
  let slug = firstLine
    .toLowerCase()
    .replace(/[^\w\s\-\u4e00-\u9fa5]/g, "") // Keep alphanumeric, Chinese, hyphen, space
    .trim()
    .replace(/[\s_]+/g, "-");
  
  if (!slug) return backupId;
  return slug.slice(0, 40);
}

async function run() {
  loadEnv();
  const apiKey = process.env.APIFY_API_KEY;
  if (!apiKey) {
    console.error("Error: APIFY_API_KEY is not defined in .env file.");
    process.exit(1);
  }

  const postUrl = process.argv[2];
  if (!postUrl) {
    console.error("Error: Please provide a Facebook post URL.");
    console.log("Usage: node scripts/scrape-and-import.mjs <fb-post-url>");
    process.exit(1);
  }

  console.log(`Starting Apify scrape for: ${postUrl}`);

  // We call the apify/facebook-posts-scraper
  const actorId = "apify~facebook-posts-scraper";
  const apiUrl = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apiKey}`;

  const payload = {
    startUrls: [{ url: postUrl }],
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Apify API call failed (HTTP ${response.status}): ${errorText}`);
    console.log("Tip: If the sync-run timed out, you can try running it async via Apify Console or check your API key.");
    process.exit(1);
  }

  const datasetItems = await response.json();
  if (!Array.isArray(datasetItems) || datasetItems.length === 0) {
    console.error("Error: Scraper succeeded but returned no dataset items. Double-check if the post is public.");
    process.exit(1);
  }

  console.log(`Scraped successfully. Processing ${datasetItems.length} post(s)...`);

  for (const post of datasetItems) {
    const postId = post.facebookId || post.id || Math.random().toString(36).slice(2, 9);
    const rawText = post.text || "";
    const title = rawText.split("\n")[0].trim().slice(0, 80) || "Facebook Post";
    const slug = generateSlug(rawText, postId);
    const filename = `${slug}.md`;
    const destPath = join(POSTS_DIR, filename);

    if (existsSync(destPath)) {
      console.log(`[Skipped] ${filename} already exists.`);
      continue;
    }

    const author = post.author || post.user;
    const authorName = author?.name || "Anonymous";
    const authorId = author?.id || generateSlug(authorName, "anonymous");
    const authorUrl = author?.profileUrl || (author?.id ? `https://www.facebook.com/${author.id}` : "https://www.facebook.com");
    const dateStr = post.time || post.timestamp || new Date().toISOString();
    
    const likes = post.engagement?.likesCount ?? post.likes ?? 0;
    const comments = post.engagement?.commentsCount ?? post.comments ?? 0;
    const shares = post.engagement?.sharesCount ?? post.shares ?? 0;

    const images = [];
    if (post.attachments) {
      for (const att of post.attachments) {
        if ((att.type === "photo" || att.type === "image") && att.url) {
          images.push(att.url);
        }
      }
    }

    const highlights = (post.topComments || []).map((c) => ({
      author: c.profileName || "Anonymous",
      authorId: c.profileId || c.id || "",
      text: c.text || "",
      likes: c.likesCount || 0,
      isBestAnswer: false,
    }));

    let postType = "article";
    if (highlights.length > 0) {
      postType = "discussion";
    }

    const frontmatter = {
      title,
      author: authorName,
      authorId,
      authorUrl,
      date: dateStr,
      category: "知識精華",
      sourceUrl: post.postUrl || postUrl,
      likes,
      comments,
      shares,
      images,
      postType,
      highlights,
    };

    const yamlLines = [
      "---",
      `title: ${JSON.stringify(frontmatter.title)}`,
      `author: ${JSON.stringify(frontmatter.author)}`,
      `authorId: ${JSON.stringify(frontmatter.authorId)}`,
      `authorUrl: ${JSON.stringify(frontmatter.authorUrl)}`,
      `date: ${frontmatter.date}`,
      `category: ${JSON.stringify(frontmatter.category)}`,
      `sourceUrl: ${JSON.stringify(frontmatter.sourceUrl)}`,
      `likes: ${frontmatter.likes}`,
      `comments: ${frontmatter.comments}`,
      `shares: ${frontmatter.shares}`,
      `images: ${JSON.stringify(frontmatter.images)}`,
      `postType: ${JSON.stringify(frontmatter.postType)}`,
    ];

    if (frontmatter.highlights.length === 0) {
      yamlLines.push("highlights: []");
    } else {
      yamlLines.push("highlights:");
      for (const h of frontmatter.highlights) {
        yamlLines.push(`  - author: ${JSON.stringify(h.author)}`);
        yamlLines.push(`    authorId: ${JSON.stringify(h.authorId)}`);
        yamlLines.push(`    text: ${JSON.stringify(h.text)}`);
        yamlLines.push(`    likes: ${h.likes}`);
        yamlLines.push(`    isBestAnswer: ${h.isBestAnswer}`);
      }
    }

    yamlLines.push("---");
    yamlLines.push("");
    
    const bodyLines = rawText.split("\n");
    if (bodyLines[0].trim() === title) {
      bodyLines.shift();
    }
    yamlLines.push(bodyLines.join("\n").trim());

    await writeFile(destPath, yamlLines.join("\n"), "utf-8");
    console.log(`[Imported] ${filename}`);
  }

  console.log("\nRunning image downloader to localize images...");
  try {
    const { stdout, stderr } = await execAsync("node scripts/download-images.mjs");
    console.log(stdout);
    if (stderr) console.warn(stderr);
  } catch (err) {
    console.error(`Failed to run download-images.mjs: ${err.message}`);
  }

  console.log("Process complete!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
