"use client";

import { useState } from "react";

export default function AdminPage() {
  const [saved, setSaved] = useState(false);
  const [intro, setIntro] = useState("Tempat kecil untuk cerita, pikiran, dan hal-hal yang sedang kupelajari.");
  return <main className="site-shell admin-wrap"><div className="admin-top"><div><div className="eyebrow">Private workspace</div><h1 style={{ marginBottom: 0 }}>Admin</h1></div><a className="text-link" href="/">← Lihat website</a></div><div className="admin-grid"><aside className="admin-nav"><button>Overview</button><button>Posts</button><button>Media</button><button>Settings</button></aside><section className="admin-card"><h2>Pengaturan homepage</h2><p>Edit konten dasar website dari sini. Panel ini masih menggunakan data template sementara.</p>{saved && <div className="notice">Perubahan tersimpan di sesi browser ini.</div>}<div className="form-grid"><label>Nama<input defaultValue="Sy" /></label><label>Intro homepage<textarea value={intro} onChange={(event) => setIntro(event.target.value)} /></label><label>Email publik<input defaultValue="hello@example.com" type="email" /></label><button className="button" onClick={() => setSaved(true)}>Simpan perubahan</button></div></section></div></main>;
}
