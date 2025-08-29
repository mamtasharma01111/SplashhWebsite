// Rooms page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Room filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const roomCards = document.querySelectorAll('.room-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Filter rooms
            roomCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Booking modal functionality
    const modal = document.getElementById('bookingModal');
    const bookButtons = document.querySelectorAll('.book-btn');
    const closeBtn = document.querySelector('.close');
    const bookingForm = document.getElementById('bookingForm');

    // Open modal
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roomType = this.getAttribute('data-room');
            const roomPrice = this.getAttribute('data-price');

            document.getElementById('roomType').value = roomType;
            document.getElementById('roomPrice').value = `₹${roomPrice}/night`;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('checkIn').min = today;
            document.getElementById('checkOut').min = today;
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

    // Calculate total price
    function calculateTotal() {
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const rooms = document.getElementById('rooms').value;
        const roomPrice = document.getElementById('roomPrice').value.replace('₹', '').replace('/night', '').replace(',', '');

        if (checkIn && checkOut && rooms && roomPrice) {
            const startDate = new Date(checkIn);
            const endDate = new Date(checkOut);
            const timeDiff = endDate.getTime() - startDate.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (daysDiff > 0) {
                const total = daysDiff * parseInt(roomPrice) * parseInt(rooms);
                document.getElementById('totalPrice').textContent = total.toLocaleString();
            }
        }
    }

    // Add event listeners for price calculation
    ['checkIn', 'checkOut', 'rooms'].forEach(id => {
        document.getElementById(id).addEventListener('change', calculateTotal);
    });

    // Validate check-out date
    document.getElementById('checkIn').addEventListener('change', function() {
        const checkInDate = this.value;
        const checkOutInput = document.getElementById('checkOut');
        
        if (checkInDate) {
            const nextDay = new Date(checkInDate);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutInput.min = nextDay.toISOString().split('T')[0];
            
            if (checkOutInput.value && checkOutInput.value <= checkInDate) {
                checkOutInput.value = '';
            }
        }
    });

    // Handle booking form submission
    bookingForm.addEventListener('submit', function(e) {
        // Remove preventDefault to allow form submission to FormSubmit
        
        if (window.validateForm(this)) {
            // Show processing state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            // Form will submit to FormSubmit and redirect to success page
            // No need to manually close modal or show success message
        }
    });

    // Add smooth transitions to room cards
    roomCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
});