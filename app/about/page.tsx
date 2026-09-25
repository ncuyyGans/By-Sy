import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getAboutPage, getSiteSettings } from "@/lib/data";

export const revalidate = 60;

export default async function AboutPage() {
  const [settings, about] = await Promise.all([getSiteSettings(), getAboutPage()]);
  return <main className="site-shell"><SiteHeader settings={settings} /><section className="page-hero about-page-hero"><h1>{about.eyebrow}</h1></section><section className="about-layout"><article className="about-card about-card-large"><span className="eyebrow">{about.story_label}</span><h2>{about.story_title}</h2><p>{about.story_body}</p><p>{about.story_body_2}</p></article><article className="about-card"><span className="eyebrow">{about.focus_label}</span><ul className="about-list"><li>{about.focus_1}</li><li>{about.focus_2}</li><li>{about.focus_3}</li></ul></article><article className="about-card"><span className="eyebrow">{about.links_label}</span><div className="about-links">{settings.github_url && <a href={settings.github_url} target="_blank" rel="noreferrer">GitHub ↗</a>}{settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noreferrer">Instagram ↗</a>}{settings.x_url && <a href={settings.x_url} target="_blank" rel="noreferrer">X / Twitter ↗</a>}<a href={`mailto:${settings.email}`}>Email ↗</a></div></article></section><section className="page-cta"><div><span className="eyebrow">{about.cta_label}</span><h2>{about.cta_title}</h2></div><Link className="button" href="/projects">{about.cta_button_label}</Link></section><footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()}</p></footer></main>;
}
