import express from "express"
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
const router= express.Router()

router.get("/assignments", authenticate, authorize("STUDENT"));

//getStudentAssignments
export default router;