import { useEffect, useState, useCallback } from "react";
import { getAdminProducts, deleteProduct as deleteProductApi } from "@/services/productApi";
import { Product } from "@/types/product";
import { toast } from "react-toastify";

export function useAdminProducts(initialFilters: any = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAdminProducts(filters);
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || "Failed to fetch products.");
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

  const updateFilters = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const changePage = (page: number) => {
    setFilters((prev: any) => ({ ...prev, page }));
  };

  const removeProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await deleteProductApi(id);
      if (response.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error(response.message || "Failed to delete product");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error deleting product");
    }
  };

  return { 
    products, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    pagination, 
    changePage,
    refresh: fetchProducts,
    removeProduct
  };
}
