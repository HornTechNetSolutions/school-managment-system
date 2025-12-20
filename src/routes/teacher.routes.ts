import express from "express"
import { assignResults, getExams, getExam, getExamResults } from "../controllers/exam.controller.ts";
import { authenticate, authorize } from "../middlewares/auth.middleware.ts";
const router= express.Router()



router.get("/my-assignments", authenticate, authorize("TEACHER"), );
router.post("/exam/:examUuid/result", authenticate, authorize("TEACHER"), assignResults);
router.get("/exam/:resultUuid/results", authenticate, getExamResults);
router.get("/exam/all", authenticate, getExams);
router.get("/exam/:examUuid", authenticate, getExam);


// getAssignments

export default router;