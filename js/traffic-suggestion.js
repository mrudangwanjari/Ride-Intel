// Traffic Suggestion System

// Traffic patterns by area and time
const trafficPatterns = {
    'Sitabuldi': { peakHours: [8, 9, 10, 17, 18, 19, 20], baseTraffic: 'moderate' },
    'Dharampeth': { peakHours: [8, 9, 17, 18, 19], baseTraffic: 'moderate' },
    'MIHAN': { peakHours: [7, 8, 17, 18], baseTraffic: 'low' },
    'Sadar': { peakHours: [9, 10, 18, 19, 20], baseTraffic: 'high' },
    'Wardha Road': { peakHours: [8, 9, 17, 18, 19], baseTraffic: 'moderate' },
    'Railway Station': { peakHours: [7, 8, 9, 17, 18, 19, 20, 21], baseTraffic: 'high' },
    'Airport': { peakHours: [6, 7, 8, 17, 18, 19], baseTraffic: 'low' },
    'Hingna': { peakHours: [8, 9, 17, 18], baseTraffic: 'low' },
    'Kamptee': { peakHours: [8, 9, 17, 18], baseTraffic: 'low' },
    'Butibori': { peakHours: [7, 8, 17, 18], baseTraffic: 'low' }
};

// Alternative routes mapping
const alternativeAreas = {
    'Sitabuldi': ['Dharampeth', 'Sadar'],
    'Dharampeth': ['Sitabuldi', 'Wardha Road'],
    'MIHAN': ['Airport', 'Hingna'],
    'Sadar': ['Sitabuldi', 'Railway Station'],
    'Wardha Road': ['Dharampeth', 'Hingna'],
    'Railway Station': ['Sitabuldi', 'Sadar'],
    'Airport': ['MIHAN', 'Hingna'],
    'Hingna': ['Wardha Road', 'MIHAN'],
    'Kamptee': ['Hingna', 'Butibori'],
    'Butibori': ['MIHAN', 'Hingna']
};

// Predict traffic status
function predictTraffic(area) {
    const now = new Date();
    const hour = now.getHours();
    const pattern = trafficPatterns[area];
    
    let trafficLevel = pattern.baseTraffic;
    let message = '';
    let alternatives = [];
    
    // Check if it's peak hour
    if (pattern.peakHours.includes(hour)) {
        trafficLevel = 'high';
        message = `🚨 Heavy traffic expected at ${area} right now. Peak hour congestion detected. Consider alternative routes to save time and fuel.`;
        
        // Get alternative areas with lower traffic
        const altAreas = alternativeAreas[area];
        alternatives = altAreas.map(alt => {
            const altPattern = trafficPatterns[alt];
            const altTraffic = altPattern.peakHours.includes(hour) ? 'moderate' : 'low';
            return {
                area: alt,
                traffic: altTraffic,
                timeSaved: Math.floor(Math.random() * 10) + 5 // 5-15 minutes
            };
        });
    } else if (hour >= 22 || hour < 6) {
        trafficLevel = 'low';
        message = `✅ Clear roads at ${area}. Night time - minimal traffic. Perfect conditions for quick rides and efficient navigation.`;
    } else {
        if (pattern.baseTraffic === 'high') {
            trafficLevel = 'moderate';
            message = `⚠️ Moderate traffic at ${area}. Roads are busy but moving. Plan your route accordingly.`;
        } else {
            trafficLevel = 'low';
            message = `✅ Light traffic at ${area}. Good conditions for smooth rides. Optimal time for efficient transportation.`;
        }
    }
    
    return {
        level: trafficLevel,
        message,
        alternatives
    };
}

// Form submission handler
document.getElementById('traffic-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const area = document.getElementById('traffic-area').value;
    const result = predictTraffic(area);
    
    // Set traffic badge
    const badge = document.getElementById('traffic-badge');
    badge.textContent = result.level.toUpperCase();
    badge.className = 'traffic-badge ' + result.level;
    
    // Display message
    document.getElementById('traffic-message').textContent = result.message;
    
    // Display alternative routes
    const altContainer = document.getElementById('alternative-routes');
    if (result.alternatives.length > 0) {
        let altHTML = '<h4>🔄 Alternative Areas</h4>';
        result.alternatives.forEach(alt => {
            altHTML += `
                <div class="route-option">
                    <strong>${alt.area}</strong> - ${alt.traffic} traffic
                    <br><small>Estimated time saved: ${alt.timeSaved} minutes</small>
                </div>
            `;
        });
        altContainer.innerHTML = altHTML;
    } else {
        altContainer.innerHTML = '';
    }
    
    // Show result card
    const resultCard = document.getElementById('traffic-result');
    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
