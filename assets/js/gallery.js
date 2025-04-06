document.addEventListener('DOMContentLoaded', () => {
  const galleries = document.querySelectorAll('.gallery-container');

  galleries.forEach(galleryContainer => {
    let currentIndex = 0;
    const galleryWrapper = galleryContainer.querySelector('.gallery-wrapper');
    const gallery = galleryWrapper.querySelector('.gallery');
    const galleryInner = galleryWrapper.querySelector('.gallery-inner');
    const indicatorsContainer = galleryWrapper.querySelector('.indicators');
    const totalImages = galleryInner.querySelectorAll('.image-wrapper').length;
    const prevButton = galleryContainer.querySelector('.prev-button');
    const nextButton = galleryContainer.querySelector('.next-button');

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let isSwiping = false;
    let galleryWidth = 0;
    let startTranslate = 0;
    let currentTranslate = 0;
    const swipeThreshold = 15; // minimum px horizontally before recognizing swipe
    const resistance = 0.4;

    for (let i = 0; i < totalImages; i++) {
      const indicator = document.createElement('div');
      indicator.className = i === 0 ? 'indicator active' : 'indicator';
      indicator.onclick = () => {
        currentIndex = i;
        updateGallery();
      };
      indicatorsContainer.appendChild(indicator);
    }

    const updateIndicators = () => {
      const indicators = indicatorsContainer.querySelectorAll('.indicator');
      indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    };

    const updateButtons = () => {
      if (currentIndex === 0) {
        prevButton.classList.add('hidden');
      } else {
        prevButton.classList.remove('hidden');
      }
      if (currentIndex === totalImages - 1) {
        nextButton.classList.add('hidden');
      } else {
        nextButton.classList.remove('hidden');
      }
    };

    const updateGallery = (withTransition = true) => {
      galleryWidth = gallery.offsetWidth;
      if (withTransition) {
        galleryInner.style.transition = 'transform 0.3s ease';
      } else {
        galleryInner.style.transition = 'none';
      }
      galleryInner.style.transform = `translateX(${-currentIndex * galleryWidth}px)`;
      updateIndicators();
      updateButtons();
    };

    const setTranslate = (translate) => {
      galleryInner.style.transition = 'none';
      galleryInner.style.transform = `translateX(${translate}px)`;
    };

    const scrollGallery = (direction) => {
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < totalImages) {
        currentIndex = newIndex;
        updateGallery();
      }
    };

    gallery.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      galleryWidth = gallery.offsetWidth;
      startTranslate = -currentIndex * galleryWidth;
      currentTranslate = startTranslate;
      isDragging = true;
      isSwiping = false;
      galleryInner.style.transition = 'none';
    });

    gallery.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      if (!isSwiping) {
        if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
          isSwiping = true;
        } else if (Math.abs(deltaY) > Math.abs(deltaX)) {
          isDragging = false; // treat as vertical scroll
          return;
        } else {
          return; // not enough movement yet
        }
      }

      let move = startTranslate + deltaX;

      if (currentIndex === 0 && deltaX > 0) {
        move = startTranslate + deltaX * resistance;
      }
      if (currentIndex === totalImages - 1 && deltaX < 0) {
        move = startTranslate + deltaX * resistance;
      }

      setTranslate(move);
    });

    gallery.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const movedBy = currentX - startX;

      if (movedBy < -galleryWidth / 4 && currentIndex < totalImages - 1) {
        currentIndex++;
      } else if (movedBy > galleryWidth / 4 && currentIndex > 0) {
        currentIndex--;
      }

      updateGallery(true);
    });

    prevButton.addEventListener('click', () => scrollGallery(-1));
    nextButton.addEventListener('click', () => scrollGallery(1));
    window.addEventListener('resize', () => {
      updateGallery(false);
    });

    updateGallery();
  });
});
