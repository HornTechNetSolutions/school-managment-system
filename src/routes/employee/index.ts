import { Router } from 'express';
import studentRoutes from './student.routes.ts';
import parentRoutes from './parent.routes.ts';
import teacherRoutes from './teacher.routes.ts';

const router = Router();

router.use('/students', studentRoutes);
router.use('/parents', parentRoutes);
router.use('/teachers', teacherRoutes);

export default router;
