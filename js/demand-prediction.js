// Demand Prediction using time-based patterns

// Demand patterns for each area by hour (0-23)
const demandPatterns = {
    'Sitabuldi': {
        morning: [7, 8, 9, 10],  // High demand hours
        evening: [17, 18, 19, 20],
        baseLevel: 'medium'
    },
    'Dharampeth': {
        morning: [8, 9, 10],
        evening: [17, 18, 19, 20, 21],
        baseLevel: 'high'
    },
    'MIHAN': {
        morning: [6, 7, 8],
        evening: [17, 18, 19],
        baseLevel: 'low'
    },
    'Sadar': {
        morning: [7, 8, 9],
        evening: [18, 19, 20],
        baseLevel: 'medium'
    },
    'Wardha Road': {
        morning: [7, 8, 9],
        evening: [17, 18, 19],
        baseLevel: 'medium'
    },
    'Railway Station': {
        morning: [6, 7, 8, 9, 10],
        evening: [17, 18, 19, 20, 21],
        baseLevel: 'high'
    },
    'Airport': {
        morning: [5, 6, 7, 8],
        evening: [17, 18, 19, 20, 21, 22],
        baseLevel: 'medium'
    },
    'Hingna': {
        morning: [7, 8, 9],
        evening: [17, 18, 19],
        baseLevel: 'low'
    },
    'Kamptee': {
        morning: [7, 8, 9],
        evening: [17, 18, 19],
        baseLevel: 'low'
    },
    'Butibori': {
        morning: [6, 7, 8, 9],
        evening: [17, 18, 19],
        baseLevel: 'low'
    }
};

// Predict demand level
function predictDemand(area, time) {
    const hour = parseInt(time.split(':')[0]);
    const pattern = demandPatterns[area];
    
    let demandLevel = pattern.baseLevel;
    let expectedRides = 0;
    let competition = 'Medium';
    let recommendation = 'Consider';
    
    // Check if it's peak hours
    if (pattern.morning.includes(hour)) {
        demandLevel = 'high';
        expectedRides = Math.floor(Math.random() * 5) + 8; // 8-12 rides
        competition = 'High';
        recommendation = 'Go Now!';
    } else if (pattern.evening.includes(hour)) {
        demandLevel = 'high';
        expectedRides = Math.floor(Math.random() * 6) + 10; // 10-15 rides
        competition = 'High';
        recommendation = 'Go Now!';
    } else if (hour >= 22 || hour < 6) {
        demandLevel = 'low';
        expectedRides = Math.floor(Math.random() * 3) + 1; // 1-3 rides
        competition = 'Low';
        recommendation = 'Low Activity';
    } else {
        demandLevel = pattern.baseLevel;
        if (demandLevel === 'high') {
            expectedRides = Math.floor(Math.random() * 4) + 5; // 5-8 rides
            competition = 'Medium';
            recommendation = 'Good Time';
        } else if (demandLevel === 'medium') {
            expectedRides = Math.floor(Math.random() * 3) + 3; // 3-5 rides
            competition = 'Medium';
            recommendation = 'Consider';
        } else {
            expectedRides = Math.floor(Math.random() * 2) + 2; // 2-3 rides
            competition = 'Low';
            recommendation = 'Explore Other Areas';
        }
    }
    
    // Generate message
    let message = '';
    if (demandLevel === 'high') {
        message = `🔥 High demand expected at ${area} around ${time}. This is a peak time with many ride requests. Position yourself here for maximum earnings!`;
    } else if (demandLevel === 'medium') {
        message = `⚡ Moderate demand at ${area} during this time. Steady ride requests expected. Good area for consistent earnings.`;
    } else {
        message = `💤 Low demand at ${area} at this hour. Consider moving to busier areas like Railway Station or Dharampeth for better opportunities.`;
    }
    
    return {
        level: demandLevel,
        expectedRides,
        competition,
        recommendation,
        message
    };
}

// Get alternative high-demand areas
function getAlternativeAreas(currentArea, time) {
    const hour = parseInt(time.split(':')[0]);
    const alternatives = [];
    
    for (const [area, pattern] of Object.entries(demandPatterns)) {
        if (area !== currentArea) {
            if (pattern.morning.includes(hour) || pattern.evening.includes(hour)) {
                alternatives.push(area);
            }
        }
    }
    
    return alternatives.slice(0, 3); // Return top 3
}

// Set current time on page load
window.addEventListener('load', function() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeInput = document.getElementById('demand-time');
    if (timeInput) {
        timeInput.value = `${hours}:${minutes}`;
    }
});

// Form submission handler
document.getElementById('demand-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const area = document.getElementById('demand-area').value;
    const time = document.getElementById('demand-time').value;
    
    const result = predictDemand(area, time);
    
    // Set demand badge
    const badge = document.getElementById('demand-badge');
    badge.textContent = result.level.toUpperCase();
    badge.className = 'demand-badge ' + result.level;
    
    // Display results
    document.getElementById('demand-message').textContent = result.message;
    document.getElementById('expected-rides').textContent = result.expectedRides + ' rides/hour';
    document.getElementById('competition').textContent = result.competition;
    document.getElementById('recommendation').textContent = result.recommendation;
    
    // Show result card
    const resultCard = document.getElementById('demand-result');
    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
