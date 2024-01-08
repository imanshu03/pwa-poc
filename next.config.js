/** @type {import('next').NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const nextConfig = {
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "./src/sw.js"),
            to: path.resolve(__dirname, "./public/sw.js"),
          },
        ],
      })
    );
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        port: "",
        pathname: "/product-images/**",
      },
    ],
  },
};

module.exports = nextConfig;
