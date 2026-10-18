import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Allowed post categories. Single source of truth so the schema, the category
// filter UI and any badge rendering all agree on the legal values.
export const POST_CATEGORIES = ["知識精華", "社群活動"] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

const localAssetPath = z
  .string()
  .regex(
    /^\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-][A-Za-z0-9_.-]*$/,
    "Media must use a local root-relative asset path",
  );

const resourceUrl = z.string().url().refine(
  (url) => ["http:", "https:"].includes(new URL(url).protocol),
  "Resource URL must use HTTP or HTTPS",
);

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z
    .object({
      title: z.string(),
      author: z.string(),
      authorId: z.string(),
      authorUrl: z.string().url().optional(),
      // ISO datetime string in frontmatter -> Date via coercion.
      date: z.coerce.date(),
      category: z.enum(POST_CATEGORIES),
      tags: z.array(z.string()).default([]),
      sourceUrl: z.string().url(),
      resources: z
        .array(
          z.object({
            label: z.string().trim().min(1),
            url: resourceUrl,
            sourceUrl: resourceUrl,
            sourceLabel: z.string().optional(),
          }),
        )
        .default([]),
      likes: z.number(),
      comments: z.number(),
      shares: z.number(),
      images: z.array(z.string()),
      videos: z
        .array(
          z.object({
            src: localAssetPath.refine(
              (path) => path.endsWith(".mp4"),
              "Video must be an MP4",
            ),
            sourceUrl: z
              .string()
              .url()
              .refine((url) => {
                const hostname = new URL(url).hostname;
                return (
                  hostname === "facebook.com" ||
                  hostname.endsWith(".facebook.com")
                );
              }, "Video source must be a Facebook URL"),
            poster: localAssetPath.optional(),
            afterImage: z.number().int().nonnegative(),
          }),
        )
        .default([]),
      postType: z.enum(["article", "discussion", "qa"]).default("article"),
      highlights: z
        .array(
          z.object({
            author: z.string(),
            authorId: z.string(),
            text: z.string(),
            likes: z.number(),
            isBestAnswer: z.boolean().default(false),
          }),
        )
        .default([]),
    })
    .superRefine((post, context) => {
      post.videos.forEach((video, index) => {
        if (video.afterImage > post.images.length) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["videos", index, "afterImage"],
            message: "afterImage must not exceed the number of images",
          });
        }
      });
    }),
});

export const collections = { posts };
