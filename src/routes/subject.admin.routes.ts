import express from "express"
import { 
    createSubject, 
    deleteSubject, 
    removeSubjectFromTeacher, 
    updateSubject 
} from "../controllers/subject.controller.ts";

const router= express.Router()

router.post("/create", createSubject);
router.put("/:subjectUuid", updateSubject);
router.delete("/:subjectUuid", deleteSubject);

router.post("/remove-teacher/:subjectUuid", removeSubjectFromTeacher);

export default router;
