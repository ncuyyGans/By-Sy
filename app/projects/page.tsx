import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/data";
import { projects } from "@/lib/projects";

export const revalidate = 60;

export default async function ProjectsPage() {
  const settings = await getSiteSettings();
  return <main className="site-shell"><SiteHeader settings={settings} /><section className="page-hero"><p className="intro-label">Selected work</p><h1>Projects & karya.</h1><p className="page-lead">Beberapa hal yang sedang dan pernah kubangun—dari rumah digital sampai eksperimen kecil yang membantu proses belajar.</p></section><section className="project-list" aria-label="Daftar project">{projects.map((project, index) => <article className="project-card" key={project.title}><div className="project-index">{String(index + 1).padStart(2, "0")}</div><div className="project-main"><div className="project-heading"><div><span className="eyebrow">{project.eyebrow}</span><h2>{project.title}</h2></div><span className="project-year">{project.year}</span></div><p>{project.description}</p><div className="project-bottom"><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-links"><a href={project.url} target="_blank" rel="noreferrer">Lihat project ↗</a>{project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer">Source ↗</a>}</div></div></div></article>)}</section><section className="project-note"><span className="eyebrow">Sedang bertumbuh</span><p>Halaman ini akan terus diisi seiring bertambahnya karya, eksperimen, dan project yang ingin kubagikan.</p></section><footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()}</p></footer></main>;
}
