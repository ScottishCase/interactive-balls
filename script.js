const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let gravity = 0.1; // Initial gravity value
const damping = 0.99; // Damping factor to slow particles down

// Get slider and label elements
const gravitySlider = document.getElementById('gravitySlider');
const gravityValueLabel = document.getElementById('gravityValue');

// Update gravity value based on slider
gravitySlider.addEventListener('input', (e) => {
    gravity = parseFloat(e.target.value);
    gravityValueLabel.textContent = gravity; // Update displayed value
});

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2; // Random angle
        this.radius = Math.random() * 5 + 2; // Random radius between 2 and 7
        this.speedX = Math.cos(this.angle) * (Math.random() * 0.2 + 0.1);
        this.speedY = Math.sin(this.angle) * (Math.random() * 0.2 + 0.1);
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    update() {
        // Apply gravity to the Y speed
        this.speedY += gravity;

        // Update positions based on speeds
        this.x += this.speedX;
        this.y += this.speedY;

        // Apply damping to gradually slow down the particles
        this.speedX *= damping;
        this.speedY *= damping;

        // Bounce off the edges
        if (this.x < 0 || this.x > canvas.width) {
            this.speedX = -this.speedX;
            this.x = Math.max(this.radius, Math.min(this.x, canvas.width - this.radius));
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.speedY = -this.speedY;
            this.y = Math.max(this.radius, Math.min(this.y, canvas.height - this.radius));
        }

        this.draw();
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Animate particles
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    
    requestAnimationFrame(animate);
}

// Spawn particles on spacebar press
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        const x = mousePosition.x || canvas.width / 2; // Default to center if no mouse position
        const y = mousePosition.y || canvas.height / 2; // Default to center if no mouse position

        createParticles(x, y);
    }
});

// Track mouse position
let mousePosition = { x: canvas.width / 2, y: canvas.height / 2 };
canvas.addEventListener('mousemove', (e) => {
    mousePosition.x = e.x;
    mousePosition.y = e.y;
});

// Create particles at provided coordinates
function createParticles(x, y) {
    for (let i = 0; i < 2; i++) { // Number of particles per event
        particles.push(new Particle(x, y));
    }
}

// Initialize the animation
animate();

// Resize the canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});