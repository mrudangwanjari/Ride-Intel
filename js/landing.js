// Ride-Intel Landing Page Animation
// Pure Canvas 2D - No external dependencies

const canvas = document.getElementById('three-canvas');
const ctx = canvas.getContext('2d');

const ACCENT = '#DFFF00';
const ACCENT_DIM = 'rgba(223, 255, 0, 0.15)';
const LINE_COLOR = 'rgba(223, 255, 0, 0.12)';
const PARTICLE_COUNT = 120;
const CONNECTION_DISTANCE = 140;

let width, height, particles, mouse;

mouse = { x: null, y: null };

// Resize handler
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// Particle class
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(frame) {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse repulsion
        if (mouse.x !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                this.x += (dx / dist) * 1.5;
                this.y += (dy / dist) * 1.5;
            }
        }

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Pulse opacity
        this.currentOpacity = this.opacity + Math.sin(frame * this.pulseSpeed + this.pulseOffset) * 0.15;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(223, 255, 0, ${this.currentOpacity})`;
        ctx.fill();
    }
}

// Draw connections between nearby particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONNECTION_DISTANCE) {
                const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.25;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(223, 255, 0, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }
}

// Draw mouse glow
function drawMouseGlow() {
    if (mouse.x === null) return;
    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
    gradient.addColorStop(0, 'rgba(223, 255, 0, 0.08)');
    gradient.addColorStop(1, 'rgba(223, 255, 0, 0)');
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
}

// Init
function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

// Animation loop
let frame = 0;
function animate() {
    requestAnimationFrame(animate);
    frame++;

    // Clear with dark background
    ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
    ctx.fillRect(0, 0, width, height);

    drawMouseGlow();
    drawConnections();
    particles.forEach(p => {
        p.update(frame);
        p.draw();
    });
}

// Events
window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.reset());
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Start
init();
animate();
