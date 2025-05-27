import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CommentList.css';
import { API_ENDPOINTS } from '../config/api';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const { user, token } = useAuth();

  // Fetch comments
  const fetchComments = async () => {
    try {
      console.log(`[CommentList Diagnostics] Fetching comments for postId: ${postId}`);
      const response = await axios.get(API_ENDPOINTS.COMMENTS.LIST(postId));
      console.log('[CommentList Diagnostics] Fetched comments data from backend:', JSON.stringify(response.data));
      setComments(response.data);
    } catch (error) {
      console.error('[CommentList Diagnostics] Error fetching comments:', error.response || error);
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

    console.log('[CommentList Diagnostics] handleSubmit called.');
    console.log('[CommentList Diagnostics] Current user:', JSON.stringify(user));
    console.log('[CommentList Diagnostics] Token being sent:', token); // Log the token

    if (!token) {
      console.error('[CommentList Diagnostics] No token available. Cannot submit comment.');
      setError('You must be logged in to comment.'); // Inform user
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.COMMENTS.CREATE,
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
      await axios.delete(API_ENDPOINTS.COMMENTS.DELETE(commentId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(comments.filter(comment => comment._id !== commentId));
      setError('');
    } catch (error) {
      console.error('[CommentList Diagnostics] Error deleting comment:', error.response || error);
      let errorMessage = 'Failed to delete comment.';
      if (error.response) {
        // 後端返回了響應
        errorMessage = error.response.data?.message || `Server responded with status ${error.response.status}.`;
        console.error('[CommentList Diagnostics] Backend error data:', error.response.data);
      } else if (error.request) {
        // 請求已發出，但沒有收到響應
        errorMessage = 'No response from server. Please check your network connection.';
        console.error('[CommentList Diagnostics] No response received:', error.request);
      } else {
        // 設置請求時觸發了錯誤
        errorMessage = `Error setting up request: ${error.message}`;
        console.error('[CommentList Diagnostics] Error setting up request:', error.message);
      }
      setError(errorMessage);
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
          <button type="submit" color="primary">Post Comment</button>
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