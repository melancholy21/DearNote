import axios from 'axios'

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";
const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
    try {
        if (window.Clerk) {
            const token = await window.Clerk.session?.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch (error) {
        console.error("Error setting Authorization header:", error);
    }
    return config;
});

export default api;