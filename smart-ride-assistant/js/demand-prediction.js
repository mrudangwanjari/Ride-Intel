/**
 * Demand Prediction Engine
 * Simulates ML-based ride demand prediction for Nagpur areas
 */

// Demand score (0–100) per area per hour of day
// Based on realistic Nagpur city patterns
const DEMAND_PATTERNS = {
  'Sitabuldi': {
    // Commercial hub — high during business hours
    hourly: [15, 10, 8, 8, 12, 25, 55, 80, 90, 75, 70, 65, 60, 55, 60, 65, 70, 85, 80, 65, 50, 40, 30, 20]
  },
  'Dharampeth': {
    // Residential + commercial — morning and evening peaks
    hourly: [10, 8, 6, 6, 10, 20, 50, 75, 70, 60, 55, 50, 55, 50, 55, 65, 80, 90, 75, 60, 45, 35, 25, 15]
  },
  'MIHAN': {
    // SEZ/Airport zone — business hours + flight times
    hourly: [20, 15, 12, 12, 18, 30, 45, 60, 70, 65, 60, 55, 50, 55, 60, 65, 70, 65, 55, 45, 40, 35, 30, 25]
  },
  'Sadar': {
    // Mixed residential/commercial
    hourly: [12, 8, 6, 6, 10, 22, 48, 72, 68, 58, 55, 52, 58, 55, 58, 62, 75, 85, 72, 58, 42, 32, 22, 16]
  },
  'Wardha Road': {
    // Major arterial road — consistent traffic
    hourly: [18, 12, 10, 10, 15, 28, 52, 70, 75, 68, 62, 58, 60, 58, 62, 68, 78, 82, 70, 58, 45, 38, 28, 22]
  },
  'Nagpur Railway Station': {
    // Train arrivals/departures — spiky demand
    hourly: [35, 30, 25, 28, 35, 50, 70, 85, 80, 65, 60, 55, 65, 60, 65, 70, 80, 90, 85, 75, 65, 55, 50, 42]
  },
  'Airport': {
    // Flight schedule based — peaks at flight times
    hourly: [30, 25, 20, 22, 30, 45, 65, 75, 70, 60, 55, 50, 60, 55, 60, 65, 70, 75, 70, 60, 55, 50, 45, 38]
  },
  'Hingna': {
    // Industrial area — shift-based demand
    hourly: [15, 10, 8, 8, 12, 30, 60, 75, 70, 55, 45, 40, 45, 40, 45, 55, 70, 75, 65, 50, 35, 25, 20, 18]
  },
  'Kamptee': {
    // Suburban — lower overall demand
    hourly: [10, 8, 6, 6, 10, 18, 40, 58, 55, 45, 40, 38, 42, 40, 42, 48, 60, 68, 58, 45, 32, 25, 18, 12]
  },
  'Butibori': {
    // Industrial suburb — shift-based
    hourly: [12, 8, 6, 6, 10, 25, 55, 70, 65, 50, 42, 38, 42, 38, 42, 50, 65, 70, 60, 45, 30, 22, 18, 14]
  }
};

// Weekend modifier (some areas busier on weekends)
const WEEKEND_MODIFIER = {
  'Sitabuldi':              1.15,
  'Dharampeth':             0.90,
  'MIHAN':                  0.75,
  'Sadar':                  1.10,
  'Wardha Road':            0.85,
  'Nagpur Railway Station': 1.20,
  'Airport':                1.10,
  'Hingna':                 0.70,
  'Kamptee':                0.95,
  'Butibori':               0.65
};

// Nearby alternative areas for each area
const NEARBY_AREAS = {
  'Sitabuldi':              ['Sadar', 'Dharampeth'],
  'Dharampeth':             ['Sitabuldi', 'Wardha Road'],
  'MIHAN':                  ['Airport', 'Hingna'],
  'Sadar':                  ['Sitabuldi', 'Nagpur Railway Station'],
  'Wardha Road':            ['Dharampeth', 'Hingna'],
  'Nagpur Railway Station': ['Sitabuldi', 'Sadar'],
  'Airport':                ['MIHAN', 'Hingna'],
  'Hingna':                 ['Wardha Road', 'Butibori'],
  'Kamptee':                ['Nagpur Railway Station', 'Sitabuldi'],
  'Butibori':               ['Hingna', 'Wardha Road']
};

