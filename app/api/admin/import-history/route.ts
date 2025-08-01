import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware-utils";
import { getImportHistory, getImportHistoryById } from "@/lib/import/importHistory";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const id = searchParams.get("id");

    // If ID is provided, return specific import
    if (id) {
      const importEntry = await getImportHistoryById(id);
      if (!importEntry) {
        return NextResponse.json({ error: "Import not found" }, { status: 404 });
      }
      return NextResponse.json(importEntry);
    }

    // Return paginated list
    const result = await getImportHistory(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching import history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
