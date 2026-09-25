export type Project = {
  title: string;
  eyebrow: string;
  year: string;
  description: string;
  url: string;
  repoUrl?: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    title: "By-Sy",
    eyebrow: "Personal journal & blog",
    year: "2026",
    description: "Ruang personal untuk cerita, opini, catatan belajar, dan visual—dibangun sebagai rumah digital yang terus tumbuh.",
    url: "https://by-sy.vercel.app",
    repoUrl: "https://github.com/ncuyyGans/By-Sy",
    tags: ["Next.js", "Supabase", "Writing"],
  },
];
