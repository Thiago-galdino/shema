import { Router } from 'express';
import * as memberController from '../controllers/member.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.use(protect);

router.get('/export', authorize('admin', 'lider'), memberController.exportCSV);
router.get('/', memberController.getAll);
router.get('/:id', memberController.getById);
router.post('/', authorize('admin', 'lider'), upload.single('photo'), memberController.create);
router.put('/:id', authorize('admin', 'lider'), upload.single('photo'), memberController.update);
router.delete('/:id', authorize('admin'), memberController.remove);

export default router;
