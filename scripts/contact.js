// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    // Handle contact form submission
    contactForm.addEventListener('submit', function(e) {
        // Validate form first
        if (!window.validateForm(this)) {
            e.preventDefault();
            return;
        }

        // Add reply-to field if it doesn't exist
        let replyToField = this.querySelector('input[name="_replyto"]');
        if (!replyToField) {
            replyToField = document.createElement('input');
            replyToField.type = 'hidden';
            replyToField.name = '_replyto';
            this.appendChild(replyToField);
        }
        
        // Set the reply-to field to the sender's email
        const emailField = this.querySelector('input[name="email"]');
        if (emailField) {
            replyToField.value = emailField.value;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Let the form submit naturally to FormSubmit
        // The form will redirect to the success page after submission
    });

    // Real-time form validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(255, 107, 107)') {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        let isValid = true;

        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
        }

        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
            }
        }

        // Phone validation
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
                isValid = false;
            }
        }

        // Update field appearance
        if (isValid) {
            field.style.borderColor = '#e0e0e0';
        } else {
            field.style.borderColor = '#ff6b6b';
        }

        return isValid;
    }

    // Add animation to contact items
    const contactItems = document.querySelectorAll('.contact-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);

    contactItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Social links hover effect
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Add smooth transitions
    socialLinks.forEach(link => {
        link.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });

    // Character counter for message textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const maxLength = 500;
        
        // Create character counter
        const counter = document.createElement('div');
        counter.style.cssText = `
            text-align: right;
            font-size: 0.9rem;
            color: #666;
            margin-top: 0.5rem;
        `;
        messageTextarea.parentNode.appendChild(counter);

        function updateCounter() {
            const remaining = maxLength - messageTextarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 50) {
                counter.style.color = '#ff6b6b';
            } else {
                counter.style.color = '#666';
            }
        }

        messageTextarea.setAttribute('maxlength', maxLength);
        messageTextarea.addEventListener('input', updateCounter);
        updateCounter();
    }
});