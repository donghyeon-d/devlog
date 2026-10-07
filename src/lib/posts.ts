import { getCollection, type CollectionEntry } from 'astro:content';
import { readingTime, slugify, withBase } from './utils';

export type Post = CollectionEntry<'blog'>;

export interface Taxonomy {
  name: string;
  slug: string;
  count: number;
}

/**
 * 공개된 글 목록을 최신순으로 반환한다.
 * production build 에서는 draft: true 인 글을 제외한다. (dev 서버에서는 미리보기 가능)
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
}

export function postUrl(post: Post): string {
  return withBase(`/blog/${post.id}`);
}

export function postReadingTime(post: Post): number {
  return readingTime(post.body ?? '');
}

export function categoryUrl(category: string): string {
  return withBase(`/categories/${slugify(category)}`);
}

export function tagUrl(tag: string): string {
  return withBase(`/tags/${slugify(tag)}`);
}

/** 이름별 개수를 세고 (같은 slug 는 처음 등장한 표기를 사용) */
function collect(values: string[]): Taxonomy[] {
  const map = new Map<string, Taxonomy>();
  for (const name of values) {
    const slug = slugify(name);
    const item = map.get(slug);
    if (item) item.count += 1;
    else map.set(slug, { name, slug, count: 1 });
  }
  return [...map.values()];
}

/** 카테고리 목록 (글 개수 많은 순 → 이름순) */
export function getCategories(posts: Post[]): Taxonomy[] {
  return collect(posts.map((post) => post.data.category)).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

/** 태그 목록 (글 개수 많은 순 → 이름순) */
export function getTags(posts: Post[]): Taxonomy[] {
  return collect(posts.flatMap((post) => post.data.tags)).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

/**
 * 이전 글 / 다음 글
 * posts 는 최신순으로 정렬되어 있으므로 이전 글(더 오래된 글)은 index + 1 이다.
 */
export function getAdjacentPosts(posts: Post[], current: Post): { prev?: Post; next?: Post } {
  const index = posts.findIndex((post) => post.id === current.id);
  if (index === -1) return {};
  return { prev: posts[index + 1], next: posts[index - 1] };
}

/**
 * 관련 글: 태그가 겹칠수록, 같은 카테고리일수록 높은 점수를 준다.
 * 점수가 같으면 최신 글을 우선한다.
 */
export function getRelatedPosts(posts: Post[], current: Post, limit = 3): Post[] {
  const tags = new Set(current.data.tags.map(slugify));
  const category = slugify(current.data.category);

  return posts
    .filter((post) => post.id !== current.id)
    .map((post) => {
      const sharedTags = post.data.tags.filter((tag) => tags.has(slugify(tag))).length;
      const sameCategory = slugify(post.data.category) === category ? 1 : 0;
      return { post, score: sharedTags * 2 + sameCategory };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.date.valueOf() - a.post.data.date.valueOf())
    .slice(0, limit)
    .map(({ post }) => post);
}

/** 연도별로 묶기 (아카이브 페이지용) */
export function groupByYear(posts: Post[]): [number, Post[]][] {
  const groups = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.date.getFullYear();
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups.entries()].sort((a, b) => b[0] - a[0]);
}
