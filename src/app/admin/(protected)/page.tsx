import { redirect } from "next/navigation";
import { requireAdminPage } from "@/server/auth/authorization";
export default async function AdminPage() { await requireAdminPage(); redirect("/admin/projects"); }
