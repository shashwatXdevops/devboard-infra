import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../api';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks from MongoDB on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks/');
        // The API returns a list of Task objects. 
        // We map _id to id just in case FastAPI serializes it with the alias.
        const mappedTasks = response.data.map(t => ({
          ...t,
          id: t._id || t.id
        }));
        setTasks(mappedTasks);
      } catch (err) {
        console.error("Failed to load tasks", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    try {
      const response = await api.post('/tasks/', {
        title: newTaskTitle,
        status: 'NEW'
      });
      
      const newTask = {
        ...response.data,
        id: response.data._id || response.data.id
      };
      
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setIsAdding(false);
    } catch (err) {
      console.error("Failed to save task", err);
      alert("Failed to save task securely.");
    }
  };

  const moveTask = async (id, newStatus) => {
    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));

    try {
      // Persist to MongoDB
      await api.put(`/tasks/${id}`, {
        status: newStatus
      });
    } catch (err) {
      console.error("Failed to update status", err);
      setTasks(previousTasks); // Rollback on failure
    }
  };
  
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task forever?")) return;
    
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const columns = ['NEW', 'DOING', 'DONE'];

  if (isLoading) {
    return <div style={{ padding: '2rem' }}>Loading tasks securely...</div>;
  }

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
                  <button type="submit" className="btn-small">Save to DB</button>
                  <button type="button" className="btn-small ghost" onClick={() => setIsAdding(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className="task-list">
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task.id} className="task-card">
                  <p>{task.title}</p>
                  <div className="task-actions" style={{ justifyContent: 'space-between' }}>
                    <button onClick={() => deleteTask(task.id)} style={{ color: 'var(--warning)' }}>
                      <Trash2 size={14} />
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {col !== 'NEW' && (
                        <button onClick={() => moveTask(task.id, col === 'DONE' ? 'DOING' : 'NEW')}>←</button>
                      )}
                      {col !== 'DONE' && (
                        <button onClick={() => moveTask(task.id, col === 'NEW' ? 'DOING' : 'DONE')}>→</button>
                      )}
                    </div>
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
