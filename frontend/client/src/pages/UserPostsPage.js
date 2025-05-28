import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  CircularProgress,
  Box,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api'; // 假設 API 端點在此配置

const UserPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!token) {
        setError('Please log in to manage your posts.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // 假設 API_ENDPOINTS.POSTS.MY_POSTS 是獲取使用者文章的端點
        const response = await axios.get(API_ENDPOINTS.POSTS.MY_POSTS, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPosts(response.data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch user posts:', err);
        setError(err.response?.data?.message || 'Could not load your posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [token]);

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      // 假設 API_ENDPOINTS.POSTS.DELETE(postId) 是刪除文章的端點
      await axios.delete(API_ENDPOINTS.POSTS.DELETE(postToDelete), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPosts(posts.filter(post => post._id !== postToDelete));
      setPostToDelete(null);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError(err.response?.data?.message || 'Could not delete the post. Please try again.');
      setPostToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setPostToDelete(null);
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading your posts...</Typography>
      </Container>
    );
  }

  if (error && !posts.length) { // 只在沒有文章可顯示時，才將錯誤訊息填滿整個頁面
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Posts
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} 

      {posts.length === 0 && !loading && !error && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">You haven't created any posts yet.</Typography>
          <Typography color="text.secondary">
            Click "Create New Post" to start sharing your thoughts!
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item key={post._id} xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                {/* 可以選擇性顯示作者，但在此頁面通常是目前使用者
                <Typography color="text.secondary" gutterBottom>
                  Author: {post.author?.username || user?.username || 'You'}
                </Typography>
                */}
                <Typography variant="body2" color="text.secondary" paragraph sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  minHeight: '3.6em' 
                }}>
                  {post.content} 
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button 
                  component={RouterLink} 
                  to={`/posts/${post._id}`} 
                  size="small"
                >
                  View
                </Button>
                <Box>
                
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteClick(post._id)}
                    aria-label="delete post"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserPostsPage; 