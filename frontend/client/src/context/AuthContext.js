import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.get(API_ENDPOINTS.AUTH.ME, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(response => {
        setUser(response.data);
        setToken(storedToken);
      })
      .catch(error => {
        console.error('驗證 token 失敗:', error);
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setUser(null);
      setToken(null);
      setLoading(false);
    }
  }, []);

  const login = async (formData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, formData);
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setUser(userData);
      setToken(newToken);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (formData) => {
    try {
      console.log('Sending registration request:', formData);
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, formData);
      console.log('Registration response:', response.data);
      
      return { 
        success: true,
        message: 'Registration successful, please login'
      };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed, please try again later'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 