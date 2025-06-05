const express = require('express');
const router = express.Router();
const axios = require('axios'); // Import axios
const { auth } = require('../middleware/auth');

// No longer need to initialize OpenAI client with the SDK if using axios directly

router.post('/generate-image', auth, async (req, res) => {
  const { prompt } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not found. Please set OPENAI_API_KEY environment variable.');
    return res.status(503).json({ message: 'OpenAI service is not configured (API key missing).' });
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ message: 'A valid prompt is required.' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: `${prompt}, pixel art style`,
        n: 1,
        size: '256x256',
        response_format: 'url',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // console.log('OpenAI Image Response:', JSON.stringify(response.data, null, 2));
    const imageUrl = response.data && response.data.data && response.data.data[0] && response.data.data[0].url;

    if (imageUrl) {
      res.json({ imageUrl });
    } else {
      console.error('Failed to extract image URL from OpenAI response:', response.data);
      res.status(500).json({ message: 'Failed to parse image URL from AI response.' });
    }
  } catch (error) {
    console.error('Error calling OpenAI Image API with axios:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    let errorMessage = 'Failed to generate image using AI.';
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
        errorMessage = error.response.data.error.message;
    }
    res.status(error.response?.status || 500).json({ message: errorMessage });
  }
});

module.exports = router; 