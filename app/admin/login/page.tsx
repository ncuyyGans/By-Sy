import { login } from "@/app/admin/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="login-page"><form className="admin-card login-card" action={login}><div><div className="eyebrow">Sy / Private</div><h2>Masuk ke admin</h2><p>Gunakan akun admin yang dibuat di Supabase Authentication.</p></div>{error && <div className="form-error">{error}</div>}<label>Email<input type="email" name="email" autoComplete="email" required /></label><label>Password<input type="password" name="password" autoComplete="current-password" required /></label><button className="button" type="submit">Masuk</button><a className="text-link" href="/">← Kembali ke website</a></form></main>;
}
