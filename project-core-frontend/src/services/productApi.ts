import { ApiResponse, ApiProductResponse } from "@/types/product";
import axiosInstance from "@/lib/axios";

export const getProducts = async (): Promise<ApiResponse> => {
    const res = await axiosInstance.get("/product");
    return res.data;
};

export const getAdminProducts = async (filters: any = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await axiosInstance.get(`/product/admin?${params}`);
    return res.data;
}

export const getProuctById = async (id: string): Promise<ApiProductResponse> => {
    const res = await axiosInstance.get(`product/${id}`);
    return res.data;
};

export const getAdminProductById = async (id: string): Promise<ApiProductResponse> => {
    const res = await axiosInstance.get(`product/admin/${id}`);
    return res.data;
};

export const createProduct = async (data: FormData): Promise<ApiProductResponse> => {
    const res = await axiosInstance.post("/product", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const updateProduct = async (id: string, data: any) => {
    const res = await axiosInstance.patch(`/product/${id}`, data);
    return res.data;
};

export const deleteProduct = async (id: string) => {
    const res = await axiosInstance.delete(`/product/${id}`);
    return res.data;
}

export const activateProduct = async (id: string) => {
    const res = await axiosInstance.patch(`/product/activate/${id}`);
    return res.data;
};

export const activateAllProducts = async () => {
    const res = await axiosInstance.patch('/product/activate-all');
    return res.data;
};
