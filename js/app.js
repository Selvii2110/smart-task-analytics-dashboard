/**
 * App.js
 * Main application logic, DOM interactions, and event listeners
 */

// DOM Elements
const elements = {
    // Current date
    currentDate: document.getElementById('current-date'),
    
    // Stats
    statTotal: document.getElementById('stat-total'),
    statCompletion: document.getElementById('stat-completion'),
    statOverdue: document.getElementById('stat-overdue'),
    statTopCategory: document.getElementById('stat-top-category'),
    
    // Tasks list
    taskList: document.getElementById('task-list'),
    
    // Filters
    navItems: document.querySelectorAll('.nav-item'),
    filterCategory: document.getElementById('filter-category'),
    filterPriority: document.getElementById('filter-priority'),
    
    // Chart tabs
    chartTabs: document.querySelectorAll('.tab-btn'),
    
    // Modal
    modal: document.getElementById('task-modal'),
    modalTitle: document.getElementById('modal-title'),
    closeBtn: document.getElementById('close-modal'),
    cancelBtn: document.getElementById('cancel-modal'),
    addBtn: document.getElementById('add-task-btn'),
    
    // Form
    taskForm: document.getElementById('task-form'),
    taskId: document.getElementById('task-id'),
    taskTitle: document.getElementById('task-title'),
    taskCategory: document.getElementById('task-category'),
    taskPriority: document.getElementById('task-priority'),
    taskDueDate: document.getElementById('task-due-date'),
    taskStatus: document.getElementById('task-status')
};

// Current filter state
let currentFilters = {
    status: 'all',
    category: 'all',
    priority: 'all'
};

/**
 * Initialize App
 */
function init() {
    // Set current date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elements.currentDate.textContent = new Date().toLocaleDateString('en-US', options);
    
    // Set minimum date for date picker to today
    const today = new Date().toISOString().split('T')[0];
    elements.taskDueDate.setAttribute('min', today);
    
    // Bind Events
    bindEvents();
    
    // Initial render
    updateDashboard();
}

/**
 * Bind all event listeners
 */
function bindEvents() {
    // Sidebar navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active class
            elements.navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Update filter and render
            currentFilters.status = item.dataset.filter;
            renderTasks();
        });
    });
    
    // Dropdown filters
    elements.filterCategory.addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        renderTasks();
    });
    
    elements.filterPriority.addEventListener('change', (e) => {
        currentFilters.priority = e.target.value;
        renderTasks();
    });
    
    // Chart tabs
    elements.chartTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.chartTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            ChartManager.renderChart(tab.dataset.chart);
        });
    });
    
    // Modal operations
    elements.addBtn.addEventListener('click', () => openModal());
    elements.closeBtn.addEventListener('click', closeModal);
    elements.cancelBtn.addEventListener('click', closeModal);
    
    // Close modal on outside click
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
            closeModal();
        }
    });
    
    // Form submission
    elements.taskForm.addEventListener('submit', handleTaskSubmit);
}

/**
 * Open modal for add or edit
 * @param {Object} taskData - Optional task data for editing
 */
function openModal(taskData = null) {
    elements.modal.classList.add('active');
    
    if (taskData) {
        elements.modalTitle.textContent = 'Edit Task';
        elements.taskId.value = taskData.id;
        elements.taskTitle.value = taskData.title;
        elements.taskCategory.value = taskData.category;
        elements.taskPriority.value = taskData.priority;
        elements.taskDueDate.value = taskData.dueDate;
        elements.taskStatus.value = taskData.status;
    } else {
        elements.modalTitle.textContent = 'Create New Task';
        elements.taskForm.reset();
        elements.taskId.value = '';
        
        // Default to today
        elements.taskDueDate.value = new Date().toISOString().split('T')[0];
    }
}

/**
 * Close modal
 */
function closeModal() {
    elements.modal.classList.remove('active');
    setTimeout(() => {
        elements.taskForm.reset();
    }, 300); // Wait for transition
}

/**
 * Handle form submit
 * @param {Event} e 
 */
function handleTaskSubmit(e) {
    e.preventDefault();
    
    const taskData = {
        title: elements.taskTitle.value.trim(),
        category: elements.taskCategory.value,
        priority: elements.taskPriority.value,
        dueDate: elements.taskDueDate.value,
        status: elements.taskStatus.value
    };
    
    const id = elements.taskId.value;
    
    if (id) {
        TaskManager.updateTask(id, taskData);
    } else {
        TaskManager.addTask(taskData);
    }
    
    closeModal();
    updateDashboard();
}

