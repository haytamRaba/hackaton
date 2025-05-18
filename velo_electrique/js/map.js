// JavaScript pour la fonctionnalité d'itinéraire

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les fonctionnalités d'itinéraire si nécessaire
    initRouteMap();
});

// Fonction pour initialiser la carte d'itinéraire
function initRouteMap() {
    // Vérifier si la page contient un élément de carte d'itinéraire
    const routeMapContainer = document.querySelector('.route-map-container');
    
    if (routeMapContainer) {
        // Charger la bibliothèque de carte dynamiquement
        loadMapLibrary().then(() => {
            // Initialiser la carte
            initializeMap(routeMapContainer);
        }).catch(error => {
            console.error('Erreur lors du chargement de la bibliothèque de carte:', error);
        });
    }
}

// Fonction pour charger la bibliothèque de carte
function loadMapLibrary() {
    return new Promise((resolve, reject) => {
        // Vérifier si la bibliothèque est déjà chargée
        if (window.L) {
            resolve();
            return;
        }
        
        // Charger le CSS de Leaflet
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        document.head.appendChild(linkElement);
        
        // Charger le JavaScript de Leaflet
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
        script.async = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Impossible de charger la bibliothèque de carte'));
        
        document.head.appendChild(script);
    });
}

// Fonction pour initialiser la carte
function initializeMap(container) {
    // Coordonnées par défaut (Paris)
    const defaultLat = 48.8566;
    const defaultLng = 2.3522;
    
    // Récupérer les coordonnées depuis les attributs data si disponibles
    const lat = parseFloat(container.getAttribute('data-lat') || defaultLat);
    const lng = parseFloat(container.getAttribute('data-lng') || defaultLng);
    const zoom = parseInt(container.getAttribute('data-zoom') || '13', 10);
    
    // Créer l'élément de carte
    const mapElement = document.createElement('div');
    mapElement.className = 'map';
    mapElement.style.height = '100%';
    container.appendChild(mapElement);
    
    // Initialiser la carte Leaflet
    const map = L.map(mapElement).setView([lat, lng], zoom);
    
    // Ajouter une couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Stocker la référence de la carte pour une utilisation ultérieure
    container.map = map;
    
    // Ajouter des marqueurs pour les kiosques si spécifiés
    addKiosksToMap(map, container);
    
    // Ajouter des contrôles supplémentaires
    addMapControls(map);
    
    // Si des coordonnées de destination sont spécifiées, calculer l'itinéraire
    if (container.hasAttribute('data-dest-lat') && container.hasAttribute('data-dest-lng')) {
        const destLat = parseFloat(container.getAttribute('data-dest-lat'));
        const destLng = parseFloat(container.getAttribute('data-dest-lng'));
        
        calculateRoute(map, [lat, lng], [destLat, destLng]);
    }
}

// Fonction pour ajouter des kiosques à la carte
function addKiosksToMap(map, container) {
    // Vérifier si des données de kiosques sont disponibles
    const kiosksData = container.getAttribute('data-kiosks');
    
    if (!kiosksData) {
        // Utiliser des données de démonstration si aucune donnée n'est fournie
        const demoKiosks = [
            { id: 1, name: 'Gare Centrale', lat: 48.8566, lng: 2.3522, velo: 5, trottinette: 3, moto: 2 },
            { id: 2, name: 'Place du Marché', lat: 48.8606, lng: 2.3376, velo: 2, trottinette: 4, moto: 0 },
            { id: 3, name: 'Parc Municipal', lat: 48.8496, lng: 2.3656, velo: 8, trottinette: 6, moto: 3 },
            { id: 4, name: 'Centre Commercial', lat: 48.8646, lng: 2.3446, velo: 4, trottinette: 2, moto: 1 }
        ];
        
        addKiosksMarkers(map, demoKiosks);
    } else {
        try {
            // Analyser les données JSON des kiosques
            const kiosks = JSON.parse(kiosksData);
            addKiosksMarkers(map, kiosks);
        } catch (error) {
            console.error('Erreur lors de l\'analyse des données de kiosques:', error);
        }
    }
}

