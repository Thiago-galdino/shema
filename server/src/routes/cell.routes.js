import { Router } from 'express';
import * as cellController from '../controllers/cell.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createCellSchema, updateCellSchema, frequencySchema } from '../validators/cell.validator.js';

const router = Router();

router.use(protect);

router.get('/', cellController.getAll);
router.get('/:id', cellController.getById);
router.post('/', authorize('admin', 'lider'), validate(createCellSchema), cellController.create);
router.put('/:id', authorize('admin', 'lider'), validate(updateCellSchema), cellController.update);
router.delete('/:id', authorize('admin'), cellController.remove);
router.post('/:id/frequency', authorize('admin', 'lider'), validate(frequencySchema), cellController.registerFrequency);
router.post('/:id/members', authorize('admin', 'lider'), cellController.addMember);
router.delete('/:id/members/:memberId', authorize('admin', 'lider'), cellController.removeMember);

export default router;
