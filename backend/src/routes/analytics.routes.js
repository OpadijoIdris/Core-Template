import { getAdminAnalytics, getRevenueTrends } from "../controller/analytics.controller.js";
import { Router } from "express";
import { protect, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/admin/overview",
  protect,
  requireAdmin,
  getAdminAnalytics
);

router.get(
  "/admin/revenue-trends",
  protect,
  requireAdmin,
  getRevenueTrends
);

export default router;
