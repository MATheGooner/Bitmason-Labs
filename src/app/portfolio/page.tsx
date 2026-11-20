import Link from "next/link";
import { PublicPage } from "@/components/layout/public-page";
import { ProjectCard } from "@/components/portfolio/project-card";
import { PageCta } from "@/components/public/page-cta";
import { PageHero } from "@/components/public/page-hero";
import { Container } from "@/components/ui/container";
import { publicPageMetadata } from "@/lib/metadata";
import { getPortfolioCategories, listPublishedProjects } from "@/server/portfolio/reader";

export const metadata = publicPageMetadata("Selected work", "Explore design and engineering case studies across hospitality, home services, healthcare and property, from customer discovery to connected operations.", "/portfolio");

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const [query, categories, allProjects] = await Promise.all([searchParams, getPortfolioCategories(), listPublishedProjects()]);
  const category = typeof query.category === "string" && query.category ? query.category : undefined;
  const activeCategory = categories.find((item) => item.slug === category);
  const invalidCategory = Array.isArray(query.category) || (category !== undefined && !activeCategory);
  const projects = invalidCategory ? [] : category ? await listPublishedProjects({ category }) : allProjects;
  return <PublicPage activePage="/portfolio">
    <PageHero eyebrow="Portfolio / Selected work" title={<>Different businesses.<br /><span>Clearer customer journeys.</span></>} description="A selection of design and engineering work across service businesses, hospitality, healthcare and property. Explore how each experience connects a business purpose with a clear customer journey." />
    <section id="projects" tabIndex={-1} className="portfolio-section" aria-labelledby="portfolio-results-title"><Container>
      <nav className="portfolio-filters" aria-label="Filter projects by category">
        <Link href="/portfolio#projects" aria-current={!category && !invalidCategory ? "true" : undefined}>All work</Link>
        {categories.map((item) => <Link key={item.slug} href={`/portfolio?category=${encodeURIComponent(item.slug)}#projects`} aria-current={activeCategory?.slug === item.slug ? "true" : undefined}>{item.name}</Link>)}
      </nav>
      <div className="portfolio-results-heading"><h2 id="portfolio-results-title">{activeCategory ? `${activeCategory.name} projects` : "Selected work"}</h2><p>{projects.length} {projects.length === 1 ? "project" : "projects"}{activeCategory ? ` in ${activeCategory.name.toLowerCase()}` : ""}</p></div>
      {projects.length ? <div className="projects-grid portfolio-grid">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div> : <div className="portfolio-empty"><p>{allProjects.length ? "No projects match this category." : "Selected work is currently unavailable. Please check back shortly."}</p><Link href="/portfolio#projects" className="text-link">View all work</Link></div>}
    </Container></section>
    <PageCta title="A similar challenge in your business?" description="A useful project starts with your requirements. Tell us about the experience, system or workflow you want to improve." />
  </PublicPage>;
}
