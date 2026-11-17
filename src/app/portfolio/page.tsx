import Link from "next/link";

import { PublicPage } from "@/components/layout/public-page";
import { ProjectCard } from "@/components/portfolio/project-card";
import { PageCta } from "@/components/public/page-cta";
import { PageHero } from "@/components/public/page-hero";
import { Container } from "@/components/ui/container";
import { publicPageMetadata } from "@/lib/metadata";
import { getPortfolioCategories, listPublishedProjects } from "@/server/portfolio/reader";

export const metadata = publicPageMetadata("Portfolio", "Explore project studies showing service discovery, quote enquiries, ordering and appointment requests, with clear delivery status and scope.", "/portfolio");

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const [query, categories, allProjects] = await Promise.all([searchParams, getPortfolioCategories(), listPublishedProjects()]);
  const category = typeof query.category === "string" && query.category ? query.category : undefined;
  const activeCategory = categories.find((item) => item.slug === category);
  const invalidCategory = Array.isArray(query.category) || (category !== undefined && !activeCategory);
  const projects = invalidCategory ? [] : category ? await listPublishedProjects({ category }) : allProjects;
  const total = allProjects.length;
  const allConcepts = total > 0 && allProjects.every((project) => project.status === "concept");
  const shownAreConcepts = projects.length > 0 && projects.every((project) => project.status === "concept");

  return (
    <PublicPage activePage="/portfolio">
      <PageHero eyebrow="Portfolio / Project studies" title={<>Different businesses.<br /><span>Clearer customer journeys.</span></>} description="Explore how websites can help customers find a service, explain their requirements, place an order or request an appointment. Each study makes its context, scope and concept status clear.">
        <p className="portfolio-honesty">{allConcepts ? "The current collection consists of concept studies for fictional businesses. No commissioned client delivery or measured business results are claimed." : "Each project is labelled with its delivery status. Concept studies are distinct from completed work."}</p>
      </PageHero>
      <section id="projects" tabIndex={-1} className="portfolio-section" aria-labelledby="portfolio-results-title">
        <Container>
          <nav className="portfolio-filters" aria-label="Filter projects by category">
            <Link href="/portfolio#projects" aria-current={!category && !invalidCategory ? "true" : undefined}>All projects <span>{String(total).padStart(2, "0")}</span></Link>
            {categories.map((item) => <Link key={item.slug} href={`/portfolio?category=${encodeURIComponent(item.slug)}#projects`} aria-current={activeCategory?.slug === item.slug ? "true" : undefined}>{item.name} <span>{String(item.count).padStart(2, "0")}</span></Link>)}
          </nav>
          <div className="portfolio-results-heading">
            <h2 id="portfolio-results-title">{activeCategory ? `${activeCategory.name} ${shownAreConcepts ? "concepts" : "projects"}` : "Project studies"}</h2>
            <p>{projects.length} {projects.length === 1 ? "project" : "projects"}{activeCategory ? ` in ${activeCategory.name.toLowerCase()}` : ""}</p>
          </div>
          {projects.length ? <div className="projects-grid portfolio-grid">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} presentation="interface" />)}</div> : <div className="portfolio-empty"><p>{total ? "No projects match this category." : "Project studies are currently unavailable. Please check back shortly."}</p><Link href="/portfolio#projects" className="text-link">View all projects</Link></div>}
          <p className="project-note">Interface images are captures of the existing {allConcepts ? "concept " : ""}builds. Photography is illustrative. Each project study explains the scope and limitations.</p>
        </Container>
      </section>
      <PageCta title="A similar challenge in your business?" description="A useful project starts with your requirements. Tell us about the experience, system or workflow you want to improve." />
    </PublicPage>
  );
}
