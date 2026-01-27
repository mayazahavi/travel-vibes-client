import { API_URL } from "../config/api";
import { fetchJson } from "./http";

/**
 * Service to handle authentication API calls.
 * Connected to the real backend API.
 */

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - { user, token }
 */
export const login = async (email, password) => {
    try {
        const data = await fetchJson(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // Return user and token from server response
        return {
            user: data.data.user,
            token: data.data.token,
        };
    } catch (error) {
        // Network error or server error
        throw new Error(error.message || 'Failed to connect to server');
    }
};

/**
 * Register new user
 * @param {Object} userData - { name, email, password, confirmPassword }
 * @returns {Promise<Object>} - { user, token }
 */
export const register = async (userData) => {
    try {
        const data = await fetchJson(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        // Return user and token from server response
        return {
            user: data.data.user,
            token: data.data.token,
        };
    } catch (error) {
        throw new Error(error.message || 'Failed to connect to server');
    }
};

/**
 * Logout user
 * For JWT, this is usually just client-side (clearing token/localStorage)
 */
export const logout = () => {
    // JWT logout is handled client-side
    // If you need to invalidate token on server, add API call here
    return Promise.resolve();
};
