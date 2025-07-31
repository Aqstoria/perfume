import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for customer update
const updateCustomerSchema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  email: z.string().email("Geldig email adres is verplicht"),
  phone: z.string().optional(),
  address: z.string().optional(),
  generalMargin: z.number().min(0).max(100),
  minimumOrderValue: z.number().min(0),
  minimumOrderItems: z.number().min(0),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        customerMargins: true,
        customerPrices: true,
        customerDiscounts: true,
        customerHiddenCategories: true,
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            orders: true,
            customerMargins: true,
            customerPrices: true,
            customerDiscounts: true,
            customerHiddenCategories: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const customerData = updateCustomerSchema.parse(body);

    // Check if email already exists for another customer
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        email: customerData.email,
        id: { not: id },
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Email adres is al in gebruik" },
        { status: 400 }
      );
    }

    // Update customer
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...customerData,
        phone: customerData.phone || null,
        address: customerData.address || null,
      },
      include: {
        _count: {
          select: {
            orders: true,
            customerMargins: true,
            customerPrices: true,
            customerDiscounts: true,
            customerHiddenCategories: true,
          },
        },
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Customer",
        entityId: customer.id,
        details: {
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
        },
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if customer has orders
    const customerWithOrders = await prisma.customer.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!customerWithOrders) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    if (customerWithOrders._count.orders > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete customer with existing orders",
        },
        { status: 400 }
      );
    }

    // Delete customer
    await prisma.customer.delete({
      where: { id },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Customer",
        entityId: id,
        details: {
          customerId: id,
          customerName: customerWithOrders.name,
          customerEmail: customerWithOrders.email,
        },
      },
    });

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
