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

// GET 獲取當前用戶點讚 (收藏) 的所有帖子
router.get('/me/favorites', auth, async (req, res) => {
  try {
    // req.user._id 應該由 auth 中間件從 token 解析後設置
    const userId = req.user._id; 

    if (!userId) {
      return res.status(401).json({ message: 'User not authorized or user ID is invalid' });
    }

    // 查找所有 likes 數組中其 'user' 字段等於 userId 的帖子
    const favoritePosts = await Post.find({ 'likes.user': userId })
                                    .populate('author', 'username email') // 填充作者的用戶名和郵箱
                                    .sort({ createdAt: -1 });     // 按創建時間降序排列

    res.json(favoritePosts);
  } catch (error) {
    console.error('Error fetching favorite posts:', error);
    res.status(500).json({ message: 'Failed to fetch favorite posts. Please try again later.' });
  }
});

// 新增：根據標籤名稱獲取文章
router.get('/tag/:tagName', async (req, res) => {
  try {
    const tagName = req.params.tagName;
    // 查找 tags 數組中包含 tagName 的文章
    // 假設 tagName 在數據庫中存儲時與傳入的大小寫一致
    const posts = await Post.find({ tags: tagName })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      // 雖然找不到文章不算嚴格意義上的錯誤，但可以返回空數組或特定消息
      // return res.status(404).json({ message: `No posts found with tag: ${tagName}` });
      return res.json([]); // 直接返回空數組更常見
    }

    res.json(posts);
  } catch (error) {
    console.error(`Error fetching posts by tag ${req.params.tagName}:`, error);
    res.status(500).json({ message: 'Failed to fetch posts by tag. Please try again later.' });
  }
});

// 新增：獲取所有唯一的標籤
router.get('/tags/unique', async (req, res) => {
  try {
    const uniqueTags = await Post.distinct('tags');
    // distinct() 返回一個包含所有不重複標籤的數組
    // 例如: ["Tech", "Health", "AI", "Science"]
    res.json(uniqueTags.sort()); // 按字母順序排序返回
  } catch (error) {
    console.error('Error fetching unique tags:', error);
    res.status(500).json({ message: 'Failed to fetch unique tags. Please try again later.' });
  }
});

module.exports = router; 