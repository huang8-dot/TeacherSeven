class VisualEffectsManager {
    constructor() {
        this.particleContainer = null;
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticleContainer();
        this.setupGlobalStyles();
    }

    createParticleContainer() {
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'particle-container';
        document.body.appendChild(this.particleContainer);
    }

    setupGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .particle {
                position: absolute;
                pointer-events: none;
                border-radius: 50%;
            }
        `;
        document.head.appendChild(style);
    }

    createParticle(x, y, type, options = {}) {
        const particle = document.createElement('div');
        particle.className = `particle ${type}-particle`;
        
        const size = options.size || Math.random() * 10 + 5;
        const duration = options.duration || Math.random() * 1 + 0.5;
        const delay = options.delay || 0;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        if (options.color) {
            particle.style.background = options.color;
        }
        
        this.particleContainer.appendChild(particle);
        this.particles.push(particle);
        
        setTimeout(() => {
            this.removeParticle(particle);
        }, (duration + delay) * 1000);
    }

    createParticleBurst(x, y, type, count = 10) {
        for (let i = 0; i < count; i++) {
            const offsetX = (Math.random() - 0.5) * 50;
            const offsetY = (Math.random() - 0.5) * 50;
            const delay = Math.random() * 0.3;
            
            this.createParticle(x + offsetX, y + offsetY, type, {
                size: Math.random() * 15 + 5,
                duration: Math.random() * 0.8 + 0.4,
                delay: delay
            });
        }
    }

    createHeartParticles(x, y, count = 5) {
        this.createParticleBurst(x, y, 'heart', count);
    }

    createCoinParticles(x, y, count = 5) {
        this.createParticleBurst(x, y, 'coin', count);
    }

    createStarParticles(x, y, count = 8) {
        this.createParticleBurst(x, y, 'star', count);
    }

    createMagicParticles(x, y, count = 10) {
        this.createParticleBurst(x, y, 'magic', count);
    }

    createExplosion(x, y, count = 15) {
        this.createParticleBurst(x, y, 'explosion', count);
    }

    removeParticle(particle) {
        const index = this.particles.indexOf(particle);
        if (index > -1) {
            this.particles.splice(index, 1);
        }
        
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }

    clearAllParticles() {
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
    }

    screenShake(intensity = 5, duration = 500) {
        document.body.classList.add('screen-shake');
        
        setTimeout(() => {
            document.body.classList.remove('screen-shake');
        }, duration);
    }

    flashEffect(color = 'white', duration = 300) {
        const flash = document.createElement('div');
        flash.className = 'flash-effect';
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = color;
        flash.style.zIndex = '9998';
        flash.style.pointerEvents = 'none';
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            document.body.removeChild(flash);
        }, duration);
    }

    addGlowEffect(element, color = null) {
        if (color) {
            element.style.color = color;
        }
        element.classList.add('glow-effect');
    }

    removeGlowEffect(element) {
        element.classList.remove('glow-effect');
    }

    addPulseEffect(element) {
        element.classList.add('pulse-effect');
    }

    removePulseEffect(element) {
        element.classList.remove('pulse-effect');
    }

    addFloatEffect(element) {
        element.classList.add('float-effect');
    }

    removeFloatEffect(element) {
        element.classList.remove('float-effect');
    }

    addSpinEffect(element) {
        element.classList.add('spin-effect');
    }

    removeSpinEffect(element) {
        element.classList.remove('spin-effect');
    }

    addBounceEffect(element) {
        element.classList.add('bounce-effect');
        
        setTimeout(() => {
            element.classList.remove('bounce-effect');
        }, 500);
    }

    addSlideInEffect(element, direction = 'left') {
        element.classList.add(`slide-in-${direction}`);
    }

    addFadeInEffect(element) {
        element.classList.add('fade-in');
    }

    addFadeOutEffect(element) {
        element.classList.add('fade-out');
    }

    addScaleInEffect(element) {
        element.classList.add('scale-in');
    }

    addScaleOutEffect(element) {
        element.classList.add('scale-out');
    }

    addRotateInEffect(element) {
        element.classList.add('rotate-in');
    }

    addRotateOutEffect(element) {
        element.classList.add('rotate-out');
    }

    addTypewriterEffect(element, text) {
        element.textContent = '';
        element.classList.add('typewriter');
        element.style.width = '0';
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 50);
    }

    addRainbowEffect(element) {
        element.classList.add('rainbow');
    }

    removeRainbowEffect(element) {
        element.classList.remove('rainbow');
    }

    addNeonEffect(element, color = null) {
        if (color) {
            element.style.color = color;
        }
        element.classList.add('neon');
    }

    removeNeonEffect(element) {
        element.classList.remove('neon');
    }

    addGlassEffect(element) {
        element.classList.add('glass');
    }

    removeGlassEffect(element) {
        element.classList.remove('glass');
    }

    addHoverLiftEffect(element) {
        element.classList.add('hover-lift');
    }

    removeHoverLiftEffect(element) {
        element.classList.remove('hover-lift');
    }

    addHoverScaleEffect(element) {
        element.classList.add('hover-scale');
    }

    removeHoverScaleEffect(element) {
        element.classList.remove('hover-scale');
    }

    addHoverGlowEffect(element, color = null) {
        if (color) {
            element.style.color = color;
        }
        element.classList.add('hover-glow');
    }

    removeHoverGlowEffect(element) {
        element.classList.remove('hover-glow');
    }

    addHoverRotateEffect(element) {
        element.classList.add('hover-rotate');
    }

    removeHoverRotateEffect(element) {
        element.classList.remove('hover-rotate');
    }

    addClickPressEffect(element) {
        element.classList.add('click-press');
    }

    removeClickPressEffect(element) {
        element.classList.remove('click-press');
    }

    addFocusRingEffect(element) {
        element.classList.add('focus-ring');
    }

    removeFocusRingEffect(element) {
        element.classList.remove('focus-ring');
    }

    createLoadingSpinner(container) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        container.appendChild(spinner);
        return spinner;
    }

    removeLoadingSpinner(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
        }
    }

    addAnimatedProgressBar(element) {
        element.classList.add('progress-bar-animated');
    }

    removeAnimatedProgressBar(element) {
        element.classList.remove('progress-bar-animated');
    }

    createTooltip(element, text) {
        element.classList.add('tooltip');
        element.setAttribute('data-tooltip', text);
    }

    removeTooltip(element) {
        element.classList.remove('tooltip');
        element.removeAttribute('data-tooltip');
    }

    createBadge(element, text, type = 'info') {
        const badge = document.createElement('span');
        badge.className = `badge badge-${type}`;
        badge.textContent = text;
        element.appendChild(badge);
        return badge;
    }

    createCard(content) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = content;
        return card;
    }

    createButton(text, type = 'primary', onClick = null) {
        const button = document.createElement('button');
        button.className = `button button-${type}`;
        button.textContent = text;
        
        if (onClick) {
            button.addEventListener('click', onClick);
        }
        
        return button;
    }

    createInput(placeholder = '', type = 'text') {
        const input = document.createElement('input');
        input.className = 'input-field';
        input.type = type;
        input.placeholder = placeholder;
        return input;
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            border-radius: 10px;
            font-weight: bold;
            z-index: 10000;
            animation: slide-in-right 0.5s ease-out;
        `;
        
        const typeColors = {
            success: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
            error: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            warning: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
            info: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
        };
        
        if (typeColors[type]) {
            toast.style.background = typeColors[type];
        }
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slide-out-right 0.5s ease-out';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, duration);
    }

    createModal(content, onClose = null) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fade-in 0.3s ease-out;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            animation: scale-in 0.3s ease-out;
        `;
        modalContent.innerHTML = content;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        if (onClose) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal, onClose);
                }
            });
        }
        
        return modal;
    }

    closeModal(modal, onClose = null) {
        modal.style.animation = 'fade-out 0.3s ease-out';
        modal.querySelector('.modal-content').style.animation = 'scale-out 0.3s ease-out';
        
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
            if (onClose) {
                onClose();
            }
        }, 300);
    }

    createConfetti() {
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                z-index: 9999;
                animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    document.body.removeChild(confetti);
                }
            }, 5000);
        }
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confetti-fall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createFireworks(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const offsetX = (Math.random() - 0.5) * 200;
                const offsetY = (Math.random() - 0.5) * 200;
                const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                
                this.createParticleBurst(x + offsetX, y + offsetY, 'explosion', 20);
            }, i * 300);
        }
    }
}

const visualEffects = new VisualEffectsManager();