import Nav from "@/components/Nav";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-4xl text-text-primary mb-4">404</h1>
        <p className="text-text-secondary mb-6">Pagina non trovata.</p>
        <Link
          href="/"
          className="text-sm text-accent-primary hover:underline"
        >
          Torna alla home
        </Link>
      </main>
    </div>
  );
}
