import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true },
  mediaUrl: { type: String, default: null },
  mediaType: { type: String, enum: ['image', 'video', null], default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  isPinned: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

postSchema.index({ isPinned: -1, createdAt: -1 });

export default mongoose.model('Post', postSchema);
