import { NextResponse } from "next/server";
import { checkDatabaseConnection, prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("🔍 Health check initiated...");

    // Check environment variables
    const envStatus = {
      hasPostgresPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
      hasPostgresUrlNonPooling: !!process.env.POSTGRES_URL_NON_POOLING,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };

    console.log("📊 Environment status:", envStatus);

    // Test database connection
    const dbConnected = await checkDatabaseConnection();

    if (!dbConnected) {
      return NextResponse.json(
        {
          status: "unhealthy",
          message: "Database connection failed",
          environment: envStatus,
        },
        { status: 500 },
      );
    }

    // Test a simple query
    try {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log("✅ Health check query successful:", result);

      return NextResponse.json({
        status: "healthy",
        message: "Database connected and responsive",
        environment: envStatus,
        timestamp: new Date().toISOString(),
      });
    } catch (queryError) {
      console.error("❌ Health check query failed:", queryError);
      return NextResponse.json(
        {
          status: "unhealthy",
          message: "Database query failed",
          environment: envStatus,
          error: queryError instanceof Error ? queryError.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("❌ Health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
