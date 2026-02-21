import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const { token, activeOrgId, activeInstituteId } = useAuthStore.getState();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (activeOrgId) {
        config.headers['x-org-id'] = activeOrgId;
    }
    if (activeInstituteId) {
        config.headers['x-institute-id'] = activeInstituteId;
    }
    return config;
});

export default api;
