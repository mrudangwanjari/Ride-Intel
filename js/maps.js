// Ride-Intel - Google Maps Integration
// Handles maps for both User Portal and Driver Portal

const GOOGLE_MAPS_API_KEY = 'AIzaSyD6hbww8suMxQM4u4oIOSzADUK2HaArjvA';

// Coordinates for all Nagpur areas
const areaCoordinates = {
    'Sitabuldi':        { lat: 21.1458, lng: 79.0882 },
    'Dharampeth':       { lat: 21.1497, lng: 79.0720 },
    'MIHAN':            { lat: 21.0667, lng: 79.0500 },
    'Sadar':            { lat: 21.1520, lng: 79.0900 },
    'Wardha Road':      { lat: 21.1100, lng: 79.0800 },
    'Railway Station':  { lat: 21.1466, lng: 79.0850 },
    'Airport':          { lat: 21.0922, lng: 79.0472 },
    'Hingna':           { lat: 21.1200, lng: 78.9800 },
    'Kamptee':          { lat: 21.2167, lng: 79.1833 },
    'Butibori':         { lat: 21.0000, lng: 79.0167 }
};

// Demand colors for driver map markers
const demandColors = {
    high:   '#ff4444',
    medium: '#ff9900',
    low:    '#00ff88'
};

// ─────────────────────────────────────────────
// USER PORTAL MAP
// ─────────────────────────────────────────────

let userMap, pickupMarker, dropMarker, routeRenderer, directionsService;

function initUserMap() {
    const mapEl = document.getElementById('user-map');
    if (!mapEl) return;

    userMap = new google.maps.Map(mapEl, {
        center: { lat: 21.1458, lng: 79.0882 }, // Nagpur center
        zoom: 12,
        styles: darkMapStyle(),
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
    });

    directionsService = new google.maps.DirectionsService();
    routeRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: '#DFFF00',
            strokeWeight: 4,
            strokeOpacity: 0.9
        }
    });
    routeRenderer.setMap(userMap);
}

// Show pickup and drop markers + draw route
function showRouteOnMap(pickup, drop) {
    if (!userMap) return;

    const pickupCoords = areaCoordinates[pickup];
    const dropCoords   = areaCoordinates[drop];
    if (!pickupCoords || !dropCoords) return;

    // Clear old markers
    if (pickupMarker) pickupMarker.setMap(null);
    if (dropMarker)   dropMarker.setMap(null);

    // Pickup marker (green)
    pickupMarker = new google.maps.Marker({
        position: pickupCoords,
        map: userMap,
        title: `Pickup: ${pickup}`,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#00ff88',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        },
        label: { text: 'A', color: '#000', fontWeight: 'bold', fontSize: '12px' }
    });

    // Drop marker (red)
    dropMarker = new google.maps.Marker({
        position: dropCoords,
        map: userMap,
        title: `Drop: ${drop}`,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#ff4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        },
        label: { text: 'B', color: '#fff', fontWeight: 'bold', fontSize: '12px' }
    });

    // Info windows
    const pickupInfo = new google.maps.InfoWindow({
        content: `<div style="background:#1a1a1a;color:#DFFF00;padding:8px 12px;border-radius:6px;font-family:Inter,sans-serif;font-weight:600;">📍 Pickup: ${pickup}</div>`
    });
    const dropInfo = new google.maps.InfoWindow({
        content: `<div style="background:#1a1a1a;color:#ff4444;padding:8px 12px;border-radius:6px;font-family:Inter,sans-serif;font-weight:600;">🏁 Drop: ${drop}</div>`
    });

    pickupMarker.addListener('click', () => pickupInfo.open(userMap, pickupMarker));
    dropMarker.addListener('click',   () => dropInfo.open(userMap, dropMarker));

    // Draw driving route
    directionsService.route({
        origin: pickupCoords,
        destination: dropCoords,
        travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
        if (status === 'OK') {
            routeRenderer.setDirections(result);
        }
    });

    // Fit map to show both markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(pickupCoords);
    bounds.extend(dropCoords);
    userMap.fitBounds(bounds, { padding: 80 });
}

// ─────────────────────────────────────────────
// DRIVER PORTAL MAP
// ─────────────────────────────────────────────

let driverMap, trafficLayer, driverMarkers = [];

function initDriverMap() {
    const mapEl = document.getElementById('driver-map');
    if (!mapEl) return;

    driverMap = new google.maps.Map(mapEl, {
        center: { lat: 21.1458, lng: 79.0882 },
        zoom: 11,
        styles: darkMapStyle(),
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
    });

    // Traffic layer
    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(driverMap);

    // Plot all area demand markers
    plotDemandMarkers();
}

