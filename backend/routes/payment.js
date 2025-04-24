const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// 創建支付意向
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe 使用最小貨幣單位（例如：分）
      currency: 'twd',
      metadata: {
        userId: req.user.userId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('支付意向創建失敗:', error);
    res.status(500).json({ message: '支付意向創建失敗' });
  }
});

// 更新用戶捐款狀態
router.post('/update-status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { donateuser: status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: '用戶不存在' });
    }

    res.json({
      message: '狀態更新成功',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        donateuser: user.donateuser
      }
    });
  } catch (error) {
    console.error('更新用戶狀態失敗:', error);
    res.status(500).json({ message: '更新狀態失敗' });
  }
});

// Stripe webhook 處理
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      console.error('缺少 Stripe 簽名');
      return res.status(400).json({ message: '缺少 Stripe 簽名' });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('缺少 Stripe webhook 密鑰');
      return res.status(500).json({ message: '伺服器配置錯誤' });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // 處理支付成功事件
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata.userId;
      
      if (!userId) {
        console.error('支付意向中缺少用戶 ID');
        return res.status(400).json({ message: '支付意向中缺少用戶 ID' });
      }

      try {
        const user = await User.findByIdAndUpdate(
          userId,
          { donateuser: 'yes' },
          { new: true }
        );

        if (!user) {
          console.error(`找不到用戶: ${userId}`);
          return res.status(404).json({ message: '找不到用戶' });
        }

        console.log(`用戶 ${userId} 的支付成功，已更新捐款狀態`);
      } catch (error) {
        console.error('更新用戶捐款狀態失敗:', error);
        return res.status(500).json({ message: '更新用戶狀態失敗' });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook 錯誤:', error);
    res.status(400).json({ message: 'Webhook 錯誤' });
  }
});

module.exports = router;