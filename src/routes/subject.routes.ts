import express from "express"
import { 
    assignSubjectToClass, 
    getSubjects, 
    getSubject , 
    assignSubjectsToTeacher
} from "../controllers/subject.controller.ts";
import { authenticate, authorize } from "../middlewares/auth.middleware.ts";
import { onlyRegistrar } from "../middlewares/onlyRegistrar.ts";

const router= express.Router()

router.use(authenticate);

router.get("/", authorize("ADMIN","TEACHER","EMPLOYEE"), getSubjects);
router.get("/:subjectUuid", authorize("ADMIN","TEACHER","EMPLOYEE"), getSubject);
router.post("/assign-teacher/:teacherUuid", authorize("ADMIN","EMPLOYEE"), assignSubjectsToTeacher);
router.post( "/assign-class/:classUuid", onlyRegistrar, authorize("ADMIN","EMPLOYEE"),assignSubjectToClass);


export default router;