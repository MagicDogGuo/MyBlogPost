const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // 認證相關
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`
  },
  
  // 文章相關
  POSTS: {
    LIST: `${API_BASE_URL}/posts`,
    DETAIL: (id) => `${API_BASE_URL}/posts/${id}`,
    CREATE: `${API_BASE_URL}/posts`,
    UPDATE: (id) => `${API_BASE_URL}/posts/${id}`,
    DELETE: (id) => `${API_BASE_URL}/posts/${id}`
  },
  
  // 互動相關
  INTERACTIONS: {
    GET: (postId) => `${API_BASE_URL}/interactions/${postId}`,
    LIKE: (postId) => `${API_BASE_URL}/interactions/${postId}/like`,
    COMMENT: (postId) => `${API_BASE_URL}/interactions/${postId}/comment`,
    DELETE_COMMENT: (postId, commentId) => 
      `${API_BASE_URL}/interactions/${postId}/comment/${commentId}`
  }
}; 