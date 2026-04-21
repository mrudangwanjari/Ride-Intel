/**
 * Fare Prediction Engine
 * Simulates ML-based fare prediction for Nagpur city
 */

const AREAS = [
  'Sitabuldi', 'Dharampeth', 'MIHAN', 'Sadar', 'Wardha Road',
  'Nagpur Railway Station', 'Airport', 'Hingna', 'Kamptee', 'Butibori'
];

// Distance matrix (km) between areas — symmetric
const DISTANCE_MATRIX = {
  'Sitabuldi':              { 'Sitabuldi': 0,    'Dharampeth': 3.2,  'MIHAN': 22,   'Sadar': 2.5,  'Wardha Road': 8,    'Nagpur Railway Station': 1.8, 'Airport': 8.5,  'Hingna': 18,  'Kamptee': 14,  'Butibori': 28 },
  'Dharampeth':             { 'Sitabuldi': 3.2,  'Dharampeth': 0,    'MIHAN': 20,   'Sadar': 4.1,  'Wardha Road': 6.5,  'Nagpur Railway Station': 4.5, 'Airport': 9.2,  'Hingna': 16,  'Kamptee': 16,  'Butibori': 26 },
  'MIHAN':                  { 'Sitabuldi': 22,   'Dharampeth': 20,   'MIHAN': 0,    'Sadar': 21,   'Wardha Road': 14,   'Nagpur Railway Station': 23,  'Airport': 5.5,  'Hingna': 12,  'Kamptee': 34,  'Butibori': 18 },
  'Sadar':                  { 'Sitabuldi': 2.5,  'Dharampeth': 4.1,  'MIHAN': 21,   'Sadar': 0,    'Wardha Road': 9,    'Nagpur Railway Station': 3.2, 'Airport': 9.8,  'Hingna': 19,  'Kamptee': 15,  'Butibori': 29 },
  'Wardha Road':            { 'Sitabuldi': 8,    'Dharampeth': 6.5,  'MIHAN': 14,   'Sadar': 9,    'Wardha Road': 0,    'Nagpur Railway Station': 9.5, 'Airport': 10,   'Hingna': 10,  'Kamptee': 22,  'Butibori': 20 },
  'Nagpur Railway Station': { 'Sitabuldi': 1.8,  'Dharampeth': 4.5,  'MIHAN': 23,   'Sadar': 3.2,  'Wardha Road': 9.5,  'Nagpur Railway Station': 0,   'Airport': 10,   'Hingna': 20,  'Kamptee': 13,  'Butibori': 30 },
  'Airport':                { 'Sitabuldi': 8.5,  'Dharampeth': 9.2,  'MIHAN': 5.5,  'Sadar': 9.8,  'Wardha Road': 10,   'Nagpur Railway Station': 10,  'Airport': 0,    'Hingna': 8,   'Kamptee': 22,  'Butibori': 14 },
  'Hingna':                 { 'Sitabuldi': 18,   'Dharampeth': 16,   'MIHAN': 12,   'Sadar': 19,   'Wardha Road': 10,   'Nagpur Railway Station': 20,  'Airport': 8,    'Hingna': 0,   'Kamptee': 30,  'Butibori': 12 },
  'Kamptee':                { 'Sitabuldi': 14,   'Dharampeth': 16,   'MIHAN': 34,   'Sadar': 15,   'Wardha Road': 22,   'Nagpur Railway Station': 13,  'Airport': 22,   'Hingna': 30,  'Kamptee': 0,   'Butibori': 42 },
  'Butibori':               { 'Sitabuldi': 28,   'Dharampeth': 26,   'MIHAN': 18,   'Sadar': 29,   'Wardha Road': 20,   'Nagpur Railway Station': 30,  'Airport': 14,   'Hingna': 12,  'Kamptee': 42,  'Butibori': 0  }
};

// Base rate per km (₹)
const BASE_RATES = {
  'Auto Rickshaw': 12,
  'Bike':          8,
  'Sedan':         15,
  'SUV':           20
};

// Minimum fare (₹)
const MIN_FARE = {
  'Auto Rickshaw': 30,
  'Bike':          20,
  'Sedan':         50,
  'SUV':           80
};

// Base fare (flag-down charge)
const BASE_FARE = {
  'Auto Rickshaw': 15,
  'Bike':          10,
  'Sedan':         25,
  'SUV':           40
};

/**
 * Calculate surge multiplier based on time
 */
function getSurgeMultiplier(hour) {
  if (hour >= 7 && hour < 10)  return { multiplier: 1.3, label: 'Morning Peak', reason: '7–10 AM rush hour' };
  if (hour >= 17 && hour < 20) return { multiplier: 1.3, label: 'Evening Peak', reason: '5–8 PM rush hour' };
  if (hour >= 22 || hour < 5)  return { multiplier: 1.2, label: 'Late Night',   reason: 'Late night premium' };
  if (hour >= 12 && hour < 14) return { multiplier: 1.1, label: 'Lunch Rush',   reason: '12–2 PM lunch hour' };
  return { multiplier: 1.0, label: 'Normal',       reason: 'Standard pricing' };
}

