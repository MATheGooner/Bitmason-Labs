import "server-only";

type ServerVariable =
  | "DATABASE_URL"
  | "DATABASE_URL_UNPOOLED"
  | "AUTH_SECRET"
  | "AUTH_URL"
  | "ADMIN_EMAIL"
  | "ADMIN_PASSWORD_HASH"
  | "R2_ACCOUNT_ID"
  | "R2_ACCESS_KEY_ID"
  | "R2_SECRET_ACCESS_KEY"
  | "R2_BUCKET_NAME"
  | "R2_PUBLIC_BASE_URL";

/** Lazy reads keep unused integrations optional at startup and build time. */
export function optionalServerEnv(name: ServerVariable): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function databaseUrl(name: "DATABASE_URL" | "DATABASE_URL_UNPOOLED" = "DATABASE_URL"): string {
  const value = requireServerEnv(name);
  try {
    const url = new URL(value);
    if (!["postgres:", "postgresql:"].includes(url.protocol) || !url.username || !url.password || !url.hostname.endsWith(".neon.tech") || url.pathname.length < 2) throw new Error();
    return value;
  } catch {
    throw new Error(`Invalid Neon connection configuration: ${name}`);
  }
}

/** Call inside an implemented adapter; report the variable name, never its value. */
export function requireServerEnv(name: ServerVariable): string {
  const value = optionalServerEnv(name);

  if (!value) {
    throw new Error(`Missing server environment variable: ${name}`);
  }

  return value;
}
