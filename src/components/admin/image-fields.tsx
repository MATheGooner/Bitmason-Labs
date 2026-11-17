"use client";
import { useEffect, useRef, useState } from "react";
import type { ProjectGalleryImage, ProjectImage } from "@/lib/portfolio";
import { assetIdFromUrl, IMAGE_ACCEPT, IMAGE_UPLOAD_HINT, MAX_IMAGE_BYTES } from "@/lib/media";
import type { UploadedImage } from "@/lib/media";
import type { ProjectValues } from "@/lib/admin-project";
import { Button } from "@/components/ui/button";
import { PortfolioImage } from "@/components/portfolio/portfolio-image";

export interface ImageEditing { scopeId: string; projectId?: string; onUploaded: (assetId: string) => void; onBusy: (delta: number) => void }
const emptyImage = (): ProjectImage => ({ src: "", alt: "", width: 1440, height: 900 });

function UploadField({ image, editing, label, onChange }: { image: ProjectImage; editing: ImageEditing; label: string; onChange: (image: ProjectImage) => void }) {
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const request = useRef<XMLHttpRequest | null>(null);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => () => request.current?.abort(), []);

  async function selectFile(file: File | undefined) {
    if (!file) return;
    setMessage(""); setError(false);
    if (!IMAGE_ACCEPT.split(",").includes(file.type) || !file.size || file.size > MAX_IMAGE_BYTES) {
      setError(true); setMessage("Choose a nonempty JPEG, PNG or WebP no larger than 8 MB."); return;
    }
    setPreview(URL.createObjectURL(file)); setProgress(0); editing.onBusy(1);
    const data = new FormData(); data.set("file", file); data.set("scopeId", editing.scopeId);
    if (editing.projectId) data.set("projectId", editing.projectId);
    try {
      const uploaded = await new Promise<UploadedImage>((resolve, reject) => {
        const xhr = new XMLHttpRequest(); request.current = xhr;
        xhr.open("POST", "/api/admin/images"); xhr.timeout = 60_000;
        xhr.upload.onprogress = (event) => { if (event.lengthComputable) setProgress(Math.min(99, Math.round(event.loaded / event.total * 100))); };
        xhr.onload = () => {
          let result;
          try { result = JSON.parse(xhr.responseText); } catch { reject(new Error("The upload response was unavailable. Retry the upload.")); return; }
          if (xhr.status === 201) resolve(result as UploadedImage);
          else reject(new Error(typeof result.error === "string" ? result.error : "The upload failed. Try again."));
        };
        xhr.onerror = xhr.ontimeout = () => reject(new Error("The upload connection was interrupted. Try again; unused uploads can be cleaned up from the dashboard."));
        xhr.onabort = () => reject(new Error("Upload cancelled.")); xhr.send(data);
      });
      editing.onUploaded(uploaded.assetId);
      onChange({ src: uploaded.src, assetId: uploaded.assetId, width: uploaded.width, height: uploaded.height, alt: image.alt });
      setPreview("");
      setMessage("Image uploaded. Save the project to apply this image.");
    } catch (failure) { setError(true); setMessage(failure instanceof Error ? failure.message : "Image upload failed."); setPreview(""); }
    finally { request.current = null; setProgress(null); editing.onBusy(-1); }
  }
  return <div className="admin-image-upload">
    {(preview || image.src) && <div className="admin-image-preview"><PortfolioImage src={preview || image.src} alt={image.alt || "Selected image preview"} width={image.width} height={image.height} unoptimized className="admin-preview-image" /></div>}
    <label className="admin-field"><span>{label}</span><input type="file" accept={IMAGE_ACCEPT} disabled={progress !== null} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void selectFile(file); }} /></label>
    <p className="admin-hint">{IMAGE_UPLOAD_HINT}</p>
    {progress !== null && <div role="status"><progress max={100} value={progress} aria-label="Image upload progress" /><p>{progress < 99 ? `Uploading image… ${progress}%` : "Processing and saving image…"}</p></div>}
    {message && <p className={error ? "admin-field-error" : "admin-hint"} role={error ? "alert" : "status"}>{message}</p>}
    <noscript><p className="admin-hint">Enable JavaScript to upload files and preview them. Existing image references can still be edited and saved.</p></noscript>
  </div>;
}

function ReferenceFields({ image, prefix, cover = false, errors, onChange }: { image: ProjectImage; prefix: string; cover?: boolean; errors: Record<string, string>; onChange: (image: ProjectImage) => void }) {
  const names = cover ? { src: "coverSrc", alt: "coverAlt", width: "coverWidth", height: "coverHeight", assetId: "coverAssetId" } : { src: `${prefix}.src`, alt: `${prefix}.alt`, width: `${prefix}.width`, height: `${prefix}.height`, assetId: `${prefix}.assetId` };
  return <><input type="hidden" name={names.assetId} value={image.assetId ?? ""} />
    {(["src", "alt", "width", "height"] as const).map((key) => {
      const name = names[key]; const number = key === "width" || key === "height";
      return <div className={`admin-field ${number ? "" : "admin-field-wide"}`} key={key}><label htmlFor={name}>{{ src: "Image reference", alt: "Alternative text", width: "Width (pixels)", height: "Height (pixels)" }[key]}</label>
        <input id={name} name={name} type={number ? "number" : "text"} value={image[key]} min={number ? 1 : undefined} maxLength={number ? undefined : 500} readOnly={number && Boolean(image.assetId)}
          aria-invalid={Boolean(errors[name]) || undefined} aria-describedby={errors[name] ? `${name}-error` : undefined} onChange={(event) => {
            if (key === "src") { const updated = { ...image, src: event.target.value }; delete updated.assetId; const assetId = assetIdFromUrl(event.target.value); if (assetId) updated.assetId = assetId; onChange(updated); }
            else onChange({ ...image, [key]: number ? Number(event.target.value) : event.target.value });
          }} />{errors[name] && <p id={`${name}-error`} className="admin-field-error">{errors[name]}</p>}
      </div>;
    })}</>;
}

