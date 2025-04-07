/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server components
  reactStrictMode: true,
  // GitHub Pages configuration
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/assignment' : '',
  // Disable image optimization since it's not supported in static exports
  images: {
    unoptimized: true,
  },
};

export default nextConfig; 