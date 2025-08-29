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
    inquiryForm.addEventListener('submit', function(e) {
        // Remove preventDefault to allow form submission to FormSubmit
        
        if (window.validateForm(this)) {
            // Show processing state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Form will submit to FormSubmit and redirect to success page
            // No need to manually close modal or show success message
        }
    });

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