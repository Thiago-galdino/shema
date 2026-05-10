import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { upload, validateFileContent } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createPostSchema, updatePostSchema, commentSchema } from '../validators/post.validator.js';

const router = Router();

router.use(protect);

router.get('/', postController.getFeed);
router.get('/:id', postController.getById);
router.post('/', upload.single('media'), validateFileContent, validate(createPostSchema), postController.create);
router.put('/:id', validate(updatePostSchema), postController.update);
router.delete('/:id', authorize('admin', 'lider'), postController.remove);
router.post('/:id/like', postController.toggleLike);
router.post('/:id/comments', validate(commentSchema), postController.addComment);

export default router;
