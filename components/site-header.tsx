import Link from "next/link";
import type { SiteSettings } from "@/lib/data";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return <header className="site-header"><Link className="logo" href="/">{settings.name}</Link><nav className="nav" aria-label="Navigasi utama"><Link href="/">Home</Link><Link href="/blog">Blog</Link><a href={`mailto:${settings.email}`}>Email</a></nav></header>;
}
