// script.js
document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('gallery-grid');
    const viewMoreBtn = document.getElementById('view-more');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    let images = [];  // Array to store successfully loaded image sources
    let currentIndex = 0;

    // Recursive function to load sequential images
    function loadSequential(index = 1) {
        const src = `images/packard${index}.jpg`;  // Adjust extension if not all .jpg
        const img = new Image();

        img.onload = () => {
            // Add to gallery
            const galleryImg = document.createElement('img');
            galleryImg.src = src;
            galleryImg.alt = `Packard Image ${index}`;
            galleryImg.dataset.index = images.length;
            if (images.length >= 4) {
                galleryImg.classList.add('hidden');
            }
            galleryGrid.appendChild(galleryImg);

            // Store in array for lightbox navigation
            images.push(src);

            // Click to open lightbox
            galleryImg.addEventListener('click', () => {
                currentIndex = parseInt(galleryImg.dataset.index);
                openLightbox();
            });

            // Load next
            loadSequential(index + 1);
        };

        img.onerror = () => {
            // Stop on failure (no more images)
            console.log(`Stopped loading at ${src}`);
            // Show "View More" if more than 4 images
            if (images.length > 4) {
                viewMoreBtn.style.display = 'block';
            }
        };

        img.src = src;
    }

    // Start loading
    loadSequential();

    // View More button click
    viewMoreBtn.addEventListener('click', () => {
        const hiddenImgs = galleryGrid.querySelectorAll('img.hidden');
        hiddenImgs.forEach(img => img.classList.remove('hidden'));
        viewMoreBtn.style.display = 'none';
    });

    // Open lightbox
    function openLightbox() {
        if (images.length === 0) return;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateLightboxImage();
    }

    // Update image in lightbox
    function updateLightboxImage() {
        lightboxImg.src = images[currentIndex];
        lightboxImg.alt = `Packard Image ${currentIndex + 1}`;
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);

    // Close on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Previous image
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        updateLightboxImage();
    });

    // Next image
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        updateLightboxImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });
});