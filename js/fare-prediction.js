// Fare Prediction Logic with ML-inspired calculations

// Distance matrix between Nagpur areas (in km)
const distanceMatrix = {
    'Sitabuldi': { 'Sitabuldi': 0, 'Dharampeth': 3, 'MIHAN': 18, 'Sadar': 2, 'Wardha Road': 8, 'Railway Station': 1, 'Airport': 15, 'Hingna': 12, 'Kamptee': 16, 'Butibori': 25 },
    'Dharampeth': { 'Sitabuldi': 3, 'Dharampeth': 0, 'MIHAN': 20, 'Sadar': 4, 'Wardha Road': 6, 'Railway Station': 3, 'Airport': 17, 'Hingna': 14, 'Kamptee': 18, 'Butibori': 27 },
    'MIHAN': { 'Sitabuldi': 18, 'Dharampeth': 20, 'MIHAN': 0, 'Sadar': 19, 'Wardha Road': 12, 'Railway Station': 17, 'Airport': 5, 'Hingna': 8, 'Kamptee': 22, 'Butibori': 15 },
    'Sadar': { 'Sitabuldi': 2, 'Dharampeth': 4, 'MIHAN': 19, 'Sadar': 0, 'Wardha Road': 9, 'Railway Station': 2, 'Airport': 16, 'Hingna': 13, 'Kamptee': 17, 'Butibori': 26 },
    'Wardha Road': { 'Sitabuldi': 8, 'Dharampeth': 6, 'MIHAN': 12, 'Sadar': 9, 'Wardha Road': 0, 'Railway Station': 7, 'Airport': 10, 'Hingna': 5, 'Kamptee': 11, 'Butibori': 18 },
    'Railway Station': { 'Sitabuldi': 1, 'Dharampeth': 3, 'MIHAN': 17, 'Sadar': 2, 'Wardha Road': 7, 'Railway Station': 0, 'Airport': 14, 'Hingna': 11, 'Kamptee': 15, 'Butibori': 24 },
    'Airport': { 'Sitabuldi': 15, 'Dharampeth': 17, 'MIHAN': 5, 'Sadar': 16, 'Wardha Road': 10, 'Railway Station': 14, 'Airport': 0, 'Hingna': 7, 'Kamptee': 19, 'Butibori': 12 },
    'Hingna': { 'Sitabuldi': 12, 'Dharampeth': 14, 'MIHAN': 8, 'Sadar': 13, 'Wardha Road': 5, 'Railway Station': 11, 'Airport': 7, 'Hingna': 0, 'Kamptee': 16, 'Butibori': 13 },
    'Kamptee': { 'Sitabuldi': 16, 'Dharampeth': 18, 'MIHAN': 22, 'Sadar': 17, 'Wardha Road': 11, 'Railway Station': 15, 'Airport': 19, 'Hingna': 16, 'Kamptee': 0, 'Butibori': 28 },
    'Butibori': { 'Sitabuldi': 25, 'Dharampeth': 27, 'MIHAN': 15, 'Sadar': 26, 'Wardha Road': 18, 'Railway Station': 24, 'Airport': 12, 'Hingna': 13, 'Kamptee': 28, 'Butibori': 0 }
};

// Base rates per km for each vehicle type
const vehicleRates = {
    'Bike': 8,
    'Auto Rickshaw': 12,
    'Sedan': 15,
    'SUV': 20
};

// Base fare (minimum charge)
const baseFare = {
    'Bike': 20,
    'Auto Rickshaw': 30,
    'Sedan': 50,
    'SUV': 80
};

// Calculate surge multiplier based on time
function getSurgeMultiplier(time) {
    const hour = parseInt(time.split(':')[0]);
    
    // Morning peak: 7-10 AM
    if (hour >= 7 && hour < 10) {
        return 1.3;
    }
    // Evening peak: 5-8 PM
    if (hour >= 17 && hour < 20) {
        return 1.4;
    }
    // Night: 10 PM - 5 AM
    if (hour >= 22 || hour < 5) {
        return 1.2;
    }
    // Normal hours
    return 1.0;
}

// Predict fare
function predictFare(pickup, dropoff, time, vehicle) {
    // Get distance
    const distance = distanceMatrix[pickup][dropoff];
    
    // Calculate base fare
    const rate = vehicleRates[vehicle];
    const base = baseFare[vehicle];
    let fare = base + (distance * rate);
    
    // Apply surge
    const surge = getSurgeMultiplier(time);
    fare *= surge;
    
    // Add random variation (±8%) to simulate ML prediction variance
    const variation = 1 + (Math.random() * 0.16 - 0.08);
    fare *= variation;
    
    // Calculate fare range
    const fareMin = Math.round(fare * 0.92);
    const fareMax = Math.round(fare * 1.08);
    
    // Calculate confidence (higher for shorter distances, normal hours)
    let confidence = 95;
    if (distance > 15) confidence -= 5;
    if (surge > 1.0) confidence -= 3;
    confidence = Math.max(85, Math.min(98, confidence));
    
    return {
        fareMin,
        fareMax,
        distance,
        surge,
        confidence
    };
}

// Set current time on page load
window.addEventListener('load', function() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeInput = document.getElementById('ride-time');
    if (timeInput) {
        timeInput.value = `${hours}:${minutes}`;
    }
});

// Form submission handler
document.getElementById('fare-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const pickup = document.getElementById('pickup').value;
    const dropoff = document.getElementById('dropoff').value;
    const time = document.getElementById('ride-time').value;
    const vehicle = document.getElementById('vehicle').value;
    
    if (pickup === dropoff) {
        alert('Pickup and drop locations cannot be the same!');
        return;
    }
    
    const result = predictFare(pickup, dropoff, time, vehicle);
    
    // Display results
    document.getElementById('fare-amount').textContent = `₹${result.fareMin} - ₹${result.fareMax}`;
    document.getElementById('fare-distance').textContent = `${result.distance} km`;
    document.getElementById('fare-surge').textContent = `${result.surge.toFixed(1)}x`;
    document.getElementById('fare-confidence').textContent = `${result.confidence}%`;
    
    // Show result card with animation
    const resultCard = document.getElementById('fare-result');
    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Show route on Google Map
    if (typeof showRouteOnMap === 'function') {
        showRouteOnMap(pickup, dropoff);
    }
});
