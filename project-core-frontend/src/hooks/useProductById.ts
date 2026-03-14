import { useEffect, useState } from "react";
import { getProuctById } from "@/services/productApi";
import { Product } from "@/types/product";

export function useProductById(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Product ID is missing.");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getProuctById(id);
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError(response.message || "Product not found.");
        }
      } catch (err) {
        setError("Failed to fetch product details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { product, loading, error };
}
