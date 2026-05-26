const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Subscriber = require('../models/Subscriber');

// Subscribe to newsletter
router.post('/', async function(req, res) {
  try {
    const { email } = req.body;
    
    // Check whether already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return res.status(400).json({ message: 'This mailbox is subscribed' });
      } else {
        // Re-subscribe
        existingSubscriber.status = 'active';
        await existingSubscriber.save();
        return res.json({ message: 'Re-subscribed successfully' });
      }
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unsubscribe
router.put('/unsubscribe/:id', async function(req, res) {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    subscriber.status = 'unsubscribed';
    await subscriber.save();
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all subscribers (admin only)
router.get('/', auth, async function(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No permission to access this resource' });
    }

    const subscribers = await Subscriber.find()
      .sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update subscriber status (admin only)
router.put('/:id', auth, async function(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No permission to access this resource' });
    }

    const { status } = req.body;
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    subscriber.status = status;
    await subscriber.save();
    res.json(subscriber);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 