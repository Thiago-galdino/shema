import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.use(protect);

router.get('/', postController.getFeed);
router.get('/:id', postController.getById);
router.post('/', upload.single('media'), postController.create);
router.put('/:id', postController.update);
router.delete('/:id', authorize('admin', 'lider'), postController.remove);
router.post('/:id/like', postController.toggleLike);
router.post('/:id/comments', postController.addComment);

export default router;