// Fonction pour ajouter des marqueurs de kiosques
function addKiosksMarkers(map, kiosks) {
    kiosks.forEach(kiosk => {
        // Créer une icône personnalisée pour le kiosque
        const kioskIcon = L.divIcon({
            className: 'kiosk-marker',
            html: `<div class="kiosk-marker-inner"></div>`,
            iconSize: [30, 30]
        });
        
        // Créer le marqueur
        const marker = L.marker([kiosk.lat, kiosk.lng], { icon: kioskIcon }).addTo(map);
        
        // Créer le contenu du popup
        const popupContent = `
            <div class="kiosk-popup-content">
                <h3>${kiosk.name}</h3>
                <div class="kiosk-availability">
                    <div class="availability-item">
                        <span class="vehicle-icon velo"></span>
                        <span class="availability-count">${kiosk.velo}</span>
                    </div>
                    <div class="availability-item">
                        <span class="vehicle-icon trottinette"></span>
                        <span class="availability-count">${kiosk.trottinette}</span>
                    </div>
                    <div class="availability-item">
                        <span class="vehicle-icon moto"></span>
                        <span class="availability-count">${kiosk.moto}</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="window.location.href='map.html?kiosk=${kiosk.id}'">Voir détails</button>
            </div>
        `;
        
        // Ajouter le popup au marqueur
        marker.bindPopup(popupContent);
    });
}

// Fonction pour ajouter des contrôles à la carte
function addMapControls(map) {
    // Ajouter un bouton de géolocalisation
    const locateControl = L.control({ position: 'bottomright' });
    
    locateControl.onAdd = function() {
        const div = L.DomUtil.create('div', 'leaflet-control-locate');
        div.innerHTML = '<button class="locate-button" title="Ma position"></button>';
        
        div.onclick = function() {
            map.locate({ setView: true, maxZoom: 16 });
        };
        
        return div;
    };
    
    locateControl.addTo(map);
    
    // Gérer les événements de géolocalisation
    map.on('locationfound', function(e) {
        // Ajouter un marqueur à la position de l'utilisateur
        const userIcon = L.divIcon({
            className: 'user-marker',
            html: '<div class="user-marker-inner"></div>',
            iconSize: [20, 20]
        });
        
        // Supprimer l'ancien marqueur s'il existe
        if (map.userMarker) {
            map.removeLayer(map.userMarker);
        }
        
        // Créer un nouveau marqueur
        map.userMarker = L.marker(e.latlng, { icon: userIcon }).addTo(map);
        
        // Ajouter un cercle pour montrer la précision
        if (map.accuracyCircle) {
            map.removeLayer(map.accuracyCircle);
        }
        
        map.accuracyCircle = L.circle(e.latlng, {
            radius: e.accuracy / 2,
            weight: 1,
            color: '#4CAF50',
            fillColor: '#4CAF50',
            fillOpacity: 0.15
        }).addTo(map);
    });
    
    map.on('locationerror', function(e) {
        showNotification('Impossible de déterminer votre position. Veuillez vérifier vos paramètres de localisation.', 'error');
    });
}

// Fonction pour calculer un itinéraire
function calculateRoute(map, start, end) {
    // Dans une application réelle, cette fonction utiliserait une API d'itinéraire
    // Pour cette démo, nous simulons un itinéraire simple
    
    // Créer une ligne pour représenter l'itinéraire
    const routeLine = L.polyline([start, end], {
        color: '#4CAF50',
        weight: 5,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
    }).addTo(map);
    
    // Ajuster la vue pour inclure tout l'itinéraire
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    
    // Ajouter des marqueurs pour le départ et l'arrivée
    const startIcon = L.divIcon({
        className: 'route-marker start-marker',
        html: '<div class="route-marker-inner"></div>',
        iconSize: [20, 20]
    });
    
    const endIcon = L.divIcon({
        className: 'route-marker end-marker',
        html: '<div class="route-marker-inner"></div>',
        iconSize: [20, 20]
    });
    
    L.marker(start, { icon: startIcon }).addTo(map);
    L.marker(end, { icon: endIcon }).addTo(map);
    
    // Simuler le calcul de la distance et du temps
    const distance = calculateDistance(start[0], start[1], end[0], end[1]);
    const duration = Math.round(distance / 15 * 60); // 15 km/h en moyenne
    
    // Afficher les informations d'itinéraire
    const routeInfoContainer = document.querySelector('.route-info');
    if (routeInfoContainer) {
        routeInfoContainer.innerHTML = `
            <div class="route-info-item">
                <span class="info-label">Distance</span>
                <span class="info-value">${distance.toFixed(1)} km</span>
            </div>
            <div class="route-info-item">
                <span class="info-label">Durée estimée</span>
                <span class="info-value">${formatDuration(duration)}</span>
            </div>
        `;
    }
}

// Fonction pour calculer la distance entre deux points (formule de Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}

// Fonction pour formater la durée en minutes
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} h ${mins} min`;
    }
}

// Exposer les fonctions pour une utilisation externe
window.EcoRideMap = {
    init: initializeMap,
    addKiosks: addKiosksToMap,
    calculateRoute: calculateRoute
};
