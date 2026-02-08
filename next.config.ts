import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '1010web.studio',
          },
        ],
        destination: 'https://www.1010web.studio/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
