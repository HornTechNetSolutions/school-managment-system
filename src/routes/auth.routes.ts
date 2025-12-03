import express from "express"
import { login, logout, refreshToken, getMe, signup } from "../controllers/auth.controller.ts"
import { authenticate } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/get-me", authenticate, getMe);

export default router;