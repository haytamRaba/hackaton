// JavaScript pour l'interface kiosque

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'interface kiosque
    initKioskInterface();
    
    // Mettre à jour l'horloge
    updateClock();
    setInterval(updateClock, 60000); // Mise à jour toutes les minutes
});

// Fonction pour initialiser l'interface kiosque
function initKioskInterface() {
    // Gérer les options du kiosque
    const optionCards = document.querySelectorAll('.option-card');
    const kioskPanels = document.querySelectorAll('.kiosk-panel');
    
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            const optionId = this.id;
            const panelId = optionId.replace('option', 'panel');
            
            // Masquer tous les panneaux
            kioskPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Afficher le panneau correspondant
            document.getElementById(panelId).classList.add('active');
        });
    });
    
    // Gérer les boutons de retour
    const backButtons = document.querySelectorAll('.btn-back');
    
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Masquer tous les panneaux
            kioskPanels.forEach(panel => {
                panel.classList.remove('active');
            });
        });
    });
    
    // Initialiser la location rapide
    initQuickRental();
    
    // Initialiser le scanner QR
    initQRScanner();
    
    // Initialiser les FAQ
    initFAQ();
}

// Fonction pour mettre à jour l'horloge
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    const clockElement = document.querySelector('.kiosk-time');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

// Fonction pour initialiser la location rapide
function initQuickRental() {
    const quickPanel = document.getElementById('quick-panel');
    
    if (!quickPanel) return;
    
    const steps = quickPanel.querySelectorAll('.quick-step');
    const nextButton = quickPanel.querySelector('.btn-next');
    const backButton = quickPanel.querySelector('.btn-back');
    
    let currentStep = 1;
    
    // Fonction pour afficher une étape
    function showStep(stepNumber) {
        steps.forEach(step => {
            step.classList.remove('active');
        });
        
        const stepToShow = quickPanel.querySelector(`.quick-step[data-step="${stepNumber}"]`);
        if (stepToShow) {
            stepToShow.classList.add('active');
        }
        
        // Mettre à jour les boutons
        if (stepNumber === 1) {
            backButton.textContent = 'Retour';
            nextButton.textContent = 'Continuer';
            nextButton.disabled = !quickPanel.querySelector('.vehicle-item.selected');
        } else if (stepNumber === 2) {
            backButton.textContent = 'Retour';
            nextButton.textContent = 'Continuer';
            nextButton.disabled = !quickPanel.querySelector('.duration-option.active');
        } else if (stepNumber === 3) {
            backButton.textContent = 'Retour';
            nextButton.textContent = 'Payer et déverrouiller';
        } else if (stepNumber === 4) {
            backButton.style.display = 'none';
            nextButton.textContent = 'Terminer';
        }
    }
    
    // Gérer le bouton suivant
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            if (currentStep < 4) {
                currentStep++;
                showStep(currentStep);
            } else {
                // Dernière étape, retour à l'accueil
                const kioskPanels = document.querySelectorAll('.kiosk-panel');
                kioskPanels.forEach(panel => {
                    panel.classList.remove('active');
                });
            }
        });
    }
    
    // Gérer le bouton retour
    if (backButton) {
        backButton.addEventListener('click', function() {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            } else {
                // Première étape, retour à l'accueil
                const kioskPanels = document.querySelectorAll('.kiosk-panel');
                kioskPanels.forEach(panel => {
                    panel.classList.remove('active');
                });
            }
        });
    }
    
    // Gérer la sélection des véhicules
    const vehicleTypeOptions = quickPanel.querySelectorAll('.vehicle-type-option');
    const vehicleItems = quickPanel.querySelectorAll('.vehicle-item');
    
    vehicleTypeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Mettre à jour la sélection active
            vehicleTypeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrer les véhicules (dans une vraie application)
            const vehicleType = this.getAttribute('data-type');
            console.log(`Filtrage des véhicules de type: ${vehicleType}`);
        });
    });
    
    vehicleItems.forEach(item => {
        item.addEventListener('click', function() {
            // Mettre à jour la sélection active
            vehicleItems.forEach(veh => veh.classList.remove('selected'));
            this.classList.add('selected');
            
            // Activer le bouton suivant
            if (nextButton) {
                nextButton.disabled = false;
            }
        });
    });
    
    // Gérer la sélection de la durée
    const durationOptions = quickPanel.querySelectorAll('.duration-option');
    
    durationOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Mettre à jour la sélection active
            durationOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Activer le bouton suivant
            if (nextButton) {
                nextButton.disabled = false;
            }
            
            // Mettre à jour le résumé (dans une vraie application)
            const duration = this.getAttribute('data-duration');
            console.log(`Durée sélectionnée: ${duration} minutes`);
        });
    });
    
    // Initialiser à la première étape
    showStep(1);
}

// Fonction pour initialiser le scanner QR
function initQRScanner() {
    const scanPanel = document.getElementById('scan-panel');
    
    if (!scanPanel) return;
    
    // Simuler une animation de scan
    const viewfinder = scanPanel.querySelector('.qr-scanner-viewfinder');
    
    if (viewfinder) {
        // Ajouter une animation de scan
        viewfinder.style.animation = 'scanAnimation 2s infinite';
        
        // Ajouter une animation CSS si elle n'existe pas déjà
        if (!document.getElementById('scan-animation-style')) {
            const style = document.createElement('style');
            style.id = 'scan-animation-style';
            style.textContent = `
                @keyframes scanAnimation {
                    0% {
                        box-shadow: 0 0 0 5000px rgba(0, 0, 0, 0.3);
                    }
                    50% {
                        box-shadow: 0 0 0 5000px rgba(0, 0, 0, 0.4);
                    }
                    100% {
                        box-shadow: 0 0 0 5000px rgba(0, 0, 0, 0.3);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Simuler un scan réussi après 5 secondes
        setTimeout(() => {
            // Dans une vraie application, cela serait déclenché par un vrai scan
            const successPanel = document.createElement('div');
            successPanel.className = 'scan-success';
            successPanel.innerHTML = `
                <div class="success-icon"></div>
                <h4>QR Code scanné avec succès !</h4>
                <p>Redirection vers l'application...</p>
            `;
            
            scanPanel.querySelector('.qr-scanner-container').innerHTML = '';
            scanPanel.querySelector('.qr-scanner-container').appendChild(successPanel);
            
            // Simuler une redirection après 2 secondes
            setTimeout(() => {
                // Dans une vraie application, cela ouvrirait l'application mobile
                alert('Dans une application réelle, l\'utilisateur serait redirigé vers l\'application mobile ou le véhicule serait déverrouillé.');
                
                // Réinitialiser le panneau
                const kioskPanels = document.querySelectorAll('.kiosk-panel');
                kioskPanels.forEach(panel => {
                    panel.classList.remove('active');
                });
            }, 2000);
        }, 5000);
    }
}

// Fonction pour initialiser les FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                item.classList.toggle('active');
            });
        }
    });
}

// Exposer les fonctions pour une utilisation externe
window.EcoRideKiosk = {
    init: initKioskInterface,
    updateClock: updateClock
};
