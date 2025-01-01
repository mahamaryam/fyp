window.addEventListener('scroll', () => {
    const progressBar = document.getElementById('progress-bar');
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    // Calculate dynamic colors based on the scroll percentage
    const red = Math.min(255, Math.floor(scrollPercentage * 2.55)); // Ranges from 0 to 255
    const green = Math.min(255, Math.floor((100 - scrollPercentage) * 2.55)); // Ranges from 255 to 0
    const blue = 128 + Math.floor(Math.sin(scrollPercentage * 0.1) * 127); // Oscillates for effect

    // Set dynamic gradient background
    progressBar.style.background = `linear-gradient(to right, rgb(${red}, ${green}, 255), rgb(${blue}, ${red}, ${green}))`;
    progressBar.style.width = scrollPercentage + '%';
});