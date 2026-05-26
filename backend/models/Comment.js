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

// Update updatedAt
commentSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// Update post comment count
commentSchema.post('save', async function() {
  const Post = mongoose.model('Post');
  const commentCount = await this.constructor.countDocuments({ 
    postId: this.postId,
    isPublic: true 
  });
  await Post.findByIdAndUpdate(this.postId, { commentCount });
});

// Update post comment count when deleting comments
// Note: listen to findOneAndDelete instead of remove
commentSchema.post('findOneAndDelete', async function(doc) { 
  // doc is the deleted document
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
      // Even if this fails, deletion response should not be blocked; log the error
    }
  }
});

module.exports = mongoose.model('Comment', commentSchema); 