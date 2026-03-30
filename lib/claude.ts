import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function rewriteArticle(rawText: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Riscrivi questa notizia in italiano in massimo 120 parole. Tono: informativo, neutro, autorevole. NO frasi come "secondo fonti". Inizia direttamente con il fatto. Notizia: ${rawText}`,
      },
    ],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

export async function scoreArticle(
  title: string,
  body: string
): Promise<{ importance: number; sentiment: number; tags: string[]; category?: string }> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Analizza questo articolo di politica italiana e rispondi SOLO con JSON valido.
Titolo: ${title}
Testo: ${body}

Formato: {"importance": <1-10>, "sentiment": <-1.0 a 1.0>, "tags": ["tag1","tag2"], "category": "governo|economia|elezioni|partiti|esteri"}`,
      },
    ],
  });
  const block = response.content[0];
  const text = block.type === "text" ? block.text : "{}";
  try {
    return JSON.parse(text);
  } catch {
    return { importance: 5, sentiment: 0, tags: [] };
  }
}

export async function generateMarketQuestion(
  title: string,
  body: string
): Promise<{
  question: string;
  closes_at: string;
  category: string;
} | null> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Dato questo articolo di politica italiana, genera UNA domanda binaria (sì/no) per un prediction market. Deve essere: verificabile, con scadenza chiara, interessante per il pubblico italiano. Formato JSON: {"question": "...", "closes_at": "YYYY-MM-DD", "category": "governo|economia|elezioni|partiti|esteri"}

Titolo: ${title}
Testo: ${body}`,
      },
    ],
  });
  const block = response.content[0];
  const text = block.type === "text" ? block.text : "";
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function evaluateResolution(
  question: string,
  recentNews: string
): Promise<{ resolved: boolean; resolution: boolean; reasoning: string }> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Sei un giudice di prediction market. Data questa domanda e le notizie recenti, determina se la domanda può essere risolta.

Domanda: ${question}
Notizie recenti: ${recentNews}

Rispondi SOLO con JSON: {"resolved": true/false, "resolution": true/false, "reasoning": "breve spiegazione"}
Se non ci sono abbastanza informazioni per risolvere, resolved deve essere false.`,
      },
    ],
  });
  const block = response.content[0];
  const text = block.type === "text" ? block.text : "{}";
  try {
    return JSON.parse(text);
  } catch {
    return { resolved: false, resolution: false, reasoning: "Parse error" };
  }
}
