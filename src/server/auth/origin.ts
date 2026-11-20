import { site } from "../../lib/site";

interface AuthEnvironment {
  NODE_ENV?: string;
  VERCEL?: string;
  VERCEL_ENV?: string;
  AUTH_URL?: string;
  NEXTAUTH_URL?: string;
}

export function isProductionDeployment(environment: AuthEnvironment): boolean {
  return environment.VERCEL_ENV === "production"
    || (environment.VERCEL === "1" && environment.NODE_ENV === "production" && !environment.VERCEL_ENV);
}

/** Auth.js reads process.env when constructing requests, actions and cookies. */
export function configureAuthOrigin(environment: AuthEnvironment): void {
  if (!isProductionDeployment(environment)) return;
  environment.AUTH_URL = site.url;
  if (environment.NEXTAUTH_URL !== undefined) environment.NEXTAUTH_URL = site.url;
}

export function adminPageHref(path: "/admin/login" | "/admin/projects", environment: AuthEnvironment): string {
  return isProductionDeployment(environment) ? `${site.url}${path}` : path;
}

/** Keep callbacks inside administration, including old localhost callback cookies. */
export function adminRedirect(url: string, baseUrl: string, environment: AuthEnvironment): string {
  const origin = isProductionDeployment(environment) ? site.url : new URL(baseUrl).origin;
  const fallback = `${origin}/admin/projects`;
  try {
    const target = new URL(url, origin);
    if (target.origin !== origin || target.username || target.password || !/^\/admin(?:\/|$)/.test(target.pathname)) return fallback;
    return target.href;
  } catch {
    return fallback;
  }
}
