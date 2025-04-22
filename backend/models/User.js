const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 刪除現有的集合和索引
mongoose.connection.on('connected', async () => {
  try {
    await mongoose.connection.db.collection('users').drop();
  } catch (error) {
    // 如果集合不存在，忽略錯誤
    if (error.code !== 26) {
      console.error('刪除集合錯誤:', error);
    }
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  donateuser: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 密碼加密
userSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password')) {
      console.log('正在加密密碼...');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      console.log('密碼加密完成');
    }
    next();
  } catch (error) {
    console.error('密碼加密錯誤:', error);
    next(error);
  }
});

// 添加密碼比較方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('正在比較密碼...');
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('密碼比較結果:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('密碼比較錯誤:', error);
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema); 