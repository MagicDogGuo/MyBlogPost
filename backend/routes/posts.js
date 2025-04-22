const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// 驗證中間件
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '未授權' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: '未授權' });
  }
};

// 獲取所有文章
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: '獲取文章失敗', error: error.message });
  }
});

// 獲取單篇文章
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('comments.user', 'name');
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '獲取文章失敗', error: error.message });
  }
});

// 創建文章
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const post = new Post({
      title,
      content,
      author: req.user.userId,
      tags: tags || []
    });
    await post.save();
    
    // 填充作者信息後返回
    await post.populate('author', 'name email');
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: '創建文章失敗', error: error.message });
  }
});

// 更新文章
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '無權修改此文章' });
    }
    
    post.title = title;
    post.content = content;
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '更新文章失敗', error: error.message });
  }
});

// 刪除文章
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '無權刪除此文章' });
    }
    
    await post.remove();
    res.json({ message: '文章已刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除文章失敗', error: error.message });
  }
});

// 文章互動
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    // 檢查是否已經點讚
    const likeIndex = post.likes.findIndex(like => like.user.toString() === req.user.id);
    
    if (likeIndex === -1) {
      // 添加點讚
      post.likes.push({ user: req.user.id });
    } else {
      // 取消點讚
      post.likes.splice(likeIndex, 1);
    }
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '操作失敗', error: error.message });
  }
});

// 添加評論
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    post.comments.push({
      user: req.user.id,
      content,
      authorName: req.user.name
    });
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '添加評論失敗', error: error.message });
  }
});

// 刪除評論
router.delete('/:postId/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    const comment = post.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: '評論不存在' });
    }
    
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '無權刪除此評論' });
    }
    
    comment.remove();
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '刪除評論失敗', error: error.message });
  }
});

module.exports = router; 