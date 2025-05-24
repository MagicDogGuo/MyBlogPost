const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // 從請求頭獲取 token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: '請提供認證令牌' });
    }

    // 驗證 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 將用戶信息添加到請求對象
    req.user = {
      _id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      username: decoded.name
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: '認證失敗' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '需要管理員權限' });
  }
  next();
};

module.exports = { auth, isAdmin }; 