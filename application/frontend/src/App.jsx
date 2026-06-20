import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Board from './pages/Board';
import Auth from './pages/Auth';

// Placeholder Pages
const Dashboard = () => (
  <div className="glass-panel">
    <h2>Dashboard Overview</h2>
    <p>Welcome to DevBoard. Navigate to the Task Board to manage your sprint.</p>
  </div>
);

const AiWiki = () => (
  <div className="glass-panel">
    <h2>AI Knowledge Base</h2>
    <p>Markdown documents and AI insights will render here.</p>
  </div>
);

const Settings = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="glass-panel">
      <h2>System Settings</h2>
      <button className="btn-primary" onClick={handleLogout} style={{ marginTop: '2rem' }}>Log Out</button>
    </div>
  );
};

// Security Wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Auth />} />

      {/* Protected Routes enclosed in Layout */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/board" element={<PrivateRoute><Board /></PrivateRoute>} />
      <Route path="/wiki" element={<PrivateRoute><AiWiki /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
