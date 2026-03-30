const CLOB_BASE = "https://clob.polymarket.com";

const ITALY_KEYWORDS = [
  "italy",
  "italian",
  "meloni",
  "italia",
  "italiano",
  "europe",
  "eu ",
  "draghi",
  "salvini",
  "schlein",
];

export type PolymarketMarket = {
  condition_id: string;
  question: string;
  tokens: { token_id: string; outcome: string }[];
  active: boolean;
  closed: boolean;
  market_slug: string;
  end_date_iso: string;
  description: string;
};

export type PriceHistoryPoint = {
  t: number;
  p: number;
};

export async function fetchPoliticsMarkets(): Promise<PolymarketMarket[]> {
  try {
    const res = await fetch(`${CLOB_BASE}/markets?tag=politics&limit=100`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const markets: PolymarketMarket[] = Array.isArray(data) ? data : data.data || [];
    return markets.filter((m) =>
      ITALY_KEYWORDS.some(
        (kw) =>
          m.question.toLowerCase().includes(kw) ||
          m.description?.toLowerCase().includes(kw)
      )
    );
  } catch {
    return [];
  }
}

export async function fetchPriceHistory(
  tokenId: string,
  interval: string = "1d"
): Promise<PriceHistoryPoint[]> {
  try {
    const res = await fetch(
      `${CLOB_BASE}/prices-history?market=${tokenId}&interval=${interval}`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.history || [];
  } catch {
    return [];
  }
}
