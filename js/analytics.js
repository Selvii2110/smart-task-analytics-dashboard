/**
 * Analytics.js
 * Calculates statistics for the dashboard
 */

const Analytics = {
    /**
     * Calculate all dashboard statistics
     * @returns {Object} Statistics object
     */
    getStats: () => {
        const tasks = Storage.getTasks();
        const total = tasks.length;
        
        if (total === 0) {
            return {
                total: 0,
                completedPercent: 0,
                overdue: 0,
                topCategory: '-'
            };
        }

        const completed = tasks.filter(t => t.status === 'completed').length;
        const completedPercent = Math.round((completed / total) * 100);

        // Calculate overdue (pending and date is past today)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const overdue = tasks.filter(t => {
            if (t.status === 'completed') return false;
            const dueDate = new Date(t.dueDate);
            return dueDate < today;
        }).length;

        // Calculate top category
        const categoryCounts = tasks.reduce((acc, task) => {
            acc[task.category] = (acc[task.category] || 0) + 1;
            return acc;
        }, {});

        let topCategory = '-';
        let maxCount = 0;
        
        for (const [category, count] of Object.entries(categoryCounts)) {
            if (count > maxCount) {
                maxCount = count;
                topCategory = category.charAt(0).toUpperCase() + category.slice(1);
            }
        }

        return {
            total,
            completedPercent,
            overdue,
            topCategory
        };
    },
    
    /**
     * Get data for status chart
     */
    getStatusData: () => {
        const tasks = Storage.getTasks();
        const pending = tasks.filter(t => t.status === 'pending').length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        
        return {
            labels: ['Pending', 'Completed'],
            data: [pending, completed],
            colors: ['#f59e0b', '#10b981'] // warning and success colors
        };
    },
    
    /**
     * Get data for category chart
     */
    getCategoryData: () => {
        const tasks = Storage.getTasks();
        const categories = {
            work: 0,
            personal: 0,
            learning: 0,
            health: 0
        };
        
        tasks.forEach(task => {
            if (categories[task.category] !== undefined) {
                categories[task.category]++;
            }
        });
        
        return {
            labels: ['Work', 'Personal', 'Learning', 'Health'],
            data: [categories.work, categories.personal, categories.learning, categories.health],
            colors: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'] // info, purple, warning, success
        };
    }
};
