const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const { auth, isAdmin } = require('../middleware/auth');
const User = require('../models/User');

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
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 獲取單篇文章
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('likes.user', 'username');
    
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 創建文章
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '只有管理員可以發布文章' });
    }

    const { title, content, imageUrl, tags } = req.body;
    const post = new Post({
      title,
      content,
      author: req.user._id,
      imageUrl,
      tags: tags || []
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 更新文章
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '只有管理員可以修改文章' });
    }

    const { title, content, imageUrl, tags } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (imageUrl) post.imageUrl = imageUrl;
    if (tags) post.tags = tags;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 刪除文章
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '只有管理員可以刪除文章' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    await post.remove();
    res.json({ message: '文章已刪除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 收藏/取消收藏文章
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    const user = await User.findById(req.user._id);
    const favoriteIndex = user.favorites.indexOf(post._id);

    if (favoriteIndex === -1) {
      // 收藏文章
      user.favorites.push(post._id);
      await user.save();
      res.json({ message: '文章已收藏' });
    } else {
      // 取消收藏
      user.favorites.splice(favoriteIndex, 1);
      await user.save();
      res.json({ message: '已取消收藏' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 按讚/取消按讚
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex === -1) {
      // 按讚
      post.likes.push({ user: req.user._id });
      await post.save();
      res.json({ message: '已按讚' });
    } else {
      // 取消按讚
      post.likes.splice(likeIndex, 1);
      await post.save();
      res.json({ message: '已取消按讚' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 