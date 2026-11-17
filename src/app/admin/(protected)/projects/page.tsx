import Link from "next/link";
import { Button, buttonClassName } from "@/components/ui/button";
import { requireAdminPage } from "@/server/auth/authorization";
import { listAdminProjects } from "@/server/portfolio/admin";
import { projectStatusLabel } from "@/lib/portfolio";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ q?: string; deleted?: string; cleanup?: string }> }) {
  await requireAdminPage();
  const query = await searchParams;
  const search = typeof query.q === "string" ? query.q.slice(0, 200) : "";
  let records;
  try { records = await listAdminProjects(search); } catch { return <><h1>Projects</h1><p className="admin-error" role="alert">The portfolio database is unavailable. Check its configuration, connection and migrations, then reload.</p></>; }
  return <>
    <div className="admin-title-row"><div><p className="technical-label">Portfolio administration</p><h1>Projects</h1><p>Manage project studies and their visibility on the public website.</p></div><Link href="/admin/projects/new" className={buttonClassName()}>Create project</Link></div>
    {query.deleted === "1" && <p className="admin-message" role="status">Project deleted.</p>}
    {query.cleanup === "1" && <p className="admin-error" role="alert">The project was deleted, but unused images are awaiting cleanup. Use the cleanup control below to retry.</p>}
    <div className="admin-stats"><div><strong>{records.length}</strong><span>{search ? "Matching projects" : "Total projects"}</span></div><div><strong>{records.filter(({ project }) => project.publicationStatus === "published").length}</strong><span>Published</span></div><div><strong>{records.filter(({ project }) => project.publicationStatus === "draft").length}</strong><span>Drafts</span></div><div><strong>{records.filter(({ project }) => project.status === "concept").length}</strong><span>Concepts</span></div></div>
    <form action="/admin/projects" method="get" className="admin-search"><div className="admin-field"><label htmlFor="q">Search projects</label><input id="q" name="q" type="search" defaultValue={search} maxLength={200} placeholder="Title, slug or summary" /></div><Button type="submit" variant="secondary">Search</Button>{search && <Link href="/admin/projects" className="text-link">Clear search</Link>}</form>
    <p className="admin-hint">Publication controls visibility. A published concept remains a concept, with its fictional-business disclosure.</p>
    <div className="admin-project-list">{records.map(({ id, project }) => <article key={id} className="admin-project-row"><div><h2><Link href={`/admin/projects/${id}/edit`}>{project.name}</Link></h2><p className="admin-hint">/{project.slug} · {project.category.name}</p><p>{project.summary || "No summary yet."}</p></div><div className="admin-project-meta"><span className="admin-badge">{project.publicationStatus === "published" ? "Published" : "Draft"}</span><span>{projectStatusLabel(project.status)}</span>{project.featured && <span>Featured</span>}</div><Link href={`/admin/projects/${id}/edit`} className="text-link">Edit<span className="sr-only"> {project.name}</span></Link></article>)}</div>
    {!records.length && <p className="admin-message">{search ? "No projects match your search." : "No projects yet. Run the seed command to import the existing five concepts, or create a draft."}</p>}
  </>;
}
