/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove this line:
  // outputFileTracingRoot: path.join(__dirname, '../../'),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cpzkzyokznbrayxnyfin.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
