require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');

// 預設管理員用戶
const defaultAdmin = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin',
  donateuser: 'yes',
  createdAt: new Date()
};

// 預設一般用戶
const defaultUser = {
  username: 'user',
  email: 'user@example.com',
  password: 'user123',
  role: 'user',
  donateuser: 'no',
  createdAt: new Date()
};

// 預設文章
const defaultPosts = [
  {
    title: "The Rise of Decentralized Finance",
    content: "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. By removing intermediaries like banks and brokers, DeFi empowers individuals to manage their own assets and participate directly in financial activities without relying on centralized authorities. One of the core innovations of DeFi is the use of smart contracts, which are self-executing agreements with the terms directly written into code. These smart contracts allow DeFi platforms to automate transactions, lending, borrowing, and trading without the need for a trusted third party. As a result, DeFi offers greater transparency, accessibility, and efficiency compared to traditional financial models. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading. Users can earn interest on their crypto assets, take out loans by providing collateral, or even participate in liquidity pools and decentralized exchanges. As DeFi continues to expand, it holds the potential to reshape the financial landscape, making financial services more inclusive and accessible to people around the world.",
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
    console.log('開始初始化數據...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    let adminUser;
    
    // 檢查是否已有管理員用戶
    console.log('檢查管理員用戶...');
    const existingAdmin = await User.findOne({ email: defaultAdmin.email });
    console.log('現有管理員用戶:', existingAdmin ? '存在' : '不存在');
    
    if (!existingAdmin) {
      console.log('創建新管理員用戶...');
      // 創建管理員用戶
      adminUser = new User({
        username: defaultAdmin.username,
        email: defaultAdmin.email,
        password: defaultAdmin.password,
        role: defaultAdmin.role,
        donateuser: defaultAdmin.donateuser,
        createdAt: defaultAdmin.createdAt
      });
      await adminUser.save();
      console.log('管理員用戶創建成功:', {
        id: adminUser._id,
        username: adminUser.username,
        role: adminUser.role,
        donateuser: adminUser.donateuser
      });
    } else {
      adminUser = existingAdmin;
      console.log('使用現有管理員用戶:', {
        id: adminUser._id,
        username: adminUser.username,
        role: adminUser.role
      });
    }

    // 檢查是否已有一般用戶
    console.log('檢查一般用戶...');
    const existingUser = await User.findOne({ email: defaultUser.email });
    console.log('現有一般用戶:', existingUser ? '存在' : '不存在');
    
    if (!existingUser) {
      console.log('創建新一般用戶...');
      // 創建一般用戶
      const normalUser = new User({
        username: defaultUser.username,
        email: defaultUser.email,
        password: defaultUser.password,
        role: defaultUser.role,
        donateuser: defaultUser.donateuser,
        createdAt: defaultUser.createdAt
      });
      await normalUser.save();
      console.log('一般用戶創建成功:', {
        id: normalUser._id,
        username: normalUser.username,
        role: normalUser.role,
        donateuser: normalUser.donateuser
      });
    } else {
      console.log('使用現有一般用戶:', {
        id: existingUser._id,
        username: existingUser.username,
        role: existingUser.role
      });
    }

    // 刪除所有現有文章並重新創建
    console.log('清理現有文章...');
    await Post.deleteMany({});
    console.log('現有文章已清理');

    // 創建新文章
    console.log('開始創建新文章...');
    for (const postData of defaultPosts) {
      const post = new Post({
        ...postData,
        author: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await post.save();
      
      // 驗證文章是否正確保存
      const savedPost = await Post.findById(post._id).populate('author');
      console.log('文章創建成功:', {
        id: savedPost._id,
        title: savedPost.title,
        authorId: savedPost.author._id,
        authorUsername: savedPost.author.username
      });
    }

    // 驗證所有文章的作者關聯
    console.log('驗證所有文章...');
    const allPosts = await Post.find().populate('author');
    console.log('所有文章驗證完成:', allPosts.map(post => ({
      id: post._id,
      title: post.title,
      authorId: post.author._id,
      authorUsername: post.author.username
    })));

    console.log('數據初始化完成');
  } catch (error) {
    console.error('初始化過程中出錯:', error);
    throw error;
  }
}

// 如果這個文件被直接運行（而不是被導入），則執行初始化
if (require.main === module) {
  // 如果是直接運行，需要先連接數據庫
  console.log('正在連接 MongoDB...');
  mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('MongoDB 連接成功');
      await initData();
      // 只有在直接運行時才斷開連接
      await mongoose.disconnect();
      console.log('MongoDB 連接已斷開');
    })
    .catch(error => {
      console.error('MongoDB 連接失敗:', error);
      process.exit(1);
    });
}

// 導出初始化函數，以便可以在 app.js 中使用
module.exports = initData; 