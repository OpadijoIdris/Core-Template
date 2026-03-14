
import { Router } from "express";
import * as subcategoryController from "../controller/subcategory.controller.js";
import { protect, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", subcategoryController.getSubcategories);
router.get("/:id", subcategoryController.getSubcategoryById);
router.post("/", protect, requireAdmin, subcategoryController.createSubcategory);
router.put("/:id", protect, requireAdmin, subcategoryController.updateSubcategory)
router.delete("/:id", protect, requireAdmin, subcategoryController.deleteSubcategory);

export default router;
