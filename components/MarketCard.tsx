"use client";

import type { Market } from "@/lib/supabase";
import OddsBar from "./OddsBar";
import Sparkline from "./Sparkline";

type MarketCardProps = {
  market: Market;
  priceHistory?: { timestamp: string; value: number }[];
  index?: number;
};

export default function MarketCard({
  market,
  priceHistory,
  index = 0,
}: MarketCardProps) {
  const pctYes = Math.round(market.prob_yes * 100);
  const pctNo = 100 - pctYes;
  const isPolymarket = market.source === "polymarket";

  const closesAt = market.closes_at
    ? formatCountdown(market.closes_at)
    : null;

  return (
    <div
      className="bg-bg-overlay/50 backdrop-blur-sm border border-border-default rounded-lg p-4 transition-all duration-200 hover:border-border-strong"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-serif text-sm leading-snug text-text-primary flex-1">
          {market.question}
        </h4>
        <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${
            isPolymarket
              ? "bg-accent-blue/10 text-accent-blue"
              : "bg-accent-primary/10 text-accent-primary"
          }`}
        >
          {isPolymarket ? "Polymarket" : "Interno"}
        </span>
      </div>

      <div className="flex items-baseline gap-4 mb-3">
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-tabular text-accent-green">
            {pctYes}%
          </span>
          <span className="text-[10px] text-text-tertiary uppercase">Sì</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-tabular text-accent-red">
            {pctNo}%
          </span>
          <span className="text-[10px] text-text-tertiary uppercase">No</span>
        </div>
        {priceHistory && priceHistory.length > 1 && (
          <div className="ml-auto">
            <Sparkline data={priceHistory} />
          </div>
        )}
      </div>

      <OddsBar probYes={market.prob_yes} />

      <div className="flex items-center gap-2 mt-3 text-[10px] text-text-tertiary">
        {market.category && (
          <span className="font-mono uppercase tracking-wider">
            {market.category}
          </span>
        )}
        {isPolymarket && market.volume_usd != null && (
          <span className="font-mono">
            ${Math.round(market.volume_usd).toLocaleString()} vol
          </span>
        )}
        {!isPolymarket && (
          <span className="font-mono">
            {market.votes_yes + market.votes_no} voti
          </span>
        )}
        {closesAt && <span className="ml-auto">{closesAt}</span>}
        {market.status !== "open" && (
          <span
            className={`ml-auto font-mono uppercase ${
              market.status === "resolved"
                ? "text-accent-green"
                : "text-accent-amber"
            }`}
          >
            {market.status === "resolved" ? "Risolto" : "Chiuso"}
          </span>
        )}
      </div>

      {!isPolymarket && market.status === "open" && (
        <div className="flex gap-2 mt-3">
          <VoteButton marketId={market.id} position="yes" />
          <VoteButton marketId={market.id} position="no" />
        </div>
      )}
    </div>
  );
}

function VoteButton({
  marketId,
  position,
}: {
  marketId: string;
  position: "yes" | "no";
}) {
  const handleVote = async () => {
    try {
      await fetch("/api/markets/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketId, position }),
      });
      window.location.reload();
    } catch {
      // silent fail
    }
  };

  return (
    <button
      onClick={handleVote}
      className={`flex-1 text-xs font-mono py-1.5 rounded border transition-colors ${
        position === "yes"
          ? "border-accent-green/30 text-accent-green hover:bg-accent-green/10"
          : "border-accent-red/30 text-accent-red hover:bg-accent-red/10"
      }`}
    >
      {position === "yes" ? "Sì" : "No"}
    </button>
  );
}

function formatCountdown(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return "Scaduto";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `Scade in ${days}g`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return `Scade in ${hours}h`;
}
