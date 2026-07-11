/**
 * Storage.js
 * Handles all interactions with the browser's LocalStorage API.
 * Keeps data persistence simple and centralized.
 */

const STORAGE_KEY = 'smart_tasks_data';

// Default initial state if nothing in localStorage
const defaultData = [];

const Storage = {
    /**
     * Get all tasks from LocalStorage
     * @returns {Array} List of task objects
     */
    getTasks: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : defaultData;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultData;
        }
    },

    /**
     * Save tasks array to LocalStorage
     * @param {Array} tasks - List of task objects to save
     */
    saveTasks: (tasks) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    /**
     * Clear all tasks
     */
    clearAll: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
