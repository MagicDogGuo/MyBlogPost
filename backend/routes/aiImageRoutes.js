const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data'); // For Imgur upload
const { auth } = require('../middleware/auth');

async function uploadToImgur(imageBuffer) {
  if (!process.env.IMGUR_CLIENT_ID) {
    console.warn('Imgur Client ID not found. Please set IMGUR_CLIENT_ID environment variable.');
    throw new Error('Imgur service is not configured (Client ID missing).');
  }

  const form = new FormData();
  form.append('image', imageBuffer, { filename: 'ai_generated_image.png', contentType: 'image/png' }); // Adjust filename/contentType if needed

  try {
    const imgurResponse = await axios.post('https://api.imgur.com/3/image', form, {
      headers: {
        ...form.getHeaders(), // Important for FormData
        'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      },
    });

    if (imgurResponse.data && imgurResponse.data.success && imgurResponse.data.data && imgurResponse.data.data.link) {
      return imgurResponse.data.data.link;
    } else {
      console.error('Failed to extract Imgur link from response:', imgurResponse.data);
      throw new Error('Failed to parse Imgur URL from API response.');
    }
  } catch (error) {
    console.error('Error uploading to Imgur:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    let errorMessage = 'Failed to upload image to Imgur.';
     if (error.response && error.response.data && error.response.data.data && typeof error.response.data.data.error === 'string') {
        errorMessage = error.response.data.data.error;
    } else if (error.response && error.response.data && error.response.data.error && typeof error.response.data.error.message === 'string') {
        errorMessage = error.response.data.error.message;
    }
    throw new Error(errorMessage);
  }
}

router.post('/generate-image', auth, async (req, res) => {
  const { prompt } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ message: 'OpenAI service is not configured (API key missing).' });
  }
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ message: 'A valid prompt is required.' });
  }

  try {
    // Step 1: Generate image using OpenAI
    const openaiResponse = await axios.post(
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

    const openaiImageUrl = openaiResponse.data && openaiResponse.data.data && openaiResponse.data.data[0] && openaiResponse.data.data[0].url;

    if (!openaiImageUrl) {
      console.error('Failed to extract image URL from OpenAI response:', openaiResponse.data);
      return res.status(500).json({ message: 'Failed to parse image URL from AI (OpenAI) response.' });
    }

    // Step 2: Download the image from OpenAI URL
    const imageDownloadResponse = await axios.get(openaiImageUrl, {
      responseType: 'arraybuffer' // Get image data as a buffer
    });
    const imageBuffer = Buffer.from(imageDownloadResponse.data, 'binary');

    // Step 3: Upload the image buffer to Imgur
    const imgurUrl = await uploadToImgur(imageBuffer);

    if (imgurUrl) {
      res.json({ imageUrl: imgurUrl }); // Return the final Imgur URL
    } else {
      // This case should ideally be handled by uploadToImgur throwing an error
      res.status(500).json({ message: 'Failed to get final Imgur URL after upload.' });
    }

  } catch (error) {
    // Log the specific error object if available, otherwise the message
    const detailedError = error.response ? JSON.stringify(error.response.data, null, 2) : error.message;
    console.error('Error in AI image generation pipeline:', detailedError, error.stack);
    
    // Prefer error message from caught error if it's meaningful, otherwise a generic one
    const message = (error instanceof Error && error.message) ? error.message : 'Failed to generate and upload image.';
    res.status(500).json({ message });
  }
});

module.exports = router; 