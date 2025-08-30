// Banquet page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Inquiry modal functionality
    const modal = document.getElementById('inquiryModal');
    const inquiryButtons = document.querySelectorAll('.inquiry-btn');
    const closeBtn = document.querySelector('.close');
    const inquiryForm = document.getElementById('inquiryForm');

    // Open modal
    inquiryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const hallName = this.getAttribute('data-hall');
            document.getElementById('selectedHall').value = hallName;
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('eventDate').min = today;
        });
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Handle inquiry form submission
    inquiryForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission
        
        if (window.validateForm(this)) {
            // Show processing state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Collect form data
                const formData = {
                    selectedHall: this.querySelector('#selectedHall').value,
                    eventDate: this.querySelector('#eventDate').value,
                    eventTime: this.querySelector('#eventTime').value,
                    eventType: this.querySelector('#eventType').value,
                    guestCount: this.querySelector('#guestCount').value,
                    clientName: this.querySelector('#clientName').value,
                    clientEmail: this.querySelector('#clientEmail').value,
                    clientPhone: this.querySelector('#clientPhone').value,
                    specialRequests: this.querySelector('#specialRequests').value
                };

                // Send to backend API
                const response = await fetch('http://localhost:3000/api/banquet', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    // Show success message
                    showSuccessMessage('Inquiry sent successfully! We will get back to you within 24 hours.');
                    
                    // Reset form
                    this.reset();
                    
                    // Close modal
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    
                    // Redirect to success page after a delay
                    setTimeout(() => {
                        window.location.href = 'banquet-success.html';
                    }, 2000);
                } else {
                    throw new Error(result.message || 'Failed to send inquiry');
                }
            } catch (error) {
                console.error('Error:', error);
                showErrorMessage('Failed to send inquiry. Please try again or contact us directly.');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
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

    // Add animation to hall cards on scroll
    const hallCards = document.querySelectorAll('.hall-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    hallCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });

    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });

    // Add smooth transitions
    serviceCards.forEach(card => {
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
});