import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProductList from "@/components/admin/ProductList";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login/admin");
  }

  // Fetch products with all necessary fields
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      content: true,
      ean: true,
      purchasePrice: true,
      retailPrice: true,
      stockQuantity: true,
      maxOrderableQuantity: true,
      starRating: true,
      category: true,
      subcategory: true,
      brand: true,
      weight: true,
      dimensions: true,
      status: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform products for the component
  const transformedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    content: product.content,
    ean: product.ean,
    purchasePrice: product.purchasePrice,
    retailPrice: product.retailPrice,
    stockQuantity: product.stockQuantity,
    maxOrderQuantity: product.maxOrderableQuantity,
    rating: product.starRating,
    category: product.category,
    subcategory: product.subcategory,
    brand: product.brand,
    weight: product.weight,
    dimensions: product.dimensions,
    status: product.status,
    isAvailable: product.stockQuantity > 0,
    createdAt: product.createdAt,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Producten Beheer</h1>
        <p className="text-gray-600 mt-2">
          Beheer alle producten in het systeem
        </p>
      </div>

      <ProductList products={transformedProducts} />
    </div>
  );
}
