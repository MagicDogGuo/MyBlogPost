const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data'); // For Imgur upload
const { auth } = require('../middleware/auth');

// Define a custom error type for Imgur upload failures to identify them later
class ImgurUploadError extends Error {
  constructor(message) {
    super(message);
    this.name = "ImgurUploadError";
  }
}

async function uploadToImgur(imageBuffer) {
  if (!process.env.IMGUR_CLIENT_ID) {
    console.warn('Imgur Client ID not found. Please set IMGUR_CLIENT_ID environment variable.');
    // Throw specific error type
    throw new ImgurUploadError('Imgur service is not configured (Client ID missing).');
  }

  const form = new FormData();
  form.append('image', imageBuffer, { filename: 'ai_generated_image.png', contentType: 'image/png' });

  try {
    const imgurResponse = await axios.post('https://api.imgur.com/3/image', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      },
    });

    if (imgurResponse.data && imgurResponse.data.success && imgurResponse.data.data && imgurResponse.data.data.link) {
      return imgurResponse.data.data.link;
    } else {
      console.error('Failed to extract Imgur link from response:', imgurResponse.data);
      throw new ImgurUploadError('Failed to parse Imgur URL from API response.');
    }
  } catch (error) {
    console.error('Error uploading to Imgur:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    let errorMessage = 'Failed to upload image to Imgur.';
    if (error.response && error.response.data && error.response.data.data && typeof error.response.data.data.error === 'string') {
        errorMessage = error.response.data.data.error;
    } else if (error.response && error.response.data && error.response.data.error && typeof error.response.data.error.message === 'string') {
        errorMessage = error.response.data.error.message;
    } else if (error.message) {
        errorMessage = error.message; // Use original error message if more specific parsing fails
    }
    // Throw specific error type, possibly wrapping the original error message
    throw new ImgurUploadError(errorMessage);
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

  let openaiImageUrl = null;
  let imageBuffer = null;

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

    openaiImageUrl = openaiResponse.data && openaiResponse.data.data && openaiResponse.data.data[0] && openaiResponse.data.data[0].url;

    if (!openaiImageUrl) {
      console.error('Failed to extract image URL from OpenAI response:', openaiResponse.data);
      return res.status(500).json({ message: 'Failed to parse image URL from AI (OpenAI) response.' });
    }

    // Step 2: Download the image from OpenAI URL
    const imageDownloadResponse = await axios.get(openaiImageUrl, {
      responseType: 'arraybuffer' // Get image data as a buffer
    });
    imageBuffer = Buffer.from(imageDownloadResponse.data, 'binary');

  } catch (error) {
    const detailedError = error.response ? JSON.stringify(error.response.data, null, 2) : error.message;
    console.error('Error during OpenAI image generation or download:', detailedError, error.stack);
    const message = (error instanceof Error && error.message) ? error.message : 'Failed during OpenAI image generation or download.';
    return res.status(500).json({ message });
  }

  // If OpenAI steps were successful, imageBuffer and openaiImageUrl will be populated
  try {
    // Step 3: Upload the image buffer to Imgur
    const imgurUrl = await uploadToImgur(imageBuffer);
    // If uploadToImgur is successful, it returns the URL
    return res.json({ imageUrl: imgurUrl });

  } catch (imgurError) {
    // Check if the error is from Imgur upload (using our custom error type or by checking the message)
    if (imgurError instanceof ImgurUploadError || imgurError.message.includes('Imgur')) {
      console.warn('Imgur upload failed, returning OpenAI URL as fallback:', imgurError.message);
      return res.status(200).json({
        imageUrl: openaiImageUrl, // Fallback to OpenAI URL
        warning: `Image generated successfully, but failed to save to Imgur: ${imgurError.message}. Using temporary AI image URL. This URL may expire.`,
      });
    } else {
      // For any other unexpected errors after OpenAI success but not from Imgur
      const detailedError = imgurError.response ? JSON.stringify(imgurError.response.data, null, 2) : imgurError.message;
      console.error('Unexpected error after OpenAI success:', detailedError, imgurError.stack);
      const message = (imgurError instanceof Error && imgurError.message) ? imgurError.message : 'An unexpected error occurred after image generation.';
      return res.status(500).json({ message });
    }
  }
});

module.exports = router; 