import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['en', 'it']).default('en'),
    translationKey: z.string().optional(),
    'translation-key': z.string().optional(),
    pinned: z.boolean().default(false).optional(),
    category: z.enum(['post', 'poetry']).optional()
  }).transform((data) => ({
    ...data,
    translationKey: data.translationKey || data['translation-key']
  }))
});

export const collections = { blog };
