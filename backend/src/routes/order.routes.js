import { Router } from "express";
import { 
    getMyOrders, 
    getOrderById, 
    getAllOrderAdmin, 
    getSingleOrderAdmin, 
    updateOrderStatusAdmin, 
    cancelOrder,
    getMyOrderAudit,
    getOrderAuditAdmin
} from "../controller/order.controller.js";
import { protect, anyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// User routes
router.get("/me", protect, getMyOrders);
router.get("/me/:orderId", protect, getOrderById);
router.get("/me/:orderId/audit", protect, getMyOrderAudit);

// Admin routes
router.get("/admin/all", protect, anyAdmin, getAllOrderAdmin);
router.get("/admin/:orderId", protect, anyAdmin, getSingleOrderAdmin);
router.patch("/admin/:orderId", protect, anyAdmin, updateOrderStatusAdmin);
router.patch("/admin/cancel/:orderId", protect, anyAdmin, cancelOrder);
router.get("/admin/:orderId/audit", protect, anyAdmin, getOrderAuditAdmin);


export default router; 
