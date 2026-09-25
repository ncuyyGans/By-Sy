"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    localStorage.setItem("bysy-theme", next);
    setTheme(next);
  }

  const isDark = theme === "dark";

  return <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"} title={isDark ? "Mode terang" : "Mode gelap"}><span aria-hidden="true">{theme === null ? "◐" : isDark ? "☀" : "☾"}</span><span className="theme-toggle-label">{isDark ? "Light" : "Dark"}</span></button>;
}
