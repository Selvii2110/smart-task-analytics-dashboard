# Smart Task Analytics Dashboard

A modern, responsive, and completely client-side task management dashboard with integrated analytics. Built using HTML, CSS, JavaScript, and LocalStorage—no frameworks or backend required.

## Features

- **Task Management**: Create, read, update, and delete tasks.
- **Categorization & Prioritization**: Assign tasks to categories (Work, Personal, Learning, Health) and set priority levels.
- **Analytics Dashboard**: View real-time stats including total tasks, completion percentage, overdue count, and most active category.
- **Dynamic Charts**: Visualize task distribution by Status and Category using Chart.js.
- **Filtering System**: Filter tasks by status (All, Pending, Completed), category, or priority.
- **Responsive Design**: A sleek, premium dark mode UI that adapts flawlessly from desktop to mobile screens.
- **Local Storage**: All data is persisted securely in your browser's LocalStorage.

## Project Structure

```
smart-task-analytics-dashboard/
├── index.html
├── css/
│   ├── style.css          # Main stylesheet with premium dark theme variables and styles
│   └── responsive.css     # Media queries for mobile responsiveness
├── js/
│   ├── app.js             # Main application initialization and DOM event bindings
│   ├── storage.js         # LocalStorage wrapper logic
│   ├── tasks.js           # CRUD operations for tasks
│   ├── analytics.js       # Calculation logic for stats and chart data
│   └── charts.js          # Chart.js initialization and updates
├── assets/
│   └── icons/             # For future use (UI uses emoji/CSS for now)
└── README.md
```

## How to Run

## Application Screenshots

### Dashboard



![Dashboard Screenshot](Screenshot%202026-07-11%20215853.png)

## Technologies Used

- HTML5
- CSS3 (Vanilla, CSS Variables, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- LocalStorage API
- Chart.js (via CDN)
