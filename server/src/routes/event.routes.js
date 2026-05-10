import { Router } from 'express';
import * as eventController from '../controllers/event.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createEventSchema, updateEventSchema } from '../validators/event.validator.js';

const router = Router();

router.use(protect);

router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);
router.post('/', authorize('admin', 'lider'), validate(createEventSchema), eventController.create);
router.put('/:id', authorize('admin', 'lider'), validate(updateEventSchema), eventController.update);
router.delete('/:id', authorize('admin'), eventController.remove);
router.post('/:id/checkin', eventController.checkIn);

export default router;
