#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Setting up database for Project X...\n");

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local");
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log("📝 Creating .env.local file...");

  const envContent = `# Database Configuration
# Replace with your actual database connection string
DATABASE_URL="postgresql://username:password@host:5432/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Sentry (optional)
SENTRY_DSN="your-sentry-dsn"
`;

  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env.local file created");
  console.log("⚠️  Please update the DATABASE_URL with your actual connection string");
} else {
  console.log("ℹ️  .env.local file already exists");
}

// Check if dependencies are installed
console.log("\n📦 Checking dependencies...");
try {
  execSync("pnpm --version", { stdio: "ignore" });
  console.log("✅ pnpm is installed");
} catch (error) {
  console.log("❌ pnpm is not installed. Please install it first:");
  console.log("npm install -g pnpm");
  process.exit(1);
}

// Install dependencies
console.log("\n📦 Installing dependencies...");
try {
  execSync("pnpm install", { stdio: "inherit" });
  console.log("✅ Dependencies installed");
} catch (error) {
  console.error("❌ Failed to install dependencies:", error.message);
  process.exit(1);
}

// Generate Prisma client
console.log("\n🔧 Generating Prisma client...");
try {
  execSync("pnpm prisma generate", { stdio: "inherit" });
  console.log("✅ Prisma client generated");
} catch (error) {
  console.error("❌ Failed to generate Prisma client:", error.message);
  console.log("⚠️  Make sure your DATABASE_URL is correct in .env.local");
  process.exit(1);
}

console.log("\n🎉 Database setup complete!");
console.log("\n📋 Next steps:");
console.log("1. Update DATABASE_URL in .env.local with your actual connection string");
console.log("2. Run: pnpm prisma migrate deploy");
console.log("3. Run: pnpm prisma db seed");
console.log("4. Run: pnpm dev");
console.log(
  "\n📖 See SUPABASE_SETUP_GUIDE.md or POSTGRESQL_SETUP_GUIDE.md for detailed instructions",
);
