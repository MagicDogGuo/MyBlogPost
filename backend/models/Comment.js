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
// 修改：監聽 findOneAndDelete 而不是 remove
commentSchema.post('findOneAndDelete', async function(doc) { 
  // doc 是被刪除的文檔
  if (doc) {
    const Post = mongoose.model('Post');
    try {
      const commentCount = await mongoose.model('Comment').countDocuments({ 
        postId: doc.postId,
        isPublic: true 
      });
      await Post.findByIdAndUpdate(doc.postId, { commentCount });
      console.log(`[Comment Model Hook] Updated comment count for post ${doc.postId} to ${commentCount} after comment deletion.`);
    } catch (error) {
      console.error(`[Comment Model Hook] Error updating comment count for post ${doc.postId} after deletion:`, error);
      // 即使這裡出錯，也不應阻止刪除操作的響應，但需要記錄錯誤
    }
  }
});

module.exports = mongoose.model('Comment', commentSchema); 