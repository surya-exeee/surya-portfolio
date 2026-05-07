document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.progress-bar');
    let width = 0;

    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        } else {
            width += Math.random() * 10;
            if (width > 100) width = 100;
            progressBar.style.width = width + '%';
        }
    }, 100);

    // --- Scramble Text Effect ---
    class TextScrambler {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => (this.resolve = resolve));
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    const typingText = document.getElementById('typing-text');
    const roles = [
        'Cybersecurity Student',
        'Ethical Hacker',
        'Security Analyst',
        'Network Specialist',
        'Linux Enthusiast'
    ];

    const scrambler = new TextScrambler(typingText);
    let roleIndex = 0;

    const nextRole = () => {
        scrambler.setText(roles[roleIndex]).then(() => {
            setTimeout(nextRole, 2500);
        });
        roleIndex = (roleIndex + 1) % roles.length;
    };

    nextRole();

    // --- Sticky Navbar & Scroll Progress ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Reveal elements on scroll
        reveal();
    });

    // --- Scroll Reveal Animation ---
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');

        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    // Initial check for elements already in view
    reveal();

    // --- Mobile Menu Logic (Burger) ---
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('nav-active');

        // Animate Links
        navItems.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // --- Form Submission (Mock) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'SENDING...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                alert('Message sent successfully! (Note: This is a demo. No actual email was sent.)');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // --- Smooth Scrolling for all links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                }
            }
        });
    });

    // --- Matrix Rain Effect ---
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);

    // --- Custom Cursor Logic ---
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const mouseGlow = document.querySelector('.mouse-glow');

    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';

        // Mouse glow following with slight delay for smoothness
        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.borderColor = 'var(--accent-green)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'var(--accent-cyan)';
        });
    });

    // --- 3D Tilt Effect for Cards ---
    const cards = document.querySelectorAll('.project-card, .skill-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // --- Magnetic Buttons ---
    const magneticBtns = document.querySelectorAll('.btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const moveX = (x - centerX) / 2;
            const moveY = (y - centerY) / 2;

            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // --- Terminal Log Simulation ---
    const terminalOutput = document.createElement('div');
    terminalOutput.className = 'terminal-logs';
    document.querySelector('.hero-content').appendChild(terminalOutput);

    const logs = [
        '<span class="log-info">[INFO]</span> Initializing secure connection...',
        '<span class="log-ok">[OK]</span> Firewall bypassed.',
        '<span class="log-info">[INFO]</span> Scanning for vulnerabilities...',
        '<span class="log-warn">[WARN]</span> Potential SQL injection detected.',
        '<span class="log-info">[INFO]</span> Accessing local database...',
        '<span class="log-success">[SUCCESS]</span> User "Surya" authenticated.',
        '<span class="log-info">[INFO]</span> System status: SECURE',
        '<span class="log-warn">[ALERT]</span> Unauthorized access attempt blocked.'
    ];
    let logIndex = 0;

    function addLog() {
        if (logIndex < logs.length) {
            const logEntry = document.createElement('p');
            logEntry.innerHTML = logs[logIndex];
            logEntry.className = 'log-line';
            terminalOutput.appendChild(logEntry);

            // Auto scroll to bottom
            terminalOutput.scrollTop = terminalOutput.scrollHeight;

            // Limit logs displayed
            if (terminalOutput.children.length > 10) {
                terminalOutput.removeChild(terminalOutput.firstChild);
            }

            logIndex++;
            setTimeout(addLog, 800 + Math.random() * 1000);
        } else {
            logIndex = 0;
            setTimeout(addLog, 4000);
        }
    }

    if (document.querySelector('.hero-content')) {
        setTimeout(addLog, 1500);
    }
});
