import { SiteHeader } from "@/components/site-header";
import { getProjects, getProjectsPage, getSiteSettings } from "@/lib/data";

export const revalidate = 60;

export default async function ProjectsPage() {
  const [settings, page, projects] = await Promise.all([getSiteSettings(), getProjectsPage(), getProjects()]);
  return <main className="site-shell"><SiteHeader settings={settings} /><section className="page-hero"><p className="intro-label">{page.eyebrow}</p><h1>{page.title}</h1><p className="page-lead">{page.lead}</p></section><section className="project-list" aria-label={page.title}>{projects.length ? projects.map((project, index) => <article className="project-card" key={project.id}><div className="project-index">{String(index + 1).padStart(2, "0")}</div><div className="project-main"><div className="project-heading"><div><span className="eyebrow">{project.eyebrow}</span><h2>{project.title}</h2></div><span className="project-year">{project.year}</span></div><p>{project.description}</p><div className="project-bottom"><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-links"><a href={project.url} target="_blank" rel="noreferrer">Lihat project ↗</a>{project.repo_url && <a href={project.repo_url} target="_blank" rel="noreferrer">Source ↗</a>}</div></div></div></article>) : <div className="empty-state"><p>Belum ada project yang ditampilkan.</p></div>}</section><section className="project-note"><span className="eyebrow">{page.note_label}</span><p>{page.note_body}</p></section><footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()}</p></footer></main>;
}
