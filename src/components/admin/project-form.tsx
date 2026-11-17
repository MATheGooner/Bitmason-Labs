"use client";
import Link from "next/link";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { saveProject } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { projectValues } from "@/lib/admin-project";
import type { ProjectFormState, ProjectTextField } from "@/lib/admin-project";
import type { StoredProject } from "@/server/portfolio/queries";
import { CoverFields, GalleryFields } from "./image-fields";

export function ProjectForm({ record, uploadScope }: { record?: StoredProject; uploadScope: string }) {
  const initial: ProjectFormState = { status: "idle", errors: {}, message: "", values: projectValues(record?.project), responseId: "initial" };
  const [state, action, pending] = useActionState(saveProject, initial);
  const form = useRef<HTMLFormElement>(null);
  const errorsPanel = useRef<HTMLDivElement>(null);
  const pendingImages = useRef(new Set<string>());
  const uploadAttempted = useRef(false);
  const [uploading, setUploading] = useState(0);
  const onUploaded = useCallback((id: string) => { pendingImages.current.add(id); }, []);
  const onBusy = useCallback((delta: number) => { if (delta > 0) uploadAttempted.current = true; setUploading((count) => Math.max(0, count + delta)); }, []);
  const projectId = record?.id;
  useEffect(() => {
    const discard = () => {
      if (!uploadAttempted.current && !pendingImages.current.size) return;
      void fetch("/api/admin/images/discard", { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
        body: JSON.stringify({ scopeId: uploadScope, ...(projectId ? { projectId } : {}) }) }).catch(() => {});
    };
    window.addEventListener("pagehide", discard);
    return () => { window.removeEventListener("pagehide", discard); discard(); };
  }, [uploadScope, projectId]);
  const editing = { scopeId: uploadScope, ...(projectId ? { projectId } : {}), onUploaded, onBusy };
  useEffect(() => {
    if (state.status === "invalid") form.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
    else if (state.status === "error") errorsPanel.current?.focus();
  }, [state]);

  function field(name: ProjectTextField, label: string, options: { multiline?: boolean; wide?: boolean; hint?: string; number?: boolean; required?: boolean; max?: number } = {}) {
    const error = state.errors[name];
    const props = { id: name, name, defaultValue: state.values[name], "aria-invalid": Boolean(error) || undefined, "aria-describedby": [options.hint ? `${name}-hint` : "", error ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined, required: options.required ?? false, maxLength: options.max ?? 10000 };
    return <div className={`admin-field ${options.wide ? "admin-field-wide" : ""}`}><label htmlFor={name}>{label}{options.required ? " *" : ""}</label>{options.hint && <p className="admin-hint" id={`${name}-hint`}>{options.hint}</p>}{options.multiline ? <textarea {...props} rows={name === "overview" ? 6 : 4} /> : <input {...props} type={options.number ? "number" : "text"} min={options.number ? name.includes("Width") || name.includes("Height") ? 1 : 0 : undefined} />}{error && <p className="admin-field-error" id={`${name}-error`}>{error}</p>}</div>;
  }
  function select(name: "status" | "publicationStatus" | "previewTheme", label: string, choices: readonly (readonly [string, string])[]) {
    const error = state.errors[name];
    return <div className="admin-field"><label htmlFor={name}>{label}</label><select id={name} name={name} defaultValue={state.values[name]} aria-invalid={Boolean(error) || undefined} aria-describedby={error ? `${name}-error` : undefined}>{choices.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select>{error && <p className="admin-field-error" id={`${name}-error`}>{error}</p>}</div>;
  }
  return <form key={state.responseId} ref={form} action={action} className="admin-form" aria-busy={pending || uploading > 0} onSubmit={(event) => { if (uploading) event.preventDefault(); }}>
    <input type="hidden" name="id" value={record?.id ?? ""} /><input type="hidden" name="updatedAt" value={record?.updatedAt ?? ""} />
    <input type="hidden" name="uploadScope" value={uploadScope} />
    {state.message && <div ref={errorsPanel} tabIndex={-1} className="admin-error" role="alert"><p>{state.message}</p>{Object.keys(state.errors).length > 0 && <ul>{Object.entries(state.errors).map(([key, message]) => <li key={key}><a href={`#${key}`}>{key}: {message}</a></li>)}</ul>}{state.status === "error" && <p><Link href="/admin/login" className="text-link">Sign in</Link> · <a href="" className="text-link">Reload the latest version</a></p>}</div>}
    <fieldset disabled={pending || uploading > 0}><legend className="sr-only">Project content and settings</legend>
      <fieldset className="admin-form-section"><legend>Project details</legend><p className="admin-hint">Fields marked * are required for drafts. Publishing also requires the complete study below. Slug changes change the public URL.</p><div className="admin-form-grid">
        {field("name", "Project title", { required: true, max: 150 })}{field("slug", "Public slug", { required: true, max: 100, hint: "Lowercase words separated by hyphens. Preserve existing slugs where possible." })}
        {field("categorySlug", "Category slug", { required: true, max: 100 })}{field("categoryName", "Category name", { required: true, max: 100, hint: "Reuse an existing slug and its exact name, or enter a new category. Existing category names are preserved." })}
        {field("summary", "Summary", { multiline: true, wide: true, max: 1000 })}
      </div></fieldset>
      <fieldset className="admin-form-section"><legend>Status and visibility</legend><p className="admin-hint">Publication never changes delivery status. Preserve fictional-business disclosures for concepts. Mark work completed only with verified delivery evidence.</p><div className="admin-form-grid">
        {select("status", "Delivery status", [["concept", "Concept"], ["completed", "Completed"]])}{select("publicationStatus", "Publication status", [["draft", "Draft — hidden from visitors"], ["published", "Published — visible to visitors"]])}
        {field("order", "Display order", { number: true })}<label className="admin-check"><input type="checkbox" name="featured" defaultChecked={state.values.featured} />Featured on the homepage</label>
      </div></fieldset>
      <fieldset className="admin-form-section"><legend>Project study</legend><div className="admin-form-grid">
        {field("overview", "Overview / description", { multiline: true, wide: true, hint: "Separate paragraphs with a blank line." })}
        {field("businessProblem", "Business problem", { multiline: true })}{field("solution", "Solution", { multiline: true })}
        {field("features", "Features", { multiline: true, hint: "One entry per line." })}{field("technologies", "Technologies", { multiline: true, hint: "One entry per line. Include only tools actually used." })}
        {field("useCases", "Business use cases", { multiline: true, hint: "One entry per line." })}{field("scope", "Scope", { multiline: true, hint: "One entry per line." })}
        {field("deliveryNote", "Context and delivery disclosure", { multiline: true, wide: true, max: 5000, hint: "Required for publication. Explain concept limitations or verified delivery facts without invented results." })}
        {field("liveUrl", "Verified project URL", { wide: true, max: 2048, hint: "Optional HTTPS link. Leave blank until a verified deployment is ready." })}
      </div></fieldset>
      <fieldset className="admin-form-section"><legend>Cover image</legend><p className="admin-hint">Upload a cover or retain an existing image reference. Replacements take effect when the project is saved.</p><CoverFields initial={state.values} errors={state.errors} editing={editing} /></fieldset>
      <fieldset id="gallery" className="admin-form-section"><legend>Gallery images</legend><p className="admin-hint">Upload up to 20 images. Add alternative text and captions; move items to set their order. Replaced and removed uploads are deleted after a successful save. Existing local files are retained.</p><GalleryFields initial={state.values.gallery} errors={state.errors} editing={editing} /></fieldset>
      <details className="admin-form-section" open={Object.keys(state.errors).some((key) => key.startsWith("preview"))}><summary>Authored homepage preview (optional)</summary><p className="admin-hint">The five existing preview styles are preserved. New projects can use their cover image by leaving the style unset.</p><div className="admin-form-grid">
        {select("previewTheme", "Preview style", [["", "Use cover image"], ["le-saphir", "Le Saphir"], ["ecoshine", "EcoShine"], ["northfield", "Northfield"], ["aurelia", "Aurelia"], ["linden", "Linden"]])}
        {field("previewHeadline", "Preview headline", { max: 200 })}{field("previewLabel", "Preview label", { max: 200 })}{field("previewSector", "Preview sector", { max: 100 })}
      </div></details>
      <div className="admin-save-row"><Button type="submit">{pending ? "Saving…" : uploading ? "Uploading image…" : "Save project"}</Button><Link href="/admin/projects" className="text-link">Return to projects</Link><p className="admin-hint">Changes take effect only after saving.</p></div>
    </fieldset>
  </form>;
}
