import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.use(protect);
router.use(authorize('admin', 'lider'));

router.get('/', dashboardController.getKPIs);
router.get('/upcoming-events', dashboardController.getUpcomingEvents);

export default router;
