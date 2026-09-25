import Link from "next/link";
import type { SiteSettings } from "@/lib/data";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return <header className="site-header"><Link className="logo" href="/">{settings.name}</Link><nav className="nav" aria-label="Navigasi utama"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/projects">Projects</Link><Link href="/blog">Writing</Link><a href={`mailto:${settings.email}`}>Contact</a></nav></header>;
}
