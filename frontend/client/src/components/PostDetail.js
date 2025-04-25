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
  Tooltip
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
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.POSTS.DETAIL(id));
      setPost(response.data);
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

  const handleEditPost = () => {
    navigate(`/posts/edit/${id}`);
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
            sx={{ mb: 2 }}
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
                    <IconButton onClick={handleEditPost} color="primary">
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
    </div>
  );
};

export default PostDetail; 