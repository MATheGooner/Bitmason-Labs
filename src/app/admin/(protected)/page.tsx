import { redirect } from "next/navigation";
import { requireAdminPage } from "@/server/auth/authorization";
import { adminPageHref } from "@/server/auth/origin";
export default async function AdminPage() { await requireAdminPage(); redirect(adminPageHref("/admin/projects", process.env)); }
