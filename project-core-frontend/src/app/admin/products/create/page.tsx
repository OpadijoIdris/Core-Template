"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/services/productApi";
import {
  getAllCategories,
  getAllSubcategories,
} from "@/services/categoryApi";
import { Category, SubCategory } from "@/types/product";
import { toast } from "react-toastify";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const CreateProductPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string | number>(0);
  const [quantity, setQuantity] = useState<string | number>(0);
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<SubCategory[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, subcategoriesResponse] = await Promise.all([
          getAllCategories(),
          getAllSubcategories(),
        ]);

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        } else {
          toast.error("Failed to fetch categories.");
        }

        if (subcategoriesResponse.success) {
          setAllSubcategories(subcategoriesResponse.data);
        } else {
          toast.error("Failed to fetch subcategories.");
        }
      } catch (error) {
        toast.error("Failed to fetch data.");
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (categoryId) {
      const filteredSubcategories = allSubcategories.filter(
        (sub) => sub.categoryId === categoryId
      );
      setSubcategories(filteredSubcategories);
      setSubCategoryId(""); 
    } else {
      setSubcategories([]);
      setSubCategoryId("");
    }
  }, [categoryId, allSubcategories]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !quantity || !categoryId || !subCategoryId || !mainImage) {
      toast.error("Please fill in all required fields and select a main image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("quantity", quantity.toString());
    formData.append("categoryId", categoryId);
    formData.append("subCategoryId", subCategoryId);
    if (mainImage) {
      formData.append("mainImage", mainImage);
    }
    if (galleryImages) {
      for (let i = 0; i < galleryImages.length; i++) {
        formData.append("galleryImages", galleryImages[i]);
      }
    }

    try {
      const response = await createProduct(formData);
      if (response.success) {
        toast.success("Product created successfully!");
        router.push("/admin/products"); 
      } else {
        toast.error(response.message || "Failed to create product.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create product.";
      toast.error(errorMessage);
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Link href="/admin/products" className="text-blue-500 hover:text-blue-700 mr-2">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold">Create New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <select
              id="subcategory"
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
              disabled={!categoryId || subcategories.length === 0}
            >
              <option value="">Select a subcategory</option>
              {subcategories.map((subcat) => (
                <option key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700">
              Main Image
            </label>
            <input
              type="file"
              id="mainImage"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
              required
            />
          </div>
          <div>
            <label htmlFor="galleryImages" className="block text-sm font-medium text-gray-700">
              Gallery Images (Optional)
            </label>
            <input
              type="file"
              id="galleryImages"
              accept="image/*"
              multiple
              onChange={(e) => setGalleryImages(e.target.files)}
              className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;
