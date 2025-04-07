/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server components
  reactStrictMode: true,
  // GitHub Pages configuration
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/trello-assignment' : '',
  // Disable image optimization since it's not supported in static exports
  images: {
    unoptimized: true,
  },
  // Add trailing slash for GitHub Pages
  trailingSlash: true,
  // Ensure proper asset prefix
  assetPrefix: process.env.NODE_ENV === 'production' ? '/trello-assignment/' : '',
  // Add proper webpack configuration
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  }
};

export default nextConfig; 