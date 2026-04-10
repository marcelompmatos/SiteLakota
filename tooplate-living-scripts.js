/**
 * Script principal do Site Céu Irmão Lakota
 * Funcionalidades: Slider parallax, overlays, navegação mobile
 */

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Elementos do DOM
    const slider = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    // Variáveis de estado
    let autoPlayInterval;
    let progressInterval;
    let progressStart;
    let currentSlide = 0;
    let isAnimating = false;
    let mouseX = 0;
    let mouseY = 0;
    let isPausedByUser = false;
    let slideDuration = 5000;

    // Função para atualizar parallax
    function updateParallax() {
        const currentSlideElement = slides[currentSlide].querySelector('.background-layer');
        if (currentSlideElement) {
            currentSlideElement.style.transform = `translate(${20 * mouseX}px, ${20 * mouseY}px)`;
        }
    }

    // Função para obter duração da transição
    function getTransitionDuration() {
        return slideDuration <= 3000 ? 300 : 700;
    }

    // Função para mostrar slide
    function showSlide(index) {
        if (isAnimating) return;

        isAnimating = true;
        const transitionDuration = getTransitionDuration();
        document.documentElement.style.setProperty('--slide-transition-duration', transitionDuration + 'ms');

        slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        dots.forEach(dot => dot.classList.remove('active'));

        if (currentSlide !== index) {
            slides[currentSlide].classList.add('prev');
        }

        slides[index].classList.add('active');
        dots[index].classList.add('active');

        currentSlide = index;
        updateParallax();

        setTimeout(() => {
            isAnimating = false;
        }, transitionDuration);
    }

    // Funções de navegação
    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    // Funções de autoplay
    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        stopProgressBar();
        if (!isPausedByUser) {
            startProgressBar();
            autoPlayInterval = setInterval(() => {
                nextSlide();
                stopProgressBar();
                startProgressBar();
            }, slideDuration);
        }
    }

    // Funções da barra de progresso
    function startProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;

        function updateProgress() {
            const elapsed = Date.now() - progressStart;
            const progress = Math.min(elapsed / slideDuration, 1);
            progressBar.style.width = (progress * 100) + '%';

            if (progress >= 1) {
                progressBar.style.width = '100%';
            }
        }

        progressBar.style.width = '0%';
        progressStart = Date.now();
        clearInterval(progressInterval);
        progressInterval = setInterval(updateProgress, 50);
        updateProgress();
    }

    function stopProgressBar() {
        clearInterval(progressInterval);
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    }

    // Funções dos overlays
    function openOverlay(overlayId) {
        const overlay = document.getElementById(overlayId + 'Overlay');
        if (overlay) {
            overlay.classList.add('active');
            clearInterval(autoPlayInterval);

            const content = overlay.querySelector('.overlay-content');
            if (content) {
                setTimeout(() => {
                    const scrollIndicator = content.querySelector('.scroll-indicator');
                    if (scrollIndicator) {
                        if (content.scrollHeight > content.clientHeight) {
                            scrollIndicator.classList.add('show');
                            content.classList.add('has-scroll');
                        }
                    }
                }, 100);
            }
        }
    }

    function closeOverlay(overlayId) {
        const overlay = document.getElementById(overlayId + 'Overlay');
        if (overlay) {
            overlay.classList.remove('active');
            if (!isPausedByUser) {
                startAutoPlay();
            }
        }
    }

    window.openOverlay = openOverlay;
    window.closeOverlay = closeOverlay;

    // Event listeners
    if (menuToggle && mainNav) {
        const toggleMenu = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = !mainNav.classList.contains('active');
            mainNav.classList.toggle('active', isOpen);
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        };

        const toggleEvent = window.PointerEvent ? 'pointerdown' : 'click';
        menuToggle.addEventListener(toggleEvent, toggleMenu);

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (menuToggle && mainNav && !menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        }
    });

    if (slider) {
        slider.addEventListener('mousemove', (e) => {
            const rect = slider.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width - 0.5;
            mouseY = (e.clientY - rect.top) / rect.height - 0.5;
            updateParallax();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(autoPlayInterval);
            nextSlide();
            if (!isPausedByUser) startAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(autoPlayInterval);
            prevSlide();
            if (!isPausedByUser) startAutoPlay();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoPlayInterval);
            showSlide(index);
            if (!isPausedByUser) startAutoPlay();
        });
    });

    // Controles de teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            clearInterval(autoPlayInterval);
            prevSlide();
            if (!isPausedByUser) startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            clearInterval(autoPlayInterval);
            nextSlide();
            if (!isPausedByUser) startAutoPlay();
        } else if (e.key.toLowerCase() === 'h') {
            const uiToggleBtn = document.getElementById('uiToggleBtn');
            if (uiToggleBtn) uiToggleBtn.click();
        } else if (e.key === 'Escape') {
            document.querySelectorAll('.overlay').forEach(overlay => {
                overlay.classList.remove('active');
            });
            if (!isPausedByUser) startAutoPlay();
        }
    });

    // Fechar overlays ao clicar fora
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                if (!isPausedByUser) startAutoPlay();
            }
        });
    });

    // Inicialização
    startAutoPlay();
    updateParallax();

    // Desabilitar parallax em mobile
    if (window.innerWidth <= 768) {
        slider.removeEventListener('mousemove', updateParallax);
    }

    // Função para manipular indicador de scroll
    function handleScrollIndicator(content) {
        const scrollIndicator = content.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;

        function updateIndicator() {
            const hasScroll = content.scrollHeight > content.clientHeight;
            const isAtBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 10;

            if (hasScroll && !isAtBottom) {
                scrollIndicator.classList.add('show');
                content.classList.add('has-scroll');
            } else {
                scrollIndicator.classList.remove('show');
                content.classList.remove('has-scroll');
            }
        }

        setTimeout(updateIndicator, 100);
        content.addEventListener('scroll', updateIndicator);
    }

    // Aplicar indicador de scroll a todos os overlays
    document.querySelectorAll('.overlay-content').forEach(content => {
        handleScrollIndicator(content);
    });

    // Controles de duração
    const decreaseBtn = document.getElementById('decreaseDuration');
    const increaseBtn = document.getElementById('increaseDuration');
    const durationDisplay = document.getElementById('durationDisplay');

    if (decreaseBtn && increaseBtn && durationDisplay) {
        let currentDuration = 5;

        function updateDuration(newDuration) {
            currentDuration = Math.max(1, Math.min(9, newDuration));
            slideDuration = currentDuration * 1000;
            durationDisplay.innerHTML = currentDuration + '<span>s</span>';

            const transitionDuration = getTransitionDuration();
            document.documentElement.style.setProperty('--slide-transition-duration', transitionDuration + 'ms');

            if (!isPausedByUser) startAutoPlay();
        }

        decreaseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateDuration(currentDuration - 1);
        });

        increaseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateDuration(currentDuration + 1);
        });
    }

    // Toggle UI
    const uiToggleBtn = document.getElementById('uiToggleBtn');
    if (uiToggleBtn) {
        let uiVisible = true;

        uiToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const uiElements = document.querySelectorAll('.ui-element');

            if (uiVisible) {
                uiElements.forEach(el => el.classList.add('hidden'));
                uiVisible = false;
                uiToggleBtn.classList.add('ui-hidden');
            } else {
                uiElements.forEach(el => el.classList.remove('hidden'));
                uiVisible = true;
                uiToggleBtn.classList.remove('ui-hidden');
            }
        });
    }

    // Controles de play/pause
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        const playIcon = '<svg viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"/></svg>';
        const pauseIcon = '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';

        playPauseBtn.innerHTML = pauseIcon;

        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (isPausedByUser) {
                isPausedByUser = false;
                startAutoPlay();
                playPauseBtn.innerHTML = pauseIcon;
                playPauseBtn.classList.remove('paused');
            } else {
                isPausedByUser = true;
                clearInterval(autoPlayInterval);
                stopProgressBar();
                playPauseBtn.innerHTML = playIcon;
                playPauseBtn.classList.add('paused');
            }
        });
    }

    // Controles de tela cheia
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        const expandIcon = '<svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
        const collapseIcon = '<svg viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>';

        fullscreenBtn.innerHTML = expandIcon;

        fullscreenBtn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }

            if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
                // Sair do fullscreen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                fullscreenBtn.classList.remove('active');
                fullscreenBtn.innerHTML = expandIcon;
            } else {
                // Entrar no fullscreen
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                }
                fullscreenBtn.classList.add('active');
                fullscreenBtn.innerHTML = collapseIcon;
            }
        });

        // Event listeners para mudanças de fullscreen
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                fullscreenBtn.classList.remove('active');
                fullscreenBtn.innerHTML = expandIcon;
            }
        });

        document.addEventListener('webkitfullscreenchange', () => {
            if (!document.webkitFullscreenElement) {
                fullscreenBtn.classList.remove('active');
                fullscreenBtn.innerHTML = expandIcon;
            }
        });

        document.addEventListener('mozfullscreenchange', () => {
            if (!document.mozFullScreenElement) {
                fullscreenBtn.classList.remove('active');
                fullscreenBtn.innerHTML = expandIcon;
            }
        });
    }
}
