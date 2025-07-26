import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProductStatus } from "@prisma/client";

// Zod schema for rollback request
const rollbackSchema = z.object({
  importId: z.string().min(1, "Import ID is required"),
  rollbackReason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = rollbackSchema.parse(body);
    const { importId, rollbackReason } = validatedData;

    // Get import history and verify it exists
    const importHistory = await prisma.importHistory.findUnique({
      where: { id: importId },
      include: {
        snapshots: true,
        rollbacks: true,
      },
    });

    if (!importHistory) {
      return NextResponse.json({ error: "Import not found" }, { status: 404 });
    }

    // Check if rollback already exists
    if (importHistory.rollbacks.length > 0) {
      return NextResponse.json(
        { error: "Rollback already performed for this import" },
        { status: 400 },
      );
    }

    // Get the latest snapshot for this import
    const snapshot = importHistory.snapshots[0];
    if (!snapshot) {
      return NextResponse.json({ error: "No snapshot found for rollback" }, { status: 404 });
    }

    // Perform rollback in a transaction
    const result = await prisma.$transaction(async (tx) => {
      let entitiesRestored = 0;

      // Delete all products imported in this session
      if (importHistory.entityType === "Product") {
        const deletedProducts = await tx.product.deleteMany({
          where: {
            createdAt: {
              gte: importHistory.createdAt,
            },
          },
        });
        entitiesRestored = deletedProducts.count;
      }

      // Restore from snapshot if available
      if (snapshot.snapshotData && Array.isArray(snapshot.snapshotData)) {
        for (const entityData of snapshot.snapshotData) {
          if (
            !entityData ||
            typeof entityData !== "object" ||
            Array.isArray(entityData) ||
            !("id" in entityData)
          ) {
            continue;
          }
          if (importHistory.entityType === "Product") {
            await tx.product.create({
              data: {
                id: String(entityData.id),
                name: String(entityData.name),
                brand: String(entityData.brand),
                content: String(entityData.content),
                ean: String(entityData.ean),
                purchasePrice: Number(entityData.purchasePrice) || 0,
                retailPrice: Number(entityData.retailPrice) || 0,
                stockQuantity:
                  entityData.stockQuantity !== undefined && entityData.stockQuantity !== null
                    ? Number(entityData.stockQuantity)
                    : 0,
                maxOrderableQuantity:
                  entityData.maxOrderableQuantity !== undefined
                    ? Number(entityData.maxOrderableQuantity)
                    : null,
                starRating:
                  entityData.starRating !== undefined && entityData.starRating !== null
                    ? Number(entityData.starRating)
                    : 0,
                category: entityData.category !== undefined ? String(entityData.category) : null,
                subcategory:
                  entityData.subcategory !== undefined ? String(entityData.subcategory) : null,
                description:
                  entityData.description !== undefined ? String(entityData.description) : null,
                tags: Array.isArray(entityData.tags) ? entityData.tags.map(String) : [],
                status: Object.values(ProductStatus).includes(entityData.status as ProductStatus)
                  ? (entityData.status as ProductStatus)
                  : ProductStatus.ACTIEF,
                isActive:
                  entityData.isActive !== undefined && entityData.isActive !== null
                    ? Boolean(entityData.isActive)
                    : true,
                createdAt: entityData.createdAt
                  ? new Date(entityData.createdAt as string)
                  : new Date(),
                updatedAt: entityData.updatedAt
                  ? new Date(entityData.updatedAt as string)
                  : new Date(),
              },
            });
            entitiesRestored++;
          }
        }
      }

      // Create rollback record
      const rollback = await tx.importRollback.create({
        data: {
          importId,
          rolledBackBy: session.user.id,
          entitiesRestored,
          rollbackReason: rollbackReason ?? null,
        },
      });

      // Create audit log entry
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: "ROLLBACK",
          entity: "Import",
          entityId: importId,
          details: {
            importId,
            entityType: importHistory.entityType,
            entitiesRestored,
            rollbackReason,
            fileName: importHistory.fileName,
          },
          ipAddress: request.headers.get("x-forwarded-for"),
          userAgent: request.headers.get("user-agent"),
        },
      });

      return { rollback, entitiesRestored };
    });

    return NextResponse.json({
      success: true,
      message: `Rollback completed successfully. ${result.entitiesRestored} entities restored.`,
      rollback: result.rollback,
    });
  } catch (error) {
    console.error("Rollback error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
