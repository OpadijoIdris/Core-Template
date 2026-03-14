"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { activateProduct, activateAllProducts, getAdminProducts } from '@/services/productApi';
import { Product } from '@/types/product';
import { toast } from 'react-toastify';

const ArchivedProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchArchivedProducts = async () => {
        try {
            const response = await getAdminProducts({ status: 'ARCHIVED' });
            if (response.success) {
                setProducts(response.data);
            } else {
                toast.error(response.message || 'Failed to fetch archived products.');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred while fetching products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArchivedProducts();
    }, []);

    const handleActivate = async (id: string) => {
        try {
            const response = await activateProduct(id);
            if (response.success) {
                toast.success("Product activated successfully!");
                fetchArchivedProducts(); // Re-fetch the list
            } else {
                toast.error(response.message || "Failed to activate product.");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred while activating the product.");
        }
    };

    const handleActivateAll = async () => {
        try {
            const response = await activateAllProducts();
            if (response.success) {
                toast.success(`Successfully activated ${response.data.count} products!`);
                fetchArchivedProducts(); // Re-fetch the list
            } else {
                toast.error(response.message || "Failed to activate all products.");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred while activating all products.");
        }
    };

    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6">Archived Products</h1>
            <div className="mb-4">
                <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    onClick={handleActivateAll}
                    disabled={products.length === 0}
                >
                    Activate All Products
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
                {products.length === 0 ? (
                    <p>No archived products found.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <li key={product.id} className="py-4 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">{product.name}</h2>
                                    <p className="text-sm text-gray-600">{product.category.name} &gt; {product.subCategory.name}</p>
                                    <p className="text-sm text-gray-800">₦{product.price}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Link href={`/admin/products/archived/${product.id}`}>
                                        <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                            View
                                        </button>
                                    </Link>
                                    <button 
                                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                        onClick={() => handleActivate(product.id)}
                                    >
                                        Activate
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ArchivedProductsPage;
