"use client";
import { useActionState } from "react";
import { deleteProject } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function DeleteProjectForm({ id, slug, updatedAt }: { id: string; slug: string; updatedAt: string }) {
  const [state, action, pending] = useActionState(deleteProject, { message: "" });
  return <details className="admin-delete"><summary>Delete this project</summary><p>Deletion permanently removes the project and its gallery metadata. Unused uploaded images are also removed; existing local image files are retained. To hide a study without deleting it, save it as a draft.</p><form action={action} aria-busy={pending}><input type="hidden" name="id" value={id} /><input type="hidden" name="updatedAt" value={updatedAt} />
    {state.message && <p className="admin-error" role="alert">{state.message}</p>}
    <div className="admin-field"><label htmlFor="confirmation">Type {slug} to confirm deletion</label><input id="confirmation" name="confirmation" required pattern={slug} maxLength={100} autoComplete="off" /></div><Button type="submit" variant="secondary" className="admin-delete-button" disabled={pending}>{pending ? "Deleting…" : "Permanently delete project"}</Button></form></details>;
}
