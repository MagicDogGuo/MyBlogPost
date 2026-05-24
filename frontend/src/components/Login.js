import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert
} from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Show registration success message
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
      // Clear the message from location state after displaying it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed, please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container component="main" maxWidth="xs" className="login-page-root">
        <Paper
          elevation={3}
          className="login-paper-container"
        >
          <Typography component="h1" variant="h5" className="login-title">
            Login
          </Typography>
          {error && (
            <Alert 
              severity={location.state?.message && !formData.email ? "success" : "error"}
              className="login-alert"
            >
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} className="login-form-box">
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-submit-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/register" variant="body2" className="login-signup-link">
                Don't have an account? Sign up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Login; 