export function CoverFields({ initial, editing, errors }: { initial: ProjectValues; editing: ImageEditing; errors: Record<string, string> }) {
  const [image, setImage] = useState<ProjectImage>(() => ({ ...(initial.coverAssetId ? { assetId: initial.coverAssetId } : {}), src: initial.coverSrc, alt: initial.coverAlt, width: Number(initial.coverWidth), height: Number(initial.coverHeight) }));
  return <><UploadField image={image} editing={editing} label={image.src ? "Replace cover image" : "Upload cover image"} onChange={setImage} />
    <div className="admin-form-grid"><ReferenceFields image={image} prefix="cover" cover errors={errors} onChange={setImage} /></div>
    {image.src && <Button type="button" variant="secondary" onClick={() => setImage(emptyImage())}>Remove cover when saving</Button>}
  </>;
}

function blankGallery(initial: readonly ProjectGalleryImage[]): ProjectGalleryImage {
  let suffix = initial.length + 1;
  while (initial.some((image) => image.id === `image-${suffix}`)) suffix++;
  return { ...emptyImage(), id: `image-${suffix}`, caption: "", order: Math.max(0, ...initial.map((image) => image.order + 1)), kind: "interface" };
}
export function GalleryFields({ initial, errors, editing }: { initial: readonly ProjectGalleryImage[]; errors: Record<string, string>; editing: ImageEditing }) {
  const [rows, setRows] = useState(() => [...initial, ...(initial.length < 20 ? [blankGallery(initial)] : [])].map((image, index) => ({ ...image, rowKey: String(index) })));
  const update = (index: number, image: ProjectImage) => setRows((current) => current.map((row, i) => { if (i !== index) return row; const updated = { ...row, ...image }; if (!image.assetId) delete updated.assetId; return updated; }));
  function move(index: number, delta: number) {
    const reordered = [...rows]; const target = index + delta;
    if (!reordered[index] || !reordered[target]) return;
    [reordered[index], reordered[target]] = [reordered[target]!, reordered[index]!];
    setRows(reordered.map((row, i) => ({ ...row, order: i })));
  }
  return <><input type="hidden" name="galleryCount" value={rows.length} />{errors.gallery && <p className="admin-field-error" role="alert">{errors.gallery}</p>}
    {rows.map((row, index) => <fieldset className="admin-gallery-item" key={row.rowKey}><legend>Gallery item {index + 1}</legend>
      <UploadField image={row} editing={editing} label={row.src ? `Replace gallery image ${index + 1}` : `Upload gallery image ${index + 1}`} onChange={(image) => update(index, image)} />
      <div className="admin-form-grid"><ReferenceFields image={row} prefix={`gallery.${index}`} errors={errors} onChange={(image) => update(index, image)} />
        {(["id", "caption", "order"] as const).map((key) => { const name = `gallery.${index}.${key}`; return <div key={key} className={`admin-field ${key === "caption" ? "admin-field-wide" : ""}`}><label htmlFor={name}>{{ id: "Item ID", caption: "Caption", order: "Display order" }[key]}</label>
          <input id={name} name={name} type={key === "order" ? "number" : "text"} value={row[key]} min={key === "order" ? 0 : undefined} maxLength={key === "order" ? undefined : key === "caption" ? 2000 : 100} aria-invalid={Boolean(errors[name]) || undefined} aria-describedby={errors[name] ? `${name}-error` : undefined}
            onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, [key]: key === "order" ? Number(event.target.value) : event.target.value } : item))} />{errors[name] && <p id={`${name}-error`} className="admin-field-error">{errors[name]}</p>}</div>; })}
        <div className="admin-field"><label htmlFor={`gallery.${index}.kind`}>Image kind</label><select id={`gallery.${index}.kind`} name={`gallery.${index}.kind`} value={row.kind} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, kind: event.target.value as ProjectGalleryImage["kind"] } : item))}><option value="interface">Interface capture</option><option value="photograph">Photograph</option></select></div>
      </div><div className="admin-image-actions"><Button type="button" variant="secondary" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move gallery item ${index + 1} up`}>Move up</Button><Button type="button" variant="secondary" disabled={index === rows.length - 1} onClick={() => move(index, 1)} aria-label={`Move gallery item ${index + 1} down`}>Move down</Button>
        <Button type="button" variant="secondary" aria-label={`Remove gallery item ${index + 1} when saving`} onClick={() => setRows(rows.filter((_, i) => i !== index))}>Remove item when saving</Button>
        <noscript><label className="admin-check"><input type="checkbox" name={`gallery.${index}.remove`} />Remove this item when saving</label></noscript>
      </div>
    </fieldset>)}
    <Button type="button" variant="secondary" disabled={rows.length >= 20} onClick={() => setRows([...rows, { ...blankGallery(rows), rowKey: crypto.randomUUID() }])}>Add gallery item</Button>
    <noscript><p className="admin-hint">Use the blank item to add one image reference per save. Additional rows can be added after saving.</p></noscript>
  </>;
}
