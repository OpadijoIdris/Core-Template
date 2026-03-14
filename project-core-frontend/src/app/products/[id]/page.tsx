"use client";

import { useParams } from "next/navigation";
import { useProductById } from "@/hooks/useProductById";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { product, loading, error } = useProductById(id);

  if (loading) {
    return <p className="text-center py-8">Loading product details...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">{error}</p>;
  }

  if (!product) {
    return <p className="text-center py-8 text-gray-500">Product not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
        <ProductImageGallery
          mainImage={product.mainImage}
          galleryImages={product.galleryImages}
          productName={product.name}
        />
        <ProductInfo product={product} />
      </div>
    </div>
  );
}
