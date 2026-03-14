import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { checkout } from "../controller/checkout.controller.js";

const router = Router();

router.post("/", protect, checkout);

export default router;
