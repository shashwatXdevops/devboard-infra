// Setup placeholder for API calls to the backend
const API_BASE_URL = '/api';

export const fetchTasks = async () => {
    // Placeholder implementation
    return [
        { id: 1, title: 'Setup Backend Server', status: 'In Progress' },
        { id: 2, title: 'Database Schema Design', status: 'Completed' },
        { id: 3, title: 'Configure CI/CD Pipeline', status: 'Pending' },
    ];
};

export const fetchAISummaries = async () => {
    // Placeholder implementation
    return [
        { id: 1, text: 'The backend development is progressing well. Consider optimizing the database queries for the user endpoints.', date: '2026-06-05' },
        { id: 2, text: 'Frontend UI design looks promising. Ensure responsive layouts for mobile devices.', date: '2026-06-04' },
    ];
};
