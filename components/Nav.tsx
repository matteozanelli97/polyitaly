import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 h-[52px] bg-bg-base/80 backdrop-blur-md border-b border-border-subtle flex items-center px-4 lg:px-6">
      <Link href="/" className="flex items-center gap-1 flex-shrink-0">
        <span className="text-lg font-sans font-medium text-text-primary">
          Poly
        </span>
        <span className="text-lg font-serif italic text-text-primary">
          Italy
        </span>
        <span className="flex gap-[2px] ml-1">
          <span className="w-1 h-1 rounded-full bg-red-500" />
          <span className="w-1 h-1 rounded-full bg-white" />
          <span className="w-1 h-1 rounded-full bg-green-500" />
        </span>
      </Link>

      <div className="flex-1 flex items-center justify-center gap-6">
        <Link
          href="/"
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Home
        </Link>
        <Link
          href="/mercati"
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Mercati
        </Link>
      </div>

      <ThemeToggle />
    </nav>
  );
}
