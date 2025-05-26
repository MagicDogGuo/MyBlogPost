const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Authentication related
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
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
    FAVORITE: (id) => `${API_BASE_URL}/posts/${id}/favorite`,
    MY_FAVORITES: `${API_BASE_URL}/posts/me/favorites`
  },

  // Comments related
  COMMENTS: {
    LIST: (postId) => `${API_BASE_URL}/comments/post/${postId}`,
    CREATE: `${API_BASE_URL}/comments`,
    UPDATE: (id) => `${API_BASE_URL}/comments/${id}`,
    DELETE: (id) => `${API_BASE_URL}/comments/${id}`,
    USER: `${API_BASE_URL}/comments/user`
  },

  // Subscribers related
  SUBSCRIBERS: {
    SUBSCRIBE: `${API_BASE_URL}/subscribers`,
    UNSUBSCRIBE: (id) => `${API_BASE_URL}/subscribers/unsubscribe/${id}`,
    LIST: `${API_BASE_URL}/subscribers`,
    UPDATE: (id) => `${API_BASE_URL}/subscribers/${id}`
  },

  // Payment related
  PAYMENT: {
    CREATE_INTENT: `${API_BASE_URL}/payment/create-payment-intent`,
    UPDATE_STATUS: `${API_BASE_URL}/payment/update-status`
  }
}; 