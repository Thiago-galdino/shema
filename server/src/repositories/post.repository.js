import Post from '../models/Post.js';

export const findAll = (options = {}) => {
  const { page = 1, limit = 10 } = options;
  return Post.find({ isActive: true })
    .populate('author', 'name avatar role')
    .populate('comments.author', 'name avatar')
    .sort({ isPinned: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

export const findById = (id) =>
  Post.findOne({ _id: id, isActive: true })
    .populate('author', 'name avatar role')
    .populate('comments.author', 'name avatar')
    .populate('likes', 'name');

export const create = (data) => Post.create(data);

export const update = (id, data) => Post.findByIdAndUpdate(id, data, { new: true });

export const remove = (id) => Post.findByIdAndUpdate(id, { isActive: false }, { new: true });

export const toggleLike = async (id, userId) => {
  const post = await Post.findOne({ _id: id, isActive: true });
  const liked = post.likes.includes(userId);
  if (liked) {
    await Post.findByIdAndUpdate(id, { $pull: { likes: userId } });
  } else {
    await Post.findByIdAndUpdate(id, { $addToSet: { likes: userId } });
  }
  return { liked: !liked };
};

export const addComment = (id, comment) =>
  Post.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true })
    .populate('comments.author', 'name avatar');

export const countAll = () => Post.countDocuments({ isActive: true });
