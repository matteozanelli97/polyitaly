import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { fetchPoliticsMarkets, fetchPriceHistory } from "@/lib/polymarket";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();

  try {
    const pmMarkets = await fetchPoliticsMarkets();
    let synced = 0;

    for (const pm of pmMarkets) {
      // Upsert market
      const { data: existing } = await db
        .from("markets")
        .select("id")
        .eq("polymarket_id", pm.condition_id)
        .single();

      let marketId: string;

      if (existing) {
        marketId = existing.id;
        await db
          .from("markets")
          .update({
            status: pm.closed ? "closed" : "open",
            closes_at: pm.end_date_iso,
          })
          .eq("id", marketId);
      } else {
        const { data: inserted } = await db
          .from("markets")
          .insert({
            question: pm.question,
            source: "polymarket",
            polymarket_id: pm.condition_id,
            category: "esteri",
            status: pm.closed ? "closed" : "open",
            closes_at: pm.end_date_iso,
          })
          .select("id")
          .single();

        if (!inserted) continue;
        marketId = inserted.id;
      }

      // Fetch price history for first token (YES)
      const yesToken = pm.tokens?.find(
        (t) => t.outcome.toLowerCase() === "yes"
      );
      if (yesToken) {
        const history = await fetchPriceHistory(yesToken.token_id);
        if (history.length > 0) {
          const lastPrice = history[history.length - 1];
          await db
            .from("markets")
            .update({ prob_yes: lastPrice.p })
            .eq("id", marketId);

          // Store price history
          const points = history.slice(-168).map((h) => ({
            market_id: marketId,
            prob_yes: h.p,
            timestamp: new Date(h.t * 1000).toISOString(),
          }));

          // Clear old history and insert new
          await db
            .from("pm_price_history")
            .delete()
            .eq("market_id", marketId);
          if (points.length > 0) {
            await db.from("pm_price_history").insert(points);
          }
        }
      }

      synced++;
    }

    return NextResponse.json({ found: pmMarkets.length, synced });
  } catch (err) {
    console.error("Polymarket cron error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
