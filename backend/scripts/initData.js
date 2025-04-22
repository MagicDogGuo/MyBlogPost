require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');

// 預設管理員用戶
const defaultAdmin = {
  name: 'admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

// 預設文章
const defaultPosts = [
  {
    title: "The Rise of Decentralized Finance",
    content: "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    tags: ["Blockchain", "Finance", "Technology"]
  },
  {
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content: "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    tags: ["AI", "Business", "Technology"]
  },
  {
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content: "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    tags: ["Environment", "Lifestyle", "Sustainability"]
  }
];

async function initData() {
  try {
    let adminUser;
    
    // 檢查是否已有管理員用戶
    const existingAdmin = await User.findOne({ email: defaultAdmin.email });
    if (!existingAdmin) {
      // 創建管理員用戶
      adminUser = new User({
        name: defaultAdmin.name,
        email: defaultAdmin.email,
        password: defaultAdmin.password,
        role: defaultAdmin.role
      });
      await adminUser.save();
      console.log('Created admin user');
    } else {
      adminUser = existingAdmin;
      console.log('Found existing admin user');
    }

    // 刪除所有現有文章並重新創建
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // 創建新文章
    for (const postData of defaultPosts) {
      const post = new Post({
        ...postData,
        author: adminUser._id
      });
      await post.save();
      
      // 驗證文章是否正確保存
      const savedPost = await Post.findById(post._id).populate('author');
      console.log('Created post:', {
        id: savedPost._id,
        title: savedPost.title,
        authorId: savedPost.author._id,
        authorName: savedPost.author.name
      });
    }

    // 驗證所有文章的作者關聯
    const allPosts = await Post.find().populate('author');
    console.log('Verification - All posts:', allPosts.map(post => ({
      id: post._id,
      title: post.title,
      authorId: post.author._id,
      authorName: post.author.name
    })));

    console.log('Initialization completed successfully');
  } catch (error) {
    console.error('Error during initialization:', error);
    throw error;
  }
}

// 如果這個文件被直接運行（而不是被導入），則執行初始化
if (require.main === module) {
  // 如果是直接運行，需要先連接數據庫
  mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB');
      await initData();
      // 只有在直接運行時才斷開連接
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

// 導出初始化函數，以便可以在 app.js 中使用
module.exports = initData; 