/**
 * Charts.js
 * Handles rendering and updating of Chart.js instances
 */

const ChartManager = {
    chartInstance: null,
    currentType: 'status', // 'status' or 'category'

    /**
     * Initialize or update the chart
     * @param {string} type - 'status' or 'category'
     */
    renderChart: (type = ChartManager.currentType) => {
        ChartManager.currentType = type;
        
        const canvas = document.getElementById('taskChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const chartData = type === 'status' ? Analytics.getStatusData() : Analytics.getCategoryData();
        
        // Destroy existing chart if it exists
        if (ChartManager.chartInstance) {
            ChartManager.chartInstance.destroy();
        }
        
        // Determine chart type based on data
        // Status -> Doughnut, Category -> Bar
        const chartConfig = {
            type: type === 'status' ? 'doughnut' : 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Tasks',
                    data: chartData.data,
                    backgroundColor: chartData.colors,
                    borderWidth: 0,
                    borderRadius: type === 'category' ? 6 : 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#d1d5db',
                            font: {
                                family: "'Inter', sans-serif",
                                size: 12
                            }
                        },
                        display: type === 'status' // Only show legend for doughnut
                    },
                    tooltip: {
                        backgroundColor: '#111111',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                scales: type === 'category' ? {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#d1d5db',
                            stepSize: 1
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#d1d5db'
                        }
                    }
                } : {}
            }
        };
        
        ChartManager.chartInstance = new Chart(ctx, chartConfig);
    },
    
    /**
     * Refresh chart with current data
     */
    update: () => {
        if (ChartManager.chartInstance) {
            ChartManager.renderChart();
        }
    }
};
