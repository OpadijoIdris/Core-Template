export interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt:string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatedBy {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;
  subCategoryId: string;
  mainImage: File;
  galleryImages: File[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  quantity: number;
  status: string;
  isActive: boolean;
  mainImage: string;
  galleryImages: string[];
  categoryId: string;
  subCategoryId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  subCategory: SubCategory;
  createdBy: CreatedBy;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface ApiProductResponse {
  success: boolean;
  message: string;
  data: Product | null;
}