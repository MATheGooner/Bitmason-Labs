import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "assets.bitmasonlabs.com", port: "", pathname: "/portfolio/images/**", search: "" }],
    maximumRedirects: 0,
  },
};

export default nextConfig;
