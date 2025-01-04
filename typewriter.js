document.addEventListener("DOMContentLoaded", () => {
    const text = `Everything you need to plan the wedding you want\n\nFor all the days along the way.\n`;
  
    const typewriterElement = document.getElementById("typewriter");
    const cursor = document.getElementById("cursor");
    let index = 0;
  
    function getRandomDelay(char) {
      // Words are faster, spaces and punctuation are slower
      if (char === ' ' || char === '.' || char === ',' || char === '\n') {
        return Math.random() * (150 - 100) + 100; // Slower delay
      } else {
        return Math.random() * (100 - 30) + 30; // Faster delay
      }
    }
  
    function typeWriter() {
      if (index < text.length) {
        const currentChar = text[index];
        typewriterElement.textContent += currentChar;
        index++;
        setTimeout(typeWriter, getRandomDelay(currentChar));
      } else {
        cursor.style.animation = 'none'; // Stop blinking after typing is done
      }
    }
  
    typeWriter();
  });
