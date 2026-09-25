import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";
import "./admin.css";
import "./editor.css";
import "./theme.css";

export const metadata: Metadata = {
  title: "Sy — personal notes",
  description: "Cerita, pemikiran, dan catatan belajar dari Sy.",
};

const themeScript = `
  (function () {
    try {
      var saved = localStorage.getItem("bysy-theme");
      var theme = saved === "dark" || saved === "light"
        ? saved
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (_) {
      document.documentElement.dataset.theme = "light";
    }
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body>{children}<ThemeToggle /></body></html>;
}
