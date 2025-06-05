const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const subscriberRoutes = require('./routes/subscribers');
const aiImageRoutes = require('./routes/aiImageRoutes');
const initData = require('./scripts/initData');

dotenv.config();

const app = express();

// 連接 MongoDB 並初始化數據
console.log('Connecting to MongoDB...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connection successful');
    // 初始化數據
    console.log('Starting to initialize data...');
    await initData();
    console.log('Data initialization completed');
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// 中間件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/ai', aiImageRoutes);

// 錯誤處理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({ message: '找不到請求的資源' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`伺服器運行在端口 ${PORT}`);
});

module.exports = app; 