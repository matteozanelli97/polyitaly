import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "PolyItaly/1.0",
  },
});

export type RSSItem = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
};

const RSS_FEEDS: { url: string; name: string }[] = [
  { url: "https://www.ansa.it/sito/notizie/politica/politica_rss.xml", name: "ANSA" },
  { url: "https://www.repubblica.it/rss/politica/rss2.0.xml", name: "Repubblica" },
  { url: "https://www.corriere.it/rss/politica.xml", name: "Corriere" },
  { url: "https://tg24.sky.it/rss/tg24.rss", name: "Sky TG24" },
  { url: "https://www.ilpost.it/politica/feed/", name: "Il Post" },
];

export async function fetchAllFeeds(): Promise<RSSItem[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const parsed = await parser.parseURL(feed.url);
      return (parsed.items || []).map((item) => ({
        title: item.title || "",
        link: item.link || "",
        pubDate: item.pubDate || new Date().toISOString(),
        description: item.contentSnippet || item.content || "",
        source: feed.name,
      }));
    })
  );

  const items: RSSItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    }
  }

  return items;
}

export function titleSimilarity(a: string, b: string): number {
  const arrA = a.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const arrB = b.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  if (arrA.length === 0 || arrB.length === 0) return 0;
  const setB = new Set(arrB);
  let overlap = 0;
  for (let i = 0; i < arrA.length; i++) {
    if (setB.has(arrA[i])) overlap++;
  }
  return overlap / Math.max(arrA.length, arrB.length);
}
