import * as categoryServices from "../services/category.services.js";

export const createCategory = async (req, res) => {
    try {
        const category = await categoryServices.createCategoryService(req.body);
        res.status(201).json({
            success: true,
            data: category
        });
        if(!category) {
            return res.status(400).json({
                success: false,
                message: "Could not create category"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryServices.getCategoriesService();
        if(!categories){
            return res.status(400).json({
                success: false,
                message: "Something went wrong/ categories is empty"
            })
        }

        res.status(200).json({
            success: true,
            data: categories
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryServices.getCategoryByIdService(id);
        if(!category) {
            return res.status(404).json({ message: "Could not find category" })
        }

        res.status(200).json({
            success: true,
            data: category
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const updateCategory = async (req, res) => {
    try {
        const updated = await categoryServices.updateCategoryService(req.params.id, req.body);
        if(!updated) {
            return res.status(400).json({
                success: false,
                message: "Could not update category"
            })
        }
        res.status(200).json({
            success: true,
            data: updated
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const deleted = await categoryServices.deleteCategoryService(req.params.id);
        if(!deleted) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
