"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types/product";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Eye, 
  Edit, 
  Download,
  Plus
} from "lucide-react";
import Link from "next/link";
import ProductExportDialog from "@/components/ui/ProductExportDialog";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Available brands and categories for filters
  const brands = [
    ...new Set(products.map((p) => p.brand).filter((brand): brand is string => brand !== null)),
  ];
  const categories = [
    ...new Set(
      products.map((p) => p.category).filter((category): category is string => category !== null),
    ),
  ];
  const contentSizes = [
    ...new Set(products.map((p) => p.content).filter((content): content is string => content !== null)),
  ];
  const statuses = [
    ...new Set(products.map((p) => p.status).filter((status): status is string => status !== null)),
  ];

  // Filter and search logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ean.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesContent = !selectedContent || product.content === selectedContent;
      const matchesStatus = !selectedStatus || product.status === selectedStatus;
      const matchesAvailability = 
        !selectedAvailability || 
        (selectedAvailability === "in_stock" && product.stockQuantity > 0) ||
        (selectedAvailability === "out_of_stock" && product.stockQuantity === 0) ||
        selectedAvailability === "all";

      return matchesSearch && matchesBrand && matchesCategory && matchesContent && matchesStatus && matchesAvailability;
    });
  }, [products, searchTerm, selectedBrand, selectedCategory, selectedContent, selectedStatus, selectedAvailability]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "Actief";
      case "inactive":
        return "Inactief";
      case "pending":
        return "In behandeling";
      default:
        return status || "Onbekend";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek producten..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowExportDialog(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/admin/products/new">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nieuw Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <select
          value={selectedBrand || ""}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Alle merken</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Alle categorieën</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={selectedContent || ""}
          onChange={(e) => setSelectedContent(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Alle inhoud</option>
          {contentSizes.map((content) => (
            <option key={content} value={content}>
              {content}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus || ""}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Alle statussen</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {getStatusText(status)}
            </option>
          ))}
        </select>

        <select
          value={selectedAvailability || ""}
          onChange={(e) => setSelectedAvailability(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Alle beschikbaarheid</option>
          <option value="in_stock">Op voorraad</option>
          <option value="out_of_stock">Uitverkocht</option>
          <option value="all">Alles</option>
        </select>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {filteredProducts.length} van {products.length} producten
      </div>

      {/* Products grid/list */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold line-clamp-2">
                  {product.name}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
                  {getStatusText(product.status)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">EAN: {product.ean}</p>
              
              <div className="space-y-2 text-sm mb-4">
                {product.content && (
                  <p className="text-gray-600">
                    Inhoud: {product.content}
                  </p>
                )}
                <p className="text-gray-600">
                  Voorraad: {product.stockQuantity}
                </p>
                <p className="text-gray-600">
                  Inkoopprijs: €{product.purchasePrice}
                </p>
                <p className="text-gray-600">
                  Verkoopprijs: €{product.retailPrice}
                </p>
                {product.category && (
                  <p className="text-gray-600">
                    Categorie: {product.category}
                  </p>
                )}
                {product.brand && (
                  <p className="text-gray-600">
                    Merk: {product.brand}
                  </p>
                )}
                {product.maxOrderQuantity && (
                  <p className="text-gray-600">
                    Max bestelling: {product.maxOrderQuantity}
                  </p>
                )}
                {product.rating && (
                  <p className="text-gray-600">
                    Rating: {product.rating}/5
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/products/${product.id}`}>
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Bekijk
                  </Button>
                </Link>
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Button variant="secondary" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Bewerk
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>EAN:</strong> {product.ean}
                    </div>
                    <div>
                      <strong>Voorraad:</strong> {product.stockQuantity}
                    </div>
                    <div>
                      <strong>Inkoopprijs:</strong> €{product.purchasePrice}
                    </div>
                    <div>
                      <strong>Verkoopprijs:</strong> €{product.retailPrice}
                    </div>
                    {product.content && (
                      <div>
                        <strong>Inhoud:</strong> {product.content}
                      </div>
                    )}
                    {product.category && (
                      <div>
                        <strong>Categorie:</strong> {product.category}
                      </div>
                    )}
                    {product.brand && (
                      <div>
                        <strong>Merk:</strong> {product.brand}
                      </div>
                    )}
                    {product.maxOrderQuantity && (
                      <div>
                        <strong>Max bestelling:</strong> {product.maxOrderQuantity}
                      </div>
                    )}
                    {product.rating && (
                      <div>
                        <strong>Rating:</strong> {product.rating}/5
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link href={`/admin/products/${product.id}`}>
                    <Button variant="secondary" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Bekijk
                    </Button>
                  </Link>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Bewerk
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Export Dialog */}
      <ProductExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        currentFilters={{
          search: searchTerm,
          brand: selectedBrand,
          content: selectedContent,
          availability: selectedAvailability,
        }}
      />
    </div>
  );
}
