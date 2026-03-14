"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { activateProduct, getAdminProductById } from '@/services/productApi';
import { Product } from '@/types/product';
import { toast } from 'react-toastify';
import Link from 'next/link';

const ArchivedProductDetailsPage = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await getAdminProductById(id as string);
                    if (response.success) {
                        setProduct(response.data);
                    } else {
                        toast.error(response.message || 'Failed to fetch product details.');
                    }
                } catch (error: any) {
                    toast.error(error.message || 'An error occurred while fetching product details.');
                } finally {
                    setLoading(false);
                }
            };

            fetchProduct();
        }
    }, [id]);

    const handleActivate = async () => {
        if (id) {
            try {
                const response = await activateProduct(id as string);
                if (response.success) {
                    toast.success("Product activated successfully!");
                    router.push('/admin/products/archived');
                } else {
                    toast.error(response.message || "Failed to activate product.");
                }
            } catch (error: any) {
                toast.error(error.message || "An error occurred while activating the product.");
            }
        }
    };

    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    if (!product) {
        return <div className="container mx-auto p-4">Product not found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Product Details</h1>
                <div className="flex space-x-2">
                    <Link href={`/admin/products/archived/${id}/edit`}>
                        <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                            Edit
                        </button>
                    </Link>
                    <button 
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        onClick={handleActivate}
                    >
                        Activate
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-lg font-bold mb-2">Main Image</h2>
                        <img src={product.mainImage} alt={product.name} className="w-full h-auto rounded-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                        <p className="text-lg text-gray-800 font-semibold mb-4">₦{product.price}</p>
                        <p className="text-md text-gray-600 mb-4">{product.description}</p>
                        <div className="flex flex-col space-y-2">
                            <p><strong>Category:</strong> {product.category.name}</p>
                            <p><strong>Sub-category:</strong> {product.subCategory.name}</p>
                            <p><strong>Quantity:</strong> {product.quantity}</p>
                            <p><strong>Status:</strong> <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                                product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                product.status === 'ARCHIVED' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>{product.status}</span></p>
                        </div>
                    </div>
                </div>

                {product.galleryImages && product.galleryImages.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-bold mb-2">Gallery Images</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {product.galleryImages.map((image, index) => (
                                <img key={index} src={image} alt={`${product.name} gallery image ${index + 1}`} className="w-full h-auto rounded-lg" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchivedProductDetailsPage;
