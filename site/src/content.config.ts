import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      author: z.string().default('aidd.tokyo'),
      draft: z.boolean().default(false),
      ogImage: image().optional(),
    }),
});

const EVENT_STATUS = ['upcoming', 'past', 'cancelled'] as const;

const events = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/events' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      date: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      venue: z.string().min(1),
      venueUrl: z.url().optional(),
      connpassUrl: z.url().optional(),
      status: z.enum(EVENT_STATUS).default('upcoming'),
      description: z.string().optional(),
      coverImage: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { articles, events };
