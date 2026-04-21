// Earnings Estimator

// Average earnings per hour by area (in rupees)
const areaEarnings = {
    'Sitabuldi': 280,
    'Dharampeth': 320,
    'MIHAN': 200,
    'Sadar': 260,
    'Wardha Road': 240,
    'Railway Station': 350,
    'Airport': 380,
    'Hingna': 220,
    'Kamptee': 200,
    'Butibori': 190
};

// Vehicle multipliers
const vehicleMultipliers = {
    'Bike': 0.7,
    'Auto Rickshaw': 1.0,
    'Sedan': 1.3,
    'SUV': 1.6
};

// Calculate earnings
function calculateEarnings(hours, area, vehicle) {
    const baseRate = areaEarnings[area];
    const multiplier = vehicleMultipliers[vehicle];
    
    // Calculate hourly earnings
    const hourlyRate = Math.round(baseRate * multiplier);
    
    // Calculate daily earnings with some variation
    const variation = 1 + (Math.random() * 0.2 - 0.1); // ±10% variation
    const dailyEarnings = Math.round(hourlyRate * hours * variation);
    
    // Calculate weekly earnings (assuming 6 working days)
    const weeklyEarnings = Math.round(dailyEarnings * 6);
    
    // Estimate number of rides
    const avgFarePerRide = {
        'Bike': 60,
        'Auto Rickshaw': 80,
        'Sedan': 120,
        'SUV': 180
    };
    const totalRides = Math.round(dailyEarnings / avgFarePerRide[vehicle]);
    
    return {
        dailyEarnings,
        weeklyEarnings,
        hourlyRate,
        totalRides
    };
}

// Form submission handler
document.getElementById('earnings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const hours = parseFloat(document.getElementById('hours-worked').value);
    const area = document.getElementById('earnings-area').value;
    const vehicle = document.getElementById('earnings-vehicle').value;
    
    const result = calculateEarnings(hours, area, vehicle);
    
    // Display results
    document.getElementById('daily-earnings').textContent = `₹${result.dailyEarnings.toLocaleString()}`;
    document.getElementById('weekly-earnings').textContent = `₹${result.weeklyEarnings.toLocaleString()}`;
    document.getElementById('hourly-rate').textContent = `₹${result.hourlyRate}`;
    document.getElementById('total-rides').textContent = `${result.totalRides} rides`;
    
    // Show result card
    const resultCard = document.getElementById('earnings-result');
    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
