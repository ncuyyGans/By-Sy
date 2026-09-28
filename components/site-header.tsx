import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import type { SiteSettings } from "@/lib/data";

export function SiteHeader({ settings: _settings }: { settings: SiteSettings }) {
  return <header className="site-header"><Link className="logo" href="/">BySy</Link><nav className="nav" aria-label="Navigasi utama"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/projects">Projects</Link><Link href="/blog">Writing</Link><ThemeToggle /></nav></header>;
}