/**
 * Handle task actions (toggle status, edit, delete)
 * @param {Event} e 
 */
function handleTaskAction(e) {
    const target = e.target;
    
    // Find closest task item
    const taskItem = target.closest('.task-item');
    if (!taskItem) return;
    
    const id = taskItem.dataset.id;
    
    // Toggle Status
    if (target.classList.contains('task-checkbox')) {
        TaskManager.toggleTaskStatus(id);
        updateDashboard();
        return;
    }
    
    // Edit Task
    if (target.closest('.edit-btn')) {
        const task = TaskManager.getTaskById(id);
        if (task) openModal(task);
        return;
    }
    
    // Delete Task
    if (target.closest('.delete-btn')) {
        if (confirm('Are you sure you want to delete this task?')) {
            TaskManager.deleteTask(id);
            updateDashboard();
        }
    }
}

/**
 * Format date for display
 * @param {string} dateString 
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    
    if (targetDate.getTime() === today.getTime()) {
        return 'Today';
    } else if (targetDate.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Render tasks to DOM
 */
function renderTasks() {
    const tasks = TaskManager.getFilteredTasks(currentFilters);
    
    elements.taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        elements.taskList.innerHTML = '<div class="empty-state">No tasks found matching your criteria.</div>';
        return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    tasks.forEach(task => {
        const isCompleted = task.status === 'completed';
        const taskDate = new Date(task.dueDate);
        const isOverdue = !isCompleted && taskDate < today;
        
        const item = document.createElement('div');
        item.className = `task-item ${isCompleted ? 'completed' : ''}`;
        item.dataset.id = task.id;
        
        item.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''}>
                <div class="task-details">
                    <h4>${escapeHtml(task.title)}</h4>
                    <div class="task-meta">
                        <span class="badge badge-category">${task.category}</span>
                        <span class="badge badge-${task.priority}">${task.priority}</span>
                        <span class="task-date ${isOverdue ? 'overdue' : ''}">
                            📅 ${formatDate(task.dueDate)} ${isOverdue ? '(Overdue)' : ''}
                        </span>
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-icon edit-btn" title="Edit">✏️</button>
                <button class="btn-icon delete-btn delete" title="Delete">🗑️</button>
            </div>
        `;
        
        elements.taskList.appendChild(item);
    });
    
    // Add event listeners to newly created elements
    elements.taskList.removeEventListener('click', handleTaskAction); // Prevent duplicates
    elements.taskList.addEventListener('click', handleTaskAction);
}

/**
 * Update all dashboard components
 */
function updateDashboard() {
    // 1. Update stats
    const stats = Analytics.getStats();
    elements.statTotal.textContent = stats.total;
    elements.statCompletion.textContent = `${stats.completedPercent}%`;
    elements.statOverdue.textContent = stats.overdue;
    elements.statTopCategory.textContent = stats.topCategory;
    
    // 2. Render tasks
    renderTasks();
    
    // 3. Render chart
    ChartManager.renderChart();
}

/**
 * Helper to prevent XSS
 * @param {string} unsafe 
 * @returns {string} safe HTML
 */
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Ensure init runs when DOM is fully loaded
// We're using module type implicitly if we use imports, but in browser vanilla we might need module type.
// Since we used standard `<script src="...">` without type="module" in index.html, we shouldn't use imports/exports directly in the browser unless specified.
// WAIT: I used export/import in vanilla JS. I need to update index.html to load app.js as a module, or rewrite these files without import/export. 

// Given vanilla browser constraints without a bundler, standard `<script type="module">` is required.
// But wait, the user asked for "no frameworks, no backend" which means this is run from file:// or a simple server.
// CORS blocks ES modules if run directly from file:// protocol in some browsers.
// Let's modify the code slightly so it works flawlessly without imports. 

// I will refactor the files by removing `export` and `import` and rely on global scope if we aren't using type="module", or I'll just change index.html to `<script type="module" src="js/app.js"></script>`. Let's use global scope to be safe for local file:// execution.

// Wait, I will just write this app.js without imports and remove exports from previous files using `multi_replace_file_content`.

// But for now, let me write app.js assuming globals:

// App logic below relies on TaskManager, Analytics, ChartManager being available globally.
document.addEventListener('DOMContentLoaded', init);
