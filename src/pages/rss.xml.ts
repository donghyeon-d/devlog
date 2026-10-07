import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config';
import { getPosts, postUrl } from '../lib/posts';
import { withBase } from '../lib/utils';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: new URL(withBase('/'), context.site).href,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl(post),
      categories: [post.data.category, ...post.data.tags],
    })),
    trailingSlash: false,
    customData: `<language>${SITE.lang}</language>`,
  });
}
