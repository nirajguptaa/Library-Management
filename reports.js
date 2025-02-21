// Constants for chart colors and styles
const CHART_COLORS = {
    primary: '#3498db',
    success: '#2ecc71',
    warning: '#f1c40f',
    danger: '#e74c3c',
    background: 'rgba(255, 255, 255, 0.8)'
};

class ReportsManager {
    constructor() {
        this.currentFilters = {
            dateRange: 'last7days',
            category: 'all',
            memberType: 'all',
            reportType: 'all'
        };
        
        this.chartConfigs = {
            circulation: this.createCirculationChartConfig(),
            memberActivity: this.createMemberActivityChartConfig(),
            categoryDistribution: this.createCategoryDistributionConfig(),
            checkoutTrends: this.createCheckoutTrendsConfig()
        };
        
        this.charts = {};
        
        this.initializeEventListeners();
        this.loadInitialData();
    }

    // Generate random data helpers
    generateRandomData(min, max, count) {
        return Array.from({ length: count }, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    }

    generateDates(count) {
        const dates = [];
        const today = new Date();
        for (let i = count - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return dates;
    }

    // Chart Configuration Methods
    createCirculationChartConfig() {
        const days = this.generateDates(7);
        const checkouts = this.generateRandomData(20, 50, 7);

        return {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Daily Checkouts',
                    data: checkouts,
                    borderColor: CHART_COLORS.primary,
                    backgroundColor: `${CHART_COLORS.primary}20`,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20,
                            font: { size: 12 }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Circulation Trends',
                        padding: 20,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                }
            }
        };
    }

    createMemberActivityChartConfig() {
        const memberTypes = ['Students', 'Faculty', 'Staff', 'Visitors'];
        const activityCounts = this.generateRandomData(50, 200, 4);

        return {
            type: 'bar',
            data: {
                labels: memberTypes,
                datasets: [{
                    label: 'Active Members',
                    data: activityCounts,
                    backgroundColor: [
                        `${CHART_COLORS.primary}80`,
                        `${CHART_COLORS.success}80`,
                        `${CHART_COLORS.warning}80`,
                        `${CHART_COLORS.danger}80`
                    ],
                    borderColor: [
                        CHART_COLORS.primary,
                        CHART_COLORS.success,
                        CHART_COLORS.warning,
                        CHART_COLORS.danger
                    ],
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: 'Member Activity Overview'
                    }
                }
            }
        };
    }

    createCategoryDistributionConfig() {
        const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Arts'];
        const distribution = this.generateRandomData(100, 500, 5);

        return {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: distribution,
                    backgroundColor: [
                        `${CHART_COLORS.primary}80`,
                        `${CHART_COLORS.success}80`,
                        `${CHART_COLORS.warning}80`,
                        `${CHART_COLORS.danger}80`,
                        `${CHART_COLORS.primary}60`
                    ],
                    borderColor: CHART_COLORS.background,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' },
                    title: {
                        display: true,
                        text: 'Category Distribution'
                    }
                }
            }
        };
    }

    createCheckoutTrendsConfig() {
        const days = this.generateDates(7);
        const checkouts = this.generateRandomData(30, 80, 7);
        const returns = this.generateRandomData(20, 60, 7);

        return {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'New Checkouts',
                    data: checkouts,
                    borderColor: CHART_COLORS.primary,
                    backgroundColor: `${CHART_COLORS.primary}20`,
                    tension: 0.4
                }, {
                    label: 'Returns',
                    data: returns,
                    borderColor: CHART_COLORS.success,
                    backgroundColor: `${CHART_COLORS.success}20`,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: 'Checkout vs Returns Trends'
                    }
                }
            }
        };
    }

    // Initialize charts
    async initializeCharts() {
        const chartContexts = {
            circulation: document.getElementById('circulationChart'),
            memberActivity: document.getElementById('memberActivityChart'),
            categoryDistribution: document.getElementById('categoryDistributionChart'),
            checkoutTrends: document.getElementById('checkoutTrendsChart')
        };

        for (const [key, context] of Object.entries(chartContexts)) {
            if (context) {
                this.charts[key] = new Chart(
                    context.getContext('2d'),
                    this.chartConfigs[key]
                );
            }
        }
    }

    initializeEventListeners() {
        // Add event listeners for filter changes if needed
        const filterElements = document.querySelectorAll('.filter-item select');
        filterElements.forEach(element => {
            element.addEventListener('change', () => this.handleFilterChange());
        });

        // Generate report button
        const generateButton = document.querySelector('.btn-primary');
        if (generateButton) {
            generateButton.addEventListener('click', () => this.handleFilterChange());
        }
    }

    handleFilterChange() {
        // Update charts with new random data
        Object.values(this.charts).forEach(chart => {
            if (chart.config.type === 'line') {
                chart.data.datasets.forEach(dataset => {
                    dataset.data = this.generateRandomData(20, 80, 7);
                });
            } else if (chart.config.type === 'bar') {
                chart.data.datasets[0].data = this.generateRandomData(50, 200, 4);
            } else if (chart.config.type === 'doughnut') {
                chart.data.datasets[0].data = this.generateRandomData(100, 500, 5);
            }
            chart.update();
        });
    }

    loadInitialData() {
        this.initializeCharts();
    }
}

