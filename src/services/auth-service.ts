import axios from 'axios';

const API_URL = 'https://api.neighborhoodwatch.com'; // Replace with your actual API URL

export const authService = {
    login,
    register,
    twoFactorAuth,
};

async function login(email, password) {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Login failed');
    }
}

async function register(userData) {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Registration failed');
    }
}

async function twoFactorAuth(email, code) {
    try {
        const response = await axios.post(`${API_URL}/auth/two-factor`, { email, code });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Two-factor authentication failed');
    }
}