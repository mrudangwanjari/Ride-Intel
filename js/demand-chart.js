// Demand Visualization using Chart.js

const areas = ['Sitabuldi', 'Dharampeth', 'MIHAN', 'Sadar', 'Wardha Road', 'Railway Station', 'Airport', 'Hingna', 'Kamptee', 'Butibori'];

// Get demand level for visualization
function getDemandLevel(area, hour) {
    const pattern = demandPatterns[area];
    
    if (pattern.morning.includes(hour) || pattern.evening.includes(hour)) {
        return 90 + Math.random() * 10; // 90-100 (High)
    } else if (hour >= 22 || hour < 6) {
        return 20 + Math.random() * 20; // 20-40 (Low)
    } else {
        if (pattern.baseLevel === 'high') {
            return 70 + Math.random() * 15; // 70-85 (Medium-High)
        } else if (pattern.baseLevel === 'medium') {
            return 50 + Math.random() * 20; // 50-70 (Medium)
        } else {
            return 30 + Math.random() * 20; // 30-50 (Low-Medium)
        }
    }
}

// Get bar color based on demand level
function getBarColor(value) {
    if (value >= 80) return 'rgba(255, 68, 68, 0.8)'; // High - Red
    if (value >= 60) return 'rgba(255, 153, 0, 0.8)'; // Medium - Orange
    return 'rgba(0, 255, 136, 0.8)'; // Low - Green
}

// Initialize chart
let demandChart = null;

function initChart() {
    const ctx = document.getElementById('demandChart').getContext('2d');
    const now = new Date();
    const hour = now.getHours();
    
    const demandData = areas.map(area => getDemandLevel(area, hour));
    const colors = demandData.map(value => getBarColor(value));
    
    demandChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: areas,
            datasets: [{
                label: 'Demand Level',
                data: demandData,
                backgroundColor: colors,
                borderColor: '#DFFF00',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1a1a1a',
                    titleColor: '#DFFF00',
                    bodyColor: '#ffffff',
                    borderColor: '#DFFF00',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            let level = 'Low';
                            if (value >= 80) level = 'High';
                            else if (value >= 60) level = 'Medium';
                            return `Demand: ${level} (${Math.round(value)}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#aaaaaa',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(223, 255, 0, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#aaaaaa',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Update chart based on time
function updateDemandChart() {
    const timeInput = document.getElementById('chart-time').value;
    const hour = parseInt(timeInput.split(':')[0]);
    
    const demandData = areas.map(area => getDemandLevel(area, hour));
    const colors = demandData.map(value => getBarColor(value));
    
    demandChart.data.datasets[0].data = demandData;
    demandChart.data.datasets[0].backgroundColor = colors;
    demandChart.update();
}

// Initialize chart when page loads
window.addEventListener('load', () => {
    if (document.getElementById('demandChart')) {
        // Set current time
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        document.getElementById('chart-time').value = timeString;
        
        initChart();
    }
});
