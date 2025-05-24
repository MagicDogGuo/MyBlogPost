import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CommentList.css';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const { user, token } = useAuth();

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/post/${postId}`);
      setComments(response.data);
    } catch (error) {
      setError('Failed to fetch comments');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Submit new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        '/api/comments',
        { postId, content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setComments([response.data, ...comments]);
      setNewComment('');
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post comment');
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(comments.filter(comment => comment._id !== commentId));
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {error && <div className="error-message">{error}</div>}
      
      {/* Comment input form */}
      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      )}

      {/* Comments list */}
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment._id} className="comment-item">
            <div className="comment-header">
              <span className="comment-author">{comment.user.username}</span>
              <span className="comment-date">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="comment-content">{comment.content}</div>
            {(user?._id === comment.user._id || user?.role === 'admin') && (
              <button
                onClick={() => handleDelete(comment._id)}
                className="delete-comment"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList; 