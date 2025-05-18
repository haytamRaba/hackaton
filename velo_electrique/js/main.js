// JavaScript principal pour toutes les pages

document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    initMobileMenu();
    
    // Mode sombre/clair
    initDarkMode();
    
    // Animation au défilement
    initScrollAnimations();
    
    // Gestion des langues
    initLanguageSelector();
});

// Gestion du menu mobile
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Créer le menu mobile s'il n'existe pas encore
            let mobileMenu = document.querySelector('.mobile-menu');
            
            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu';
                
                // Cloner la navigation et les boutons d'authentification
                if (mainNav) {
                    const navClone = mainNav.cloneNode(true);
                    mobileMenu.appendChild(navClone);
                }
                
                if (authButtons) {
                    const authClone = authButtons.cloneNode(true);
                    mobileMenu.appendChild(authClone);
                }
                
                document.body.appendChild(mobileMenu);
            }
            
            // Afficher/masquer le menu mobile
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
}

// Gestion du mode sombre/clair
function initDarkMode() {
    // Vérifier les préférences de l'utilisateur
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    // Appliquer le thème
    if (storedTheme === 'dark' || (!storedTheme && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
    }
    
    // Ajouter le bouton de basculement si nécessaire
    const themeSelector = document.getElementById('theme');
    if (themeSelector) {
        themeSelector.value = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        
        themeSelector.addEventListener('change', function() {
            if (this.value === 'dark') {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else if (this.value === 'light') {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            } else {
                // Mode système
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
                localStorage.removeItem('theme');
            }
        });
    }
}

// Animations au défilement
function initScrollAnimations() {
    // Sélectionner tous les éléments à animer
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length > 0) {
        // Options pour l'Intersection Observer
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        // Callback pour l'Intersection Observer
        const callback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        };
        
        // Créer l'Intersection Observer
        const observer = new IntersectionObserver(callback, options);
        
        // Observer chaque élément
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Gestion du sélecteur de langue
function initLanguageSelector() {
    const languageSelector = document.getElementById('language');
    
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            // Dans une application réelle, cette fonction changerait la langue
            // Pour cette démo, nous stockons simplement la préférence
            localStorage.setItem('language', this.value);
            
            // Simuler un changement de langue (dans une vraie application, cela rechargerait la page ou changerait les textes)
            console.log('Langue changée pour : ' + this.value);
        });
    }
}

// Fonction utilitaire pour afficher des notifications
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Ajouter au DOM
    const notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        container.appendChild(notification);
    } else {
        notificationContainer.appendChild(notification);
    }
    
    // Animer l'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Supprimer après un délai
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
