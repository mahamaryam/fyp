document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('mouseover', () => {
      const menu = dropdown.querySelector('.dropdown-menu');
      if (menu) {
        menu.classList.add('show');
      }
    });
  
    dropdown.addEventListener('mouseleave', () => {
      const menu = dropdown.querySelector('.dropdown-menu');
      if (menu) {
        menu.classList.remove('show');
      }
    });
  });