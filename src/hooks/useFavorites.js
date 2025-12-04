// src/hooks/useFavorites.js
import { useState, useEffect } from "react";

/**
 * Custom Hook: useFavorites
 * Manages favorite places with localStorage persistence
 * 
 * Features:
 * - Add/remove places from favorites
 * - Check if a place is favorited
 * - Clear all favorites
 * - Automatic localStorage sync (favorites persist across sessions)
 * 
 * @param {string} storageKey - localStorage key (default: 'travel-vibes-favorites')
 * @returns {Object} - { favorites, toggleFavorite, clearFavorites, isFavorite }
 */
export const useFavorites = (storageKey = 'travel-vibes-favorites') => {
  // Initialize state from localStorage or empty array
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem(storageKey);
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return [];
    }
  });

  // Sync favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites, storageKey]);

  /**
   * Toggle a place in favorites (add if not present, remove if present)
   * @param {Object} place - Place object to toggle
   */
  const toggleFavorite = (place) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.find((p) => p.id === place.id);
      
      if (isAlreadyFavorite) {
        // Remove from favorites
        return prev.filter((p) => p.id !== place.id);
      } else {
        // Add to favorites
        return [...prev, place];
      }
    });
  };

  /**
   * Check if a place is in favorites
   * @param {string} placeId - Place ID to check
   * @returns {boolean} - True if place is favorited
   */
  const isFavorite = (placeId) => {
    return favorites.some((p) => p.id === placeId);
  };

  /**
   * Clear all favorites
   */
  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    toggleFavorite,
    clearFavorites,
    isFavorite
  };
};

