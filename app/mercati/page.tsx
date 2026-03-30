import { supabase } from "@/lib/supabase";
import type { Market } from "@/lib/supabase";
import Nav from "@/components/Nav";
import MarketCard from "@/components/MarketCard";

export const revalidate = 60;

async function getMarkets(): Promise<{
  open: Market[];
  resolved: Market[];
}> {
  const [openRes, resolvedRes] = await Promise.all([
    supabase
      .from("markets")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("markets")
      .select("*")
      .eq("status", "resolved")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return {
    open: (openRes.data as Market[]) || [],
    resolved: (resolvedRes.data as Market[]) || [],
  };
}

export default async function MercatiPage() {
  const { open, resolved } = await getMarkets();

  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
        <h1 className="font-serif text-2xl text-text-primary mb-1">
          Mercati predittivi
        </h1>
        <p className="text-sm text-text-secondary mb-8">
          Domande sulla politica italiana con probabilità aggiornate in tempo
          reale.
        </p>

        <section className="mb-12">
          <h2 className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-4">
            Mercati aperti ({open.length})
          </h2>
          {open.length === 0 && (
            <p className="text-text-secondary text-sm">
              Nessun mercato attivo al momento.
            </p>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            {open.map((m, i) => (
              <MarketCard key={m.id} market={m} index={i} />
            ))}
          </div>
        </section>

        {resolved.length > 0 && (
          <section>
            <h2 className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-4">
              Risolti di recente
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {resolved.map((m, i) => (
                <MarketCard key={m.id} market={m} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
