// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    // Handle contact form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Collect form data
            const formData = {
                firstName: this.querySelector('#firstName').value,
                lastName: this.querySelector('#lastName').value,
                email: this.querySelector('#email').value,
                phone: this.querySelector('#phone').value,
                subject: this.querySelector('#subject').value,
                message: this.querySelector('#message').value,
                newsletter: this.querySelector('#newsletter').checked
            };

            // Send to backend API
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                showSuccessMessage('Message sent successfully! We will get back to you within 24 hours.');
                
                // Reset form
                this.reset();
                
                // Redirect to success page after a delay
                setTimeout(() => {
                    window.location.href = 'contact-success.html';
                }, 2000);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('Failed to send message. Please try again or contact us directly.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Success message display
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(40, 167, 69, 0.3);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;
        successDiv.textContent = message;

        // Add animation keyframes if not exists
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

    // Error message display
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(220, 53, 69, 0.3);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;
        errorDiv.textContent = message;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 300);
        }, 5000);
    }

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