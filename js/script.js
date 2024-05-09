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