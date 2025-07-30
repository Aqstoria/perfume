import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();

    // Check if tables exist by trying to query them
    const userCount = await prisma.user.count();
    const customerCount = await prisma.customer.count();

    return NextResponse.json({
      message: "Database connection successful",
      userCount,
      customerCount,
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
