// Gallery page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Lightbox functionality
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    let currentImageIndex = 0;
    let visibleImages = [];

    function updateVisibleImages() {
        visibleImages = Array.from(galleryItems).filter(item => 
            item.style.display !== 'none' && item.style.opacity !== '0'
        );
    }

    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            updateVisibleImages();
            currentImageIndex = visibleImages.indexOf(this);
            
            const img = this.querySelector('img');
            const overlay = this.querySelector('.gallery-overlay');
            
            lightboxImg.src = img.src;
            lightboxCaption.innerHTML = overlay ? 
                `<h3>${overlay.querySelector('h3').textContent}</h3><p>${overlay.querySelector('p').textContent}</p>` : 
                img.alt;
            
            lightboxModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    closeBtn.addEventListener('click', function() {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function(event) {
        if (event.target === lightboxModal) {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Navigation functions
    function showImage(index) {
        if (index >= 0 && index < visibleImages.length) {
            currentImageIndex = index;
            const item = visibleImages[currentImageIndex];
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay');
            
            lightboxImg.src = img.src;
            lightboxCaption.innerHTML = overlay ? 
                `<h3>${overlay.querySelector('h3').textContent}</h3><p>${overlay.querySelector('p').textContent}</p>` : 
                img.alt;
        }
    }

    // Previous image
    prevBtn.addEventListener('click', function() {
        const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : visibleImages.length - 1;
        showImage(newIndex);
    });

    // Next image
    nextBtn.addEventListener('click', function() {
        const newIndex = currentImageIndex < visibleImages.length - 1 ? currentImageIndex + 1 : 0;
        showImage(newIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (lightboxModal.style.display === 'block') {
            switch(event.key) {
                case 'Escape':
                    lightboxModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    break;
                case 'ArrowLeft':
                    prevBtn.click();
                    break;
                case 'ArrowRight':
                    nextBtn.click();
                    break;
            }
        }
    });

    // Add smooth transitions to gallery items
    galleryItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    // Lazy loading for gallery images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    // Observe all gallery images
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img.hasAttribute('loading')) {
            imageObserver.observe(img);
        }
    });

    // Initialize visible images array
    updateVisibleImages();
});