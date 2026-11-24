import { ProjectForm } from "@/components/admin/project-form";
import { requireAdminPage } from "@/server/auth/authorization";
export default async function NewProjectPage() {
  await requireAdminPage();
  return <><p className="technical-label">Portfolio administration</p><h1>Create a project.</h1><p>New projects start as drafts. Add complete, accurate project content before publishing.</p><ProjectForm uploadScope={randomUUID()} /></>;
}
import { randomUUID } from "node:crypto";
