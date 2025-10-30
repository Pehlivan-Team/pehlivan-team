/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "bys.trakya.edu.tr",
      "media.licdn.com",
      "gedik-jewellery.vercel.app",
      "cdnuploads.aa.com.tr",
      "www.utso.org.tr",
      "uzunkopru.bel.tr",
      "pbs.twimg.com",
      "pehlivan-team.vercel.app",
      "i.postimg.cc",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "haritane.com",
      "encrypted-tbn0.gstatic.com",
      "files.edgestore.dev",
      "i.ibb.co",
      "avatars.githubusercontent.com",
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
