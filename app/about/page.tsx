import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SocialIcon, type SocialIconName } from "@/components/social-icon";
import { getAboutPage, getSiteSettings, getSkills } from "@/lib/data";

export const revalidate = 60;
export default async function AboutPage() {
  const [settings, about, skills] = await Promise.all([getSiteSettings(), getAboutPage(), getSkills()]);
  const contacts: Array<{ label: string; href: string; icon: SocialIconName }> = [
    ...(settings.github_url ? [{ label: "GitHub", href: settings.github_url, icon: "github" as const }] : []),
    ...(settings.instagram_url ? [{ label: "Instagram", href: settings.instagram_url, icon: "instagram" as const }] : []),
    ...(settings.facebook_url ? [{ label: "Facebook", href: settings.facebook_url, icon: "facebook" as const }] : []),
    ...(settings.linkedin_url ? [{ label: "LinkedIn", href: settings.linkedin_url, icon: "linkedin" as const }] : []),
    ...(settings.email ? [{ label: "Email", href: `mailto:${settings.email}`, icon: "email" as const }] : []),
  ];
  return <main className="site-shell"><SiteHeader settings={settings}/><section className="page-hero about-page-hero"><h1>{about.eyebrow}</h1></section><section className="about-main-grid"><article className="about-card about-profile-card"><span className="eyebrow">{about.story_label}</span><h2>{about.story_title}</h2><p>{about.story_body}</p><p>{about.story_body_2}</p></article><div className="about-side"><article className="about-card"><span className="eyebrow">{about.skills_label}</span>{skills.length ? <div className="skill-grid">{skills.map(skill => <div className="skill-item" key={skill.id}><div className="skill-logo">{skill.logo_url ? <img src={skill.logo_url} alt=""/> : <span>{skill.name.slice(0,1)}</span>}</div><div><strong>{skill.name}</strong>{skill.level && <small>{skill.level}</small>}</div></div>)}</div> : <p className="about-empty">Belum ada skill yang ditampilkan.</p>}</article>{contacts.length > 0 && <article className="about-card"><span className="eyebrow">{about.links_label}</span><div className="contact-grid">{contacts.map(contact => <a href={contact.href} target={contact.icon === "email" ? undefined : "_blank"} rel={contact.icon === "email" ? undefined : "noreferrer"} key={contact.label}><span className="contact-icon"><SocialIcon name={contact.icon}/></span><span>{contact.label}</span><span aria-hidden="true">↗</span></a>)}</div></article>}</div></section><section className="page-cta"><div><span className="eyebrow">{about.cta_label}</span><h2>{about.cta_title}</h2></div><Link className="button" href="/projects">{about.cta_button_label}</Link></section><footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()}</p></footer></main>;
}