/**
 * Get distance between two areas
 */
function getDistance(from, to) {
  if (from === to) return 0;
  return DISTANCE_MATRIX[from]?.[to] ?? DISTANCE_MATRIX[to]?.[from] ?? 10;
}

/**
 * Predict fare
 */
function predictFare(pickup, drop, timeStr, vehicleType) {
  const [hourStr, minStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);

  const distance = getDistance(pickup, drop);
  if (distance === 0) {
    return { error: 'Pickup and drop locations are the same.' };
  }

  const rate = BASE_RATES[vehicleType] || 12;
  const baseFare = BASE_FARE[vehicleType] || 15;
  const minFare = MIN_FARE[vehicleType] || 30;
  const surge = getSurgeMultiplier(hour);

  // Base calculation
  const rawFare = baseFare + (distance * rate);
  const surgedFare = rawFare * surge.multiplier;
  const finalFare = Math.max(surgedFare, minFare);

  // Add ±10% variation for range
  const variation = finalFare * 0.10;
  const low  = Math.round(finalFare - variation);
  const high = Math.round(finalFare + variation);

  // Confidence: higher for shorter distances and normal hours
  let confidence = 94;
  if (distance > 20) confidence -= 4;
  if (surge.multiplier > 1.0) confidence -= 2;
  confidence += Math.floor(Math.random() * 4) - 2; // ±2 random
  confidence = Math.min(98, Math.max(82, confidence));

  // Estimated time (minutes)
  const avgSpeed = (hour >= 7 && hour < 10) || (hour >= 17 && hour < 20) ? 18 : 28;
  const estimatedTime = Math.round((distance / avgSpeed) * 60);

  return {
    pickup,
    drop,
    vehicleType,
    distance: distance.toFixed(1),
    fareMin: low,
    fareMax: high,
    fareMid: Math.round(finalFare),
    surge: surge,
    confidence,
    estimatedTime,
    hour,
    minute
  };
}

/**
 * Render fare prediction result
 */
function renderFareResult(result, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (result.error) {
    container.innerHTML = `
      <div class="result-card danger">
        <p style="color:var(--danger)">⚠️ ${result.error}</p>
      </div>`;
    return;
  }

  const surgeHtml = result.surge.multiplier > 1.0
    ? `<span class="badge badge-warning">⚡ ${result.surge.label} ${result.surge.multiplier}x</span>`
    : `<span class="badge badge-success">✓ Standard Pricing</span>`;

  container.innerHTML = `
    <div class="result-card" style="animation: slideUp 0.4s ease;">
      <div class="flex-between mb-16">
        <h3 style="font-size:1rem; color:var(--text-secondary); font-weight:500;">Predicted Fare</h3>
        ${surgeHtml}
      </div>

      <div class="fare-display">
        <div class="fare-amount">₹${result.fareMin} – ₹${result.fareMax}</div>
        <div class="fare-range">Estimated fare for ${result.vehicleType}</div>
      </div>

      <div class="divider"></div>

      <div class="info-row">
        <span class="label">📍 Route</span>
        <span class="value">${result.pickup} → ${result.drop}</span>
      </div>
      <div class="info-row">
        <span class="label">📏 Distance</span>
        <span class="value accent">${result.distance} km</span>
      </div>
      <div class="info-row">
        <span class="label">⏱ Est. Time</span>
        <span class="value">${result.estimatedTime} mins</span>
      </div>
      <div class="info-row">
        <span class="label">💰 Base Fare</span>
        <span class="value">₹${result.fareMid}</span>
      </div>
      ${result.surge.multiplier > 1.0 ? `
      <div class="info-row">
        <span class="label">⚡ Surge</span>
        <span class="value" style="color:var(--warning)">${result.surge.multiplier}x — ${result.surge.reason}</span>
      </div>` : ''}

      <div class="confidence-bar mt-16">
        <div class="confidence-label">
          <span>Prediction Confidence</span>
          <span style="color:var(--accent); font-weight:700;">${result.confidence}%</span>
        </div>
        <div class="confidence-track">
          <div class="confidence-fill" style="width: ${result.confidence}%"></div>
        </div>
      </div>

      <div class="tip-box mt-16">
        <span class="tip-icon">💡</span>
        <span>${getTip(result)}</span>
      </div>
    </div>`;
}

function getTip(result) {
  if (result.surge.multiplier >= 1.3) {
    return `Surge pricing active. Consider waiting 20–30 minutes for normal rates, or try booking a ${result.vehicleType === 'Sedan' ? 'Bike' : 'Bike'} for a cheaper option.`;
  }
  if (result.distance > 20) {
    return `Long distance ride. SUV or Sedan recommended for comfort. Confirm fare with driver before starting.`;
  }
  if (result.vehicleType === 'Auto Rickshaw' && result.distance < 5) {
    return `Short distance — Auto Rickshaw is the most economical choice for this route.`;
  }
  return `Prices may vary slightly based on actual route and traffic conditions.`;
}
