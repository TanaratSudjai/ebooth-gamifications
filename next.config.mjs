/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-b63458979cf042379b57054965d6531d.r2.dev",
        port: "",
        pathname: "/member_ranks/**",
      },
    ],
  },
};

export default nextConfig;
