import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation check
    if (email === '' || password === '') {
      setError('Please enter both email and password.');
      return; 
    }

    try {
      await login(email, password);
      navigate('/dashboard'); 
    } catch (err) {
      setError('Invalid Credentials. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
            <h2>Sign in with email</h2>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={onSubmit} className="login-form">
          {/* This is the Email input field */}
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
            />
          </div>

          {/* This is the Password input field */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
            />
          </div>

          <button type="submit" className="login-button">Get Started</button>
        </form>

        <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;