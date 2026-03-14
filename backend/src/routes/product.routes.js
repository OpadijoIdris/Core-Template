import express from "express";
import * as productController from "../controller/product.controller.js";
import { protect, anyAdmin, requireAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/admin", protect, requireAdmin, productController.getProducts)
router.get("/admin/:id", protect, requireAdmin, productController.getAdminProductById);

router.patch("/activate/:id", protect, requireAdmin, productController.activateProduct);
router.patch("/activate-all", protect, requireAdmin, productController.activateAllProducts);

router.get("/:id", productController.getProductById);

router.post(
    "/",
    protect, anyAdmin,
    upload.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 10 }
    ]),
    productController.createProduct
);

router.patch(
    "/:id",
    protect, anyAdmin,
    upload.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 10 }
    ]),
    productController.updateProduct
);

router.delete(
    "/:id",
    protect, requireAdmin,
    productController.deleteProduct
);

export default router;
