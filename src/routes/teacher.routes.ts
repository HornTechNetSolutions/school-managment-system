import express from "express"
import { authenticate, authorize } from "../middlewares/auth.middleware.ts";
const router= express.Router()



router.get("/my-assignments", authenticate, authorize("TEACHER"), );


// getAssignments

export default router;