import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthContext';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.POSTS.DETAIL(id));
      setPost(response.data);
      setEditForm({
        title: response.data.title,
        content: response.data.content,
        tags: response.data.tags || []
      });
      setLoading(false);
    } catch (error) {
      setError('Failed to load post');
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          API_ENDPOINTS.POSTS.DELETE(id),
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        navigate('/posts');
      } catch (error) {
        setError('Failed to delete post');
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setEditForm({
      title: post.title,
      content: post.content,
      tags: post.tags || []
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setEditForm(prev => ({
        ...prev,
        tags: [...new Set([...prev.tags, tagInput.trim()])]
      }));
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        API_ENDPOINTS.POSTS.UPDATE(id),
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      await fetchPost();
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update post');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="post-detail">
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/posts')}
            className="back-button"
          >
            Back to Posts
          </Button>
          
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {post.title}
              </Typography>
              {isAdmin && (
                <Box>
                  <Tooltip title="Edit Post">
                    <IconButton onClick={handleEditClick} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Post">
                    <IconButton onClick={handleDeletePost} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            <Typography color="textSecondary" gutterBottom>
              Author: {post.author?.username || 'Unknown'}
            </Typography>
            
            <Typography color="textSecondary" sx={{ mb: 2 }}>
              Published: {new Date(post.createdAt).toLocaleString()}
            </Typography>

            {post.tags && post.tags.length > 0 && (
              <Box sx={{ mb: 3 }}>
                {post.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            )}

            <Typography variant="body1" component="div" sx={{ mb: 4 }}>
              {post.content}
            </Typography>
          </Paper>
        </Box>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              required
              fullWidth
            />
            <TextField
              label="Content"
              name="content"
              value={editForm.content}
              onChange={handleEditChange}
              required
              multiline
              rows={6}
              fullWidth
            />
            <TextField
              label="Add Tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleAddTag}
              placeholder="Press Enter to add a tag"
              fullWidth
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {editForm.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="primary"
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PostDetail; 