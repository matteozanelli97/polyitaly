import { supabase } from "@/lib/supabase";
import type { Article, Market } from "@/lib/supabase";
import Nav from "@/components/Nav";
import LiveTicker from "@/components/LiveTicker";
import ArticleCard from "@/components/ArticleCard";
import MarketCard from "@/components/MarketCard";

export const revalidate = 300;

async function getArticles(): Promise<Article[]> {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(30);
  return (data as Article[]) || [];
}

async function getMarkets(): Promise<Market[]> {
  const { data } = await supabase
    .from("markets")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(20);
  return (data as Market[]) || [];
}

export default async function HomePage() {
  const [articles, markets] = await Promise.all([
    getArticles(),
    getMarkets(),
  ]);

  const headlines = articles.slice(0, 10).map((a) => a.title);
  const featuredMarkets = markets.slice(0, 6);
  const trendingArticles = articles
    .filter((a) => a.importance >= 7)
    .slice(0, 5);

  const marketByArticle = new Map<string, Market>();
  for (const m of markets) {
    if (m.article_id) marketByArticle.set(m.article_id, m);
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <LiveTicker headlines={headlines} />
      <Nav />

      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Feed */}
          <section className="lg:w-[60%] space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-4">
              Ultimi aggiornamenti
            </h2>
            {articles.length === 0 && (
              <p className="text-text-secondary text-sm">
                Nessun articolo disponibile. Il sistema si aggiornerà
                automaticamente.
              </p>
            )}
            {articles.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                market={marketByArticle.get(article.id)}
                index={i}
              />
            ))}
          </section>

          {/* Markets Sidebar */}
          <section className="lg:w-[26%] space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-4">
              Mercati aperti
            </h2>
            {featuredMarkets.length === 0 && (
              <p className="text-text-secondary text-sm">
                Nessun mercato attivo.
              </p>
            )}
            {featuredMarkets.map((market, i) => (
              <MarketCard key={market.id} market={market} index={i} />
            ))}
          </section>

          {/* Trending */}
          <aside className="lg:w-[14%]">
            <h2 className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-4">
              In evidenza
            </h2>
            <div className="space-y-3">
              {trendingArticles.map((article) => (
                <a
                  key={article.id}
                  href={`/notizie/${article.id}`}
                  className="block group"
                >
                  <p className="text-xs font-serif leading-snug text-text-secondary group-hover:text-text-primary transition-colors">
                    {article.title}
                  </p>
                  <span className="text-[10px] font-mono text-text-tertiary mt-1 block">
                    {article.source_names?.[0]}
                  </span>
                </a>
              ))}
              {trendingArticles.length === 0 && (
                <p className="text-text-tertiary text-[10px] font-mono">
                  Aggiornato in tempo reale
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-border-subtle py-6 mt-12">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm font-sans font-medium text-text-tertiary">
              Poly
            </span>
            <span className="text-sm font-serif italic text-text-tertiary">
              Italy
            </span>
          </div>
          <p className="text-[10px] font-mono text-text-tertiary">
            Aggiornato in tempo reale
          </p>
        </div>
      </footer>
    </div>
  );
}
