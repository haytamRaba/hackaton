// JavaScript pour les notifications et le multi-langue

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les notifications
    initNotifications();
    
    // Initialiser le multi-langue
    initMultiLanguage();
});

// Système de notifications
function initNotifications() {
    // Créer le conteneur de notifications s'il n'existe pas
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Vérifier s'il y a des notifications à afficher au chargement
    const urlParams = new URLSearchParams(window.location.search);
    const notificationParam = urlParams.get('notification');
    
    if (notificationParam) {
        const type = urlParams.get('type') || 'info';
        showNotification(decodeURIComponent(notificationParam), type);
    }
    
    // Initialiser les rappels de fin de location si nécessaire
    initRentalReminders();
}

// Fonction pour afficher une notification
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Ajouter un bouton de fermeture
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    notification.appendChild(closeButton);
    
    // Ajouter au conteneur
    const container = document.querySelector('.notification-container');
    container.appendChild(notification);
    
    // Animer l'entrée
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Supprimer après un délai (sauf pour les erreurs)
    if (type !== 'error') {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    return notification;
}

// Fonction pour initialiser les rappels de fin de location
function initRentalReminders() {
    // Vérifier s'il y a une location active en cours (simulé ici)
    const activeRental = localStorage.getItem('activeRental');
    
    if (activeRental) {
        try {
            const rental = JSON.parse(activeRental);
            const endTime = new Date(rental.endTime);
            const now = new Date();
            
            // Calculer le temps restant
            const timeLeft = endTime - now;
            
            if (timeLeft > 0) {
                // Configurer un rappel 5 minutes avant la fin
                const reminderTime = timeLeft - (5 * 60 * 1000);
                
                if (reminderTime > 0) {
                    setTimeout(() => {
                        showNotification(`Votre location de ${rental.vehicleType} se termine dans 5 minutes.`, 'warning');
                        
                        // Demander la permission pour les notifications du navigateur si ce n'est pas déjà fait
                        requestNotificationPermission();
                    }, reminderTime);
                }
                
                // Configurer un rappel à la fin de la location
                setTimeout(() => {
                    showNotification(`Votre location de ${rental.vehicleType} est terminée. N'oubliez pas de stationner votre véhicule dans un kiosque.`, 'warning');
                    
                    // Envoyer une notification du navigateur si autorisé
                    sendBrowserNotification(
                        'Fin de location',
                        `Votre location de ${rental.vehicleType} est terminée. N'oubliez pas de stationner votre véhicule dans un kiosque.`
                    );
                }, timeLeft);
            }
        } catch (error) {
            console.error('Erreur lors de l\'analyse des données de location:', error);
        }
    }
}

// Fonction pour demander la permission pour les notifications du navigateur
function requestNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }
}

// Fonction pour envoyer une notification du navigateur
function sendBrowserNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: message,
            icon: '/images/logo.png'
        });
        
        notification.onclick = function() {
            window.focus();
            this.close();
        };
    }
}

// Système multi-langue
function initMultiLanguage() {
    // Récupérer la langue actuelle
    const currentLang = localStorage.getItem('language') || 'fr';
    
    // Mettre à jour le sélecteur de langue si présent
    const languageSelector = document.getElementById('language');
    if (languageSelector) {
        languageSelector.value = currentLang;
        
        // Ajouter un écouteur d'événement pour le changement de langue
        languageSelector.addEventListener('change', function() {
            const newLang = this.value;
            localStorage.setItem('language', newLang);
            
            // Charger les traductions et mettre à jour la page
            loadTranslations(newLang).then(() => {
                updatePageTranslations();
            });
        });
    }
    
    // Charger les traductions initiales si nécessaire
    if (currentLang !== 'fr') {
        loadTranslations(currentLang).then(() => {
            updatePageTranslations();
        });
    }
}

