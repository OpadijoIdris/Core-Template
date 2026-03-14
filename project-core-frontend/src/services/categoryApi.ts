import axios from '../lib/axios';

interface CategoryData {
  name: string;
}

interface SubcategoryData {
  name: string;
  categoryId: string;
}

// Category APIs
export const createCategory = async (data: CategoryData) => {
  const response = await axios.post('/category', data);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await axios.get('/category');
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await axios.get(`/category/${id}`);
  return response.data;
};

export const updateCategory = async (id: string, data: { name?: string; isActive?: boolean }) => {
  const response = await axios.put(`/category/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await axios.delete(`/category/${id}`);
  return response.data;
};

// Subcategory APIs
export const createSubcategory = async (data: SubcategoryData) => {
  const response = await axios.post('/subcategory', data);
  return response.data;
};

export const getAllSubcategories = async () => {
  const response = await axios.get('/subcategory');
  return response.data;
};

export const getSubcategoriesByCategory = async (categoryId: string) => {
  const response = await axios.get(`/subcategory/category/${categoryId}`);
  return response.data;
};

export const getSubcategoryById = async (id: string) => {
  const response = await axios.get(`/subcategory/${id}`);
  return response.data;
};

export const updateSubcategory = async (id: string, data: { name?: string; isActive?: boolean }) => {
  const response = await axios.put(`/subcategory/${id}`, data);
  return response.data;
};

export const deleteSubcategory = async (id: string) => {
  const response = await axios.delete(`/subcategory/${id}`);
  return response.data;
};

