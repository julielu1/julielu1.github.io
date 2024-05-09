function toggleSwitch() {
    console.log("Switch is toggling!")

    const element = document.querySelector('.toggleCheckbox + .toggleContainer div:first-child');
    const style = window.getComputedStyle(element);
    const color = style.getPropertyValue('color');

    const toggleContainer = document.querySelector('.toggleContainer');

    // Set to Social
    if (color === "rgb(234, 80, 35)") {
        setTimeout(function() {
            window.location.href = "social.html";
        }, 300);
    }

    // Set to Professional
    if (color === "rgb(0, 0, 0)") {
        setTimeout(function() {
            window.location.href = "index.html";    
        }, 300);    
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.image-gallery img');
    const popupContainer = document.querySelector('.popup-container');
    const popupImage = document.querySelector('.popup-image');
    const popupDescription = document.querySelector('.popup-description');
  
    images.forEach(function(image) {
      image.addEventListener('click', function() {
        popupImage.src = this.src;
        popupDescription.innerText = this.alt;
        popupContainer.style.display = 'block';
      });
    });
  
    const closePopup = document.querySelector('.close');
    closePopup.addEventListener('click', function() {
      popupContainer.style.display = 'none';
    });
  
    popupContainer.addEventListener('click', function(event) {
      if (event.target === popupContainer) {
        popupContainer.style.display = 'none';
      }
    });
  });
  
  
  