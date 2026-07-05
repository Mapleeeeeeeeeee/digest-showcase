#!/usr/bin/env node
/**
 * Import posts scraped from Apify's facebook-groups-scraper JSON export.
 *
 * Usage: node scripts/import-posts.mjs <path-to-apify-json>
 */

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

const POSTS_DIR = new URL("../src/content/posts/", import.meta.url).pathname;

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

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error("Error: Please provide the path to the Apify JSON export file.");
    console.log("Usage: node scripts/import-posts.mjs <path-to-json>");
    process.exit(1);
  }

  let postsData;
  try {
    const raw = await readFile(jsonPath, "utf-8");
    postsData = JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading/parsing JSON file: ${err.message}`);
    process.exit(1);
  }

  // Normalize single post to array if necessary
  const posts = Array.isArray(postsData) ? postsData : [postsData];
  console.log(`Found ${posts.length} posts to process.\n`);

  let importedCount = 0;
  let skippedCount = 0;

  for (const post of posts) {
    const postId = post.facebookId || post.id || Math.random().toString(36).slice(2, 9);
    
    // Extract basic fields
    const rawText = post.text || "";
    const title = rawText.split("\n")[0].trim().slice(0, 80) || "Facebook Post";
    const slug = generateSlug(rawText, postId);
    const filename = `${slug}.md`;
    const destPath = join(POSTS_DIR, filename);

    if (existsSync(destPath)) {
      console.log(`[Skipped] ${filename} already exists.`);
      skippedCount++;
      continue;
    }

    const authorName = post.author?.name || "Anonymous";
    const authorId = post.author?.id || generateSlug(authorName, "anonymous");
    const authorUrl = post.author?.profileUrl || "https://www.facebook.com";
    const dateStr = post.timestamp || new Date().toISOString();
    
    // Engagement
    const likes = post.engagement?.likesCount ?? post.likes ?? 0;
    const comments = post.engagement?.commentsCount ?? post.comments ?? 0;
    const shares = post.engagement?.sharesCount ?? post.shares ?? 0;

    // Attachments (Images)
    const images = [];
    if (post.attachments) {
      for (const att of post.attachments) {
        if ((att.type === "photo" || att.type === "image") && att.url) {
          images.push(att.url);
        }
      }
    }

    // Top comments/highlights
    const highlights = (post.topComments || []).map((c) => ({
      author: c.profileName || "Anonymous",
      authorId: c.profileId || c.id || "",
      text: c.text || "",
      likes: c.likesCount || 0,
      isBestAnswer: false,
    }));

    // Post Type logic
    let postType = "article";
    if (highlights.length > 0) {
      postType = "discussion";
    }

    // Astro content markdown template
    const frontmatter = {
      title,
      author: authorName,
      authorId,
      authorUrl,
      date: dateStr,
      category: "知識精華", // Default category, user can edit
      sourceUrl: post.postUrl || `https://www.facebook.com/groups/1224997379198346/permalink/${postId}/`,
      likes,
      comments,
      shares,
      images,
      postType,
      highlights,
    };

    // Serialize frontmatter manually to avoid dependencies
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
    
    // Remaining text of the post body
    const bodyLines = rawText.split("\n");
    // Skip first line if it's the title to avoid duplication
    if (bodyLines[0].trim() === title) {
      bodyLines.shift();
    }
    yamlLines.push(bodyLines.join("\n").trim());

    await writeFile(destPath, yamlLines.join("\n"), "utf-8");
    console.log(`[Imported] ${filename}`);
    importedCount++;
  }

  console.log(`\nImport complete: ${importedCount} imported, ${skippedCount} skipped.`);
  console.log("Tip: Run 'node scripts/download-images.mjs' next to download remote images locally.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
