class MatrixBackground {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.fontSize = 16;
        this.rainDrops = [];
        this.animationId = null;

        this.handleResize = this.handleResize.bind(this);
        this.init();
    }

    init() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        this.createRainDrops();
        this.animate();
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = this.canvas.width / this.fontSize;
        this.createRainDrops();
    }

    createRainDrops() {
        this.rainDrops = Array(Math.ceil(this.columns)).fill(1);
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#64ffda';
        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.rainDrops.length; i++) {
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(text, i * this.fontSize, this.rainDrops[i] * this.fontSize);

            if (this.rainDrops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.rainDrops[i] = 0;
            }
            this.rainDrops[i]++;
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        window.removeEventListener('resize', this.handleResize);
        cancelAnimationFrame(this.animationId);
    }
}

class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.setupForm();
    }

    setupForm() {
        if (!this.form) return;

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.addInputValidation();
    }

    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    addInputValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.value = this.sanitizeInput(input.value);
            });
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        if (!this.validateEmail(data.email)) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Submission failed');

            alert('Message sent successfully!');
            event.target.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Failed to send message. Please try again later.');
        }
    }
}

class TypeWriter {
    constructor(element, text, delay = 100, isSkill = false) {
        this.element = element;
        this.text = text;
        this.delay = delay;
        this.index = 0;
        this.lastTime = 0;
        this.isSkill = isSkill;
    }

    animate(currentTime) {
        if (!this.lastTime) this.lastTime = currentTime;

        if (currentTime - this.lastTime >= this.delay) {
            if (this.index <= this.text.length) {
                if (this.isSkill) {
                    this.element.textContent = this.text.substring(0, this.index);
                } else {
                    let displayText = '';
                    for (let j = 0; j < this.text.length; j++) {
                        displayText += j < this.index ? this.text[j] : this.getRandomChar();
                    }
                    this.element.textContent = displayText;
                }
                this.index++;
                this.lastTime = currentTime;
            } else if (!this.isSkill) {
                setTimeout(() => {
                    this.index = 0;
                    this.element.textContent = '';
                    this.animate(performance.now());
                }, 2000);
                return;
            }
        }

        if (this.index <= this.text.length || !this.isSkill) {
            requestAnimationFrame(time => this.animate(time));
        }
    }

    getRandomChar() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return chars[Math.floor(Math.random() * chars.length)];
    }

    start() {
        requestAnimationFrame(time => this.animate(time));
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function createSecurityAnimation() {
    const container = document.querySelector('.security-animation');
    for (let i = 0; i < 3; i++) {
        const circle = document.createElement('div');
        circle.className = 'security-circle';
        circle.style.width = circle.style.height = `${300 - i * 80}px`;
        circle.style.top = circle.style.left = `${i * 40}px`;
        circle.style.animationDelay = `${i * 0.5}s`;
        container.appendChild(circle);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const matrix = new MatrixBackground();

    const form = new FormHandler('contact-form');

    const heroTypewriter = new TypeWriter(
        document.getElementById('hero-title'),
        'Niyaz Al Mahmud'
    );
    heroTypewriter.start();
    createSecurityAnimation();

    const skillAnimations = new SkillAnimationManager();
    skillAnimations.init();

    const handleScroll = debounce(() => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 16);

    window.addEventListener('scroll', handleScroll);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

class SkillAnimationManager {
    constructor() {
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
            threshold: 0.1
        });
    }

    init() {
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            this.observer.observe(card);
        });
    }

    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                const skillLists = entry.target.querySelectorAll('.skill-list li');
                skillLists.forEach((li, index) => {
                    const text = li.getAttribute('data-text');
                    if (text) {
                        li.textContent = '';
                        li.classList.add('typing');

                        setTimeout(() => {
                            const typewriter = new TypeWriter(li, text, 90, true);
                            typewriter.start();
                        }, index * 200);
                    }
                });

                observer.unobserve(entry.target);
            }
        });
    }
}