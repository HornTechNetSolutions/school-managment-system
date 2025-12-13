import express from "express"
import { login, logout, refreshToken, getMe, changePassword } from "../controllers/auth.controller.ts"
import { authenticate } from "../middlewares/auth.middleware.ts";

const router = express.Router();

// router.post("/signup", createUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/get-me", authenticate, getMe);
router.put("/change-password", changePassword)
export default router;