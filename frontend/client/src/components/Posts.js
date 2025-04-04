import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import PostList from './PostList';
import PostForm from './PostForm';
import axios from 'axios';
import './Posts.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      await axios.post('http://localhost:5000/api/posts', postData);
      fetchPosts();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdatePost = async (postData) => {
    try {
      await axios.put(`http://localhost:5000/api/posts/${editingPost.id}`, postData);
      fetchPosts();
      setIsFormOpen(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  return (
    <div className="posts-container">
      <div className="posts-content">
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Blog Posts
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsFormOpen(true)}
              sx={{ mb: 3 }}
            >
              New Post
            </Button>

            {isFormOpen && (
              <PostForm
                onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingPost(null);
                }}
                initialData={editingPost}
              />
            )}

            <PostList
              posts={posts}
              onDelete={handleDeletePost}
              onEdit={handleEditPost}
            />
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default Posts; 