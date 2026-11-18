import "server-only";
import { createHash } from "node:crypto";
import NextAuth from "next-auth";
import { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { optionalServerEnv } from "@/server/env";
import { passwordHashPattern, verifyPassword } from "./password";
import { allowAdminLoginAttempt } from "./rate-limit";

export function authConfigured(): boolean {
  return Boolean((optionalServerEnv("AUTH_SECRET")?.length ?? 0) >= 32
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(optionalServerEnv("ADMIN_EMAIL") ?? "")
    && passwordHashPattern.test(optionalServerEnv("ADMIN_PASSWORD_HASH") ?? ""));
}

function adminKey() {
  return createHash("sha256").update(`${optionalServerEnv("ADMIN_EMAIL")}:${optionalServerEnv("ADMIN_PASSWORD_HASH")}`).digest("hex");
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  secret: optionalServerEnv("AUTH_SECRET") ?? "",
  pages: { signIn: "/admin/login", error: "/admin/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  providers: [Credentials({
    credentials: { email: { type: "email" }, password: { type: "password" } },
    async authorize(credentials, request) {
      if (!authConfigured() || typeof credentials.email !== "string" || typeof credentials.password !== "string"
        || credentials.email.length > 254 || credentials.password.length > 256) return null;
      // Provider-level protection covers both HTTP callbacks and Server Actions.
      if (!(await allowAdminLoginAttempt(request))) return null;
      // Always do the password work for a valid request, even with a wrong email.
      const valid = await verifyPassword(credentials.password, optionalServerEnv("ADMIN_PASSWORD_HASH")!);
      const email = optionalServerEnv("ADMIN_EMAIL")!.toLowerCase();
      return valid && credentials.email.trim().toLowerCase() === email ? { id: "bitmason-admin", email, name: "Administrator" } : null;
    },
  })],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.adminKey = adminKey();
      if (!authConfigured() || token.adminKey !== adminKey() || token.sub !== "bitmason-admin") return null;
      return token;
    },
    session({ session }) {
      // Expose only the standard session identity, never secrets or the hash.
      return session;
    },
    redirect({ url, baseUrl }) {
      const target = new URL(url, baseUrl);
      return target.origin === baseUrl && /^\/admin(?:\/|$)/.test(target.pathname) ? target.href : `${baseUrl}/admin/projects`;
    },
  },
  logger: { error: (error) => console.error(`Administrative authentication failed: ${error instanceof AuthError ? error.type : "Unknown"}.`) },
}));
