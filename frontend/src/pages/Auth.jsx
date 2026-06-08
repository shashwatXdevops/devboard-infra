import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // FastAPI OAuth2PasswordRequestForm expects form-urlencoded data!
        const formData = new URLSearchParams();
        formData.append('username', email); // OAuth2 spec uses 'username'
        formData.append('password', password);

        const response = await api.post('/auth/login', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        // Save the generated JWT Token to the browser
        localStorage.setItem('token', response.data.access_token);
        // Redirect to the Dashboard
        navigate('/');
      } else {
        // Registration endpoint expects JSON
        await api.post('/auth/register', {
          email,
          password,
          full_name: fullName
        });
        
        // Auto-switch to login after successful registration
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass-panel" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        
        {error && <div style={{ color: error.includes('successful') ? 'var(--success)' : 'var(--warning)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