// Initialize the reports manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const reportsManager = new ReportsManager();
});
// Export functionality for the Reports page
class ReportExporter {
    constructor(reportsManager) {
        this.reportsManager = reportsManager;
        this.initializeExportButton();
    }

    initializeExportButton() {
        const exportButton = document.querySelector('.btn-outline');
        if (exportButton) {
            exportButton.addEventListener('click', () => this.exportData());
        }
    }

    getChartData() {
        const data = {
            circulationStats: {
                totalCheckouts: 1247,
                activeLoans: 429,
                overdueItems: 48,
                averageLoanDuration: "18 days"
            },
            popularBooks: [
                { title: "Atomic Habits", author: "James Clear", category: "Self-Help", timesBorrowed: 142, availability: "2/5" },
                { title: "The Midnight Library", author: "Matt Haig", category: "Fiction", timesBorrowed: 128, availability: "1/3" },
                { title: "Project Hail Mary", author: "Andy Weir", category: "Sci-Fi", timesBorrowed: 115, availability: "4/4" },
                { title: "The Psychology of Money", author: "Morgan Housel", category: "Finance", timesBorrowed: 98, availability: "3/3" }
            ]
        };

        // Add chart data if available
        if (this.reportsManager && this.reportsManager.charts) {
            const { charts } = this.reportsManager;
            
            if (charts.circulation) {
                data.circulationTrends = {
                    labels: charts.circulation.data.labels,
                    data: charts.circulation.data.datasets[0].data
                };
            }
            
            if (charts.categoryDistribution) {
                data.categoryDistribution = {
                    categories: charts.categoryDistribution.data.labels,
                    distribution: charts.categoryDistribution.data.datasets[0].data
                };
            }
        }

        return data;
    }

    convertToCSV(data) {
        const csvParts = [];

        // Add circulation stats
        csvParts.push('Circulation Statistics\n');
        csvParts.push('Metric,Value\n');
        Object.entries(data.circulationStats).forEach(([key, value]) => {
            csvParts.push(`${this.formatHeader(key)},${value}\n`);
        });
        csvParts.push('\n');

        // Add popular books
        csvParts.push('Popular Books\n');
        csvParts.push('Title,Author,Category,Times Borrowed,Availability\n');
        data.popularBooks.forEach(book => {
            csvParts.push(`"${book.title}","${book.author}","${book.category}",${book.timesBorrowed},"${book.availability}"\n`);
        });
        csvParts.push('\n');

        // Add circulation trends if available
        if (data.circulationTrends) {
            csvParts.push('Circulation Trends\n');
            csvParts.push('Date,Checkouts\n');
            data.circulationTrends.labels.forEach((label, index) => {
                csvParts.push(`${label},${data.circulationTrends.data[index]}\n`);
            });
            csvParts.push('\n');
        }

        // Add category distribution if available
        if (data.categoryDistribution) {
            csvParts.push('Category Distribution\n');
            csvParts.push('Category,Number of Books\n');
            data.categoryDistribution.categories.forEach((category, index) => {
                csvParts.push(`${category},${data.categoryDistribution.distribution[index]}\n`);
            });
        }

        return csvParts.join('');
    }

    formatHeader(str) {
        return str
            .split(/(?=[A-Z])/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    downloadCSV(csv) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `library_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    exportData() {
        try {
            const data = this.getChartData();
            const csv = this.convertToCSV(data);
            this.downloadCSV(csv);
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('There was an error exporting the data. Please try again.');
        }
    }
}

// Update the ReportsManager class to include the exporter
ReportsManager.prototype.initializeExporter = function() {
    this.exporter = new ReportExporter(this);
};

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    const reportsManager = new ReportsManager();
    reportsManager.initializeExporter();
});