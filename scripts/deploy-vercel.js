#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Deploying Project X to Vercel...\n");

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.log("❌ .env.local file not found!");
  console.log("📝 Please create .env.local with your database connection string");
  console.log("📖 See SUPABASE_SETUP_GUIDE.md for instructions");
  process.exit(1);
}

// Check if pnpm is installed
try {
  execSync("pnpm --version", { stdio: "ignore" });
  console.log("✅ pnpm is installed");
} catch (error) {
  console.log("❌ pnpm is not installed. Installing...");
  try {
    execSync("npm install -g pnpm", { stdio: "inherit" });
    console.log("✅ pnpm installed");
  } catch (installError) {
    console.error("❌ Failed to install pnpm:", installError.message);
    process.exit(1);
  }
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
  process.exit(1);
}

// Check if Vercel CLI is installed
try {
  execSync("vercel --version", { stdio: "ignore" });
  console.log("✅ Vercel CLI is installed");
} catch (error) {
  console.log("📦 Installing Vercel CLI...");
  try {
    execSync("npm install -g vercel", { stdio: "inherit" });
    console.log("✅ Vercel CLI installed");
  } catch (installError) {
    console.error("❌ Failed to install Vercel CLI:", installError.message);
    process.exit(1);
  }
}

console.log("\n🎉 Ready to deploy!");
console.log("\n📋 Next steps:");
console.log("1. Run: vercel login");
console.log("2. Run: vercel");
console.log("3. Follow the prompts to deploy");
console.log("\n📖 See VERCEL_DEPLOYMENT.md for detailed instructions");
