"use server";

import { randomUUID } from "node:crypto";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authConfigured, signIn, signOut } from "@/server/auth/config";
import { requireAdmin, UnauthorizedError } from "@/server/auth/authorization";
import { adminPageHref } from "@/server/auth/origin";
import { deleteAdminProject, saveAdminProject } from "@/server/portfolio/admin";
import { ProjectConflictError } from "@/server/portfolio/writer";
import { formErrors, parseProjectValues, readProjectForm } from "@/lib/admin-project";
import type { ProjectFormState } from "@/lib/admin-project";
import { MediaError } from "@/server/storage/errors";

export async function loginAdmin(_previous: { message: string; email: string }, form: FormData) {
  const email = typeof form.get("email") === "string" ? String(form.get("email")).trim().slice(0, 254) : "";
  if (!authConfigured()) return { message: "Administrative access is not configured. Contact the site owner.", email };
  try {
    await signIn("credentials", { email, password: form.get("password"), redirectTo: adminPageHref("/admin/projects", process.env) });
  } catch (error) {
    if (error instanceof AuthError) return { message: "Unable to sign in. Check your credentials, or wait 10 minutes after repeated attempts.", email };
    throw error;
  }
  return { message: "", email };
}

export async function logoutAdmin() {
  await signOut({ redirectTo: adminPageHref("/admin/login", process.env) });
}

function safeMutationError(error: unknown) {
  if (error instanceof UnauthorizedError) return "Your session has expired. Sign in again before making changes.";
  if (error instanceof ProjectConflictError) return error.message;
  if (error instanceof MediaError) return error.message;
  // Database drivers wrap PostgreSQL errors. Only inspect codes, never serialize errors.
  let cause: unknown = error;
  for (let i = 0; i < 4 && cause && typeof cause === "object"; i++) {
    if ("code" in cause && cause.code === "23505") return "This slug is already in use. Choose a unique project slug.";
    cause = "cause" in cause ? cause.cause : undefined;
  }
  console.error("Administrative portfolio operation failed.");
  return "Unable to save this change. Your details are retained; check the database connection and try again.";
}

function refreshPortfolio(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/sitemap.xml");
  revalidatePath(`/portfolio/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/portfolio/${previousSlug}`);
  revalidatePath("/admin/projects", "layout");
}

export async function saveProject(previous: ProjectFormState, form: FormData): Promise<ProjectFormState> {
  let values = previous.values;
  let saved;
  const responseId = randomUUID();
  try {
    values = readProjectForm(form);
    await requireAdmin();
    const parsed = parseProjectValues(values);
    if (!parsed.success) return { status: "invalid", message: "Please check the highlighted fields. Publishing requires complete project content.", errors: formErrors(parsed.error.issues), values, responseId };
    const id = String(form.get("id") ?? "");
    const existing = id ? { id, updatedAt: String(form.get("updatedAt") ?? "") } : undefined;
    const { preview, ...project } = parsed.data;
    const uploadScope = String(form.get("uploadScope") ?? "") || undefined;
    saved = await saveAdminProject({ ...project, ...(preview ? { preview } : {}) }, existing, uploadScope);
  } catch (error) {
    return { status: "error", message: safeMutationError(error), errors: {}, values, responseId };
  }
  refreshPortfolio(saved.slug, saved.previousSlug);
  redirect(`/admin/projects/${saved.id}/edit?saved=1${saved.cleanupPending ? "&cleanup=1" : ""}`);
}

export async function deleteProject(_previous: { message: string }, form: FormData) {
  let deleted;
  try {
    await requireAdmin();
    deleted = await deleteAdminProject(String(form.get("id") ?? ""), String(form.get("updatedAt") ?? ""), String(form.get("confirmation") ?? ""));
  } catch (error) {
    return { message: safeMutationError(error) };
  }
  refreshPortfolio(deleted.slug);
  redirect(`/admin/projects?deleted=1${deleted.cleanupPending ? "&cleanup=1" : ""}`);
}
