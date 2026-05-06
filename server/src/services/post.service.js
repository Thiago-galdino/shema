import * as postRepo from '../repositories/post.repository.js';

export const getFeed = (query) => {
  const { page = 1, limit = 10 } = query;
  return postRepo.findAll({ page: +page, limit: +limit });
};

export const getById = async (id) => {
  const post = await postRepo.findById(id);
  if (!post) { const err = new Error('Post não encontrado.'); err.statusCode = 404; throw err; }
  return post;
};

export const create = async (data, userId, file) => {
  const postData = { ...data, author: userId };
  if (file) {
    postData.mediaUrl = `/uploads/${file.filename}`;
    postData.mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';
  }
  return postRepo.create(postData);
};

export const update = async (id, data, userId) => {
  const post = await postRepo.findById(id);
  if (!post) { const err = new Error('Post não encontrado.'); err.statusCode = 404; throw err; }
  if (post.author._id.toString() !== userId.toString()) {
    const err = new Error('Não autorizado.'); err.statusCode = 403; throw err;
  }
  return postRepo.update(id, data);
};

export const remove = async (id) => {
  const post = await postRepo.remove(id);
  if (!post) { const err = new Error('Post não encontrado.'); err.statusCode = 404; throw err; }
  return post;
};

export const toggleLike = (id, userId) => postRepo.toggleLike(id, userId);

export const addComment = (id, userId, text) =>
  postRepo.addComment(id, { author: userId, text });
