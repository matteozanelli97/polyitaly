import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolyItaly — Il polso della politica italiana",
  description:
    "Intelligence in tempo reale sulla politica italiana. Notizie, mercati predittivi e analisi. Aggiornato in tempo reale.",
  openGraph: {
    title: "PolyItaly",
    description: "Il polso della politica italiana",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-bg-base text-text-primary">
        {children}
      </body>
    </html>
  );
}
