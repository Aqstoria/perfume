import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("🔍 Testing database connection...");
    console.log("📊 Environment variables:");
    console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
    console.log("- DIRECT_URL:", process.env.DIRECT_URL ? "Set" : "Not set");

    // Try to connect
    await prisma.$connect();
    console.log("✅ Connection successful");

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Query successful:", result);

    return NextResponse.json({
      success: true,
      message: "Database connection and query successful",
      result,
    });
  } catch (error) {
    console.error("❌ Connection failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        env: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasDirectUrl: !!process.env.DIRECT_URL,
        },
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