/**
 * Get demand level label and color class
 */
function getDemandLevel(score) {
  if (score >= 65) return { level: 'High',   class: 'high',   color: 'var(--success)', barClass: 'high' };
  if (score >= 35) return { level: 'Medium', class: 'medium', color: 'var(--warning)', barClass: 'medium' };
  return              { level: 'Low',    class: 'low',    color: 'var(--danger)',  barClass: 'low' };
}

/**
 * Get day type
 */
function getDayType(date) {
  const day = date.getDay();
  return (day === 0 || day === 6) ? 'weekend' : 'weekday';
}

/**
 * Predict demand for an area at a given time
 */
function predictDemand(area, timeStr, dateObj) {
  const [hourStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const date = dateObj || new Date();
  const isWeekend = getDayType(date) === 'weekend';

  const pattern = DEMAND_PATTERNS[area];
  if (!pattern) return { error: 'Area not found.' };

  let score = pattern.hourly[hour] || 50;

  // Apply weekend modifier
  if (isWeekend) {
    score = score * (WEEKEND_MODIFIER[area] || 1.0);
  }

  // Add small random variation ±8
  score += (Math.random() * 16) - 8;
  score = Math.min(100, Math.max(5, Math.round(score)));

  const demandInfo = getDemandLevel(score);

  // Find best nearby area
  const nearby = NEARBY_AREAS[area] || [];
  const nearbyScores = nearby.map(a => {
    let s = (DEMAND_PATTERNS[a]?.hourly[hour] || 50);
    if (isWeekend) s *= (WEEKEND_MODIFIER[a] || 1.0);
    return { area: a, score: Math.round(s) };
  }).sort((a, b) => b.score - a.score);

  const bestNearby = nearbyScores[0];

  // Generate contextual message
  const message = generateDemandMessage(area, hour, score, demandInfo.level, isWeekend);

  // Hourly forecast for next 6 hours
  const forecast = [];
  for (let i = 0; i < 6; i++) {
    const fHour = (hour + i) % 24;
    let fScore = pattern.hourly[fHour] || 50;
    if (isWeekend) fScore *= (WEEKEND_MODIFIER[area] || 1.0);
    fScore = Math.min(100, Math.max(5, Math.round(fScore)));
    forecast.push({ hour: fHour, score: fScore, level: getDemandLevel(fScore).level });
  }

  return {
    area,
    hour,
    score,
    demandInfo,
    message,
    isWeekend,
    bestNearby,
    nearbyScores,
    forecast
  };
}

/**
 * Generate human-readable demand message
 */
function generateDemandMessage(area, hour, score, level, isWeekend) {
  const timeLabel = getTimeLabel(hour);
  const dayLabel  = isWeekend ? 'weekend' : 'weekday';

  const messages = {
    High: [
      `🔥 High demand at ${area} during ${timeLabel}. Position here for quick pickups!`,
      `📈 ${area} is a hotspot right now. Expect multiple ride requests in ${timeLabel}.`,
      `⚡ Peak demand at ${area}. Riders are actively looking for ${vehicleHint(area, hour)}.`
    ],
    Medium: [
      `📊 Moderate demand at ${area} during ${timeLabel}. Steady ride flow expected.`,
      `🚗 Average activity at ${area}. Good for consistent earnings this ${dayLabel}.`,
      `📍 Decent demand at ${area}. ${timeLabel} typically sees regular bookings here.`
    ],
    Low: [
      `📉 Low demand at ${area} right now. Consider moving to a busier zone.`,
      `⚠️ Slow period at ${area} during ${timeLabel}. Better opportunities nearby.`,
      `🔄 Demand is low at ${area}. This is a good time to reposition.`
    ]
  };

  const pool = messages[level] || messages['Medium'];
  return pool[Math.floor(Math.random() * pool.length)];
}

function getTimeLabel(hour) {
  if (hour >= 5  && hour < 9)  return 'early morning';
  if (hour >= 9  && hour < 12) return 'mid-morning';
  if (hour >= 12 && hour < 14) return 'lunch hours';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening rush';
  if (hour >= 20 && hour < 23) return 'night hours';
  return 'late night';
}

function vehicleHint(area, hour) {
  if (area === 'Airport' || area === 'MIHAN') return 'Sedans and SUVs';
  if (hour >= 7 && hour < 10) return 'quick rides to offices';
  if (hour >= 17 && hour < 20) return 'rides back home';
  return 'rides';
}

/**
 * Get demand scores for all areas at a given hour (for chart)
 */
function getAllAreaDemand(hour, isWeekend) {
  return Object.keys(DEMAND_PATTERNS).map(area => {
    let score = DEMAND_PATTERNS[area].hourly[hour] || 50;
    if (isWeekend) score *= (WEEKEND_MODIFIER[area] || 1.0);
    score = Math.min(100, Math.max(5, Math.round(score)));
    return { area, score, level: getDemandLevel(score).level };
  });
}

/**
 * Render demand prediction result
 */
function renderDemandResult(result, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (result.error) {
    container.innerHTML = `<div class="result-card danger"><p style="color:var(--danger)">⚠️ ${result.error}</p></div>`;
    return;
  }

  const { area, score, demandInfo, message, bestNearby, forecast, isWeekend } = result;

  const forecastHtml = forecast.map(f => {
    const colors = { High: 'var(--success)', Medium: 'var(--warning)', Low: 'var(--danger)' };
    const h = f.hour.toString().padStart(2, '0');
    return `
      <div style="text-align:center; flex:1;">
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-bottom:4px;">${h}:00</div>
        <div style="height:${Math.max(8, f.score * 0.6)}px; background:${colors[f.level]}; border-radius:3px; opacity:0.8; min-height:8px;"></div>
        <div style="font-size:0.7rem; color:${colors[f.level]}; margin-top:4px;">${f.level[0]}</div>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="result-card" style="animation: slideUp 0.4s ease;">
      <div class="flex-between mb-16">
        <h3 style="font-size:1rem; color:var(--text-secondary); font-weight:500;">Demand Forecast</h3>
        <span class="badge badge-${demandInfo.class === 'high' ? 'success' : demandInfo.class === 'medium' ? 'warning' : 'danger'}">
          ${demandInfo.level} Demand
        </span>
      </div>

      <div style="text-align:center; padding: 16px 0;">
        <div style="font-size:3.5rem; font-weight:900; color:${demandInfo.color}; font-family:'Poppins',sans-serif; line-height:1;">
          ${score}<span style="font-size:1.5rem; opacity:0.6;">/100</span>
        </div>
        <div style="color:var(--text-secondary); font-size:0.9rem; margin-top:4px;">Demand Score</div>
      </div>

      <div class="demand-meter">
        <div class="demand-bar-track">
          <div class="demand-bar-fill ${demandInfo.barClass}" style="width:${score}%"></div>
        </div>
      </div>

      <div style="margin: 16px 0; padding: 14px; background: rgba(255,255,255,0.03); border-radius: 8px; font-size:0.9rem; line-height:1.5;">
        ${message}
      </div>

      <div class="divider"></div>

      <div class="info-row">
        <span class="label">📍 Area</span>
        <span class="value">${area}</span>
      </div>
      <div class="info-row">
        <span class="label">📅 Day Type</span>
        <span class="value">${isWeekend ? '🗓 Weekend' : '💼 Weekday'}</span>
      </div>
      ${bestNearby ? `
      <div class="info-row">
        <span class="label">🎯 Best Nearby</span>
        <span class="value accent">${bestNearby.area} (${bestNearby.score}/100)</span>
      </div>` : ''}

      <div style="margin-top:20px;">
        <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:10px; text-transform:uppercase; letter-spacing:0.6px;">6-Hour Forecast</div>
        <div style="display:flex; gap:8px; align-items:flex-end; height:60px;">
          ${forecastHtml}
        </div>
      </div>
    </div>`;
}
