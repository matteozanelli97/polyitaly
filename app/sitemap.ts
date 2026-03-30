import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articles } = await supabase
    .from("articles")
    .select("id, published_at")
    .order("published_at", { ascending: false })
    .limit(500);

  const articleEntries = (articles || []).map(
    (a: { id: string; published_at: string }) => ({
      url: `https://polyitaly.it/notizie/${a.id}`,
      lastModified: a.published_at,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })
  );

  return [
    {
      url: "https://polyitaly.it",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: "https://polyitaly.it/mercati",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    ...articleEntries,
  ];
}
