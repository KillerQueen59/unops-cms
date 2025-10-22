import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Exclude googleapis and related Node.js modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
      };

      // Explicitly mark googleapis as external for client
      config.externals = config.externals || [];
      config.externals.push('googleapis');
    }
    return config;
  },
};

export default nextConfig;
