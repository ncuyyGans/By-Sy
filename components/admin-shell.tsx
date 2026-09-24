import Link from "next/link";
import { logout } from "@/app/admin/actions";

export function AdminShell({ children, title = "Admin" }: { children: React.ReactNode; title?: string }) {
  return <main className="site-shell admin-wrap"><div className="admin-top"><div><div className="eyebrow">Private workspace</div><h1 style={{ marginBottom: 0 }}>{title}</h1></div><div className="admin-actions"><Link className="text-link" href="/">Lihat website ↗</Link><form action={logout}><button className="link-button">Keluar</button></form></div></div>{children}</main>;
}
