import Link from "next/link";
import type { Article, Market } from "@/lib/supabase";

const CATEGORY_COLORS: Record<string, string> = {
  governo: "border-l-accent-primary",
  economia: "border-l-accent-amber",
  elezioni: "border-l-accent-green",
  partiti: "border-l-accent-blue",
  esteri: "border-l-accent-red",
};

type ArticleCardProps = {
  article: Article;
  market?: Market | null;
  index?: number;
};

export default function ArticleCard({
  article,
  market,
  index = 0,
}: ArticleCardProps) {
  const isLive =
    Date.now() - new Date(article.published_at).getTime() < 30 * 60 * 1000;
  const borderColor =
    CATEGORY_COLORS[article.category || ""] || "border-l-border-default";

  return (
    <Link href={`/notizie/${article.id}`}>
      <article
        className={`group border-l-[3px] ${borderColor} bg-bg-elevated rounded-r-lg p-4 hover:-translate-y-0.5 hover:border-border-strong transition-all duration-200 border border-l-0 border-border-subtle`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-center gap-2 mb-2">
          {isLive && (
            <span className="text-[10px] font-mono font-medium tracking-wider text-accent-red bg-accent-red/10 px-1.5 py-0.5 rounded">
              LIVE
            </span>
          )}
          {article.category && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
              {article.category}
            </span>
          )}
          <span className="text-[10px] text-text-tertiary ml-auto">
            {formatTimeAgo(article.published_at)}
          </span>
        </div>

        <h3 className="font-serif text-lg leading-snug text-text-primary group-hover:text-accent-primary transition-colors mb-2">
          {article.title}
        </h3>

        <p className="text-sm text-text-secondary line-clamp-2 mb-3">
          {article.body.slice(0, 200)}...
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {article.source_names?.map((s) => (
            <span
              key={s}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg-surface text-text-tertiary"
            >
              {s}
            </span>
          ))}
          {market && (
            <span className="ml-auto text-xs font-mono font-tabular text-accent-green">
              {Math.round(market.prob_yes * 100)}% Sì
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m fa`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h fa`;
  const days = Math.floor(hours / 24);
  return `${days}g fa`;
}
