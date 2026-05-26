const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Get all comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      postId: req.params.postId,
      isPublic: true 
    })
    .populate('user', 'username _id')
    .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new comment
router.post('/', auth, async function(req, res) {
  try {
    const { postId, content } = req.body;
    
    // Check whether the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post does not exist' });
    }

    const comment = new Comment({
      postId,
      user: req.user._id,
      content,
      isPublic: true
    });

    await comment.save();
    // Populate the user field before sending the response
    const populatedComment = await Comment.findById(comment._id).populate('user', 'username _id');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update comment
router.put('/:id', auth, async function(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment does not exist' });
    }

    // Check permissions
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to edit this comment' });
    }

    const { content, isPublic } = req.body;
    if (content) comment.content = content;
    if (isPublic !== undefined && req.user.role === 'admin') {
      comment.isPublic = isPublic;
    }

    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete comment
router.delete('/:id', auth, async function(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment does not exist' });
    }

    // Check permissions
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to delete this comment' });
    }

    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment does not exist or has already been deleted' });
    }
    
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('[BACKEND ERROR - Delete Comment Route] Error deleting comment:', error); 
    res.status(500).json({ message: error.message || 'Internal server error while deleting comment' });
  }
});

// Get all comments by current user
router.get('/user', auth, async function(req, res) {
  try {
    const comments = await Comment.find({ user: req.user._id })
      .populate('postId', 'title')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 