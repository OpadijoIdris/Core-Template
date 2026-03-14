import { Router } from "express";
import { getUser, getAllUser, updateUser, deleteUser, uploadAvatar } from "../controller/user.controller.js";
import { upload } from "../middlewares/upload.js";
import { protect, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protect, requireAdmin, getAllUser);
router.get("/:id", getUser);
router.put("/profile", protect, updateUser);
router.patch("/avatar", protect, upload.single("avatar"), uploadAvatar);
router.delete("/:id", protect, deleteUser);
// will be adding on deleting logged in user by the user himself later

export default router;

