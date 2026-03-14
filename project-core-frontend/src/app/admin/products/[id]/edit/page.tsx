"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getAdminProductById, updateProduct } from "@/services/productApi";
import {
  getAllCategories,
  getAllSubcategories,
} from "@/services/categoryApi";
import { Category, SubCategory, Product } from "@/types/product";
import { toast } from "react-toastify";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const EditProductPage = ({ params }: EditProductPageProps) => {
  const { id } = use(params);
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string | number>(0);
  const [quantity, setQuantity] = useState<string | number>(0);
  const [status, setStatus] = useState("ACTIVE");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
  
  const [existingMainImage, setExistingMainImage] = useState("");
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<SubCategory[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, subcategoriesResponse, productResponse] = await Promise.all([
          getAllCategories(),
          getAllSubcategories(),
          getAdminProductById(id)
        ]);

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }
        if (subcategoriesResponse.success) {
          setAllSubcategories(subcategoriesResponse.data);
        }

        if (productResponse.success && productResponse.data) {
          const product = productResponse.data;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setQuantity(product.quantity);
          setStatus(product.status);
          setCategoryId(product.categoryId);
          setSubCategoryId(product.subCategoryId || "");
          setExistingMainImage(product.mainImage);
          setExistingGalleryImages(product.galleryImages || []);
        } else {
          toast.error("Failed to fetch product details.");
          router.push("/admin/products");
        }
      } catch (error) {
        toast.error("Failed to fetch data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  useEffect(() => {
    if (categoryId) {
      const filteredSubcategories = allSubcategories.filter(
        (sub) => sub.categoryId === categoryId
      );
      setSubcategories(filteredSubcategories);
    } else {
      setSubcategories([]);
    }
  }, [categoryId, allSubcategories]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || quantity === undefined || !categoryId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("quantity", quantity.toString());
    formData.append("status", status);
    formData.append("categoryId", categoryId);
    if (subCategoryId) {
      formData.append("subCategoryId", subCategoryId);
    }
    
    if (mainImage) {
      formData.append("mainImage", mainImage);
    }
    
    if (galleryImages) {
      for (let i = 0; i < galleryImages.length; i++) {
        formData.append("galleryImages", galleryImages[i]);
      }
    }

    try {
      const response = await updateProduct(id, formData);
      if (response.success) {
        toast.success("Product updated successfully!");
        router.push("/admin/products"); 
      } else {
        toast.error(response.message || "Failed to update product.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update product.";
      toast.error(errorMessage);
      console.error("Error updating product:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href="/admin/products" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors mr-2">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₦)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none bg-no-repeat "
            >
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory</label>
            <select
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50"
              disabled={!categoryId || subcategories.length === 0}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((subcat) => (
                <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            ></textarea>
          </div>

          <div className="md:col-span-2 space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Main Image</label>
            {existingMainImage && !mainImage && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                <Image src={existingMainImage} alt="Current main" fill className="object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files ? e.target.files[0] : null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Gallery Images</label>
            {existingGalleryImages.length > 0 && !galleryImages && (
              <div className="flex flex-wrap gap-2">
                {existingGalleryImages.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setGalleryImages(e.target.files)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Update Product"}
          </button>
          <Link 
            href="/admin/products"
            className="flex-1 text-center border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors active:scale-[0.98]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
