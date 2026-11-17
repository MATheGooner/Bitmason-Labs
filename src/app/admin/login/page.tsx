import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/layout/brand";
import { ThemeControl } from "@/components/layout/theme-control";
import { LoginForm } from "@/components/admin/login-form";
import { adminSession } from "@/server/auth/authorization";
import { authConfigured } from "@/server/auth/config";

export default async function LoginPage() {
  if (await adminSession()) redirect("/admin/projects");
  return <main id="main-content" tabIndex={-1} className="admin-login"><div className="admin-login-top"><Brand /><ThemeControl /></div><p className="technical-label">Administration</p><h1>Manage the portfolio.</h1><p>Sign in with the administrator credentials configured for this site.</p><LoginForm configured={authConfigured()} /><Link href="/" className="text-link">Return to the website</Link></main>;
}
