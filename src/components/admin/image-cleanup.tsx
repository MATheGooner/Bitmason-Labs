"use client";
import { useState } from "react";
import type { ImageCleanupResult } from "@/lib/media";
import { Button } from "@/components/ui/button";

export function ImageCleanup({ eligible, pending }: { eligible: number; pending: number }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  async function cleanup() {
    setBusy(true); setFailed(false);
    try {
      const response = await fetch("/api/admin/images/cleanup", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Image cleanup could not complete.");
      const status = result as ImageCleanupResult;
      setFailed(status.errors > 0);
      setMessage(`${status.removed} unused image${status.removed === 1 ? "" : "s"} removed. ${status.pending} awaiting cleanup.${status.errors ? " Some objects could not be removed; check storage configuration and retry." : ""}`);
    } catch (error) { setFailed(true); setMessage(error instanceof Error ? error.message : "Image cleanup could not complete."); }
    finally { setBusy(false); }
  }
  return <aside className="admin-image-cleanup" aria-label="Unused image cleanup"><p className="admin-hint">{pending || eligible ? "Unused images are awaiting cleanup. Saved project images are protected." : "Unused uploads expire after 24 hours. Interrupted uploads become eligible for cleanup after 15 minutes."}</p>
    <Button type="button" variant="secondary" disabled={busy} onClick={() => void cleanup()}>{busy ? "Cleaning up…" : "Clean up unused images"}</Button>
    {message && <p className={failed ? "admin-field-error" : "admin-hint"} role={failed ? "alert" : "status"}>{message}</p>}
  </aside>;
}
