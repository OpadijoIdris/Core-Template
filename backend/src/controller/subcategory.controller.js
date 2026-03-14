import { 
    createSubcategoryService,
    getSubcategoriesService,
    getSubcategoryByIdService,
    updateSubcategoryService,
    deleteSubcategoryService
 } from "../services/subcategories.services.js";

 export const createSubcategory = async (req, res) => {
    try {
        const subcategory = await createSubcategoryService(req.body);
        if(!subcategory) {
            return res.status(400).json({
                success: false,
                message: "Could not create subcategory"
            })
        }

        res.status(201).json({
            success: true,
            data: subcategory
        })
        
    } catch (error) {
        return res.status(500).json({
            sucess: false, 
            message: error.message
        })
    }
 };


 export const getSubcategories = async (req, res) => {
    try {
        const subcategories = await getSubcategoriesService();
        if(!subcategories) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong/ subcategories is empty"
            })
        };

        res.status(200).json({
            success: true,
            data: subcategories
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
 };

 export const getSubcategoryById = async (req, res) => {
    try {
        const subcategory = await getSubcategoryByIdService(req.params.id);
        if(!subcategory) {
            return res.status(404).json({
                success: false,
                message: "Could not find subcategory"
            })
        }

        res.status(200).json({
            success: true,
            data: subcategory
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
 };

 export const updateSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, ...data } = req.body;
        
        if(!id) {
            return res.status(400).json({ error: "Subcategory ID is required" })
        };
        if(!categoryId) {
            return res.status(400).json({ error: "Category ID is required" })
        }
        
        const updated = await updateSubcategoryService(id, data, categoryId)

        return res.status(200).json({
            message: "Subcategory updated successfully",
            data: updated
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
 };

 export const deleteSubcategory = async (req, res) => {
    try {
        const deleted = await deleteSubcategoryService(req.params.id);
        if(!deleted){
            return res.status(404).json({
                success: false,
                message: "Subcategory not found"
            })
        };

        res.status(200).json({
            success: true,
            message: "Subcategory deleted successfully",
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
 } 
