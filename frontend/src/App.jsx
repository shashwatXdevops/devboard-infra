import React, { useEffect, useState } from 'react';
import { fetchTasks, fetchAISummaries } from './api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const tasksData = await fetchTasks();
      const summariesData = await fetchAISummaries();
      setTasks(tasksData);
      setSummaries(summariesData);
    };
    loadData();
  }, []);

  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-progress';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>DEVBOARD</h1>
        <div className="user-profile">
          <span style={{color: 'var(--text-muted)'}}>Admin Dashboard</span>
        </div>
      </header>

      <main className="grid-container">
        <section className="card">
          <h2 className="card-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            Active Tasks
          </h2>
          <ul className="task-list">
            {tasks.map(task => (
              <li key={task.id} className="task-item">
                <span className="task-title">{task.title}</span>
                <span className={`status-badge ${getStatusClass(task.status)}`}>{task.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 className="card-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            AI Summaries
          </h2>
          <ul className="summary-list">
            {summaries.map(summary => (
              <li key={summary.id} className="summary-item">
                <p className="summary-text">{summary.text}</p>
                <span className="summary-date">{summary.date}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
