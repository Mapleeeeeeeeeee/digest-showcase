import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"posts">;
export const GET_A_LIFE_TOPIC = {
  primaryId: "get-a-life-mandala-tool",
  sourceIds: ["mandala-life-timeline-origin", "get-a-life-mandala-tool"],
  title: "Get-a-Life：生活規劃工具與開發歷程",
} as const;

export function getPostTopic(id: string) {
  return GET_A_LIFE_TOPIC.sourceIds.some((sourceId) => sourceId === id)
    ? GET_A_LIFE_TOPIC
    : undefined;
}

export function sourceAnchor(id: string): string {
  return `source-${id}`;
}

/** Returns both original entries in reading order; missing sources are an invalid collection. */
export function getTopicSources(posts: Post[]): Post[] {
  return GET_A_LIFE_TOPIC.sourceIds.map((id) => {
    const matches = posts.filter((post) => post.id === id);
    if (matches.length !== 1)
      throw new Error(`Expected one topic source: ${id}`);
    return matches[0];
  });
}

/** Projects original entries to one card per topic without changing their source data. */
export function getDisplayEntries(posts: Post[]): Post[] {
  getTopicSources(posts);
  return posts
    .filter(
      (post) =>
        !getPostTopic(post.id) || post.id === GET_A_LIFE_TOPIC.primaryId,
    )
    .map((post) =>
      post.id === GET_A_LIFE_TOPIC.primaryId
        ? { ...post, data: { ...post.data, title: GET_A_LIFE_TOPIC.title } }
        : post,
    )
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getSearchTitle(post: Post, originals: Post[]): string {
  return getPostTopic(post.id)
    ? [
        post.data.title,
        ...getTopicSources(originals).map((source) => source.data.title),
      ].join(" ")
    : post.data.title;
}

export function getAuthorDisplayEntries(
  posts: Post[],
  authorId: string,
): Post[] {
  const sourceIds = new Set(
    posts
      .filter((post) => post.data.authorId === authorId)
      .map((post) => post.id),
  );
  return getDisplayEntries(posts).filter(
    (post) =>
      sourceIds.has(post.id) ||
      (post.id === GET_A_LIFE_TOPIC.primaryId &&
        GET_A_LIFE_TOPIC.sourceIds.some((id) => sourceIds.has(id))),
  );
}
