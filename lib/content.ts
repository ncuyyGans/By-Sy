export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Cerita" | "Opini" | "Catatan Belajar" | "Visual";
  date: string;
  readingTime: string;
  body: string[];
};

export const siteContent = {
  name: "Sy",
  intro: "Tempat kecil untuk cerita, pikiran, dan hal-hal yang sedang kupelajari.",
  footer: "Dibuat pelan-pelan oleh Sy.",
};

export const posts: Post[] = [
  {
    slug: "memulai-dari-hal-kecil",
    title: "Memulai dari hal kecil",
    excerpt: "Catatan singkat tentang membuat ruang pribadi di internet.",
    category: "Cerita",
    date: "2026-09-20",
    readingTime: "3 min read",
    body: ["Aku selalu suka ruang yang tidak terlalu ramai. Ruang yang memberi kesempatan untuk berhenti sebentar, membaca, lalu kembali dengan pikiran yang sedikit lebih jernih.", "Website ini adalah percobaan kecil untuk membuat ruang seperti itu. Tidak harus sempurna, tidak harus selesai dalam satu malam.", "Mungkin nanti isinya berubah. Untuk sekarang, cukup mulai dari satu tulisan dan satu halaman sederhana."],
  },
  {
    slug: "belajar-menyimpan-catatan",
    title: "Belajar menyimpan catatan",
    excerpt: "Kenapa menulis ulang sesuatu bisa membantu kita memahaminya.",
    category: "Catatan Belajar",
    date: "2026-09-12",
    readingTime: "4 min read",
    body: ["Belajar sering terasa lebih nyata ketika kita menuliskan kembali apa yang baru saja dipahami.", "Catatan tidak harus menjadi dokumentasi yang lengkap. Kadang satu paragraf yang jujur sudah cukup untuk mengingatkan kita pada prosesnya."],
  },
  {
    slug: "tentang-tampilan-yang-tenang",
    title: "Tentang tampilan yang tenang",
    excerpt: "Beberapa alasan kenapa aku lebih nyaman dengan desain yang sederhana.",
    category: "Opini",
    date: "2026-09-05",
    readingTime: "2 min read",
    body: ["Desain yang sederhana bukan berarti tidak punya karakter. Justru karena elemen yang dipakai lebih sedikit, detail kecil menjadi lebih terasa.", "Aku menyukai halaman yang memberi ruang untuk bernapas: tipografi yang jelas, navigasi yang tidak mengganggu, dan isi yang menjadi pusat perhatian."],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
