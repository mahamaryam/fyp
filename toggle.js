document.getElementById('toggleSidebar').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
});

// Example of dynamically updating the image source from the backend
const dynamicImage = document.getElementById('dynamicImage');
const imageUrlFromBackend = 'img/dynamic-image.jpg'; // Replace this with actual backend logic
dynamicImage.src = imageUrlFromBackend;