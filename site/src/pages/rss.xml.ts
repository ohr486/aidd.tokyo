import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
  escapeXml,
  formatRssDate,
  latestDate,
} from '../lib/site';

export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
  const lastBuildDate = latestDate(articles.map((article) => article.data.updatedAt ?? article.data.publishedAt));

  const items = articles
    .map((article) => {
      const articleUrl = absoluteUrl(`/articles/${article.id}/`);
      const pubDate = article.data.publishedAt;
      const categories = article.data.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join('');

      return [
        '<item>',
        `<title>${escapeXml(article.data.title)}</title>`,
        `<link>${escapeXml(articleUrl)}</link>`,
        `<guid isPermaLink="true">${escapeXml(articleUrl)}</guid>`,
        `<description>${escapeXml(article.data.description)}</description>`,
        `<pubDate>${formatRssDate(pubDate)}</pubDate>`,
        categories,
        '</item>',
      ].join('');
    })
    .join('');

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(SITE_NAME)}</title>`,
    `<link>${escapeXml(absoluteUrl('/'))}</link>`,
    `<description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    `<language>ja</language>`,
    `<atom:link href="${escapeXml(absoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml" />`,
    lastBuildDate ? `<lastBuildDate>${formatRssDate(lastBuildDate)}</lastBuildDate>` : '',
    items,
    '</channel>',
    '</rss>',
  ].join('');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
