import express from "express"
import { 
    createExam, 
    getExam, 
    getExams, 
    removeExam, 
    updateExam, 
    getExamResults, 
    lockExam
} from "../controllers/exam.controller.ts";
import { authenticate, authorize } from "../middlewares/auth.middleware.ts";

const router= express.Router()

router.post("/", authenticate, authorize("TEACHER","ADMIN"), createExam);
router.get("/", authenticate, getExams);
router.get("/:examUuid", authenticate, getExam);
router.put("/:examUuid", authenticate, authorize("TEACHER","ADMIN"), updateExam);
router.delete("/:examUuid", authenticate, authorize("ADMIN"), removeExam);
router.get("/:examUuid/results", authenticate, getExamResults);
router.post("/:examUuid/results/lock", authenticate, authorize("ADMIN"), lockExam);



export default router;