// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Custom Cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .room-card, .feature-card, .testimonial-card, .hall-card, .service-card, .team-member, .award-item, .gallery-item, .contact-form, .modal-content, .testimonial-form-container, input, textarea, select');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .room-card, .testimonial-card, .value-card, .team-member, .award-item, .service-card, .hall-card').forEach(el => {
        observer.observe(el);
    });

    // Form validation helper
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ff6b6b';
                isValid = false;
            } else {
                field.style.borderColor = '#e0e0e0';
            }
        });

        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (field.value && !emailRegex.test(field.value)) {
                field.style.borderColor = '#ff6b6b';
                isValid = false;
            }
        });

        // Phone validation
        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (field.value && !phoneRegex.test(field.value.replace(/\s/g, ''))) {
                field.style.borderColor = '#ff6b6b';
                isValid = false;
            }
        });

        return isValid;
    }

    // Success message display
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;
        successDiv.textContent = message;

        // Add animation keyframes
        if (!document.querySelector('#success-animation-style')) {
            const style = document.createElement('style');
            style.id = 'success-animation-style';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }

    // Expose utility functions globally
    window.validateForm = validateForm;
    window.showSuccessMessage = showSuccessMessage;

    // Image lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });

    // Hero Slider Functionality
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-slider-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            dots[i].classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 3000);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            stopSlider();
            showSlide(i);
            startSlider();
        });
    });

    showSlide(0);
    startSlider();

    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            card.classList.remove('feature-animate');
            // Force reflow to restart animation
            void card.offsetWidth;
            card.classList.add('feature-animate');
        });
        card.addEventListener('animationend', function() {
            card.classList.remove('feature-animate');
        });
    });

    // Testimonial Review System
    function getStoredReviews() {
        return JSON.parse(localStorage.getItem('splashhReviews') || '[]');
    }

    function saveReview(name, text) {
        const reviews = getStoredReviews();
        reviews.unshift({ name, text });
        localStorage.setItem('splashhReviews', JSON.stringify(reviews));
    }

    // Testimonial Slider Data and Logic
    const staticTestimonials = [
        {
            text: 'Absolutely stunning resort! The service was impeccable and the banquet hall was perfect for our wedding celebration.',
            name: 'Priya & Raj Sharma',
            occasion: 'Wedding Celebration'
        },
        {
            text: 'A truly royal experience. The rooms are luxurious and the staff goes above and beyond to ensure comfort.',
            name: 'Mr. Anil Gupta',
            occasion: 'Business Stay'
        },
        {
            text: 'Perfect venue for our corporate event. Professional service and excellent facilities made it memorable.',
            name: 'Ms. Kavita Singh',
            occasion: 'Corporate Event'
        }
    ];

    // Testimonial Slider
    const testimonialSlides = document.getElementById('testimonial-slides');
    const testimonialDots = document.getElementById('testimonial-slider-dots');
    const testimonialPrev = document.getElementById('testimonial-prev');
    const testimonialNext = document.getElementById('testimonial-next');
    const testimonialForm = document.getElementById('testimonialForm');
    const reviewerName = document.getElementById('reviewerName');
    const reviewText = document.getElementById('reviewText');

    // Only initialize testimonial slider if elements exist
    if (testimonialSlides && testimonialDots && testimonialPrev && testimonialNext) {
        function getAllTestimonials() {
            const user = getStoredReviews().map(r => ({ text: r.text, name: r.name, occasion: '' }));
            return [...user, ...staticTestimonials];
        }

        let testimonialIndex = 0;
        let testimonialInterval;

        function renderTestimonialSlider() {
            const testimonials = getAllTestimonials();
            testimonialSlides.innerHTML = '';
            testimonialDots.innerHTML = '';
            testimonials.forEach((t, i) => {
                const card = document.createElement('div');
                card.className = 'testimonial-card';
                card.innerHTML = `
                    <div class="testimonial-content">
                        <p>"${t.text}"</p>
                    </div>
                    <div class="testimonial-author">
                        <strong>${t.name}</strong>
                        ${t.occasion ? `<span>${t.occasion}</span>` : ''}
                    </div>
                `;
                testimonialSlides.appendChild(card);
                // Dots
                const dot = document.createElement('span');
                dot.className = 'dot' + (i === testimonialIndex ? ' active' : '');
                dot.addEventListener('click', () => {
                    showTestimonial(i);
                    restartTestimonialInterval();
                });
                testimonialDots.appendChild(dot);
            });
            updateTestimonialSlider();
        }

        function updateTestimonialSlider() {
            const cards = testimonialSlides.querySelectorAll('.testimonial-card');
            cards.forEach((card, i) => {
                card.style.transform = `translateX(${(i - testimonialIndex) * 100}%)`;
                card.style.transition = 'transform 0.6s cubic-bezier(.77,0,.18,1)';
            });
            // Update dots
            const dots = testimonialDots.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === testimonialIndex);
            });
        }

        function showTestimonial(index) {
            const testimonials = getAllTestimonials();
            testimonialIndex = (index + testimonials.length) % testimonials.length;
            updateTestimonialSlider();
        }

        function nextTestimonial() {
            showTestimonial(testimonialIndex + 1);
        }

        function prevTestimonial() {
            showTestimonial(testimonialIndex - 1);
        }

        function startTestimonialInterval() {
            testimonialInterval = setInterval(nextTestimonial, 4000);
        }

        function restartTestimonialInterval() {
            clearInterval(testimonialInterval);
            startTestimonialInterval();
        }

        testimonialPrev.addEventListener('click', () => {
            prevTestimonial();
            restartTestimonialInterval();
        });
        
        testimonialNext.addEventListener('click', () => {
            nextTestimonial();
            restartTestimonialInterval();
        });

        // Render on load
        renderTestimonialSlider();
        showTestimonial(0);
        startTestimonialInterval();
    }

    // Testimonial form handling (only if form exists)
    if (testimonialForm && reviewerName && reviewText) {
        testimonialForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = reviewerName.value.trim();
            const text = reviewText.value.trim();
            
            if (name && text) {
                try {
                    // Send to backend API
                    const response = await fetch('http://localhost:3000/api/testimonial', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ reviewerName: name, reviewText: text })
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            // Store review locally
                            const reviews = getStoredReviews();
                            reviews.push({ name, text, date: new Date().toISOString() });
                            localStorage.setItem('userReviews', JSON.stringify(reviews));
                            
                            // Show success message
                            showSuccessMessage('Thank you for your review!');
                            
                            // Reset form
                            testimonialForm.reset();
                            
                            // Re-render slider if it exists
                            if (typeof renderTestimonialSlider === 'function') {
                                renderTestimonialSlider();
                            }
                            
                            // Redirect to success page
                            setTimeout(() => {
                                window.location.href = 'testimonial-success.html';
                            }, 2000);
                        } else {
                            throw new Error(result.message || 'Failed to submit review');
                        }
                    } else {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error('Error submitting review:', error);
                    showErrorMessage('Failed to submit review. Please try again.');
                }
            }
        });
    }
});