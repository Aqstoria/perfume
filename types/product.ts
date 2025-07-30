export interface Product {
  id: string;
  name: string;
  content: string | null;
  ean: string;
  purchasePrice: number;
  retailPrice: number;
  stockQuantity: number;
  maxOrderQuantity: number | null;
  rating: number | null;
  category: string | null;
  subcategory: string | null;
  brand: string | null;
  weight: number | null;
  dimensions: string | null;
  status: string;
  isAvailable: boolean;
  createdAt: Date;
} 