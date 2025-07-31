import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get unique brand names from products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        brand: true,
      },
    });

    // Extract unique brand names and filter out null values
    const brandNames = products
      .map((product) => product.brand)
      .filter((brand): brand is string => brand !== null && brand.trim() !== "");

    const uniqueBrands = [...new Set(brandNames)].sort();

    return NextResponse.json(uniqueBrands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch brands",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
