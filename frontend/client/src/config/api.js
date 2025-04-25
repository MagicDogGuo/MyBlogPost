const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Authentication related
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`
  },
  
  // Posts related
  POSTS: {
    LIST: `${API_BASE_URL}/posts`,
    DETAIL: (id) => `${API_BASE_URL}/posts/${id}`,
    CREATE: `${API_BASE_URL}/posts`,
    UPDATE: (id) => `${API_BASE_URL}/posts/${id}`,
    DELETE: (id) => `${API_BASE_URL}/posts/${id}`,
    LIKE: (id) => `${API_BASE_URL}/posts/${id}/like`,
    COMMENT: (id) => `${API_BASE_URL}/posts/${id}/comments`,
    DELETE_COMMENT: (postId, commentId) => 
      `${API_BASE_URL}/posts/${postId}/comments/${commentId}`
  },

  // Payment related
  PAYMENT: {
    CREATE_INTENT: `${API_BASE_URL}/payment/create-payment-intent`,
    UPDATE_STATUS: `${API_BASE_URL}/payment/update-status`
  }
}; 