// import tripsData from "./trips.js";

// Top switches
function toggleSwitch() {
  console.log("Switch is toggling!");

  const element = document.querySelector(
    ".toggleCheckbox + .toggleContainer div:first-child"
  );
  const style = window.getComputedStyle(element);
  const color = style.getPropertyValue("color");

  // Set to Social
  if (color === "rgb(234, 80, 35)") {
    setTimeout(function () {
      window.location.href = "social.html";
    }, 300);
  }

  // Set to Professional
  if (color === "rgb(0, 0, 0)") {
    setTimeout(function () {
      window.location.href = "index.html";
    }, 300);
  }
}

// Media page
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.endsWith("media.html")) {
    const images = document.querySelectorAll(".image-gallery img");
    const popupContainer = document.querySelector(".popup-container");
    const popupImage = document.querySelector(".popup-image");
    const popupDescription = document.querySelector(".popup-description");

    images.forEach(function (image) {
        image.addEventListener("click", function () {
        popupImage.src = this.src;
        popupDescription.innerText = this.alt;
        popupContainer.style.display = "block";
        });
    });

    const closePopup = document.querySelector(".close");
    closePopup.addEventListener("click", function () {
        popupContainer.style.display = "none";
    });

    popupContainer.addEventListener("click", function (event) {
        if (event.target === popupContainer) {
        popupContainer.style.display = "none";
        }
    });
    }
});

// Travel page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith("travel.html")) 
    {
        function displayName(name) {
            document.getElementById('country-name').firstChild.data = name;
        }

        function undisplayName() {
            document.getElementById('country-name').firstChild.data = "Hover over a country";
        }

        function highlightCountry(country) {
            let replaced = country.replace(/ /g, ".");
            const paths = document.querySelectorAll('.' + replaced);
            paths.forEach(path => {
                path.setAttribute('fill', 'red'); // Change the fill color to red (or any other color you prefer)
            });
        }

        function unhighlightCountry(country) {
            let replaced = country.replace(/ /g, ".");
            const paths = document.querySelectorAll('.' + replaced);
            paths.forEach(path => {
                path.setAttribute('fill', ''); // Reset the fill color
            });
        }
        
        //display with js
        function displayInformation(country) {
            const trips = tripsData[country];
            if (trips) {
                console.log(trips);
                for (let i = 0; i < trips.length; i++) {
                    console.log(trips[i]);
            };
                document.querySelector('.country-name-selected').innerHTML = `${trips[0]['country']}`;
                document.querySelector('.country-visit-number').innerHTML = `${trips[0]['name']}`;
                document.querySelector('.date-travelled').innerHTML = `${trips[0]['date']}`;
                document.querySelector('.trip-information').innerHTML = `${trips[0]['description']}`;
            } else {
                document.querySelector('.country-name-selected').innerHTML = ` `;
                document.querySelector('.country-visit-number').innerHTML = ` `;
                document.querySelector('.date-travelled').innerHTML = ` `;
                document.querySelector('.trip-information').innerHTML = 'No trip information available for this country.';
            }
        }

        const pathElements = document.querySelectorAll('path');

        pathElements.forEach(path => {
            const country = path.getAttribute('class');
            path.addEventListener('mouseover', () => {
                displayName(country);
                highlightCountry(country);
            });
            path.addEventListener('mouseout', () => {
                undisplayName();
                unhighlightCountry(country);
            });
            path.addEventListener('click', () => {
                displayInformation(country);
            });
        });
    }
});

const tripsData = {
    "China": [
        {
            "country": "China",
            "name": "Trip 1",
            "date": "November 2023",
            "description": "Saw the Great Wall"
        },
        {
            "country": "China",
            "name": "Trip 2",
            "date": "December 2024",
            "description": "Saw the terracotta warriors"
        }
    ],
    "Australia": [
        {
            "country": "Australia",
            "name": "Trip 1",
            "date": "January 2021",
            "description": "Saw the opera house"
        }
    ]
};