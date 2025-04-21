// Déclaration d'une variable globale pour stocker l'instance de ScrollReveal
let srInstance;

// Vérification des préférences système pour le mode sombre
function checkDarkMode() {
    // Vérifier les préférences système
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Vérifier le localStorage
    const savedDarkMode = localStorage.getItem("dark-mode");
    
    if (savedDarkMode === "enabled" || (savedDarkMode !== "disabled" && prefersDarkMode)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    
    // Ajouter un listener pour les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem("dark-mode") === null) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });
}

// Active le mode sombre
function enableDarkMode() {
    const body = document.body;
    const content = document.querySelector(".content");
    const sidebar = document.querySelector(".sidebar");
    const button = document.querySelector(".toggle-btn");
    
    body.classList.add("dark-mode");
    content.classList.add("dark-mode");
    sidebar.classList.add("dark-mode");
    button.classList.add("dark-mode");
    button.textContent = "Mode Clair";
}

// Désactive le mode sombre
function disableDarkMode() {
    const body = document.body;
    const content = document.querySelector(".content");
    const sidebar = document.querySelector(".sidebar");
    const button = document.querySelector(".toggle-btn");
    
    body.classList.remove("dark-mode");
    content.classList.remove("dark-mode");
    sidebar.classList.remove("dark-mode");
    button.classList.remove("dark-mode");
    button.textContent = "Mode Sombre";
}

// Basculer entre les modes
function toggleDarkMode() {
    if (document.body.classList.contains("dark-mode")) {
        disableDarkMode();
        localStorage.setItem("dark-mode", "disabled");
    } else {
        enableDarkMode();
        localStorage.setItem("dark-mode", "enabled");
    }
    
    // Animation de transition
    document.querySelector(".cv-container").style.transform = "scale(0.98)";
    setTimeout(() => {
        document.querySelector(".cv-container").style.transform = "scale(1)";
    }, 200);
}

// Fonction d'impression optimisée pour une seule page
function printCV() {
    // Sauvegarder l'état actuel du mode sombre
    const wasDarkMode = document.body.classList.contains("dark-mode");
    
    // Ajuster temporairement le contenu pour l'impression
    preparePrintLayout();
    
    // Désactiver temporairement le mode sombre pour l'impression
    if (wasDarkMode) {
        disableDarkMode();
    }
    
    // Imprimer la page
    setTimeout(() => {
        window.print();
        
        // Restaurer l'état initial après l'impression
        if (wasDarkMode) {
            setTimeout(() => {
                enableDarkMode();
            }, 500);
        }
        
        // Restaurer la mise en page normale
        setTimeout(() => {
            restoreNormalLayout();
        }, 500);
    }, 300);
}

// Préparer la mise en page pour l'impression
function preparePrintLayout() {
    // Stocker les tailles originales
    document.querySelectorAll('section').forEach(section => {
        section.dataset.originalMargin = section.style.marginBottom || '';
    });
    
    // Ajuster pour l'impression
    const aboutSection = document.querySelector('.about p');
    if (aboutSection) {
        aboutSection.dataset.originalHeight = aboutSection.style.maxHeight || '';
        aboutSection.style.maxHeight = 'none';
    }
    
    // Appliquer la classe d'impression
    document.body.classList.add('printing');
}

// Restaurer la mise en page normale après l'impression
function restoreNormalLayout() {
    // Restaurer les tailles originales
    document.querySelectorAll('section').forEach(section => {
        section.style.marginBottom = section.dataset.originalMargin;
    });
    
    const aboutSection = document.querySelector('.about p');
    if (aboutSection) {
        aboutSection.style.maxHeight = aboutSection.dataset.originalHeight;
    }
    
    // Retirer la classe d'impression
    document.body.classList.remove('printing');
}

// Configuration de ScrollReveal pour les appareils mobiles et tablettes
function setupScrollReveal() {
    // Vérifier si l'appareil est un mobile ou une tablette
    const isMobileOrTablet = window.innerWidth <= 768;
    
    // Ne configurer ScrollReveal que pour les appareils mobiles et tablettes
    if (isMobileOrTablet && typeof ScrollReveal !== 'undefined') {
        // Si une instance existe déjà, nettoyer avant de recréer
        if (srInstance) {
            srInstance.destroy();
        }
        
        // Rendre tous les éléments visibles avant de réinitialiser (pour résoudre le problème de redimensionnement)
        document.querySelectorAll('.reveal-sidebar, .reveal-content, .reveal-item').forEach(el => {
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            // Réinitialiser les transformations potentielles
            el.style.transform = 'none';
        });
        
        // Configuration de base
        srInstance = ScrollReveal({
            origin: 'bottom',
            distance: '20px',
            duration: 800,
            delay: 200,
            easing: 'ease-in-out',
            reset: false,
            mobile: true,
            desktop: false
        });
        
        // Configuration pour la sidebar
        srInstance.reveal('.reveal-sidebar', {
            origin: 'left',
            distance: '30px',
            interval: 100,
            viewFactor: 0.2
        });
        
        // Configuration pour les sections principales
        srInstance.reveal('.reveal-content', {
            distance: '20px',
            interval: 150,
            viewFactor: 0.1
        });
        
        // Configuration pour les éléments individuels
        srInstance.reveal('.reveal-item', {
            interval: 100,
            scale: 0.95,
            viewFactor: 0.1
        });
    } else {
        // Si ce n'est pas mobile/tablette, s'assurer que tout est visible
        document.querySelectorAll('.reveal-sidebar, .reveal-content, .reveal-item').forEach(el => {
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
}

// Exécuter la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    checkDarkMode();
    
    // Ajuster le contenu en fonction de la taille de la fenêtre
    handleResponsiveLayout();
    
    // Animation d'entrée
    setTimeout(() => {
        document.querySelector(".cv-container").style.opacity = "1";
        document.querySelector(".cv-container").style.transform = "translateY(0)";
    }, 100);
    
    // Initialiser ScrollReveal
    setupScrollReveal();
    
    // Écouter les changements de taille de la fenêtre avec un délai pour éviter les appels multiples
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            handleResponsiveLayout();
            // Réinitialiser ScrollReveal lors du changement de taille
            setupScrollReveal();
        }, 250); // Délai de 250ms avant d'appliquer les changements
    });
});

// Gérer la mise en page responsive
function handleResponsiveLayout() {
    const windowWidth = window.innerWidth;
    
    if (windowWidth <= 480) {
        // Très petits écrans (mobile)
        document.body.classList.add('mobile-view');
        document.body.classList.remove('tablet-view');
    } else if (windowWidth <= 768) {
        // Tablettes
        document.body.classList.add('tablet-view');
        document.body.classList.remove('mobile-view');
    } else {
        // Grands écrans
        document.body.classList.remove('tablet-view', 'mobile-view');
    }
}

// Ajout d'un effet parallaxe léger sur le fond (désactivé en impression)
if (!window.matchMedia('print').matches) {
    document.addEventListener("mousemove", function(e) {
        // Ne pas appliquer l'effet sur mobile
        if (window.innerWidth > 768) {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            document.body.style.backgroundPosition = `${moveX}px ${moveY}px`;
        }
    });
}

// Écouter l'événement avant impression pour préparer la mise en page
window.addEventListener('beforeprint', preparePrintLayout);

// Écouter l'événement après impression pour restaurer la mise en page
window.addEventListener('afterprint', restoreNormalLayout);