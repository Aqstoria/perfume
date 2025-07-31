import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Check if it's a POST request
    const { action } = await request.json();

    if (action === "migrate") {
      console.log("Starting Prisma migration...");
      
      // Run prisma migrate deploy
      const { stdout, stderr } = await execAsync("npx prisma migrate deploy");
      
      if (stderr) {
        console.error("Migration stderr:", stderr);
      }
      
      console.log("Migration stdout:", stdout);
      
      return NextResponse.json({
        success: true,
        message: "Migration completed successfully",
        output: stdout,
      });
    } else if (action === "push") {
      console.log("Starting Prisma db push...");
      
      // Run prisma db push
      const { stdout, stderr } = await execAsync("npx prisma db push");
      
      if (stderr) {
        console.error("Push stderr:", stderr);
      }
      
      console.log("Push stdout:", stdout);
      
      return NextResponse.json({
        success: true,
        message: "Database push completed successfully",
        output: stdout,
      });
    } else if (action === "seed") {
      console.log("Starting database seeding...");
      
      // Run prisma db seed
      const { stdout, stderr } = await execAsync("npx prisma db seed");
      
      if (stderr) {
        console.error("Seed stderr:", stderr);
      }
      
      console.log("Seed stdout:", stdout);
      
      return NextResponse.json({
        success: true,
        message: "Database seeding completed successfully",
        output: stdout,
      });
    } else {
      return NextResponse.json({
        error: "Invalid action. Use 'migrate', 'push', or 'seed'",
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({
      error: "Migration failed",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Migration API endpoint",
    availableActions: ["migrate", "push", "seed"],
    usage: "POST with { action: 'migrate' | 'push' | 'seed' }",
  });
} 