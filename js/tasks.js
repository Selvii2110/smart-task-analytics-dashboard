/**
 * Tasks.js
 * Handles core task logic: CRUD operations (Create, Read, Update, Delete)
 */

const TaskManager = {
    /**
     * Create a new task object
     * @param {Object} taskData - The form data
     * @returns {Object} The created task
     */
    addTask: (taskData) => {
        const tasks = Storage.getTasks();
        const newTask = {
            id: Date.now().toString(), // Simple unique ID
            title: taskData.title,
            category: taskData.category,
            priority: taskData.priority,
            dueDate: taskData.dueDate,
            status: taskData.status || 'pending',
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        Storage.saveTasks(tasks);
        return newTask;
    },

    /**
     * Update an existing task
     * @param {string} id - Task ID to update
     * @param {Object} updates - Updated properties
     */
    updateTask: (id, updates) => {
        const tasks = Storage.getTasks();
        const index = tasks.findIndex(t => t.id === id);
        
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            Storage.saveTasks(tasks);
            return tasks[index];
        }
        return null;
    },

    /**
     * Delete a task by ID
     * @param {string} id - Task ID to delete
     */
    deleteTask: (id) => {
        const tasks = Storage.getTasks();
        const filtered = tasks.filter(t => t.id !== id);
        Storage.saveTasks(filtered);
    },

    /**
     * Toggle task status between pending and completed
     * @param {string} id - Task ID
     */
    toggleTaskStatus: (id) => {
        const tasks = Storage.getTasks();
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.status = task.status === 'completed' ? 'pending' : 'completed';
            Storage.saveTasks(tasks);
            return task;
        }
        return null;
    },

    /**
     * Get a single task by ID
     * @param {string} id - Task ID
     */
    getTaskById: (id) => {
        const tasks = Storage.getTasks();
        return tasks.find(t => t.id === id);
    },

    /**
     * Get tasks with optional filtering
     * @param {Object} filters - Filter criteria {status, category, priority}
     */
    getFilteredTasks: (filters = {}) => {
        let tasks = Storage.getTasks();
        
        if (filters.status && filters.status !== 'all') {
            tasks = tasks.filter(t => t.status === filters.status);
        }
        
        if (filters.category && filters.category !== 'all') {
            tasks = tasks.filter(t => t.category === filters.category);
        }
        
        if (filters.priority && filters.priority !== 'all') {
            tasks = tasks.filter(t => t.priority === filters.priority);
        }
        
        // Sort by due date by default
        return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
};
