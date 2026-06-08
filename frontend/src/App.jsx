import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Board from './pages/Board';

// Placeholder Pages for now
const Dashboard = () => (
  <div className="glass-panel">
    <h2>Dashboard Overview</h2>
    <p>Welcome to DevBoard Metrics. Navigate to the Task Board to manage your sprint.</p>
  </div>
);

const AiWiki = () => (
  <div className="glass-panel">
    <h2>AI Knowledge Base</h2>
    <p>Markdown documents and AI insights will render here.</p>
  </div>
);

const Settings = () => (
  <div className="glass-panel">
    <h2>System Settings</h2>
    <p>Authentication and tenant settings.</p>
  </div>
);

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/board" element={<Board />} />
        <Route path="/wiki" element={<AiWiki />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
