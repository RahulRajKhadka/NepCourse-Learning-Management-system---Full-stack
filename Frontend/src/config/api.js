import axios from 'axios';

// Configure axios defaults globally
axios.defaults.timeout = 60000; // 60 seconds for Render cold starts
axios.defaults.withCredentials = true;

// Backend URL
export const serverUrl = import.meta.env.VITE_SERVER_URL || "https://nepcourse-learning-management-system-7zk8.onrender.com";