import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import PostList from './PostList';
import PostForm from './PostForm';
import axios from 'axios';
import './Posts.css';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Add as AddIcon
} from '@mui/icons-material';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [comment, setComment] = useState('');
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.POSTS.LIST);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_ENDPOINTS.POSTS.CREATE, postData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchPosts();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdatePost = async (postData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        API_ENDPOINTS.POSTS.UPDATE(editingPost._id), 
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchPosts();
      setOpenDialog(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (id) => {
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
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setOpenDialog(true);
  };

  return (
    <div className="posts-container">
      <div className="posts-content">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>

          {isAdmin && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              New Post
            </Button>
          )}
        </Box>
        <PostList
          posts={posts}
          onDelete={handleDeletePost}
          onEdit={handleEditPost}
        />
        {isAdmin && (
          <PostForm
            open={openDialog}
            onClose={() => {
              setOpenDialog(false);
              setEditingPost(null);
            }}
            onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
            initialData={editingPost}
          />
        )}
      </div>
    </div>
  );
}

export default Posts; 