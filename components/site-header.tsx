import Link from "next/link";
import type { SiteSettings } from "@/lib/data";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return <header className="site-header"><Link className="logo" href="/">{settings.name}<span className="logo-dot">●</span></Link><nav className="nav" aria-label="Navigasi utama"><Link href="/">Index</Link><Link href="/blog">Writing</Link><a href={`mailto:${settings.email}`}>Contact</a></nav></header>;
}
