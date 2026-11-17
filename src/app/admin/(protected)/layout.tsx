import Link from "next/link";
import type { ReactNode } from "react";
import { Brand } from "@/components/layout/brand";
import { ThemeControl } from "@/components/layout/theme-control";
import { Button } from "@/components/ui/button";
import { requireAdminPage } from "@/server/auth/authorization";
import { logoutAdmin } from "@/app/admin/actions";
import { adminImageCleanupStatus } from "@/server/storage/admin";
import { ImageCleanup } from "@/components/admin/image-cleanup";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  await requireAdminPage();
  let cleanup = { eligible: 0, pending: 0 };
  try { cleanup = await adminImageCleanupStatus(); } catch { /* The editor still reports storage/database errors at its operation boundary. */ }
  return <><header className="admin-header"><Brand /><nav aria-label="Administration"><Link href="/admin/projects">Projects</Link><Link href="/portfolio">Public portfolio</Link></nav><div className="admin-header-controls"><ThemeControl /><form action={logoutAdmin}><Button type="submit" variant="secondary">Sign out</Button></form></div></header><main id="main-content" tabIndex={-1} className="admin-main">{children}<ImageCleanup {...cleanup} /></main><footer className="admin-footer">Bitmason Labs administration</footer></>;
}
