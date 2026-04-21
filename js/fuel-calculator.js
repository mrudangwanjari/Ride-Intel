// Fuel Cost Calculator

// Fuel efficiency for each vehicle type (km per liter)
const fuelEfficiency = {
    'Bike': 45,
    'Auto Rickshaw': 25,
    'Sedan': 15,
    'SUV': 10
};

// Form submission handler
document.getElementById('fuel-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const vehicle = document.getElementById('fuel-vehicle').value;
    const distance = parseFloat(document.getElementById('distance').value);
    const fuelPrice = parseFloat(document.getElementById('fuel-price').value);
    
    // Get efficiency
    const efficiency = fuelEfficiency[vehicle];
    
    // Calculate fuel required
    const fuelRequired = distance / efficiency;
    
    // Calculate total cost
    const totalCost = fuelRequired * fuelPrice;
    
    // Calculate cost per km
    const costPerKm = totalCost / distance;
    
    // Display results
    document.getElementById('fuel-cost').textContent = `₹${totalCost.toFixed(2)}`;
    document.getElementById('fuel-required').textContent = `${fuelRequired.toFixed(2)} L`;
    document.getElementById('fuel-efficiency').textContent = `${efficiency} km/l`;
    document.getElementById('cost-per-km').textContent = `₹${costPerKm.toFixed(2)}`;
    
    // Generate insight
    let insight = '';
    if (vehicle === 'Bike') {
        insight = 'Bikes offer the best fuel efficiency for short to medium distances. Ideal for solo riders looking to minimize costs.';
    } else if (vehicle === 'Auto Rickshaw') {
        insight = 'Auto rickshaws provide a good balance between cost and comfort for 2-3 passengers. Consider carpooling to reduce per-person costs.';
    } else if (vehicle === 'Sedan') {
        insight = 'Sedans are suitable for comfortable rides with 3-4 passengers. Fuel costs are moderate - consider ride-sharing for longer distances.';
    } else if (vehicle === 'SUV') {
        insight = 'SUVs have the highest fuel consumption. Best for group travel (5-7 people) where the cost can be split among passengers.';
    }
    
    // Add distance-based insight
    if (distance > 20) {
        insight += ' For long distances, consider vehicles with better fuel efficiency to optimize costs.';
    }
    
    document.getElementById('fuel-insight').textContent = insight;
    
    // Show result card
    const resultCard = document.getElementById('fuel-result');
    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
