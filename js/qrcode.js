// JavaScript pour la fonctionnalité QR Code

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les fonctionnalités QR Code si nécessaire
    initQRCode();
});

// Fonction pour initialiser les QR Codes
function initQRCode() {
    // Vérifier si la page contient des éléments QR Code
    const qrCodeContainers = document.querySelectorAll('.qr-code-container');
    
    if (qrCodeContainers.length > 0) {
        // Charger la bibliothèque QR Code dynamiquement
        loadQRCodeLibrary().then(() => {
            // Générer les QR Codes
            qrCodeContainers.forEach(container => {
                generateQRCode(container);
            });
        }).catch(error => {
            console.error('Erreur lors du chargement de la bibliothèque QR Code:', error);
        });
    }
}

// Fonction pour charger la bibliothèque QR Code
function loadQRCodeLibrary() {
    return new Promise((resolve, reject) => {
        // Vérifier si la bibliothèque est déjà chargée
        if (window.QRCode) {
            resolve();
            return;
        }
        
        // Créer un élément script
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
        script.async = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Impossible de charger la bibliothèque QR Code'));
        
        document.head.appendChild(script);
    });
}

// Fonction pour générer un QR Code
function generateQRCode(container) {
    // Récupérer les données à encoder
    const data = container.getAttribute('data-qr-content') || 'https://ecoride.fr';
    const size = parseInt(container.getAttribute('data-qr-size') || '128', 10);
    
    // Créer un élément pour le QR Code
    const qrElement = document.createElement('div');
    qrElement.className = 'qr-code';
    
    // Générer le QR Code
    try {
        const qr = window.qrcode(0, 'M');
        qr.addData(data);
        qr.make();
        
        // Insérer le QR Code dans le conteneur
        qrElement.innerHTML = qr.createImgTag(2);
        container.appendChild(qrElement);
        
        // Ajouter une légende si nécessaire
        if (container.hasAttribute('data-qr-label')) {
            const label = document.createElement('div');
            label.className = 'qr-code-label';
            label.textContent = container.getAttribute('data-qr-label');
            container.appendChild(label);
        }
    } catch (error) {
        console.error('Erreur lors de la génération du QR Code:', error);
        qrElement.textContent = 'Erreur de génération du QR Code';
    }
}

// Fonction pour scanner un QR Code (simulation)
function scanQRCode(callback) {
    // Dans une application réelle, cette fonction utiliserait l'API de la caméra
    // Pour cette démo, nous simulons un scan réussi après un délai
    
    // Afficher une interface de scan simulée
    const scanOverlay = document.createElement('div');
    scanOverlay.className = 'qr-scan-overlay';
    scanOverlay.innerHTML = `
        <div class="qr-scan-container">
            <div class="qr-scan-viewfinder"></div>
            <div class="qr-scan-message">Positionnez le QR Code dans le cadre...</div>
        </div>
    `;
    
    document.body.appendChild(scanOverlay);
    
    // Simuler un scan après 3 secondes
    setTimeout(() => {
        // Supprimer l'overlay
        scanOverlay.remove();
        
        // Simuler un résultat de scan
        const simulatedResult = {
            success: true,
            data: 'ECORIDE-VELO-12345',
            vehicleType: 'velo',
            vehicleId: '12345'
        };
        
        // Appeler le callback avec le résultat
        if (typeof callback === 'function') {
            callback(simulatedResult);
        }
    }, 3000);
}

// Fonction pour déverrouiller un véhicule via QR Code
function unlockVehicleWithQRCode(vehicleType, vehicleId) {
    // Simuler une requête API pour déverrouiller le véhicule
    console.log(`Déverrouillage du ${vehicleType} #${vehicleId}...`);
    
    // Afficher une notification de chargement
    showNotification('Déverrouillage en cours...', 'info');
    
    // Simuler un délai de traitement
    setTimeout(() => {
        // Simuler une réponse réussie
        const success = Math.random() > 0.1; // 90% de chance de réussite
        
        if (success) {
            showNotification('Véhicule déverrouillé avec succès !', 'success');
            
            // Rediriger vers une page de confirmation ou afficher des instructions
            setTimeout(() => {
                window.location.href = `unlock-success.html?type=${vehicleType}&id=${vehicleId}`;
            }, 1500);
        } else {
            showNotification('Erreur lors du déverrouillage. Veuillez réessayer.', 'error');
        }
    }, 2000);
}

// Exposer les fonctions pour une utilisation externe
window.EcoRideQR = {
    generate: generateQRCode,
    scan: scanQRCode,
    unlock: unlockVehicleWithQRCode
};
