/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "bys.trakya.edu.tr",
      "media.licdn.com",
      "gedik-jewellery.vercel.app",
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
