# 🚗 Ride-Intel

An AI-powered ride intelligence web application inspired by Uber and Ola, designed specifically for Nagpur city. This system demonstrates **Business Data-Driven Decision Making (BDDC)** through predictive analytics, regression analysis, and intelligent recommendations.

---

## 🚀 Quick Start

### Option 1: Easiest (No Setup)
```
Just double-click: index.html
```

### Option 2: Recommended (Local Server)
```bash
# Windows
start-server.bat

# Mac/Linux
bash start-server.sh

# Or manually
python -m http.server 8000
```

Then open: **http://localhost:8000**

---

## 🎨 Design Theme

- **Colors**: Black (#0a0a0a), White (#ffffff), and Neon Yellow-Green (#DFFF00)
- **Style**: Dark, sleek, modern interface with glassmorphism effects
- **Animations**: Smooth transitions and Three.js particle network on landing page

---

## ✨ Features

### 👤 User Portal

#### 💰 Fare Prediction
- Predict ride fares using regression analysis
- Input: Pickup area, Drop area, Time, Vehicle type
- Output: Fare range, Distance, Surge multiplier, Confidence level
- **BDDC Application**: Price prediction using historical patterns

#### ⛽ Fuel Cost Calculator
- Calculate fuel costs for different vehicle types
- Vehicle efficiency data: Bike (45 km/l), Auto (25 km/l), Sedan (15 km/l), SUV (10 km/l)
- Output: Total fuel cost, Fuel required, Cost per km
- **BDDC Application**: Cost optimization insights

### 🚗 Driver Portal

#### 📍 Demand Prediction (CORE FEATURE)
- Predict high-demand areas using time-based analytics
- Input: Area, Time
- Output: Demand level (High/Medium/Low), Expected rides, Competition, Recommendations
- **BDDC Application**: Predictive analytics for driver positioning

#### 🚦 Traffic Suggestion
- Real-time traffic status and alternative route suggestions
- Input: Area
- Output: Traffic level, Alternative areas, Time savings
- **BDDC Application**: Route optimization

#### 💸 Earnings Estimator
- Calculate potential earnings based on hours, area, and vehicle type
- Output: Daily earnings, Weekly estimate, Hourly rate, Expected rides
- **BDDC Application**: Income forecasting

#### 📊 Demand Visualization
- Interactive bar chart showing demand across all Nagpur areas
- Real-time updates based on time of day
- Color-coded demand levels (Red: High, Orange: Medium, Green: Low)

---

## 🏙️ Nagpur Areas Covered

1. Sitabuldi
2. Dharampeth
3. MIHAN
4. Sadar
5. Wardha Road
6. Nagpur Railway Station
7. Airport
8. Hingna
9. Kamptee
10. Butibori

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js (particle network animation)
- **Data Visualization**: Chart.js (demand charts)
- **Fonts**: Google Fonts (Inter)
- **Architecture**: Pure frontend - No backend required

---

## 📊 ML Simulation Logic

### Fare Prediction Algorithm
```javascript
fare = baseFare + (distance × ratePerKm) × surgeMultiplier × variation
```
- **Surge Multipliers**: Morning peak (1.3x), Evening peak (1.4x), Night (1.2x)
- **Variation**: ±8% random variation to simulate ML prediction uncertainty
- **Confidence**: 85-98% based on distance and time

### Demand Prediction Algorithm
- Time-based patterns for each area
- Morning peaks: 7-10 AM
- Evening peaks: 5-8 PM
- Night hours: 10 PM - 5 AM (low demand)
- Area-specific base demand levels

### Traffic Prediction
- Peak hour detection per area
- Alternative route suggestions
- Time savings estimation

---

## 📁 Project Structure

```
ride-intel/
│
├── 🌐 HTML Pages
│   ├── index.html              # Landing page with Three.js animation
│   ├── login.html              # Portal selection (User/Driver)
│   ├── user-portal.html        # User features (Fare & Fuel)
│   └── driver-portal.html      # Driver features (Demand, Traffic, Earnings)
│
├── 🎨 Styles
│   └── css/
│       └── style.css           # Unified stylesheet
│
├── ⚙️ JavaScript
│   └── js/
│       ├── landing.js          # Three.js particle animation
│       ├── fare-prediction.js  # Fare calculation logic
│       ├── fuel-calculator.js  # Fuel cost calculator
│       ├── demand-prediction.js # Demand analytics
│       ├── traffic-suggestion.js # Traffic intelligence
│       ├── earnings-estimator.js # Earnings calculator
│       └── demand-chart.js     # Chart.js visualization
│
├── 🚀 Launch Scripts
│   ├── start-server.bat        # Windows launcher
│   └── start-server.sh         # Mac/Linux launcher
│
└── 📚 Documentation
    └── README.md               # This file
```

---

## 🎮 How to Use

### For Users (Riders)

1. Click **"User Login"**
2. **Predict Fare:**
   - Select pickup: Sitabuldi
   - Select drop: Airport
   - Choose time: 08:00
   - Select vehicle: Sedan
   - Click "Predict Fare"
   - See: ₹200-250 with 1.3x surge
3. **Calculate Fuel:**
   - Select vehicle: Bike
   - Enter distance: 20 km
   - See fuel cost and efficiency

### For Drivers

1. Click **"Driver Login"**
2. **Check Demand:**
   - Select area: Railway Station
   - Choose time: 08:00
   - See: HIGH demand, 8-12 rides/hour
3. **Check Traffic:**
   - Select area: Sitabuldi
   - See traffic status + alternatives
4. **Estimate Earnings:**
   - Hours: 8
   - Area: Airport
   - Vehicle: Sedan
   - See: ₹3,000-4,000/day
5. **View Demand Chart:**
   - See all areas at once
   - Color-coded demand levels

---

## 🧪 Test Scenarios

### Scenario 1: Peak Hour Ride
```
Pickup: Railway Station
Drop: Airport
Time: 08:00 (morning peak)
Vehicle: Sedan
Expected: High fare with 1.3x surge
```

### Scenario 2: High Demand Area
```
Area: Railway Station
Time: 08:30
Expected: HIGH demand, 8-12 rides/hour
```

### Scenario 3: Fuel Efficiency
```
Vehicle: Bike (45 km/l)
Distance: 20 km
Expected: ~₹47 fuel cost
```

### Scenario 4: Earnings Potential
```
Hours: 8
Area: Airport
Vehicle: Sedan
Expected: ₹3,000-4,000/day
```

---

## 🎯 BDDC Mapping

| Feature | BDDC Concept | Implementation |
|---------|--------------|----------------|
| Fare Prediction | Regression Analysis | Distance-based pricing with surge multipliers |
| Demand Prediction | Predictive Analytics | Time-series pattern matching |
| Traffic Suggestion | Decision Support System | Real-time route optimization |
| Fuel Calculator | Cost Optimization | Efficiency-based cost analysis |
| Earnings Estimator | Forecasting | Multi-factor income prediction |
| Demand Visualization | Data Analytics | Real-time demand heatmap |

---

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 📱 Mobile Support

Fully responsive! Works on:
- 💻 Desktop (1920px+)
- 💻 Laptop (1366px - 1920px)
- 📱 Tablet (768px - 1366px)
- 📱 Mobile (320px - 768px)

---

## 🐛 Troubleshooting

### Three.js not loading?
- Check internet connection (CDN required)
- Try refreshing the page

### Chart not showing?
- Check internet connection (CDN required)
- Ensure you're on driver portal, visualization tab

### Time input not working?
- Click directly on the time field
- Or type manually (e.g., 08:30)
- Time auto-fills with current time
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### Styles not working?
- Ensure css/style.css exists
- Check browser console (F12) for errors
- Clear browser cache

---

## 🎓 Educational Value

This project demonstrates:
- **Predictive Analytics** - Demand forecasting
- **Regression Analysis** - Fare prediction
- **Data Visualization** - Interactive charts
- **Decision Support** - Traffic & route optimization
- **Cost Optimization** - Fuel efficiency analysis
- **Frontend Development** - Modern web technologies
- **UI/UX Design** - Dark theme, animations
- **Responsive Design** - Mobile-first approach

---

## 🔮 Future Enhancements

### Phase 2 (Backend Integration)
- [ ] Python Flask/Django API
- [ ] PostgreSQL database
- [ ] User authentication
- [ ] Real-time data sync

### Phase 3 (ML Integration)
- [ ] Scikit-learn models
- [ ] Kaggle dataset training
- [ ] Improved predictions
- [ ] Historical analytics

### Phase 4 (Advanced Features)
- [ ] GPS tracking
- [ ] Payment gateway
- [ ] Driver-rider matching
- [ ] Weather integration
- [ ] Multi-city support

---

## 📄 License

This is a demonstration project for educational purposes.

---

## 👨‍💻 Developer Notes

### Key Features Implemented:
1. ✅ Three.js animated landing page
2. ✅ Dual portal system (User/Driver)
3. ✅ ML-inspired fare prediction
4. ✅ Time-based demand analytics
5. ✅ Interactive Chart.js visualization
6. ✅ Traffic intelligence system
7. ✅ Earnings forecasting
8. ✅ Fuel cost optimization
9. ✅ Black/White/Yellow (#DFFF00) theme
10. ✅ Fully responsive design

### Data Sources:
- Distance matrix: Approximate distances between Nagpur areas
- Demand patterns: Simulated based on typical urban mobility patterns
- Pricing: Based on average ride-sharing rates in India

---

**Built with ❤️ for demonstrating Business Data-Driven Decision Making (BDDC)**

**Status: ✅ PRODUCTION READY**

---

*Project: Ride-Intel | Last Updated: April 21, 2026*
