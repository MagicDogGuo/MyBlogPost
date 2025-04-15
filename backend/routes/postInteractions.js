const express = require('express');
const router = express.Router();
const PostInteraction = require('../models/PostInteraction');
const auth = require('../middleware/auth');

// 獲取文章的互動數據
router.get('/:postId', async (req, res) => {
  try {
    const interaction = await PostInteraction.findOne({ postId: req.params.postId })
      .populate('likes', 'name')
      .populate('comments.userId', 'name');
    
    if (!interaction) {
      return res.status(404).json({ message: 'No interactions found for this post' });
    }
    
    res.json(interaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 添加/移除愛心
router.post('/:postId/like', auth, async (req, res) => {
  try {
    let interaction = await PostInteraction.findOne({ postId: req.params.postId });
    
    if (!interaction) {
      interaction = new PostInteraction({
        postId: req.params.postId,
        likes: [],
        comments: []
      });
    }
    
    const userId = req.user._id;
    const likeIndex = interaction.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      interaction.likes.push(userId);
    } else {
      interaction.likes.splice(likeIndex, 1);
    }
    
    await interaction.save();
    res.json(interaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 添加留言
router.post('/:postId/comment', auth, async (req, res) => {
  try {
    let interaction = await PostInteraction.findOne({ postId: req.params.postId });
    
    if (!interaction) {
      interaction = new PostInteraction({
        postId: req.params.postId,
        likes: [],
        comments: []
      });
    }
    
    interaction.comments.push({
      userId: req.user._id,
      content: req.body.content
    });
    
    await interaction.save();
    res.json(interaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 刪除留言
router.delete('/:postId/comment/:commentId', auth, async (req, res) => {
  try {
    const interaction = await PostInteraction.findOne({ postId: req.params.postId });
    
    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }
    
    const commentIndex = interaction.comments.findIndex(
      comment => comment._id.toString() === req.params.commentId
    );
    
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // 檢查是否是留言作者或管理員
    if (interaction.comments[commentIndex].userId.toString() !== req.user._id.toString() && 
        !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    interaction.comments.splice(commentIndex, 1);
    await interaction.save();
    res.json(interaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 