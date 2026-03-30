import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getServiceClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type Article = {
  id: string;
  title: string;
  body: string;
  category: string | null;
  importance: number;
  sentiment: number | null;
  source_names: string[];
  source_urls: string[];
  tags: string[];
  published_at: string;
  created_at: string;
};

export type Market = {
  id: string;
  article_id: string | null;
  question: string;
  source: "internal" | "polymarket";
  polymarket_id: string | null;
  category: string | null;
  status: "open" | "closed" | "resolved";
  resolution: boolean | null;
  prob_yes: number;
  volume_pts: number;
  volume_usd: number | null;
  votes_yes: number;
  votes_no: number;
  closes_at: string | null;
  created_at: string;
};

export type PricePoint = {
  id: string;
  market_id: string;
  prob_yes: number;
  timestamp: string;
};
