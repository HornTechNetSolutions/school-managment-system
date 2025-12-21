import express from "express"
import { assignResults} from "../controllers/exam.controller.ts";
import { authenticate, authorize } from "../middlewares/auth.middleware.ts";


const router= express.Router()

router.use(authenticate, authorize("TEACHER"));

router.post("/exam/:examUuid/result", assignResults);
// router.get("/my-assignments", getTeacherAssignments);


export default router;