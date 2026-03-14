import prisma from "../config/postgres.js";
import { generateSlug } from "../utilis/slugify.js";
import cloudinary from "../utilis/cloudinary.js";

const uploadToCloudinary = async (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) reject(error);
                resolve(result.secure_url);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

// Auto-transition: quantity ≤ 0 → OUT_OF_STOCK
const getAutoStatus = (quantity, requestedStatus) => {
    const qty = parseInt(quantity);
    if (qty <= 0) {
        return "OUT_OF_STOCK";
    }
    return requestedStatus || "ACTIVE";
};

export const createProductService = async (data, files, userId) => {
    try {
        if (!files?.mainImage?.[0]) {
            throw new Error("Main image is required");
        }

        if (!data.categoryId) {
            throw new Error("Category is required");
        }

        const baseSlug = generateSlug(data.name);
        let slug = baseSlug;
        let count = 1;

        while (await prisma.product.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }

        const mainImageUrl = await uploadToCloudinary(
            files.mainImage[0].buffer,
            "product-main-images"
        );

        let galleryImageUrls = [];
        if (files?.galleryImages?.length > 0) {
        const uploadPromises = files.galleryImages.map(file =>
            uploadToCloudinary(file.buffer, "product-gallery-images")
        );

        const results = await Promise.allSettled(uploadPromises);

        galleryImageUrls = results
            .filter(result => result.status === "fulfilled")
            .map(result => result.value);
        }

        const {
            name,
            description,
            price,
            quantity,
            categoryId,
            subCategoryId,
            status
        } = data;

        const parsedQuantity = parseInt(quantity);

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: parseFloat(price),
                quantity: parsedQuantity,
                status: "ARCHIVED",
                isActive: true,
                mainImage: mainImageUrl,
                galleryImages: galleryImageUrls,
                categoryId,
                subCategoryId: subCategoryId || null,
                createdById: userId
            },
            include: {
                category: true,
                subCategory: true,
                createdBy: {
                    select: { id: true, email: true, firstName: true, lastName: true }
                }
            }
        });

        return product;
    } catch (error) {
        throw new Error(`Failed to create product: ${error.message}`);
    }
};

export const getProductsService = async (filters = {}) => {
    try {
        let page = parseInt(filters.page) || 1;
        let limit = parseInt(filters.limit) || 20;
        
        if (page < 1) page = 1;
        if (limit < 1) limit = 20;
        if (limit > 100) limit = 100; 
        
        const skip = (page - 1) * limit;

        const where = {
            isActive: true,
            status: "ACTIVE",
            quantity: { gt: 0 }
        };

        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters.subCategoryId) {
            where.subCategoryId = filters.subCategoryId;
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined) {
                where.price.gte = parseFloat(filters.minPrice);
            }
            if (filters.maxPrice !== undefined) {
                where.price.lte = parseFloat(filters.maxPrice);
            }
        }

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
            ];
        }

        // ✅ NEW: support sorting by simple fields and by creator fields
        // - simple: `sort=price:asc` or `sort=createdAt:desc`
        // - creator: `sort=createdBy.email:asc` or `sort=createdBy.firstName:desc`
        let orderBy = { createdAt: 'desc' };
        if (filters.sort) {
            const [fieldSpec, direction] = filters.sort.split(':');
            const validDirections = ['asc', 'desc'];

            if (fieldSpec && direction && validDirections.includes(direction)) {
                // createdBy.<field> sorting
                if (fieldSpec.startsWith('createdBy.')) {
                    const sub = fieldSpec.split('.')[1];
                    const validCreatorFields = ['email', 'firstName', 'lastName'];
                    if (validCreatorFields.includes(sub)) {
                        orderBy = { createdBy: { [sub]: direction } };
                    }
                } else {
                    const validFields = ['price', 'createdAt', 'name'];
                    if (validFields.includes(fieldSpec)) {
                        orderBy = { [fieldSpec]: direction };
                    }
                }
            }
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    subCategory: true,
                    createdBy: {
                        select: { id: true, email: true, firstName: true, lastName: true }
                    }
                },
                orderBy,
                skip,
                take: limit
            }),
            prisma.product.count({ where })
        ]);

        return {
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
    }
};

