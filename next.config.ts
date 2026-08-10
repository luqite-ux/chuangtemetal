import type { NextConfig } from "next";

const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  async rewrites() {
    if (!adminUrl) return [];
    return {
      afterFiles: [
        { source: "/admin", destination: `${adminUrl}/admin` },
        { source: "/admin/:path*", destination: `${adminUrl}/admin/:path*` },
        { source: "/api/admin/:path*", destination: `${adminUrl}/api/admin/:path*` },
      ],
    };
  },
};

export default nextConfig;
