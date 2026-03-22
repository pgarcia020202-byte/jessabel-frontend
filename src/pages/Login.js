import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormValidation, createValidationSchema } from '../hooks/useFormValidation';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/client';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { setLoading, setError, clearError } = useApp();
  const { login } = useAuth();
  const firstInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Validation schema
  const validationSchema = createValidationSchema({
    email: ['required', 'email'],
    password: ['required', { type: 'minLength', params: [6] }]
  });

  // Initial form values
  const initialValues = {
    email: '',
    password: '',
    rememberMe: false
  };

  // Use custom form validation hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useFormValidation(initialValues, validationSchema);

  // Auto-focus first input when component mounts
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      setSubmitError('');
      setLoading(true);
      clearError();

      const data = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      login(data);

      if (formData.rememberMe) {
        localStorage.setItem('artvision-user', JSON.stringify(data.user));
      }

      navigate('/home');
    } catch (error) {
      const message = error?.message || 'Login failed. Please try again.';
      setSubmitError(message);
      setError(message);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const allFields = Object.keys(values);
    allFields.forEach((field) => {
      if (!touched[field]) {
        const fakeEvent = { target: { name: field } };
        handleBlur(fakeEvent);
      }
    });
    handleSubmit(onSubmit);
  };

  // Handle guest login
  const handleGuestLogin = () => {
    navigate('/home');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Login Header */}
          <div className="login-header">
            <div className="login-logo">🎨</div>
            <h1>Welcome Back</h1>
            <p>Login to your ArtVision account to continue your creative journey</p>
          </div>

          {/* Login Form */}
          {submitError ? (
           <span className="error-message">{submitError}</span>
         ) : null}
         <form className="login-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  ref={firstInputRef}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.email && errors.email ? 'error' : ''}
                  disabled={isSubmitting}
                />
                <span className="input-icon">📧</span>
              </div>
              {touched.email && errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.password && errors.password ? 'error' : ''}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={isSubmitting}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {touched.password && errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={values.rememberMe}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#forgot-password" className="forgot-link">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Guest Login */}
          <button className="guest-btn" onClick={handleGuestLogin}>
            Continue as Guest
          </button>

          {/* Sign Up Link */}
          <div className="signup-link">
            <p>Don't have an account? <a href="/register">Sign up now</a></p>
          </div>
        </div>

        {/* Background Art Elements */}
        <div className="background-art">
          <div className="art-element art-1">🎨</div>
          <div className="art-element art-2">🖌️</div>
          <div className="art-element art-3">🎭</div>
          <div className="art-element art-4">🖼️</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
