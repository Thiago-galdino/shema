import { Router } from 'express';
import * as memberController from '../controllers/member.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { upload, validateFileContent } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createMemberSchema, updateMemberSchema } from '../validators/member.validator.js';

const router = Router();

router.use(protect);

router.get('/export', authorize('admin', 'lider'), memberController.exportCSV);
router.get('/', memberController.getAll);
router.get('/:id', memberController.getById);
router.post('/', authorize('admin', 'lider'), upload.single('photo'), validateFileContent, validate(createMemberSchema), memberController.create);
router.put('/:id', authorize('admin', 'lider'), upload.single('photo'), validateFileContent, validate(updateMemberSchema), memberController.update);
router.delete('/:id', authorize('admin'), memberController.remove);

export default router;
