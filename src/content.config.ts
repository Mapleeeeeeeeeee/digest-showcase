import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Allowed post categories. Single source of truth so the schema, the category
// filter UI and any badge rendering all agree on the legal values.
export const POST_CATEGORIES = ["知識精華", "社群活動"] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    authorId: z.string(),
    authorUrl: z.string().url(),
    // ISO datetime string in frontmatter -> Date via coercion.
    date: z.coerce.date(),
    category: z.enum(POST_CATEGORIES),
    tags: z.array(z.string()).default([]),
    sourceUrl: z.string().url(),
    likes: z.number(),
    comments: z.number(),
    shares: z.number(),
    images: z.array(z.string()),
  }),
});

export const collections = { posts };
