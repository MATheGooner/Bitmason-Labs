import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { optionalServerEnv } from "@/server/env";
import { auth, authConfigured } from "./config";

export class UnauthorizedError extends Error {}

export const adminSession = cache(async () => {
  // Keep authentication request-time even when credentials are absent at build.
  await connection();
  if (!authConfigured()) return null;
  const session = await auth();
  return session?.user?.email?.toLowerCase() === optionalServerEnv("ADMIN_EMAIL")?.toLowerCase() ? session : null;
});

export async function requireAdmin() {
  const session = await adminSession();
  if (!session) throw new UnauthorizedError("Sign in to manage projects.");
  return session;
}

export async function requireAdminPage() {
  const session = await adminSession();
  if (!session) redirect("/admin/login");
  return session;
}
