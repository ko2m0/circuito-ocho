/**
 * Circuito Ocho - Main JavaScript File
 * Handles Mobile Menu, Scroll Animations, Parallax Effects, and Interactive Background
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Menu Toggle ---
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const icon = btn.querySelector('svg');

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        
        if (menu.classList.contains('hidden')) {
            btn.setAttribute('aria-expanded', 'false');
            // Reset icon to hamburger
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
        } else {
            btn.setAttribute('aria-expanded', 'true');
            // Change icon to X
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
        });
    });

    // --- 2. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-element');

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- 3. Navbar Blur Effect on Scroll ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
            navbar.classList.replace('bg-brand-dark/80', 'bg-brand-dark/95');
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.classList.replace('bg-brand-dark/95', 'bg-brand-dark/80');
        }
    });

    // --- 4. Parallax Effect for Even Sections (1, 3, 5, 7...) ---
    const parallaxSections = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxSections.forEach((section, index) => {
            const speed = 0.15;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Calculate if section is in view
            if (scrolled + window.innerHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
                const offset = (scrolled - sectionTop) * speed;
                section.style.transform = `translateY(${offset}px)`;
            }
        });
    });

    // --- 5. Interactive Circuit Background Animation ---
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    
    // Configuration
    const particleCount = 80;
    const connectionDistance = 180;
    const mouseConnectionDistance = 200;
    const particleSpeed = 0.4;

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * particleSpeed;
            this.vy = (Math.random() - 0.5) * particleSpeed;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
        }

        update() {
            // Regular movement
            this.x += this.vx;
            this.y += this.vy;

            // Mouse interaction - particles are attracted to mouse
            if (mouse.x != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    
                    this.x += directionX * force * 2;
                    this.y += directionY * force * 2;
                }
            }

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            // Glow effect for particles
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#35FC03';
            ctx.fillStyle = '#35FC03';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    class CircuitNode {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 2;
            this.pulse = 0;
            this.pulseSpeed = 0.02 + Math.random() * 0.03;
        }

        update() {
            this.pulse += this.pulseSpeed;
        }

        draw() {
            const pulseSize = this.size + Math.sin(this.pulse) * 2;
            
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#35FC03';
            ctx.fillStyle = '#35FC03';
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Create circuit nodes (larger, stationary points)
    const circuitNodes = [];
    const circuitNodeCount = 15;

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        circuitNodes.length = 0;
        for (let i = 0; i < circuitNodeCount; i++) {
            circuitNodes.push(new CircuitNode());
        }
    }

    function drawCircuitLines() {
        // Draw connections between particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = 1 - distance / connectionDistance;
                    ctx.strokeStyle = `rgba(53, 252, 3, ${opacity * 0.3})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Draw connections to mouse
            if (mouse.x != null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseConnectionDistance) {
                    const opacity = 1 - distance / mouseConnectionDistance;
                    ctx.strokeStyle = `rgba(53, 252, 3, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            // Draw connections to circuit nodes
            for (let node of circuitNodes) {
                const dx = particles[i].x - node.x;
                const dy = particles[i].y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance * 1.5) {
                    const opacity = 1 - distance / (connectionDistance * 1.5);
                    ctx.strokeStyle = `rgba(53, 252, 3, ${opacity * 0.2})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(node.x, node.y);
                    ctx.stroke();
                }
            }
        }

        // Draw connections between circuit nodes
        for (let i = 0; i < circuitNodes.length; i++) {
            for (let j = i + 1; j < circuitNodes.length; j++) {
                const dx = circuitNodes[i].x - circuitNodes[j].x;
                const dy = circuitNodes[i].y - circuitNodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 300) {
                    const opacity = 1 - distance / 300;
                    ctx.strokeStyle = `rgba(53, 252, 3, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(circuitNodes[i].x, circuitNodes[i].y);
                    ctx.lineTo(circuitNodes[j].x, circuitNodes[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw circuit nodes
        circuitNodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw all connections
        drawCircuitLines();

        // Draw mouse interaction point
        if (mouse.x != null) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#35FC03';
            ctx.fillStyle = 'rgba(53, 252, 3, 0.3)';
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        requestAnimationFrame(animateParticles);
    }

    // Initialize Canvas
    window.addEventListener('resize', resize);
    resize();
    initParticles();
    animateParticles();

    // --- 6. Form Submission Handler ---
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(form);
            
            // Show success message (in production, this would send to backend)
            const button = form.querySelector('button');
            const originalText = button.textContent;
            button.textContent = '✓ Datos Transmitidos';
            button.classList.add('bg-white');
            button.classList.remove('bg-brand-neon');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('bg-white');
                button.classList.add('bg-brand-neon');
                form.reset();
            }, 3000);
        });
    }

    // --- 7. Smooth Scroll for Anchor Links ---
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

    // --- 8. Add dynamic circuit lines to sections ---
    function addCircuitDecorations() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            if (index % 2 === 0) { // Even sections
                // Add decorative circuit lines
                for (let i = 0; i < 3; i++) {
                    const line = document.createElement('div');
                    line.className = 'circuit-line';
                    line.style.top = `${20 + i * 25}%`;
                    line.style.left = '0';
                    line.style.width = '100%';
                    line.style.animationDelay = `${i * 0.5}s`;
                    section.appendChild(line);
                }
            }
        });
    }

    // Initialize decorations after a short delay
    setTimeout(addCircuitDecorations, 100);
});

// --- 9. Scroll to Top Button Functionality ---
const scrollToTopBtn = document.getElementById('scroll-to-top');

// Show/hide button based on scroll position
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Scroll to top on click
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// --- 10. WhatsApp Button Click Tracking (Optional Analytics) ---
const whatsappBtn = document.querySelector('a[href*="wa.me"]');

if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
        // Track click event (for Google Analytics or similar)
        if (typeof gtag === 'function') {
            gtag('event', 'click', {
                'event_category': 'WhatsApp',
                'event_label': 'Chat Button Click'
            });
        }
        
        // Optional: Console log for debugging
        console.log('WhatsApp chat initiated');
    });
}

 // Icon Animation Controller for Circuito Ocho
    class IconAnimationController {
      constructor() {
        this.iconCards = document.querySelectorAll('.icon-card');
        this.observerOptions = {
          threshold: 0.2,
          rootMargin: '0px'
        };
        this.init();
                    }

      init() {
        // Set up intersection observer for scroll animations
        this.observer = new IntersectionObserver(
          this.handleIntersection.bind(this),
          this.observerOptions
        );

        // Observe all icon cards
        this.iconCards.forEach(card => {
          this.observer.observe(card);
        });

        // Add hover effects
        this.addHoverEffects();

        // Initialize continuous animations
        this.initContinuousAnimations();
      }

      handleIntersection(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.triggerEntryAnimation(entry.target);
          } else {
            entry.target.classList.remove('visible');
          }
        });
      }

      triggerEntryAnimation(card) {
        const svg = card.querySelector('svg');
        const shapes = svg.querySelectorAll('.main-shape, .node, .connection, .gear, .layer, .arrow, .target, .bar');
        
        shapes.forEach((shape, index) => {
          setTimeout(() => {
            shape.style.opacity = '0';
            shape.style.transform = 'scale(0.8)';
            shape.style.transition = 'all 0.4s ease';
            
            setTimeout(() => {
              shape.style.opacity = '1';
              shape.style.transform = 'scale(1)';
            }, 50);
          }, index * 50);
        });
      }

      addHoverEffects() {
        this.iconCards.forEach(card => {
          card.addEventListener('mouseenter', () => {
            const svg = card.querySelector('svg');
            svg.style.filter = 'drop-shadow(0 0 15px rgba(53, 252, 3, 0.8))';
          });

          card.addEventListener('mouseleave', () => {
            const svg = card.querySelector('svg');
            svg.style.filter = 'drop-shadow(0 0 8px rgba(53, 252, 3, 0.6))';
          });
        });
      }

      initContinuousAnimations() {
        // Add random pulse variations to nodes
        const nodes = document.querySelectorAll('.node');
        nodes.forEach(node => {
          const randomDelay = Math.random() * 2;
          node.style.animationDelay = `${randomDelay}s`;
        });

        // Add random bar heights for analytics
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => {
          const randomHeight = 15 + Math.random() * 15;
          bar.style.height = `${randomHeight}px`;
          bar.style.animationDuration = `${2 + Math.random()}s`;
        });
      }

      // Method to trigger all icons animation (for demo purposes)
      triggerAllAnimations() {
        this.iconCards.forEach((card, index) => {
          setTimeout(() => {
            this.triggerEntryAnimation(card);
          }, index * 200);
        });
      }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      window.iconController = new IconAnimationController();
      
      // Add circuit decoration lines dynamically
      this.addCircuitDecorations();
    });

    // Add dynamic circuit line decorations
    function addCircuitDecorations() {
      const container = document.querySelector('.container');
      const colors = ['#35FC03'];
      
      for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line';
        line.style.width = `${Math.random() * 200 + 50}px`;
        line.style.height = '1px';
        line.style.top = `${Math.random() * 100}vh`;
        line.style.left = `${Math.random() * 100}%`;
        line.style.opacity = Math.random() * 0.3;
        container.appendChild(line);
      }
    }

    // Optional: Add click interaction for demo
    document.addEventListener('click', (e) => {
      if (e.target.closest('.icon-card')) {
        const card = e.target.closest('.icon-card');
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.transform = 'scale(1)';
        }, 150);
      }
    });

     // Modal Logic
        document.addEventListener('DOMContentLoaded', () => {
            const openButtons = document.querySelectorAll('.open-modal-btn');
            const closeButtons = document.querySelectorAll('.close-modal-btn');
            const modals = document.querySelectorAll('.legal-modal');

            function openModal(modalId) {
                const targetModal = document.getElementById(modalId);
                if (targetModal) {
                    targetModal.classList.remove('hidden');
                    targetModal.classList.add('flex');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            }

            function closeModal(modal) {
                if (modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    document.body.style.overflow = '';
                }
            }

            openButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetId = btn.getAttribute('data-target');
                    openModal(targetId);
                });
            });

            closeButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const modal = btn.closest('.legal-modal');
                    closeModal(modal);
                });
            });

            // Close on backdrop click
            modals.forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeModal(modal);
                    }
                });
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    modals.forEach(modal => {
                        if (!modal.classList.contains('hidden')) {
                            closeModal(modal);
                        }
                    });
                }
            });
        });