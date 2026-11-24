import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { PortfolioProject } from "@/lib/portfolio";
import { getProjectWebsiteUrl } from "@/lib/project-website";

export function ProjectWebsiteLink({ project, className }: { project: Pick<PortfolioProject, "name" | "liveUrl">; className?: string }) {
  const href = getProjectWebsiteUrl(project.liveUrl);
  if (!href) return null;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cn(buttonClassName(), "project-website-link", className)}>
    Explore Live Website <span aria-hidden="true">↗</span><span className="sr-only">: {project.name} (opens in a new tab)</span>
  </a>;
}
