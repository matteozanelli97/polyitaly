"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("polyitaly-theme");
    if (stored === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("polyitaly-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("polyitaly-theme", "light");
    }
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md hover:bg-bg-surface transition-colors text-text-secondary hover:text-text-primary"
      aria-label="Toggle theme"
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M14 8.5A6.5 6.5 0 017.5 2c0-.5.05-1 .15-1.5A7 7 0 108.5 15c-.5-.1-1-.15-1.5-.15A6.5 6.5 0 0114 8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
