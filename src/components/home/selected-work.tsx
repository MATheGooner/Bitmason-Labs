import Link from "next/link";

import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { ProjectCard } from "@/components/portfolio/project-card";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { listPublishedProjects } from "@/server/portfolio/reader";

export async function SelectedWork() {
  const projects = await listPublishedProjects({ featured: true, limit: 5 });
  return (
    <section id="selected-work" tabIndex={-1} className="selected-work-section section-space" aria-labelledby="work-title">
      <Container>
        <div className="section-introduction">
          <div><SectionLabel>Selected work</SectionLabel><SectionHeading id="work-title">Different businesses.<br />Clearer customer journeys.</SectionHeading></div>
          <p>Hospitality, home services, healthcare and property. Explore the design decisions and engineering behind experiences built around a clear business purpose.</p>
        </div>
        <div className="projects-grid">
          {projects.map((project) => <ProjectCard project={project} featured key={project.slug} />)}
        </div>
        {!projects.length && <p className="project-note">Project studies are currently unavailable. Please check back shortly.</p>}
        <Link href="/portfolio" className="text-link mt-4">View the portfolio <ArrowIcon /></Link>
      </Container>
    </section>
  );
}
