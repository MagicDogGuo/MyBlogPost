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
    // 連接 MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 清空現有數據
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // 創建管理員用戶
    const admin = new User({
      name: defaultAdmin.name,
      email: defaultAdmin.email,
      password: defaultAdmin.password,
      role: defaultAdmin.role
    });
    await admin.save();
    console.log('Created admin user');

    // 創建文章
    for (const postData of defaultPosts) {
      const post = new Post({
        ...postData,
        author: admin._id
      });
      await post.save();
    }
    console.log('Created default posts');

    console.log('Initialization completed successfully');
  } catch (error) {
    console.error('Error during initialization:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initData(); 