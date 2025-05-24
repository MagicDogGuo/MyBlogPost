const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新 updatedAt
commentSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// 更新文章評論計數
commentSchema.post('save', async function() {
  const Post = mongoose.model('Post');
  const commentCount = await this.constructor.countDocuments({ 
    postId: this.postId,
    isPublic: true 
  });
  await Post.findByIdAndUpdate(this.postId, { commentCount });
});

// 刪除評論時更新文章評論計數
commentSchema.post('remove', async function() {
  const Post = mongoose.model('Post');
  const commentCount = await this.constructor.countDocuments({ 
    postId: this.postId,
    isPublic: true 
  });
  await Post.findByIdAndUpdate(this.postId, { commentCount });
});

module.exports = mongoose.model('Comment', commentSchema); 