const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 登入
router.post('/login', async (req, res) => {
  try {
    console.log('收到登入請求:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: '請提供電子郵件和密碼' });
    }

    console.log('正在查找用戶:', email);
    const user = await User.findOne({ email });
    console.log('找到用戶:', user ? '是' : '否');

    if (!user) {
      return res.status(400).json({ message: '用戶不存在' });
    }

    try {
      console.log('開始密碼比較...');
      const isMatch = await user.comparePassword(password);
      console.log('密碼比較完成，結果:', isMatch);
      
      if (!isMatch) {
        return res.status(400).json({ message: '密碼錯誤' });
      }
    } catch (bcryptError) {
      console.error('密碼比較錯誤:', bcryptError);
      return res.status(500).json({ message: '密碼驗證失敗', error: bcryptError.message });
    }

    console.log('生成 JWT token...');
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Token 生成成功');

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        donateuser: user.donateuser
      }
    });
  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).json({ message: '伺服器錯誤', error: error.message });
  }
});

// 註冊
router.post('/register', async (req, res) => {
  try {
    console.log('收到註冊請求:', req.body);
    
    const { username, email, password, confirmPassword } = req.body;
    
    // 驗證所有必要欄位
    if (!username || !email || !password) {
      return res.status(400).json({ message: '請提供所有必要資訊' });
    }

    // 驗證密碼長度
    if (password.length < 6) {
      return res.status(400).json({ message: '密碼長度必須至少為6個字符' });
    }

    // 驗證密碼確認
    if (password !== confirmPassword) {
      return res.status(400).json({ message: '密碼和確認密碼不匹配' });
    }

    // 驗證電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: '請提供有效的電子郵件地址' });
    }

    // 檢查用戶是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '此電子郵件已被註冊' });
    }

    // 創建新用戶
    const user = new User({
      username,
      email,
      password,
      role: 'user',
      donateuser: 'no'
    });

    console.log('正在保存用戶...');
    await user.save();
    console.log('用戶保存成功');

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: '註冊成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        donateuser: user.donateuser
      }
    });
  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({ message: '註冊失敗', error: error.message });
  }
});

// 獲取當前用戶信息
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '未授權' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: '用戶不存在' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      donateuser: user.donateuser
    });
  } catch (error) {
    console.error('獲取用戶信息錯誤:', error);
    res.status(401).json({ message: '未授權', error: error.message });
  }
});

module.exports = router; 