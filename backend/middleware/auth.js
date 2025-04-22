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
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: '認證失敗' });
  }
};

// 檢查是否為管理員的中間件
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '需要管理員權限' });
  }
  next();
};

module.exports = { auth, isAdmin }; 