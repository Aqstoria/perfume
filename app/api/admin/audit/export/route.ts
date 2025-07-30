import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const action = searchParams.get("action");
    const entity = searchParams.get("entity");

    // Build where clause
    const where: any = {};
    
    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    
    if (action) {
      where.action = action;
    }

    if (entity) {
      where.entity = entity;
    }

    // Fetch audit logs with user information
    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    // Convert to CSV format
    const csvHeaders = [
      "Timestamp",
      "User",
      "Role",
      "Action",
      "Target",
      "Details",
    ];

    const csvRows = logs.map((log) => [
      log.timestamp.toISOString(),
      log.user.username,
      log.user.role,
      log.action,
      log.entity || "",
      JSON.stringify(log.details),
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting audit logs:", error);
    return NextResponse.json(
      {
        error: "Failed to export audit logs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

