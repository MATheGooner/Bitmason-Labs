import Link from "next/link";

import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { ProjectCard } from "@/components/portfolio/project-card";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { listPublishedProjects } from "@/server/portfolio/reader";

export async function SelectedWork() {
  const projects = await listPublishedProjects({ featured: true });
  const allConcepts = projects.length > 0 && projects.every((project) => project.status === "concept");
  return (
    <section id="selected-work" tabIndex={-1} className="selected-work-section section-space" aria-labelledby="work-title">
      <Container>
        <div className="section-introduction">
          <div><SectionLabel number="04">Selected projects</SectionLabel><SectionHeading id="work-title">Different businesses.<br />Clearer customer journeys.</SectionHeading></div>
          <p>{allConcepts ? "Portfolio demonstrations for fictional businesses. Each explores a different customer journey; these are concept projects, with no claimed client results." : "Explore the customer journeys and engineering scope behind selected projects. Each study makes its delivery status and contribution clear."}</p>
        </div>
        <div className="projects-grid">
          {projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}
        </div>
        {!projects.length && <p className="project-note">Project studies are currently unavailable. Please check back shortly.</p>}
        <p className="project-note">{allConcepts ? "Composed concept previews." : "Project previews."} Open each project study to explore its implementation scope and limitations.</p>
        <Link href="/portfolio" className="text-link mt-4">View the portfolio <ArrowIcon /></Link>
      </Container>
    </section>
  );
}
