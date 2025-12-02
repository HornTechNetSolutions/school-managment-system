import express from "express"
import { login, logout, refreshToken, signup } from "../controllers/auth.controller.ts"

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

export default router;