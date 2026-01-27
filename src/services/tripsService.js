import { API_URL } from "../config/api";
import { fetchJson } from "./http";

/**
 * Service to handle trip-related API calls
 * Connected to the backend API
 */

/**
 * Get authentication headers with JWT token
 * @returns {Object} - Headers object
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

/**
 * Get all trips for the logged-in user
 * @returns {Promise<Array>} - Array of trips
 */
export const getUserTrips = async () => {
    try {
        const data = await fetchJson(`${API_URL}/trips`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        return data.data.trips;
    } catch (error) {
        throw new Error(error.message || 'Failed to connect to server');
    }
};

/**
 * Get a single trip by ID
 * @param {string} tripId - Trip ID
 * @returns {Promise<Object>} - Trip object
 */
export const getTripById = async (tripId) => {
    try {
        const data = await fetchJson(`${API_URL}/trips/${tripId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        return data.data.trip;
    } catch (error) {
        throw new Error(error.message || 'Failed to connect to server');
    }
};

/**
 * Create a new trip
 * @param {Object} tripData - { name, destination, startDate, endDate, vibe, travelers, description }
 * @returns {Promise<Object>} - Created trip
 */
export const createTrip = async (tripData) => {
    try {
        const data = await fetchJson(`${API_URL}/trips`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(tripData),
        });

        return data.data.trip;
    } catch (error) {
        throw new Error(error.message || 'Failed to connect to server');
    }
};

/**
 * Update an existing trip
 * @param {string} tripId - Trip ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Updated trip
 */
export const updateTrip = async (tripId, updates) => {
    try {
        const data = await fetchJson(`${API_URL}/trips/${tripId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates),
        });

        return data.data.trip;
    } catch (error) {
        throw new Error(error.message || 'Failed to connect to server');
    }
};

/**
 * Delete a trip
 * @param {string} tripId - Trip ID
 * @returns {Promise<void>}
 */
export const deleteTrip = async (tripId) => {
    try {
        const data = await fetchJson(`${API_URL}/trips/${tripId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        return data.data;
    } catch (error) {
        throw new Error(error.message || 'Failed to connect to server');
    }
};

/**
 * Add a favorite place to a trip
 * @param {string} tripId - Trip ID
 * @param {Object} place - Place object
 * @returns {Promise<Object>} - Updated trip
 */
export const addFavorite = async (tripId, place) => {
    try {
        const data = await fetchJson(`${API_URL}/trips/${tripId}/favorites`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(place),
        });

        return data.data.trip;
    } catch (error) {
        throw new Error(error.message || 'Failed to connect to server');
    }
};

/**
 * Remove a favorite place from a trip
 * @param {string} tripId - Trip ID
 * @param {string} favoriteId - Favorite place ID
 * @returns {Promise<Object>} - Updated trip
 */
export const removeFavorite = async (tripId, favoriteId) => {
    try {
        const data = await fetchJson(`${API_URL}/trips/${tripId}/favorites/${favoriteId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        return data.data.trip;
    } catch (error) {
        throw new Error(error.message || 'Failed to connect to server');
    }
};

/**
 * Update a favorite place (for itinerary scheduling)
 * @param {string} tripId - Trip ID
 * @param {string} favoriteId - Favorite place ID
 * @param {Object} updates - { assignedDay, assignedTime }
 * @returns {Promise<Object>} - Updated trip
 */
export const updateFavorite = async (tripId, favoriteId, updates) => {
    try {
        const data = await fetchJson(`${API_URL}/trips/${tripId}/favorites/${favoriteId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates),
        });

        return data.data.trip;
    } catch (error) {
        throw new Error(error.message || 'Failed to connect to server');
    }
};
