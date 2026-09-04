import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: 'yaoi.foundation',
    description: "dani's stuff!",
    site: context.site || 'https://yaoi.foundation',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: post.data.category === 'poetry' ? `/poetry/${post.id}/` : `/blog/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
