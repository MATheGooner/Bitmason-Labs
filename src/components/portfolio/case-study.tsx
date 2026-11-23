import { ProjectCover } from "./project-cover";
import { GalleryImage } from "./gallery-image";
import Link from "next/link";
import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { PageCta } from "@/components/public/page-cta";
import { PageHero } from "@/components/public/page-hero";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import type { PortfolioProject } from "@/lib/portfolio";
import { projectHref } from "@/lib/portfolio";
import { presentProject } from "@/lib/project-presentation";

export function CaseStudy({ project: record, nextProject }: { project: PortfolioProject; nextProject: PortfolioProject | null }) {
  const project = presentProject(record);
  return <>
    <PageHero eyebrow={`${project.category.name} / Case study`} title={project.name} description={project.summary} breadcrumb={{ href: "/portfolio", label: "Portfolio" }}
      aside={<dl className="case-facts"><div><dt>Focus</dt><dd>{project.scope.join(" · ")}</dd></div><div><dt>Discipline</dt><dd>Design & software engineering</dd></div><div><dt>Project type</dt><dd>{project.status === "concept" ? "Independent study" : "Completed project"}</dd></div></dl>}>
      <a href="#overview" className="text-link">Read the case study <ArrowIcon /></a>
      <a href="#gallery" className="text-link">Explore the details <ArrowIcon /></a>
    </PageHero>
    <Container><figure className="case-cover"><ProjectCover project={project} /><figcaption>{project.name} · Website interface</figcaption></figure></Container>
    <section id="overview" tabIndex={-1} className="case-overview section-space" aria-labelledby="overview-title"><Container><div className="editorial-split">
      <div><SectionLabel>Project overview</SectionLabel><SectionHeading id="overview-title">The purpose behind the experience.</SectionHeading></div>
      <div className="editorial-body">{project.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </div></Container></section>
    <section className="case-brief section-space" aria-label="Project brief and solution"><Container><div className="case-brief-grid">
      <article><SectionLabel>The business challenge</SectionLabel><h2>What the experience needs to solve.</h2><p>{project.businessProblem}</p></article>
      <article><SectionLabel>The solution</SectionLabel><h2>A considered response.</h2><p>{project.solution}</p></article>
    </div></Container></section>
    <section className="case-scope section-space" aria-labelledby="features-title"><Container><div className="case-scope-grid">
      <div><SectionLabel>Features & use cases</SectionLabel><SectionHeading id="features-title">The experience, in detail.</SectionHeading><ul className="case-features" role="list">{project.features.map((feature) => <li key={feature}><span aria-hidden="true">+</span><span>{feature}</span></li>)}</ul></div>
      <div className="case-technical-details">
        <h3>Engineering</h3><ul className="technology-list">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
        <h3>Business applications</h3><ul className="case-use-cases">{project.useCases.map((useCase) => <li key={useCase}>{useCase}</li>)}</ul>
        {project.liveUrl && <><h3>Explore further</h3><a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link">Visit the project <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></>}
      </div>
    </div></Container></section>
    <section id="gallery" tabIndex={-1} className="case-gallery-section section-space" aria-labelledby="gallery-title"><Container>
      <div className="section-introduction"><div><SectionLabel>Interface & visual direction</SectionLabel><SectionHeading id="gallery-title">A closer look at the details.</SectionHeading></div><p>Explore the interface, imagery and visual decisions that bring the experience together.</p></div>
      <div className="case-gallery">{project.gallery.map((item) => <GalleryImage key={item.id} item={item} />)}</div>
    </Container></section>
    {nextProject && <section className="next-project" aria-labelledby="next-project-title"><Container><p className="technical-label">Continue exploring</p><Link href={projectHref(nextProject)}><h2 id="next-project-title">{nextProject.name}</h2><ArrowIcon /></Link><p>{nextProject.scope.join(" · ")}</p></Container></section>}
    <PageCta />
  </>;
}