export const getAdminProductsService = async (filters = {}) => {
    try {
        // ADMIN: No visibility restrictions - see EVERYTHING (archived, inactive, out of stock)
        let page = parseInt(filters.page) || 1;
        let limit = parseInt(filters.limit) || 20;
        
        if (page < 1) page = 1;
        if (limit < 1) limit = 20;
        if (limit > 100) limit = 100;
        
        const skip = (page - 1) * limit;

        // Build where clause - admins can filter but no visibility restrictions
        const where = {};

        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters.subCategoryId) {
            where.subCategoryId = filters.subCategoryId;
        }
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined) {
                where.price.gte = parseFloat(filters.minPrice);
            }
            if (filters.maxPrice !== undefined) {
                where.price.lte = parseFloat(filters.maxPrice);
            }
        }
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
            ];
        }

        // ✅ NEW: support sorting by simple fields and by creator fields
        // - simple: `sort=price:asc` or `sort=createdAt:desc`
        // - creator: `sort=createdBy.email:asc` or `sort=createdBy.firstName:desc`
        let orderBy = { createdAt: 'desc' };
        if (filters.sort) {
            const [fieldSpec, direction] = filters.sort.split(':');
            const validDirections = ['asc', 'desc'];

            if (fieldSpec && direction && validDirections.includes(direction)) {
                // createdBy.<field> sorting
                if (fieldSpec.startsWith('createdBy.')) {
                    const sub = fieldSpec.split('.')[1];
                    const validCreatorFields = ['email', 'firstName', 'lastName'];
                    if (validCreatorFields.includes(sub)) {
                        orderBy = { createdBy: { [sub]: direction } };
                    }
                } else {
                    const validFields = ['price', 'createdAt', 'name'];
                    if (validFields.includes(fieldSpec)) {
                        orderBy = { [fieldSpec]: direction };
                    }
                }
            }
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    subCategory: true,
                    createdBy: {
                        select: { id: true, email: true, firstName: true, lastName: true }
                    }
                },
                orderBy,
                skip,
                take: limit
            }),
            prisma.product.count({ where })
        ]);

        return {
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        throw new Error(`Failed to fetch admin products: ${error.message}`);
    }
};

export const getProductByIdService = async (id) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                subCategory: true,
                createdBy: {
                    select: { id: true, email: true, firstName: true, lastName: true }
                }
            }
        });

        if (!product) {
            throw new Error("Product not found");
        }

        // PUBLIC VISIBILITY: Return 404 if not visible to customers
        if (!product.isActive || product.status !== "ACTIVE" || product.quantity <= 0) {
            throw new Error("Product not found");
        }

        return product;
    } catch (error) {
        throw new Error(`${error.message}`);
    }
};

export const getAdminProductByIdService = async (id) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                subCategory: true,
                createdBy: {
                    select: { id: true, email: true, firstName: true, lastName: true }
                }
            }
        });

        if (!product) {
            throw new Error("Product not found");
        }

        // ADMIN: See everything
        return product;
    } catch (error) {
        throw new Error(`Failed to fetch product: ${error.message}`);
    }
};

export const updateProductService = async (id, data, files, userId) => {
    try {
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            throw new Error("Product not found");
        }

        let mainImage = product.mainImage;
        let galleryImages = product.galleryImages;

        // Upload new main image if provided
        if (files?.mainImage?.[0]) {
            mainImage = await uploadToCloudinary(
                files.mainImage[0].buffer,
                "product-main-images"
            );
        }

        // Upload new gallery images if provided
        if (files?.galleryImages?.length > 0) {
            galleryImages = [];
            for (const file of files.galleryImages) {
                const imageUrl = await uploadToCloudinary(
                    file.buffer,
                    "product-gallery-images"
                );
                galleryImages.push(imageUrl);
            }
        }

        // Determine auto-status based on quantity
        let autoStatus = product.status;
        if (data.quantity !== undefined) {
            autoStatus = getAutoStatus(data.quantity, data.status);
        } else if (data.status) {
            autoStatus = data.status;
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.description && { description: data.description }),
                ...(data.price && { price: parseFloat(data.price) }),
                ...(data.quantity !== undefined && { quantity: parseInt(data.quantity) }),
                status: autoStatus,
                mainImage,
                galleryImages
            },
            include: {
                category: true,
                subCategory: true,
                createdBy: {
                    select: { id: true, email: true, firstName: true, lastName: true }
                }
            }
        });

        return updatedProduct;
    } catch (error) {
        throw new Error(`Failed to update product: ${error.message}`);
    }
};

export const deleteProductService = async (id) => {
    try {
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            throw new Error("Product not found");
        }

        const deletedProduct = await prisma.product.update({
            where: { id },
            data: { isActive: false },
            include: {
                category: true,
                subCategory: true,
                createdBy: {
                    select: { id: true, email: true, firstName: true, lastName: true }
                }
            }
        });

        return deletedProduct;
    } catch (error) {
        throw new Error(`Failed to delete product: ${error.message}`);
    }
};

export const activateProductService = async (id) => {
    try {
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            throw new Error("Product not found");
        }

        const activatedProduct = await prisma.product.update({
            where: { id },
            data: { status: "ACTIVE" },
        });

        return activatedProduct;
    } catch (error) {
        throw new Error(`Failed to activate product: ${error.message}`);
    }
};

export const activateAllProductsService = async () => {
    try {
        const updatedProducts = await prisma.product.updateMany({
            where: { status: "ARCHIVED" },
            data: { status: "ACTIVE" },
        });

        return updatedProducts;
    } catch (error) {
        throw new Error(`Failed to activate all products: ${error.message}`);
    }
};
