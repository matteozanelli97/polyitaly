import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { fetchAllFeeds, titleSimilarity } from "@/lib/rss";
import { rewriteArticle, scoreArticle, generateMarketQuestion } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();

  try {
    // 1. Fetch all RSS feeds
    const items = await fetchAllFeeds();

    // 2. Get recent article titles for dedup
    const { data: recentArticles } = await db
      .from("articles")
      .select("title")
      .order("published_at", { ascending: false })
      .limit(100);

    const existingTitles = (recentArticles || []).map(
      (a: { title: string }) => a.title
    );

    // 3. Filter duplicates
    const newItems = items.filter((item) => {
      return !existingTitles.some(
        (existing: string) => titleSimilarity(item.title, existing) > 0.6
      );
    });

    // 4. Process (max 20 per run)
    const toProcess = newItems.slice(0, 20);
    let processed = 0;

    for (const item of toProcess) {
      try {
        // Rewrite with Claude
        const body = await rewriteArticle(
          `${item.title}. ${item.description}`
        );

        // Score
        const score = await scoreArticle(item.title, body);

        // Insert article
        const { data: article } = await db
          .from("articles")
          .insert({
            title: item.title,
            body,
            category: score.category || null,
            importance: score.importance,
            sentiment: score.sentiment,
            source_names: [item.source],
            source_urls: [item.link],
            tags: score.tags || [],
            published_at: item.pubDate || new Date().toISOString(),
          })
          .select("id")
          .single();

        // Generate market question for important articles
        if (score.importance >= 7 && article) {
          const market = await generateMarketQuestion(item.title, body);
          if (market) {
            await db.from("markets").insert({
              article_id: article.id,
              question: market.question,
              source: "internal",
              category: market.category,
              closes_at: market.closes_at,
            });
          }
        }

        processed++;
      } catch (err) {
        console.error(`Error processing item: ${item.title}`, err);
      }
    }

    return NextResponse.json({
      fetched: items.length,
      new: newItems.length,
      processed,
    });
  } catch (err) {
    console.error("News cron error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
