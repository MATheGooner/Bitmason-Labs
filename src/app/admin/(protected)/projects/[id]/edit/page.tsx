import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { DeleteProjectForm } from "@/components/admin/delete-project-form";
import { requireAdminPage } from "@/server/auth/authorization";
import { getAdminProject } from "@/server/portfolio/admin";

export default async function EditProjectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; cleanup?: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  let record;
  try { record = await getAdminProject(id); } catch { return <><h1>Edit project</h1><p className="admin-error" role="alert">The database is unavailable. Reload when the connection is restored.</p></>; }
  if (!record) notFound();
  const query = await searchParams;
  return <><div className="admin-title-row"><div><p className="technical-label">Portfolio administration</p><h1>{record.project.name}</h1><p>Edit content, project context and publication settings.</p></div><Link href="/admin/projects" className="text-link">All projects</Link></div>
    {query.saved === "1" && <p className="admin-message" role="status">Project saved. {record.project.publicationStatus === "published" ? "The published study is visible on the website." : "The draft is hidden from public visitors."}</p>}
    {query.cleanup === "1" && <p className="admin-error" role="alert">The project was saved, but unused images are awaiting cleanup. Use the cleanup control below to retry.</p>}
    {record.project.publicationStatus === "published" && <p><Link href={`/portfolio/${record.project.slug}`} className="text-link">View public project</Link></p>}
    <ProjectForm key={record.updatedAt} record={record} uploadScope={randomUUID()} />
    <DeleteProjectForm id={record.id} slug={record.project.slug} updatedAt={record.updatedAt} />
  </>;
}
import { randomUUID } from "node:crypto";
