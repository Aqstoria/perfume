"use server";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for product updates
const productSchema = z.object({
  name: z.string().min(1, "Productnaam is verplicht"),
  content: z.string().optional(),
  ean: z.string().min(1, "EAN is verplicht"),
  purchasePrice: z
    .string()
    .min(1, "Inkoopprijs is verplicht")
    .regex(/^\d+(\.\d{1,2})?$/, "Voer een geldig bedrag in"),
  retailPrice: z
    .string()
    .min(1, "Verkoopprijs is verplicht")
    .regex(/^\d+(\.\d{1,2})?$/, "Voer een geldig bedrag in"),
  stockQuantity: z
    .string()
    .min(1, "Voorraad is verplicht")
    .regex(/^\d+$/, "Voorraad moet een geheel getal zijn"),
  maxOrderableQuantity: z.string().optional(),
  starRating: z.string().optional(),
  category: z.string().min(1, "Categorie is verplicht"),
  subcategory: z.string().optional(),
  brand: z.string().min(1, "Merk is verplicht"),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  status: z.string().min(1, "Status is verplicht"),
});

export async function updateProduct(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: productId } = await params;

  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }

    const formData = await request.formData();
    const rawData = {
      name: formData.get("name") as string,
      content: formData.get("content") as string,
      ean: formData.get("ean") as string,
      purchasePrice: formData.get("purchasePrice") as string,
      retailPrice: formData.get("retailPrice") as string,
      stockQuantity: formData.get("stockQuantity") as string,
      maxOrderableQuantity: formData.get("maxOrderableQuantity") as string,
      starRating: formData.get("starRating") as string,
      category: formData.get("category") as string,
      subcategory: formData.get("subcategory") as string,
      brand: formData.get("brand") as string,
      weight: formData.get("weight") as string,
      dimensions: formData.get("dimensions") as string,
      status: formData.get("status") as string,
    };

    // Validate the data
    const validatedData = productSchema.parse(rawData);

    // Check if EAN already exists for another product
    const existingProduct = await prisma.product.findFirst({
      where: {
        ean: validatedData.ean,
        id: { not: productId },
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          error: "Een product met deze EAN bestaat al",
        },
        { status: 400 },
      );
    }

    // Update the product
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: validatedData.name,
        content: validatedData.content || null,
        ean: validatedData.ean,
        purchasePrice: parseFloat(validatedData.purchasePrice),
        retailPrice: parseFloat(validatedData.retailPrice),
        stockQuantity: parseInt(validatedData.stockQuantity),
        maxOrderableQuantity: validatedData.maxOrderableQuantity
          ? parseInt(validatedData.maxOrderableQuantity)
          : null,
        starRating: validatedData.starRating ? parseFloat(validatedData.starRating) : null,
        category: validatedData.category,
        subcategory: validatedData.subcategory || null,
        brand: validatedData.brand,
        weight: validatedData.weight ? parseFloat(validatedData.weight) : null,
        dimensions: validatedData.dimensions || null,
        status: validatedData.status,
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Product",
        entityId: productId,
        details: {
          productName: validatedData.name,
          ean: validatedData.ean,
          purchasePrice: validatedData.purchasePrice,
          retailPrice: validatedData.retailPrice,
          stockQuantity: validatedData.stockQuantity,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product succesvol bijgewerkt",
    });
  } catch (error) {
    console.error("Error updating product:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Ongeldige productgegevens",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Fout bij het bijwerken van het product",
        details: error instanceof Error ? error.message : "Onbekende fout",
      },
      { status: 500 },
    );
  }
}
