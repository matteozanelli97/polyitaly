"use client";

type OddsBarProps = {
  probYes: number;
  animated?: boolean;
};

export default function OddsBar({ probYes, animated = true }: OddsBarProps) {
  const pctYes = Math.round(probYes * 100);
  const pctNo = 100 - pctYes;

  return (
    <div className="w-full h-2 rounded-full bg-bg-surface overflow-hidden flex">
      <div
        className={`h-full bg-accent-green transition-all duration-300 ${animated ? "animate-odds" : ""}`}
        style={{ width: `${pctYes}%` }}
      />
      <div
        className="h-full bg-accent-red"
        style={{ width: `${pctNo}%` }}
      />
    </div>
  );
}
