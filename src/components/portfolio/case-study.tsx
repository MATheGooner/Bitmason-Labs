import { PortfolioImage } from "./portfolio-image";
import { GalleryImage } from "./gallery-image";
import Link from "next/link";

import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { PageCta } from "@/components/public/page-cta";
import { PageHero } from "@/components/public/page-hero";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import type { PortfolioProject } from "@/lib/portfolio";
import { projectHref, projectStatusLabel } from "@/lib/portfolio";

export function CaseStudy({ project, nextProject }: { project: PortfolioProject; nextProject: PortfolioProject | null }) {
  return (
    <>
      <PageHero
        eyebrow={`${project.category.name} / ${projectStatusLabel(project.status)}`}
        title={project.name}
        description={project.summary}
        breadcrumb={{ href: "/portfolio", label: "Portfolio" }}
        aside={<dl className="case-facts"><div><dt>Project status</dt><dd>{projectStatusLabel(project.status)}</dd></div><div><dt>Scope</dt><dd>{project.scope.join(" · ")}</dd></div><div><dt>Context</dt><dd>{project.status === "concept" ? "Self-initiated portfolio study" : "Completed project"}</dd></div></dl>}
      >
        <a href="#overview" className="text-link">Read the project study <ArrowIcon /></a>
        <a href="#gallery" className="text-link">View the interface <ArrowIcon /></a>
      </PageHero>
      <Container>
        <figure className="case-cover">
          <PortfolioImage src={project.cover.src} alt={project.cover.alt} width={project.cover.width} height={project.cover.height} sizes="(min-width: 1280px) 1184px, 100vw" className="case-cover-image" />
          <figcaption>Illustrative project imagery · {projectStatusLabel(project.status)}</figcaption>
        </figure>
      </Container>
      <section id="overview" tabIndex={-1} className="case-overview section-space" aria-labelledby="overview-title">
        <Container>
          <div className="editorial-split">
            <div><SectionLabel number="01">Project overview</SectionLabel><SectionHeading id="overview-title">The context behind the interface.</SectionHeading></div>
            <div className="editorial-body">
              {project.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="case-status-note"><h3>{projectStatusLabel(project.status)}</h3><p>{project.deliveryNote}</p></div>
            </div>
          </div>
        </Container>
      </section>
      <section className="case-brief section-space" aria-label="Project brief and solution">
        <Container>
          <div className="case-brief-grid">
            <article><SectionLabel number="02">Business problem{project.status === "concept" ? " / Concept brief" : ""}</SectionLabel><h2>What the experience needs to solve.</h2><p>{project.businessProblem}</p></article>
            <article><SectionLabel number="03">The solution</SectionLabel><h2>A considered response.</h2><p>{project.solution}</p></article>
          </div>
        </Container>
      </section>
      <section className="case-scope section-space" aria-labelledby="features-title">
        <Container>
          <div className="case-scope-grid">
            <div>
              <SectionLabel number="04">Features & use cases</SectionLabel>
              <SectionHeading id="features-title">What the {project.status === "concept" ? "concept" : "project"} includes.</SectionHeading>
              <ol className="case-features">{project.features.map((feature, index) => <li key={feature}><span className="technical-label">0{index + 1}</span><span>{feature}</span></li>)}</ol>
            </div>
            <div className="case-technical-details">
              <h3>Technologies</h3>
              <p>Tools used in the existing portfolio implementation.</p>
              <ul className="technology-list">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
              <h3>Business use cases</h3>
              <ul className="case-use-cases">{project.useCases.map((useCase) => <li key={useCase}>{useCase}</li>)}</ul>
              <h3>Project links</h3>
              {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link">{project.status === "concept" ? "View the concept demo" : "Visit the project"} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a> : <p>No verified public demo link is listed for this {project.status === "concept" ? "concept" : "project"}.</p>}
            </div>
          </div>
        </Container>
      </section>
      <section id="gallery" tabIndex={-1} className="case-gallery-section section-space" aria-labelledby="gallery-title">
        <Container>
          <div className="section-introduction"><div><SectionLabel number="05">Interface & imagery</SectionLabel><SectionHeading id="gallery-title">A closer look at the details.</SectionHeading></div><p>Captures from the existing {project.status === "concept" ? "concept build" : "project"}, alongside its illustrative photography. Open an image to inspect it at full size.</p></div>
          <div className="case-gallery">
            {project.gallery.map((item, index) => <GalleryImage key={item.id} item={item} index={index} />)}
          </div>
        </Container>
      </section>
      {nextProject && <section className="next-project" aria-labelledby="next-project-title"><Container><p className="technical-label">Continue exploring / {projectStatusLabel(nextProject.status)}</p><Link href={projectHref(nextProject)}><h2 id="next-project-title">{nextProject.name}</h2><ArrowIcon /></Link><p>{nextProject.scope.join(" · ")}</p></Container></section>}
      <PageCta />
    </>
  );
}
