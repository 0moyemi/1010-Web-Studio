import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.1010web.studio',
          },
        ],
        destination: 'https://1010web.studio/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
