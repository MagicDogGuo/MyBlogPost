const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// 獲取文章的所有評論
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

// 創建新評論
router.post('/', auth, async function(req, res) {
  try {
    const { postId, content } = req.body;
    
    // 檢查文章是否存在
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
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

// 更新評論
router.put('/:id', auth, async function(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: '評論不存在' });
    }

    // 檢查權限
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '沒有權限修改此評論' });
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

// 刪除評論
router.delete('/:id', auth, async function(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: '評論不存在' });
    }

    // 檢查權限
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '沒有權限刪除此評論' });
    }

    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({ message: '評論不存在或已被刪除' });
    }
    
    res.json({ message: '評論已刪除' });
  } catch (error) {
    console.error('[BACKEND ERROR - Delete Comment Route] Error deleting comment:', error); 
    res.status(500).json({ message: error.message || '刪除評論時發生內部伺服器錯誤' });
  }
});

// 獲取用戶的所有評論
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