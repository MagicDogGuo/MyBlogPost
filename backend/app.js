const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const initData = require('./scripts/initData');

dotenv.config();

const app = express();

// 連接 MongoDB 並初始化數據
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB 連接成功');
    // 初始化數據
    await initData();
  })
  .catch(err => console.error('MongoDB 連接失敗:', err));

// 中間件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '伺服器錯誤' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`伺服器運行在端口 ${PORT}`);
}); 