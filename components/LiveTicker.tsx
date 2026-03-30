type LiveTickerProps = {
  headlines: string[];
};

export default function LiveTicker({ headlines }: LiveTickerProps) {
  if (headlines.length === 0) return null;

  const text = headlines.join("  \u2022  ");

  return (
    <div className="w-full bg-bg-elevated border-b border-border-subtle overflow-hidden h-8 flex items-center">
      <span className="flex-shrink-0 px-3 text-[10px] font-mono font-medium tracking-wider text-accent-red bg-accent-red/10 h-full flex items-center">
        LIVE
      </span>
      <div className="overflow-hidden flex-1 relative">
        <div className="animate-ticker whitespace-nowrap flex">
          <span className="text-xs text-text-secondary px-4 font-mono">
            {text}
          </span>
          <span className="text-xs text-text-secondary px-4 font-mono">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
