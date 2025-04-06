document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search');
  const searchWrapper = document.querySelector('.search-wrapper');
  const closeButton = document.querySelector('.icon-remove-sign');

  if (searchButton && searchWrapper && closeButton) {
    searchButton.addEventListener('click', () => {
      searchWrapper.classList.add('active');
    });

    closeButton.addEventListener('click', () => {
      searchWrapper.classList.remove('active');
    });
  }
});