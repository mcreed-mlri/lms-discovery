/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Skip Vercel image optimization for now; the app serves few images and
    // this avoids burning the plan's optimization quota.
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
