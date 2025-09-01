// Rooms page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Room filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const roomCards = document.querySelectorAll('.room-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

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

    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roomType = this.getAttribute('data-room');
            const roomPrice = this.getAttribute('data-price');

            document.getElementById('roomType').value = roomType;
            document.getElementById('roomPrice').value = `₹${roomPrice}/night`;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            const today = new Date().toISOString().split('T')[0];
            document.getElementById('checkIn').min = today;
            document.getElementById('checkOut').min = today;
        });
    });

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

    ['checkIn', 'checkOut', 'rooms'].forEach(id => {
        document.getElementById(id).addEventListener('change', calculateTotal);
    });

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

    // Handle booking form + Razorpay
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (window.validateForm(this)) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            try {
                const formData = {
                    selectedRoom: this.querySelector('#roomType').value,
                    roomPrice: this.querySelector('#roomPrice').value.replace('₹', '').replace('/night', '').replace(',', ''),
                    checkIn: this.querySelector('#checkIn').value,
                    checkOut: this.querySelector('#checkOut').value,
                    guests: this.querySelector('#guests').value,
                    rooms: this.querySelector('#rooms').value,
                    guestName: this.querySelector('#guestName').value,
                    guestEmail: this.querySelector('#guestEmail').value,
                    guestPhone: this.querySelector('#guestPhone').value,
                    totalAmount: document.getElementById('totalPrice').textContent.replace(',', '')
                };

                // 1. Create Razorpay order from backend
                const orderResponse = await fetch('http://localhost:3000/api/payment/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: formData.totalAmount })
                });

                const order = await orderResponse.json();

                // 2. Open Razorpay checkout
                const options = {
                    key: "YOUR_RAZORPAY_KEY_ID", // replace with your key
                    amount: order.amount,
                    currency: order.currency,
                    order_id: order.id,
                    name: "Splashh Hotel Booking",
                    description: formData.selectedRoom,
                    handler: async function (response) {
                        // 3. On payment success → save booking
                        await fetch('http://localhost:3000/api/rooms', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...formData, paymentId: response.razorpay_payment_id })
                        });

                        showSuccessMessage('Payment successful! Booking confirmed.');
                        bookingForm.reset();
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        setTimeout(() => {
                            window.location.href = 'booking-success.html';
                        }, 2000);
                    },
                    prefill: {
                        name: formData.guestName,
                        email: formData.guestEmail,
                        contact: formData.guestPhone
                    },
                    theme: { color: "#3399cc" }
                };

                const rzp = new Razorpay(options);
                rzp.open();

            } catch (error) {
                console.error('Error:', error);
                showErrorMessage('Payment/Booking failed. Please try again.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });

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

    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: relative;
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

    roomCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
});
