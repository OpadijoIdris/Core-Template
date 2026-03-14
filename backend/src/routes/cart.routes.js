import { addToCart, updateCart, removeCartItem, getUserCart, clearCart } from "../controller/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getUserCart);
router.patch("/update", protect, updateCart);
router.delete("/remove/:itemId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);

export default router;
