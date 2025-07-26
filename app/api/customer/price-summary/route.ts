import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "BUYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = session.user.id;

    // Get customer with pricing configuration
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        customerMargins: true,
        customerPrices: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                brand: true,
                retailPrice: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Get recent orders for pricing analysis
    const recentOrders = await prisma.order.findMany({
      where: {
        customerId: customerId,
        status: "APPROVED",
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                retailPrice: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // Calculate pricing statistics
    const pricingStats = {
      generalMargin: customer.generalMargin,
      totalOrders: recentOrders.length,
      averageOrderValue:
        recentOrders.length > 0
          ? recentOrders.reduce((sum, order) => {
              const orderTotal = order.orderItems.reduce(
                (itemSum, item) => itemSum + item.quantity * Number(item.price),
                0,
              );
              return sum + orderTotal;
            }, 0) / recentOrders.length
          : 0,
      categoryOverrides: customer.customerMargins.length,
      productOverrides: customer.customerPrices.length,
    };

    // Get category pricing summary
    const categoryPricing = customer.customerMargins.map((cm) => ({
      categoryId: cm.category,
      categoryName: cm.category,
      marginPercentage: cm.margin,
      isOverride: Number(cm.margin) !== Number(customer.generalMargin),
    }));

    // Get product pricing summary (limited to 10 most recent)
    const productPricing = customer.customerPrices.slice(0, 10).map((cp) => ({
      productId: cp.productId,
      productName: cp.product.name,
      productBrand: cp.product.brand,
      retailPrice: cp.product.retailPrice,
      customerPrice: cp.price,
      discount: Number(cp.product.retailPrice) - Number(cp.price),
      // prettier-ignore
      discountPercentage: ((Number(cp.product.retailPrice) - Number(cp.price)) / Number(cp.product.retailPrice)) * 100,
    }));

    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        marginPercentage: customer.generalMargin,
      },
      pricingStats,
      categoryPricing,
      productPricing,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        createdAt: order.createdAt,
        status: order.status,
        totalAmount: order.orderItems.reduce(
          (sum, item) => sum + item.quantity * Number(item.price),
          0,
        ),
        itemCount: order.orderItems.length,
      })),
    });
  } catch (error) {
    console.error("Error fetching customer price summary:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
