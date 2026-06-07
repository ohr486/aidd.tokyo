import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { absoluteUrl, escapeXml, formatIsoDate, latestDate } from '../lib/site';

interface SitemapEntry {
  path: string;
  lastmod?: Date;
}

function renderUrl(entry: SitemapEntry) {
  const lastmod = entry.lastmod ? `<lastmod>${formatIsoDate(entry.lastmod)}</lastmod>` : '';

  return `<url><loc>${escapeXml(absoluteUrl(entry.path))}</loc>${lastmod}</url>`;
}

export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
  const events = (await getCollection('events', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const tags = [...new Set(articles.flatMap((article) => article.data.tags))].sort((a, b) =>
    a.localeCompare(b, 'ja'),
  );
  const contentLatestDate = latestDate([
    ...articles.map((article) => article.data.updatedAt ?? article.data.publishedAt),
    ...events.map((event) => event.data.date),
  ]);

  const entries: SitemapEntry[] = [
    { path: '/', lastmod: contentLatestDate },
    { path: '/about/' },
    { path: '/articles/', lastmod: contentLatestDate },
    { path: '/events/', lastmod: latestDate(events.map((event) => event.data.date)) },
    { path: '/tags/', lastmod: contentLatestDate },
    ...articles.map((article) => ({
      path: `/articles/${article.id}/`,
      lastmod: article.data.updatedAt ?? article.data.publishedAt,
    })),
    ...events.map((event) => ({
      path: `/events/${event.id}/`,
      lastmod: event.data.date,
    })),
    ...tags.map((tag) => ({
      path: `/tags/${encodeURIComponent(tag)}/`,
      lastmod: contentLatestDate,
    })),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(renderUrl),
    '</urlset>',
  ].join('');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
