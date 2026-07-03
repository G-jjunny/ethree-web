import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/about/greeting",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
