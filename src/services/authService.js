/**
 * Service to handle authentication API calls.
 * Connected to the real backend API.
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - { user, token }
 */
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Server returned an error
            throw new Error(data.message || 'Login failed');
        }

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
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            // Server returned validation errors or other errors
            if (data.errors) {
                // Convert errors object to a single message
                const errorMessages = Object.values(data.errors).join('. ');
                throw new Error(errorMessages);
            }
            throw new Error(data.message || 'Registration failed');
        }

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
