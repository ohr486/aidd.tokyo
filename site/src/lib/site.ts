export const SITE_NAME = 'aidd.tokyo';
export const SITE_URL = 'https://aidd.tokyo';
export const SITE_DESCRIPTION =
  'AI駆動開発 (AI-Driven Development) を学び、試し、共有する東京発のコミュニティです。';

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).href;
}

export function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function formatIsoDate(date: Date) {
  return date.toISOString();
}

export function formatRssDate(date: Date) {
  return date.toUTCString();
}

export function latestDate(dates: Date[]) {
  return dates.length > 0
    ? dates.reduce((latest, date) => (date.getTime() > latest.getTime() ? date : latest), dates[0])
    : undefined;
}
