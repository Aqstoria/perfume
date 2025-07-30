import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma, checkDatabaseConnection } from "@/lib/prisma";

export async function POST() {
  try {
    console.log("🔍 Starting database connection test...");
    console.log("📊 DATABASE_URL available:", !!process.env.DATABASE_URL);
    console.log("📊 DIRECT_URL available:", !!process.env.DIRECT_URL);

    // Test database connection first
    const dbConnected = await checkDatabaseConnection();
    if (!dbConnected) {
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: "Cannot connect to Supabase database",
          suggestion: "Check DATABASE_URL and network connectivity",
        },
        { status: 500 },
      );
    }

    // Try to check if tables exist by attempting to query them
    try {
      console.log("🔍 Checking if tables exist...");
      const existingUsers = await prisma.user.findMany();
      console.log("✅ Tables exist, found", existingUsers.length, "users");

      if (existingUsers.length > 0) {
        return NextResponse.json({
          message: "Users already exist, skipping user creation",
          users: existingUsers.map((u) => ({ id: u.id, username: u.username, role: u.role })),
        });
      }
    } catch (tableError) {
      console.log("❌ Tables don't exist or query failed:", tableError);
      return NextResponse.json(
        {
          error: "Database tables don't exist or are not accessible",
          details: tableError instanceof Error ? tableError.message : "Unknown error",
          suggestion: "Please check if the database schema has been created",
        },
        { status: 500 },
      );
    }

    console.log("🌱 Starting database seeding...");

    // Hash password for admin
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create users
    const admin = await prisma.user.create({
      data: {
        username: "mkalleche@gmail.com",
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    const buyer = await prisma.user.create({
      data: {
        username: "buyer",
        role: UserRole.BUYER,
      },
    });

    // Create a default customer
    const customer = await prisma.customer.create({
      data: {
        name: "Parfum Groothandel BV",
        email: "klant@parfumrijk.com",
        phone: "+31201234567",
        address: "Parfumstraat 1, 1000 AB Amsterdam",
        generalMargin: 15.0,
        minimumOrderValue: 100.0,
        minimumOrderItems: 5,
      },
    });

    console.log("✅ Database seeding completed successfully");

    return NextResponse.json({
      message: "Database seeded successfully",
      users: {
        admin: { id: admin.id, username: admin.username, role: admin.role },
        buyer: { id: buyer.id, username: buyer.username, role: buyer.role },
      },
      customer: { id: customer.id, name: customer.name },
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    return NextResponse.json(
      {
        error: "Failed to seed database",
        details: error instanceof Error ? error.message : "Unknown error",
        suggestion: "Check database connection and permissions",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
