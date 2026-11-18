import type { NextConfig } from "next";
import { siteIndexingEnabled } from "./src/server/launch-policy";

const development = process.env.NODE_ENV === "development";
const hostedProduction = process.env.NODE_ENV === "production" && process.env.VERCEL === "1";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${development ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://assets.bitmasonlabs.com",
  "font-src 'self'",
  `connect-src 'self'${development ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(hostedProduction ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          ...(hostedProduction ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }] : []),
          ...(!siteIndexingEnabled(process.env) ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
        ],
      },
      ...["/admin/:path*", "/api/:path*"].map((source) => ({
        source,
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      })),
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "assets.bitmasonlabs.com", port: "", pathname: "/portfolio/images/**", search: "" }],
    maximumRedirects: 0,
  },
};

export default nextConfig;
