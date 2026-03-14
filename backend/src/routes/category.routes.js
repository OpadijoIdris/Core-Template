import express from "express";
import * as categoryController from "../controller/category.controller.js";
import { protect, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", protect, requireAdmin, categoryController.createCategory);
router.patch("/:id", protect, requireAdmin, categoryController.updateCategory);
router.delete("/:id", protect, requireAdmin, categoryController.deleteCategory);

export default router;
