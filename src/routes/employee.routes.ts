import express from "express"
import { registerStudent } from "../controllers/employee.controller.ts";
import { authenticate, authorize } from "../middlewares/auth.middleware.ts";
import { onlyRegistrar } from "../middlewares/onlyRegistrar.ts";
const router= express.Router()


router.post("/register-student", authenticate, authorize("EMPLOYEE"), onlyRegistrar, registerStudent);



export default router;