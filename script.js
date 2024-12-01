function createMatrixBackground() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#64ffda';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    }

    setInterval(drawMatrix, 50);
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

function typeWriter() {
    const title = document.getElementById('hero-title');
    const text = "Niyaz Al Mahmud";
    let i = 0;

    function getRandomChar() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }

    function type() {
        if (i <= text.length) {
            let displayText = "";
            for (let j = 0; j < text.length; j++) {
                if (j < i) {
                    displayText += text[j];
                } else {
                    displayText += getRandomChar();
                }
            }
            title.textContent = displayText;
            i++;
            setTimeout(type, 100);
        } else {
            setTimeout(() => {
                i = 0;
                title.textContent = "";
                type();
            }, 2000);
        }
    }

    type();
}

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    console.log('Form submitted:', data);

    alert('Message sent successfully!');
    event.target.reset();
    return false;
}

window.addEventListener('load', () => {
    createMatrixBackground();
    createSecurityAnimation();
    typeWriter();
});

window.addEventListener('resize', () => {
    const canvas = document.getElementById('matrix-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
