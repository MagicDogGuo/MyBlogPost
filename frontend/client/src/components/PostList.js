import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Box,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import axios from 'axios';

const PostList = ({ posts, onDelete, onEdit }) => {
  const [interactions, setInteractions] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    // 獲取每篇文章的互動數據
    posts.forEach(post => {
      fetchInteractions(post.id);
    });
  }, [posts]);

  const fetchInteractions = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/interactions/${postId}`);
      setInteractions(prev => ({
        ...prev,
        [postId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching interactions:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/interactions/${postId}/like`);
      setInteractions(prev => ({
        ...prev,
        [postId]: response.data
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment[postId]?.trim()) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/interactions/${postId}/comment`, {
        content: newComment[postId]
      });
      setInteractions(prev => ({
        ...prev,
        [postId]: response.data
      }));
      setNewComment(prev => ({
        ...prev,
        [postId]: ''
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <Box>
      {posts.map((post) => (
        <Card key={post.id} sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              {post.title}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Author: {post.names}
            </Typography>
            <Typography variant="body2" component="p" sx={{ mt: 2 }}>
              {post.contentTexts}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
              Published: {new Date(post.date).toLocaleDateString()}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  onClick={() => handleLike(post.id)}
                  color={interactions[post.id]?.likes?.includes(localStorage.getItem('userId')) ? 'error' : 'default'}
                >
                  {interactions[post.id]?.likes?.includes(localStorage.getItem('userId')) ? 
                    <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton onClick={() => toggleComments(post.id)}>
                  <CommentIcon />
                </IconButton>
              </Box>
              <Box>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => onEdit(post)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => onDelete(post.id)}
                >
                  Delete
                </Button>
              </Box>
            </Box>

            {showComments[post.id] && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  comments ({interactions[post.id]?.comments?.length || 0})
                </Typography>
                <List>
                  {(interactions[post.id]?.comments || []).map((comment, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText 
                          primary={comment.content}
                          secondary={`${comment.userId.name} - ${new Date(comment.createdAt).toLocaleString()}`}
                        />
                      </ListItem>
                      {index < (interactions[post.id]?.comments?.length - 1) && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Add a comment..."
                    value={newComment[post.id] || ''}
                    onChange={(e) => setNewComment(prev => ({
                      ...prev,
                      [post.id]: e.target.value
                    }))}
                  />
                  <Button 
                    variant="contained" 
                    onClick={() => handleAddComment(post.id)}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default PostList; 