// Debug check voor DATABASE_URL in production
if (process.env.NODE_ENV === "production") {
  console.log("✅ DATABASE_URL in production:", process.env.DATABASE_URL ?? "⛔ NIET GEDEFINIEERD");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    clientTraceMetadata: true,
  },
};

module.exports = nextConfig;
