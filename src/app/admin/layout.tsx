import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/admin.css";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };
export const runtime = "nodejs";
export default function AdminLayout({ children }: { children: ReactNode }) { return <div className="admin-area">{children}</div>; }
