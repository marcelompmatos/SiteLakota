/**
 * Utilitários e melhorias de UX para o Site Céu Irmão Lakota
 */

/**
 * Utilitários e melhorias de UX para o Site Céu Irmão Lakota
 */

// Lazy loading para imagens
// Implementar lazy loading nativo se suportado
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback para lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Melhorias de acessibilidade
// Anúncios para screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    document.body.appendChild(announcement);
    announcement.textContent = message;

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Melhorar foco nos overlays
document.querySelectorAll('.overlay').forEach(overlay => {
    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusableElements = overlay.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
});

// Anúncios de abertura/fechamento de overlays
const originalOpenOverlay = window.openOverlay;
const originalCloseOverlay = window.closeOverlay;

window.openOverlay = function(id) {
    announceToScreenReader(`Abrindo seção ${id}`);
    if (originalOpenOverlay) originalOpenOverlay(id);
};

window.closeOverlay = function(id) {
    announceToScreenReader(`Fechando seção ${id}`);
    if (originalCloseOverlay) originalCloseOverlay(id);
};

// Otimização de performance
// Debounce para redimensionamento
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Recalcular elementos responsivos se necessário
        const event = new CustomEvent('optimizedResize');
        window.dispatchEvent(event);
    }, 250);
});

// Preload de overlays importantes
const preloadOverlays = ['about', 'servicos', 'contact'];
preloadOverlays.forEach(id => {
    const overlay = document.getElementById(id + 'Overlay');
    if (overlay) {
        // Pré-carregar imagens dentro dos overlays
        const images = overlay.querySelectorAll('img[data-src]');
        images.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.dataset.src || img.src;
            document.head.appendChild(link);
        });
    }
});

// Analytics e tracking (se necessário)
// Tracking de interações importantes
const trackEvent = (eventName, details = {}) => {
    // Implementar tracking se necessário
    console.log('Event tracked:', eventName, details);
};

// Rastrear abertura de overlays
document.querySelectorAll('[onclick*="openOverlay"]').forEach(element => {
    element.addEventListener('click', function() {
        const overlayId = this.onclick.toString().match(/openOverlay\('([^']+)'\)/)?.[1];
        if (overlayId) {
            trackEvent('overlay_opened', { overlay: overlayId });
        }
    });
});

// Rastrear envio de formulário
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function() {
        trackEvent('form_submitted', { form: 'contact' });
    });
}

// Service Worker para PWA (se desejado)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}
