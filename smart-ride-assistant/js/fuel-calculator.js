/**
 * Fuel Cost Calculator
 * Estimates fuel cost for a given trip
 */

// Fuel efficiency (km per litre)
const FUEL_EFFICIENCY = {
  'Sedan':         14,   // avg petrol sedan
  'SUV':           10,   // avg SUV
  'Auto Rickshaw': 30,   // CNG auto
  'Bike':          45    // avg bike
};

// Fuel type per vehicle
const FUEL_TYPE = {
  'Sedan':         'Petrol',
  'SUV':           'Petrol/Diesel',
  'Auto Rickshaw': 'CNG',
  'Bike':          'Petrol'
};

// Default fuel prices (₹/litre or ₹/kg for CNG) — Nagpur approx
const DEFAULT_FUEL_PRICES = {
  'Petrol':        104.0,
  'Diesel':        90.5,
  'CNG':           86.0
};

/**
 * Calculate fuel cost
 */
function calculateFuelCost(vehicleType, distanceKm, fuelPrice) {
  const efficiency = FUEL_EFFICIENCY[vehicleType] || 14;
  const fuelType   = FUEL_TYPE[vehicleType] || 'Petrol';
  const price      = parseFloat(fuelPrice) || DEFAULT_FUEL_PRICES[fuelType.split('/')[0]] || 104;
  const distance   = parseFloat(distanceKm) || 0;

  if (distance <= 0) return { error: 'Please enter a valid distance.' };

  const fuelUsed   = distance / efficiency;
  const totalCost  = fuelUsed * price;
  const costPerKm  = totalCost / distance;

  // CO2 estimate (kg) — petrol: 2.31 kg/litre, diesel: 2.68, CNG: 1.96
  const co2Factors = { 'Petrol': 2.31, 'Diesel': 2.68, 'CNG': 1.96 };
  const co2Factor  = co2Factors[fuelType.split('/')[0]] || 2.31;
  const co2Emitted = fuelUsed * co2Factor;

  return {
    vehicleType,
    distance,
    fuelType,
    efficiency,
    fuelUsed:   fuelUsed.toFixed(2),
    fuelPrice:  price.toFixed(2),
    totalCost:  Math.round(totalCost),
    costPerKm:  costPerKm.toFixed(2),
    co2Emitted: co2Emitted.toFixed(2)
  };
}

/**
 * Render fuel calculator result
 */
function renderFuelResult(result, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (result.error) {
    container.innerHTML = `
      <div class="result-card danger">
        <p style="color:var(--danger)">⚠️ ${result.error}</p>
      </div>`;
    return;
  }

  const fuelIcon = result.fuelType === 'CNG' ? '🟢' : result.fuelType === 'Diesel' ? '⚫' : '🔴';

  container.innerHTML = `
    <div class="result-card" style="animation: slideUp 0.4s ease;">
      <div class="flex-between mb-16">
        <h3 style="font-size:1rem; color:var(--text-secondary); font-weight:500;">Fuel Cost Estimate</h3>
        <span class="badge badge-accent">${fuelIcon} ${result.fuelType}</span>
      </div>

      <div class="fare-display">
        <div class="fare-amount">₹${result.totalCost}</div>
        <div class="fare-range">Estimated fuel cost for ${result.distance} km</div>
      </div>

      <div class="divider"></div>

      <div class="info-row">
        <span class="label">🚗 Vehicle</span>
        <span class="value">${result.vehicleType}</span>
      </div>
      <div class="info-row">
        <span class="label">⛽ Fuel Used</span>
        <span class="value accent">${result.fuelUsed} ${result.fuelType === 'CNG' ? 'kg' : 'litres'}</span>
      </div>
      <div class="info-row">
        <span class="label">💹 Price per ${result.fuelType === 'CNG' ? 'kg' : 'litre'}</span>
        <span class="value">₹${result.fuelPrice}</span>
      </div>
      <div class="info-row">
        <span class="label">📊 Cost per km</span>
        <span class="value">₹${result.costPerKm}</span>
      </div>
      <div class="info-row">
        <span class="label">🌿 CO₂ Emitted</span>
        <span class="value" style="color:var(--text-secondary)">${result.co2Emitted} kg</span>
      </div>
      <div class="info-row">
        <span class="label">🔋 Fuel Efficiency</span>
        <span class="value">${result.efficiency} km/${result.fuelType === 'CNG' ? 'kg' : 'L'}</span>
      </div>

      <div class="tip-box mt-16">
        <span class="tip-icon">💡</span>
        <span>${getFuelTip(result)}</span>
      </div>
    </div>`;
}

function getFuelTip(result) {
  if (result.vehicleType === 'Auto Rickshaw') {
    return `CNG autos are the most eco-friendly and cost-effective option for city rides in Nagpur.`;
  }
  if (result.vehicleType === 'Bike') {
    return `Bikes offer the best fuel economy. Ideal for solo trips under 20 km.`;
  }
  if (result.vehicleType === 'SUV') {
    return `SUVs consume more fuel. Consider carpooling to reduce per-person cost and emissions.`;
  }
  return `Maintain steady speed and avoid frequent braking to improve fuel efficiency by up to 15%.`;
}

/**
 * Get default fuel price for a vehicle type
 */
function getDefaultFuelPrice(vehicleType) {
  const fuelType = FUEL_TYPE[vehicleType] || 'Petrol';
  return DEFAULT_FUEL_PRICES[fuelType.split('/')[0]] || 104;
}
