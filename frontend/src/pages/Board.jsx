import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../api';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Initial fetch (mocking since auth isn't fully wired on frontend yet)
  useEffect(() => {
    // In a real app, we'd fetch from /api/v1/tasks/
    // Setting up some dummy data for layout testing
    setTasks([
      { id: '1', title: 'Setup Backend Server', status: 'DOING' },
      { id: '2', title: 'Database Schema Design', status: 'DONE' },
      { id: '3', title: 'Configure CI/CD Pipeline', status: 'NEW' },
    ]);
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'NEW'
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const columns = ['NEW', 'DOING', 'DONE'];

  return (
    <div className="board-container">
      <div className="board-header">
        <h2>Task Board</h2>
        <button className="btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={16} /> Add Task
        </button>
      </div>

      <div className="kanban-grid">
        {columns.map(col => (
          <div key={col} className="kanban-column">
            <h3 className="column-header">{col}</h3>
            
            {/* Inline Add Task Form for NEW column */}
            {col === 'NEW' && isAdding && (
              <form onSubmit={handleAddTask} className="task-card add-form">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="What needs to be done?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <div className="form-actions">
                  <button type="submit" className="btn-small">Save</button>
                  <button type="button" className="btn-small ghost" onClick={() => setIsAdding(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className="task-list">
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task.id} className="task-card">
                  <p>{task.title}</p>
                  <div className="task-actions">
                    {col !== 'NEW' && (
                      <button onClick={() => moveTask(task.id, col === 'DONE' ? 'DOING' : 'NEW')}>←</button>
                    )}
                    {col !== 'DONE' && (
                      <button onClick={() => moveTask(task.id, col === 'NEW' ? 'DOING' : 'DONE')}>→</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
