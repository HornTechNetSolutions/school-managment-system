import express from "express"
import { authenticate, authorize } from "../middlewares/auth.middleware.js";



const router= express.Router()

// router.get("/assignments", getAssignments);
// router.get("/results", getMyResults);


export default router;