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
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission
        
        if (window.validateForm(this)) {
            // Show processing state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            try {
                // Collect form data
                const formData = {
                    selectedRoom: this.querySelector('#roomType').value,
                    roomPrice: this.querySelector('#roomPrice').value.replace('₹', '').replace('/night', '').replace(',', ''),
                    checkIn: this.querySelector('#checkIn').value,
                    checkOut: this.querySelector('#checkOut').value,
                    guests: this.querySelector('#guests').value,
                    rooms: this.querySelector('#rooms').value,
                    guestName: this.querySelector('#guestName').value,
                    guestEmail: this.querySelector('#guestEmail').value,
                    guestPhone: this.querySelector('#guestPhone').value
                };

                // Send to backend API
                const response = await fetch('http://localhost:3000/api/rooms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    // Show success message
                    showSuccessMessage('Booking request sent successfully! We will get back to you within 24 hours.');
                    
                    // Reset form
                    this.reset();
                    
                    // Close modal
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    
                    // Redirect to success page after a delay
                    setTimeout(() => {
                        window.location.href = 'booking-success.html';
                    }, 2000);
                } else {
                    throw new Error(result.message || 'Failed to send booking request');
                }
            } catch (error) {
                console.error('Error:', error);
                showErrorMessage('Failed to send booking request. Please try again or contact us directly.');
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
            position:relative;
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

    // Add smooth transitions to room cards
    roomCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
});