import * as productServices from "../services/product.services.js";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

const isUserAdmin = (user) => {
    if (!user || !user.role) {
        return false;
    }
    return ADMIN_ROLES.includes(user.role);
};

const checkAdminPermission = (req, res) => {
    if (!req.user?.id) {
        res.status(401).json({
            success: false,
            message: "User not authenticated"
        });
        return false;
    }

    if (!ADMIN_ROLES.includes(req.user?.role)) {
        res.status(403).json({
            success: false,
            message: "Only admins can perform this action"
        });
        return false;
    }

    return true;
};

export const createProduct = async (req, res) => {
    try {
        if (!checkAdminPermission(req, res)) return;

        const product = await productServices.createProductService(
            req.body,
            req.files,
            req.user.id
        );

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const isAdmin = isUserAdmin(req.user);

        const {
            page,
            limit,
            categoryId,
            subCategoryId,
            minPrice,
            maxPrice,
            search,
            sort,
            status,
            isActive
        } = req.query;

        if (isAdmin) {
            const filters = {
                page,
                limit,
                ...(categoryId && { categoryId }),
                ...(subCategoryId && { subCategoryId }),
                ...(minPrice && { minPrice }),
                ...(maxPrice && { maxPrice }),
                ...(search && { search }),
                ...(sort && { sort }),
                ...(status && { status }),
                ...(isActive !== undefined && { isActive: isActive === 'true' })
            };

            const result = await productServices.getAdminProductsService(filters);

            return res.status(200).json({
                success: true,
                message: "Products retrieved successfully",
                data: result.data,
                pagination: result.pagination
            });
        } else {
            const filters = {
                page,
                limit,
                ...(categoryId && { categoryId }),
                ...(subCategoryId && { subCategoryId }),
                ...(minPrice && { minPrice }),
                ...(maxPrice && { maxPrice }),
                ...(search && { search }),
                ...(sort && { sort })
            };

            const result = await productServices.getProductsService(filters);

            return res.status(200).json({
                success: true,
                message: "Products retrieved successfully",
                data: result.data,
                pagination: result.pagination
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const isAdmin = ADMIN_ROLES.includes(req.user?.role);

        let product;
        if (isAdmin) {
            product = await productServices.getAdminProductByIdService(id);
        } else {
            product = await productServices.getProductByIdService(id);
        }

        return res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAdminProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productServices.getAdminProductByIdService(id);

        return res.status(200).json({
            success: true,
            message: "Admin: Product retrieved successfully",
            data: product
        });
    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        if (!checkAdminPermission(req, res)) return;

        const { id } = req.params;

        const updatedProduct = await productServices.updateProductService(
            id,
            req.body,
            req.files,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        if (!checkAdminPermission(req, res)) return;

        const { id } = req.params;

        const deletedProduct = await productServices.deleteProductService(id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct
        });
    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const activateProduct = async (req, res) => {
    try {
        if (!checkAdminPermission(req, res)) return;

        const { id } = req.params;

        const activatedProduct = await productServices.activateProductService(id);

        return res.status(200).json({
            success: true,
            message: "Product activated successfully",
            data: activatedProduct
        });
    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const activateAllProducts = async (req, res) => {
    try {
        if (!checkAdminPermission(req, res)) return;

        const result = await productServices.activateAllProductsService();

        return res.status(200).json({
            success: true,
            message: `Successfully activated ${result.count} products.`,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