// Fonction pour charger les traductions
function loadTranslations(lang) {
    return new Promise((resolve, reject) => {
        // Vérifier si les traductions sont déjà chargées
        if (window.translations && window.translations[lang]) {
            resolve();
            return;
        }
        
        // Initialiser l'objet de traductions s'il n'existe pas
        if (!window.translations) {
            window.translations = {};
        }
        
        // Pour cette démo, nous utilisons des traductions intégrées
        // Dans une application réelle, elles seraient chargées depuis un fichier JSON
        
        if (lang === 'en') {
            window.translations.en = {
                'header.home': 'Home',
                'header.map': 'Map',
                'header.subscription': 'Subscriptions',
                'header.contact': 'Contact',
                'header.login': 'Log in',
                'header.register': 'Sign up',
                'hero.title': 'Pedal towards a greener city!',
                'hero.subtitle': 'Easily rent electric bikes, scooters and motorcycles throughout the city.',
                'hero.discover': 'Discover kiosks',
                'hero.create_account': 'Create an account',
                'vehicles.title': 'Our electric vehicles',
                'vehicles.bikes': 'Electric bikes',
                'vehicles.bikes.desc': 'Perfect for urban travel, our electric bikes allow you to move around effortlessly.',
                'vehicles.scooters': 'Electric scooters',
                'vehicles.scooters.desc': 'Fast and maneuverable, our scooters are ideal for short trips in the city.',
                'vehicles.motorcycles': 'Electric motorcycles',
                'vehicles.motorcycles.desc': 'For more power and autonomy, choose our silent and eco-friendly electric motorcycles.',
                'vehicles.rent_now': 'Rent now',
                // ... autres traductions
            };
            resolve();
        } else if (lang === 'es') {
            window.translations.es = {
                'header.home': 'Inicio',
                'header.map': 'Mapa',
                'header.subscription': 'Suscripciones',
                'header.contact': 'Contacto',
                'header.login': 'Conectarse',
                'header.register': 'Registrarse',
                'hero.title': '¡Pedalea hacia una ciudad más verde!',
                'hero.subtitle': 'Alquila fácilmente bicicletas, patinetes y motos eléctricas por toda la ciudad.',
                'hero.discover': 'Descubrir quioscos',
                'hero.create_account': 'Crear una cuenta',
                'vehicles.title': 'Nuestros vehículos eléctricos',
                'vehicles.bikes': 'Bicicletas eléctricas',
                'vehicles.bikes.desc': 'Perfectas para desplazamientos urbanos, nuestras bicicletas eléctricas te permiten moverte sin esfuerzo.',
                'vehicles.scooters': 'Patinetes eléctricos',
                'vehicles.scooters.desc': 'Rápidos y maniobrables, nuestros patinetes son ideales para trayectos cortos en la ciudad.',
                'vehicles.motorcycles': 'Motos eléctricas',
                'vehicles.motorcycles.desc': 'Para más potencia y autonomía, elige nuestras motos eléctricas silenciosas y ecológicas.',
                'vehicles.rent_now': 'Alquilar ahora',
                // ... otras traducciones
            };
            resolve();
        } else {
            // Langue par défaut (français)
            resolve();
        }
    });
}

// Fonction pour mettre à jour les traductions sur la page
function updatePageTranslations() {
    const currentLang = localStorage.getItem('language') || 'fr';
    
    // Si la langue est le français (par défaut), pas besoin de traduire
    if (currentLang === 'fr') {
        return;
    }
    
    // Vérifier si les traductions sont disponibles
    if (!window.translations || !window.translations[currentLang]) {
        console.error(`Traductions non disponibles pour la langue: ${currentLang}`);
        return;
    }
    
    // Sélectionner tous les éléments avec un attribut data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = window.translations[currentLang][key];
        
        if (translation) {
            // Vérifier si l'élément a un attribut data-i18n-attr
            const attr = element.getAttribute('data-i18n-attr');
            
            if (attr) {
                // Mettre à jour l'attribut spécifié
                element.setAttribute(attr, translation);
            } else {
                // Mettre à jour le contenu texte
                element.textContent = translation;
            }
        }
    });
    
    // Mettre à jour le titre de la page si une traduction est disponible
    const pageTitle = window.translations[currentLang]['page.title'];
    if (pageTitle) {
        document.title = pageTitle;
    }
}

// Exposer les fonctions pour une utilisation externe
window.EcoRideNotifications = {
    show: showNotification,
    requestPermission: requestNotificationPermission,
    send: sendBrowserNotification
};

window.EcoRideLanguage = {
    change: function(lang) {
        localStorage.setItem('language', lang);
        loadTranslations(lang).then(() => {
            updatePageTranslations();
        });
    },
    current: function() {
        return localStorage.getItem('language') || 'fr';
    }
};
