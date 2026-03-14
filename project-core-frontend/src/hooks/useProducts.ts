import { useEffect, useState, useCallback, useRef } from "react";
import axiosInstance from "@/lib/axios";
import { Product } from "@/types/product";

interface ProductFilters {
  categoryId?: string;
  subCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export function useProducts(initialFilters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 12, ...initialFilters });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await axiosInstance.get(`/product?${params.toString()}`);
      if (response.data.success) {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
        setError(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch products. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const resetFilters = () => {
    setFilters({ page: 1, limit: 12 });
  };

  return { 
    products, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    pagination, 
    changePage, 
    resetFilters,
    refresh: fetchProducts 
  };
}