function plotDemandMarkers(hour) {
    if (!driverMap) return;

    // Clear old markers
    driverMarkers.forEach(m => m.setMap(null));
    driverMarkers = [];

    const currentHour = hour !== undefined ? hour : new Date().getHours();

    Object.entries(areaCoordinates).forEach(([area, coords]) => {
        const level = getDemandLevelForMap(area, currentHour);
        const color = demandColors[level];

        const marker = new google.maps.Marker({
            position: coords,
            map: driverMap,
            title: area,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 18,
                fillColor: color,
                fillOpacity: 0.85,
                strokeColor: '#ffffff',
                strokeWeight: 2
            }
        });

        const rides = getDemandRides(area, currentHour);
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="background:#1a1a1a;color:#fff;padding:12px 16px;border-radius:8px;font-family:Inter,sans-serif;min-width:160px;border-left:4px solid ${color};">
                    <div style="font-weight:700;font-size:14px;color:${color};margin-bottom:6px;">📍 ${area}</div>
                    <div style="font-size:12px;color:#aaa;">Demand: <span style="color:${color};font-weight:600;">${level.toUpperCase()}</span></div>
                    <div style="font-size:12px;color:#aaa;margin-top:4px;">Est. rides/hr: <span style="color:#fff;font-weight:600;">${rides}</span></div>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(driverMap, marker);
        });

        driverMarkers.push(marker);
    });
}

// Get demand level for map (uses same logic as demand-prediction.js)
function getDemandLevelForMap(area, hour) {
    const patterns = {
        'Sitabuldi':       { morning: [7,8,9,10],    evening: [17,18,19,20],    base: 'medium' },
        'Dharampeth':      { morning: [8,9,10],       evening: [17,18,19,20,21], base: 'high'   },
        'MIHAN':           { morning: [6,7,8],        evening: [17,18,19],       base: 'low'    },
        'Sadar':           { morning: [7,8,9],        evening: [18,19,20],       base: 'medium' },
        'Wardha Road':     { morning: [7,8,9],        evening: [17,18,19],       base: 'medium' },
        'Railway Station': { morning: [6,7,8,9,10],   evening: [17,18,19,20,21], base: 'high'   },
        'Airport':         { morning: [5,6,7,8],      evening: [17,18,19,20,21,22], base: 'medium' },
        'Hingna':          { morning: [7,8,9],        evening: [17,18,19],       base: 'low'    },
        'Kamptee':         { morning: [7,8,9],        evening: [17,18,19],       base: 'low'    },
        'Butibori':        { morning: [6,7,8,9],      evening: [17,18,19],       base: 'low'    }
    };

    const p = patterns[area];
    if (!p) return 'low';

    if (p.morning.includes(hour) || p.evening.includes(hour)) return 'high';
    if (hour >= 22 || hour < 6) return 'low';
    return p.base === 'high' ? 'medium' : p.base;
}

function getDemandRides(area, hour) {
    const level = getDemandLevelForMap(area, hour);
    if (level === 'high')   return Math.floor(Math.random() * 5) + 8;
    if (level === 'medium') return Math.floor(Math.random() * 3) + 4;
    return Math.floor(Math.random() * 2) + 1;
}

// Toggle traffic layer
function toggleTrafficLayer() {
    if (!trafficLayer) return;
    const btn = document.getElementById('traffic-toggle-btn');
    if (trafficLayer.getMap()) {
        trafficLayer.setMap(null);
        if (btn) { btn.textContent = '🚦 Show Traffic'; btn.classList.remove('active'); }
    } else {
        trafficLayer.setMap(driverMap);
        if (btn) { btn.textContent = '🚦 Hide Traffic'; btn.classList.add('active'); }
    }
}

// Update demand markers when time changes
function updateMapDemand(hour) {
    plotDemandMarkers(hour);
}

// ─────────────────────────────────────────────
// DARK MAP STYLE
// ─────────────────────────────────────────────

function darkMapStyle() {
    return [
        { elementType: 'geometry',                                    stylers: [{ color: '#0a0a0a' }] },
        { elementType: 'labels.text.stroke',                          stylers: [{ color: '#0a0a0a' }] },
        { elementType: 'labels.text.fill',                            stylers: [{ color: '#888888' }] },
        { featureType: 'road',        elementType: 'geometry',        stylers: [{ color: '#1a1a1a' }] },
        { featureType: 'road',        elementType: 'geometry.stroke', stylers: [{ color: '#212121' }] },
        { featureType: 'road',        elementType: 'labels.text.fill',stylers: [{ color: '#8a8a8a' }] },
        { featureType: 'road.highway',elementType: 'geometry',        stylers: [{ color: '#2c2c2c' }] },
        { featureType: 'road.highway',elementType: 'geometry.stroke', stylers: [{ color: '#1a1a1a' }] },
        { featureType: 'road.highway',elementType: 'labels.text.fill',stylers: [{ color: '#DFFF00' }] },
        { featureType: 'water',       elementType: 'geometry',        stylers: [{ color: '#111111' }] },
        { featureType: 'water',       elementType: 'labels.text.fill',stylers: [{ color: '#3d3d3d' }] },
        { featureType: 'poi',         elementType: 'labels',          stylers: [{ visibility: 'off' }] },
        { featureType: 'transit',     elementType: 'labels',          stylers: [{ visibility: 'off' }] },
        { featureType: 'administrative', elementType: 'geometry',     stylers: [{ color: '#2a2a2a' }] },
        { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#DFFF00' }] }
    ];
}

// ─────────────────────────────────────────────
// INIT CALLBACK (called by Google Maps API)
// ─────────────────────────────────────────────

function initMaps() {
    initUserMap();
    initDriverMap();
}
