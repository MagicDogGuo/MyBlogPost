import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Typography,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthContext';

const PostForm = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    imageUrl: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);
  const [aiImageError, setAiImageError] = useState('');
  const [aiGeneratedPreviewUrl, setAiGeneratedPreviewUrl] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          content: initialData.content || '',
          tags: initialData.tags || [],
          imageUrl: initialData.imageUrl || ''
        });
        setAiGeneratedPreviewUrl(initialData.imageUrl || '');
      } else {
        setFormData({
          title: '',
          content: '',
          tags: [],
          imageUrl: ''
        });
        setAiGeneratedPreviewUrl('');
      }
      setTagInput('');
      setAiImageError('');
      setIsGeneratingAiImage(false);
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...new Set([...prev.tags, tagInput.trim()])]
      }));
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  const handleGenerateAiImage = async () => {
    if (!formData.title.trim()) {
      setAiImageError('Please enter a title to generate an image.');
      return;
    }
    setAiImageError('');
    setIsGeneratingAiImage(true);
    setAiGeneratedPreviewUrl('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));

    try {
      const response = await axios.post(
        API_ENDPOINTS.AI.GENERATE_IMAGE, 
        { prompt: formData.title },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const imageUrlFromApi = response.data.imageUrl;

      if (imageUrlFromApi) {
        setFormData(prev => ({ ...prev, imageUrl: imageUrlFromApi }));
        setAiGeneratedPreviewUrl(imageUrlFromApi);
      } else {
        throw new Error('Image URL not found in AI response.');
      }

    } catch (error) {
      console.error('Error generating AI image via backend:', error);
      setAiImageError(error.response?.data?.message || error.message || 'Failed to generate image.');
    } finally {
      setIsGeneratingAiImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Post' : 'New Post'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            multiline
            rows={4}
            fullWidth
          />
          
          <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>Generate Post Image (Optional)</Typography>
            <Button
              onClick={handleGenerateAiImage}
              variant="outlined"
              disabled={isGeneratingAiImage || !formData.title.trim()}
              fullWidth
              startIcon={isGeneratingAiImage ? <CircularProgress size={20} /> : null}
              sx={{ mb: aiImageError || aiGeneratedPreviewUrl ? 1 : 0 }}
            >
              {isGeneratingAiImage ? 'Generating Image...' : 'Generate Image with AI from Title'}
            </Button>
            {aiImageError && <Typography color="error" sx={{ mt: 1 }}>{aiImageError}</Typography>}
            {aiGeneratedPreviewUrl && (
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="caption">Image Preview:</Typography>
                <img src={aiGeneratedPreviewUrl} alt="Post preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '8px', border: '1px solid #eee' }} />
              </Box>
            )}
          </Box>

          <TextField
            label="Add Tags (Optional)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleAddTag}
            placeholder="Press Enter to add a tag"
            fullWidth
          />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {formData.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                color="primary"
                sx={{ margin: '4px' }}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Publish'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PostForm; 