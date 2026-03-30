import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { evaluateResolution } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();

  try {
    // Get markets that should be resolved (past closes_at)
    const { data: markets } = await db
      .from("markets")
      .select("*")
      .eq("source", "internal")
      .eq("status", "open")
      .lte("closes_at", new Date().toISOString());

    if (!markets || markets.length === 0) {
      return NextResponse.json({ resolved: 0 });
    }

    // Get recent news for context
    const { data: recentNews } = await db
      .from("articles")
      .select("title, body")
      .order("published_at", { ascending: false })
      .limit(20);

    const newsContext = (recentNews || [])
      .map((a: { title: string; body: string }) => `${a.title}: ${a.body}`)
      .join("\n\n");

    let resolvedCount = 0;

    for (const market of markets) {
      try {
        const result = await evaluateResolution(market.question, newsContext);

        if (result.resolved) {
          await db
            .from("markets")
            .update({
              status: "resolved",
              resolution: result.resolution,
            })
            .eq("id", market.id);
          resolvedCount++;
        } else {
          // Extend by 7 days if can't resolve yet
          const newClose = new Date();
          newClose.setDate(newClose.getDate() + 7);
          await db
            .from("markets")
            .update({ closes_at: newClose.toISOString() })
            .eq("id", market.id);
        }
      } catch (err) {
        console.error(`Error resolving market ${market.id}:`, err);
      }
    }

    return NextResponse.json({
      checked: markets.length,
      resolved: resolvedCount,
    });
  } catch (err) {
    console.error("Resolve cron error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
