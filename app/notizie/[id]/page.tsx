import { supabase } from "@/lib/supabase";
import type { Article, Market } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import MarketCard from "@/components/MarketCard";

export const revalidate = 300;

type Props = {
  params: { id: string };
};

async function getArticle(id: string): Promise<Article | null> {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();
  return data as Article | null;
}

async function getLinkedMarkets(articleId: string): Promise<Market[]> {
  const { data } = await supabase
    .from("markets")
    .select("*")
    .eq("article_id", articleId);
  return (data as Market[]) || [];
}

const CATEGORY_COLORS: Record<string, string> = {
  governo: "text-accent-primary",
  economia: "text-accent-amber",
  elezioni: "text-accent-green",
  partiti: "text-accent-blue",
  esteri: "text-accent-red",
};

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.id);
  if (!article) notFound();

  const markets = await getLinkedMarkets(article.id);

  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />

      <main className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            {article.category && (
              <span
                className={`text-[10px] font-mono uppercase tracking-wider ${
                  CATEGORY_COLORS[article.category] || "text-text-tertiary"
                }`}
              >
                {article.category}
              </span>
            )}
            <span className="text-[10px] font-mono text-text-tertiary">
              {new Date(article.published_at).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <h1 className="font-serif text-3xl lg:text-4xl leading-tight text-text-primary mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-2 mb-6">
            {article.source_names?.map((s) => (
              <span
                key={s}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-surface text-text-tertiary"
              >
                {s}
              </span>
            ))}
            {article.tags?.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-muted text-accent-primary"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        <article className="prose-sm text-text-secondary leading-relaxed whitespace-pre-line mb-8">
          {article.body}
        </article>

        {article.source_urls && article.source_urls.length > 0 && (
          <div className="border-t border-border-subtle pt-4 mb-8">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-2">
              Fonti
            </h3>
            <div className="space-y-1">
              {article.source_urls.map((url, i) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-accent-blue hover:underline truncate"
                >
                  {article.source_names?.[i] || url}
                </a>
              ))}
            </div>
          </div>
        )}

        {markets.length > 0 && (
          <div className="border-t border-border-subtle pt-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-4">
              Mercati collegati
            </h3>
            <div className="space-y-3">
              {markets.map((m, i) => (
                <MarketCard key={m.id} market={m} index={i} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
