require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// 預設管理員用戶
const defaultAdmin = {
  username: 'Sam',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin',
  donateuser: 'yes',
  createdAt: new Date()
};

// 預設一般用戶
const defaultUser = {
  username: 'John Chen',
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
    tags: ["Blockchain", "Finance", "Technology"],
    imageUrl: "https://i.imgur.com/B5fQSBP.png"
  },
  {
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content: "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    tags: ["AI", "Business", "Technology"],
    imageUrl: "https://imgur.com/2yCyCSE.png"
  },
  {
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content: "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    tags: ["Environment", "Lifestyle", "Sustainability"],
    imageUrl: "https://imgur.com/X2xtDQn.png"
  },
  {
    title: "Exploring the Wonders of Deep Sea",
    content: "The deep sea is the lowest layer in the ocean, existing below the thermocline and above the seabed, at a depth of 1000 fathoms or more. Little or no light penetrates this part of the ocean and most of the organisms that live there rely on falling organic matter produced in the photic zone.",
    tags: ["Oceanography", "Marine Biology", "Exploration"],
    imageUrl: "https://imgur.com/1alsdgt.png"
  },
  {
    title: "The Future of Remote Work",
    content: "Remote work has seen a significant surge in recent years, accelerated by global events. This shift is reshaping how companies operate and how employees balance work and life. What does the future hold for remote work? This article explores the trends, benefits, and challenges.",
    tags: ["Work", "Future", "Technology", "Lifestyle"],
    imageUrl: "https://imgur.com/SngIAJi.png"
  },
  {
    title: "Understanding Quantum Computing",
    content: "Quantum computing is a new kind of computing that uses the principles of quantum mechanics to solve complex problems that are beyond the capabilities of classical computers. It has the potential to revolutionize fields like medicine, materials science, and artificial intelligence.",
    tags: ["Quantum Computing", "Technology", "Science"],
    imageUrl: "https://imgur.com/mSZb2OK.png"
  },
  {
    title: "A Guide to Mindful Meditation",
    content: "Mindful meditation is a practice that helps you focus on the present moment, reducing stress and improving overall well-being. This guide provides simple steps to start your meditation journey and experience its benefits.",
    tags: ["Mindfulness", "Meditation", "Health", "Lifestyle"],
    imageUrl: "https://imgur.com/FPMxCBN.png"
  },
  {
    title: "The Art of Storytelling in Marketing",
    content: "Storytelling is a powerful tool in marketing. It helps create an emotional connection with the audience, making brands more memorable and relatable. Learn how to craft compelling narratives that resonate with your customers.",
    tags: ["Marketing", "Business", "Storytelling"],
    imageUrl: "https://imgur.com/FAWfMWl.png"
  },
  {
    title: "Renewable Energy Sources: A Comprehensive Overview",
    content: "Renewable energy sources like solar, wind, and hydro are crucial for a sustainable future. This article provides a comprehensive overview of different types of renewable energy, their advantages, and their role in combating climate change.",
    tags: ["Renewable Energy", "Environment", "Sustainability", "Technology"],
    imageUrl: "https://imgur.com/siVcbbW.png"
  },
  {
    title: "Beginner's Guide to Learning Python",
    content: "Python is a versatile and widely-used programming language, known for its readability and extensive libraries. This beginner's guide will help you get started with Python, covering the basics and pointing you to further resources.",
    tags: ["Programming", "Python", "Technology", "Education"],
    imageUrl: "https://imgur.com/P10XHAt.png"
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
      if (adminUser.username !== defaultAdmin.username) {
        console.log(`更新現有管理員 ${adminUser.username} 的用戶名為 ${defaultAdmin.username}...`);
        adminUser.username = defaultAdmin.username;
        await adminUser.save();
        console.log('管理員用戶名更新成功。');
      }
      console.log('使用現有管理員用戶:', {
        id: adminUser._id,
        username: adminUser.username,
        role: adminUser.role
      });
    }

    // 創建或獲取一般用戶 (留言者)
    let commentingUser;
    console.log('檢查一般用戶 (留言者)...');
    const existingCommentingUser = await User.findOne({ email: defaultUser.email });
    if (!existingCommentingUser) {
      console.log('創建新一般用戶 (留言者)...');
      commentingUser = new User({
        username: defaultUser.username,
        email: defaultUser.email,
        password: defaultUser.password, // 密碼會自動哈希
        role: defaultUser.role,
        donateuser: defaultUser.donateuser,
        createdAt: defaultUser.createdAt
      });
      await commentingUser.save();
      console.log('一般用戶 (留言者) 創建成功:', { id: commentingUser._id, username: commentingUser.username });
    } else {
      commentingUser = existingCommentingUser;
      console.log('使用現有一般用戶 (留言者):', { id: commentingUser._id, username: commentingUser.username });
    }

    // 刪除所有現有文章並重新創建
    console.log('清理現有文章...');
    await Post.deleteMany({});
    console.log('現有文章已清理');

    // 創建新文章
    console.log('開始創建新文章...');
    const createdPosts = []; // 用於存儲已創建的文章
    for (const postData of defaultPosts) {
      const post = new Post({
        ...postData,
        author: adminUser._id, // 所有文章由管理員創建
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await post.save();
      createdPosts.push(post); // 將創建的文章添加到列表中
      console.log(`文章創建成功: ${post.title} (ID: ${post._id})`);
    }
    console.log(`${createdPosts.length} 篇文章創建完畢。`);

    // 清理現有評論 (可選，但為了保持初始化的一致性推薦添加)
    console.log('清理現有評論...');
    await Comment.deleteMany({});
    console.log('現有評論已清理');

    // 為隨機5篇文章添加評論 (如果文章和用戶存在)
    if (commentingUser && createdPosts.length > 0) {
      console.log(`開始為 ${commentingUser.username} 添加評論...`);
      const postsToCommentOn = [...createdPosts].sort(() => 0.5 - Math.random()).slice(0, 5);
      let commentsAddedCount = 0;

      if (postsToCommentOn.length > 0) {
        for (const post of postsToCommentOn) {
          const sampleComments = [
            "Great article, very insightful!",
            "Thanks for sharing this.",
            "I have a question about this part...",
            "Really enjoyed reading this post.",
            "This is exactly what I was looking for.",
            "Could you elaborate more on the first point?",
            "Helpful information, thank you!",
            "Well written and easy to understand.",
            "Looking forward to more content like this.",
            "I agree with most of your points."
          ];
          const randomCommentContent = sampleComments[Math.floor(Math.random() * sampleComments.length)];
          
          const newComment = new Comment({
            postId: post._id,
            user: commentingUser._id,
            content: randomCommentContent,
            isPublic: true, // 確保評論公開
            createdAt: new Date()
          });
          await newComment.save();
          commentsAddedCount++;
          console.log(`為文章 "${post.title}" 添加了評論: "${randomCommentContent}"`);
        }
        console.log(`${commentingUser.username} 成功添加了 ${commentsAddedCount} 條評論。`);
      } else {
        console.log('沒有足夠的文章來添加評論。');
      }
    } else {
      if (!commentingUser) console.log('留言用戶不存在，跳過添加評論。');
      if (createdPosts.length === 0) console.log('沒有文章可供評論，跳過添加評論。');
    }

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