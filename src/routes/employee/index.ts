import { Router } from 'express';
import studentRoutes from './student.routes.ts';
import parentRoutes from './parent.routes.ts';

const router = Router();

router.use('/students', studentRoutes);
router.use('/parents', parentRoutes);

export default router;