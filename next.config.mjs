const nextConfig = {
  agentRules: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/product/:id",
        destination: "/products/:id",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
