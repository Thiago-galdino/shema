import * as postService from '../services/post.service.js';

export const getFeed = async (req, res) => {
  const posts = await postService.getFeed(req.query);
  res.json({ success: true, posts });
};

export const getById = async (req, res) => {
  const post = await postService.getById(req.params.id);
  res.json({ success: true, post });
};

export const create = async (req, res) => {
  const post = await postService.create(req.body, req.user._id, req.file);
  res.status(201).json({ success: true, post });
};

export const update = async (req, res) => {
  const post = await postService.update(req.params.id, req.body, req.user._id);
  res.json({ success: true, post });
};

export const remove = async (req, res) => {
  await postService.remove(req.params.id);
  res.json({ success: true, message: 'Post removido com sucesso.' });
};

export const toggleLike = async (req, res) => {
  const result = await postService.toggleLike(req.params.id, req.user._id);
  res.json({ success: true, ...result });
};

export const addComment = async (req, res) => {
  const post = await postService.addComment(req.params.id, req.user._id, req.body.text);
  res.status(201).json({ success: true, post });
};
