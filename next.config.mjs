import { fileURLToPath } from "url";
import path from "path";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    // Add module rule for HDR files
    config.module.rules.push({
      test: /\.hdr$/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[path][name].[hash][ext]",
      },
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/hdri/:path*",
        destination: "https://raw.githack.com/pmndrs/drei-assets/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/hdri/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  images: {
    domains: ["raw.githack.com", "pmndrs.github.io"],
  },
};

export default nextConfig;
