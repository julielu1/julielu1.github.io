// Top switches
function toggleSwitch() {
  function changePage(page) {
    setTimeout(function() {
        window.location.href = page;
    }, 300);
    }

  const element = document.querySelector(
    ".toggleCheckbox + .toggleContainer span:first-child"
  );
  const style = window.getComputedStyle(element);
  const color = style.getPropertyValue("color");

  // Set to Social if colour is orange
  if (color === "rgb(234, 80, 35)") {
    changePage('social.html');
  }

  // Set to Professional if color is white
  if (color === "rgb(0, 0, 0)") {
    changePage('index.html');
  }
}

// Blue arrow animation
document.addEventListener("DOMContentLoaded", function () { 
    if (window.location.pathname.endsWith("social.html") || window.location.pathname.endsWith("index.html")) {
        document.getElementById('blue-arrows').addEventListener('click', function() {
            const aboutSection = document.querySelector('.about');
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Fun Fact
document.addEventListener("DOMContentLoaded", function () {
    const funFactElement = document.querySelector('.fun-fact');

    function updateFunFact() {
        const randomIndex = Math.floor(Math.random() * funFacts.length);
        const randomFact = `Did you know? ${funFacts[randomIndex]}`;
        funFactElement.textContent = randomFact;
        localStorage.setItem("lastFunFactUpdate", Date.now());
        localStorage.setItem("lastFunFact", randomFact);
    }

    function showFunFact() {
        const lastFunFact = localStorage.getItem("lastFunFact");
        funFactElement.textContent = lastFunFact;
    }

    const lastFunFactUpdate = localStorage.getItem("lastFunFactUpdate");
    const lastFunFact = localStorage.getItem("lastFunFact");

    // 5 minutes
    var funFactThreshold =  5 * 60 * 1000;
    if (lastFunFact === null || Date.now() - parseInt(lastFunFactUpdate) > funFactThreshold) {
        updateFunFact();
    }
    
    showFunFact();    
});

// Weather API
function setWeatherContainer(cityName, temperature, conditionText, iconPath) {
    const weatherContainer = document.getElementById("weather-container");
    lowCapsConditionText = conditionText.toLowerCase();
    weatherContainer.innerHTML = `<div>Looks like you're visiting from ${cityName}! The local weather is ${temperature}°C and ${lowCapsConditionText}<img height="50px" src="${iconPath}" alt="${conditionText}"> </div>`;
}

document.addEventListener("DOMContentLoaded", function () {
    async function getLocationAndWeather() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const weatherapikey = `c839316b88fd4ecfad9104852241305`
                const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherapikey}&q=${latitude},${longitude}&aqi=no`;
                const response = await fetch(weatherApiUrl);
                const data = await response.json();

                const cityName = data.location.name
                const temperature = data.current.temp_c;
                const conditionText = data.current.condition.text;
                const isDay = data.current.is_day === 1;
                const iconCode = data.current.condition.icon.split("/").pop();
                const iconPath = `images/weather/${isDay ? 'day' : 'night'}/${iconCode}`;

                localStorage.setItem("weatherData", JSON.stringify({ cityName, temperature, conditionText, iconPath }));

                setWeatherContainer(cityName, temperature, conditionText, iconPath);

                localStorage.setItem("lastWeatherUpdate", Date.now());
            });
        }
    }

    // Function to check if 30 min has passed
    function shouldUpdateWeather() {
        const lastWeatherUpdate = localStorage.getItem("lastWeatherUpdate");
        if (!lastWeatherUpdate) {
            return true;
        }
        
         // 30 mins
        const weatherThreshold = 30 * 60 * 1000;
        return Date.now() - lastWeatherUpdate > weatherThreshold;
    }

    if (shouldUpdateWeather()) {
        getLocationAndWeather();
    } else {
        const storedWeatherData = localStorage.getItem("weatherData");
        if (storedWeatherData) {
            const { cityName, temperature, conditionText, iconPath } = JSON.parse(storedWeatherData);
            setWeatherContainer(cityName, temperature, conditionText, iconPath);
        }
        else {
            getLocationAndWeather();
        }
    }
});


// Media page only
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
            const flag = getFlagEmoji(name);
            document.getElementById('country-name').firstChild.data = flag + ' ' + name;
        }

        function undisplayName() {
            document.getElementById('country-name').firstChild.data = "Hover over a country";
        }

        function highlightCountry(country) {
            let replaced = country.replace(/ /g, ".");
            const paths = document.querySelectorAll('.' + replaced);
            paths.forEach(path => {
                path.style.fill = 'red';
            });
        }

        function unhighlightCountry(country) {
            let replaced = country.replace(/ /g, ".");
            const paths = document.querySelectorAll('.' + replaced);
            paths.forEach(path => {
                const trips = tripsData[country];
                let color = 'white';
                if (trips && trips.length > 0) {
                    const shade = Math.min(255, Math.max(0, Math.round(255 - trips.length * 32)));
                    color = `rgb(${shade}, ${shade}, ${shade})`;
                }
                path.style.fill = color;
            });
        }
        
        function getFlagEmoji(country) {
            return countryFlags[country] || '';
        }
        
        function displayInformation(country) {
            const trips = tripsData[country];
            const tripCardsContainer = document.querySelector('.trip-cards-container');
            tripCardsContainer.innerHTML = '';
        
            // For each trip within the country, create a new list item for each trip
            if (trips) {
                for (let i = 0; i < trips.length; i++) {
                    const trip = trips[i];
                    const tripCard = document.createElement('li');
                    tripCard.classList.add('trip-card');
                    let photosHtml = '';
                    for (let j = 0; j < trip.photos.length; j++) {
                        photosHtml += `<img src="${trip.photos[j]}" alt="Image description">`;
                    }
                    tripCard.innerHTML = `
                        <h4>#${trip.name} ${trip.date}</h4>
                        <p><strong>Cities: ${trip.cities}</strong></p>
                        <p>${trip.description}</p>
                        <div class="photos-container">${photosHtml}</div>
                    `;
                    tripCardsContainer.appendChild(tripCard);
                }
        
                document.querySelector('.country-name-selected').innerHTML = `${getFlagEmoji(trips[0].country)} ${trips[0]['country']}`;
                document.querySelector('.country-visit-number').innerHTML = `Visits: ${trips.length}`;
            } else {
                document.querySelector('.country-name-selected').innerHTML = `${getFlagEmoji(country)} ${country}`;
                document.querySelector('.country-visit-number').innerHTML = ` `;
                tripCardsContainer.innerHTML = `<li>I haven't travelled to ${country} yet!</li>`;
            }
        }

        // Shading countries by visiting frequency
        function shadeCountries() {
            const pathElements = document.querySelectorAll('path');
            pathElements.forEach(path => {
                const countryName = path.getAttribute('class');
                const trips = tripsData[countryName];
                let color = 'white';
                if (trips && trips.length > 0) {
                    const shade = Math.min(255, Math.max(0, Math.round(255 - trips.length * 32)));
                    color = `rgb(${shade}, ${shade}, ${shade})`;
                }
                path.style.fill = color;
            });
        }

        function promptToSelect() {
            const currentText = document.querySelector('.country-name-selected');
            if (currentText.innerHTML === "SELECT A COUNTRY") {
                currentText.classList.add('fade-in-out');
                currentText.style.color = "lightgray";
                currentText.style.textAlign = "center";
            } else {
                currentText.classList.remove('fade-in-out');
                currentText.style.color = "black";
                currentText.style.textAlign = "left";
            }
        }        
        
        // Initial running upon loading
        promptToSelect();
        shadeCountries();

        // Creating event listeners for every country
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
                promptToSelect();
            });
        });
    }
});

// Considered putting this information into another file, but it caused CORS issues. Most effective method was to just leave it here.
const countryFlags = {
    'Afghanistan': '🇦🇫',
    'Albania': '🇦🇱',
    'Algeria': '🇩🇿',
    'Andorra': '🇦🇩',
    'Angola': '🇦🇴',
    'Antigua & Barbuda': '🇦🇬',
    'Argentina': '🇦🇷',
    'Armenia': '🇦🇲',
    'Australia': '🇦🇺',
    'Austria': '🇦🇹',
    'Azerbaijan': '🇦🇿',
    'Bahamas': '🇧🇸',
    'Bahrain': '🇧🇭',
    'Bangladesh': '🇧🇩',
    'Barbados': '🇧🇧',
    'Belarus': '🇧🇾',
    'Belgium': '🇧🇪',
    'Belize': '🇧🇿',
    'Benin': '🇧🇯',
    'Bhutan': '🇧🇹',
    'Bolivia': '🇧🇴',
    'Bosnia & Herzegovina': '🇧🇦',
    'Botswana': '🇧🇼',
    'Brazil': '🇧🇷',
    'Brunei': '🇧🇳',
    'Bulgaria': '🇧🇬',
    'Burkina Faso': '🇧🇫',
    'Burundi': '🇧🇮',
    'Cabo Verde': '🇨🇻',
    'Cambodia': '🇰🇭',
    'Cameroon': '🇨🇲',
    'Canada': '🇨🇦',
    'Central African Republic': '🇨🇫',
    'Chad': '🇹🇩',
    'Chile': '🇨🇱',
    'China': '🇨🇳',
    'Colombia': '🇨🇴',
    'Comoros': '🇰🇲',
    'Democratic Republic of the Congo': '🇨🇬',
    'Costa Rica': '🇨🇷',
    'Croatia': '🇭🇷',
    'Cuba': '🇨🇺',
    'Cyprus': '🇨🇾',
    'Czech Republic': '🇨🇿',
    'Denmark': '🇩🇰',
    'Djibouti': '🇩🇯',
    'Dominica': '🇩🇲',
    'Dominican Republic': '🇩🇴',
    'Ecuador': '🇪🇨',
    'Egypt': '🇪🇬',
    'El Salvador': '🇸🇻',
    'Equatorial Guinea': '🇬🇶',
    'Eritrea': '🇪🇷',
    'Estonia': '🇪🇪',
    'Eswatini': '🇸🇿',
    'Ethiopia': '🇪🇹',
    'Falkland Islands': '🇫🇰',
    'Fiji': '🇫🇯',
    'Finland': '🇫🇮',
    'France': '🇫🇷',
    'Gabon': '🇬🇦',
    'Gambia': '🇬🇲',
    'Georgia': '🇬🇪',
    'Germany': '🇩🇪',
    'Ghana': '🇬🇭',
    'Greece': '🇬🇷',
    'Greenland': '🇬🇱',
    'Grenada': '🇬🇩',
    'Guatemala': '🇬🇹',
    'Guinea': '🇬🇳',
    'Guinea-Bissau': '🇬🇼',
    'French Guiana': '🇬🇾',
    'Haiti': '🇭🇹',
    'Honduras': '🇭🇳',
    'Hungary': '🇭🇺',
    'Iceland': '🇮🇸',
    'India': '🇮🇳',
    'Indonesia': '🇮🇩',
    'Iran': '🇮🇷',
    'Iraq': '🇮🇶',
    'Ireland': '🇮🇪',
    'Israel': '🇮🇱',
    'Italy': '🇮🇹',
    'Jamaica': '🇯🇲',
    'Japan': '🇯🇵',
    'Jordan': '🇯🇴',
    'Kazakhstan': '🇰🇿',
    'Kenya': '🇰🇪',
    'Kiribati': '🇰🇮',
    'Dem Rep Korea': '🇰🇵',
    'Republic of Korea': '🇰🇷',
    'Kosovo': '🇽🇰',
    'Kuwait': '🇰🇼',
    'Kyrgyzstan': '🇰🇬',
    'Lao PDR': '🇱🇦',
    'Latvia': '🇱🇻',
    'Lebanon': '🇱🇧',
    'Lesotho': '🇱🇸',
    'Liberia': '🇱🇷',
    'Libya': '🇱🇾',
    'Liechtenstein': '🇱🇮',
    'Lithuania': '🇱🇹',
    'Luxembourg': '🇱🇺',
    'Madagascar': '🇲🇬',
    'Malawi': '🇲🇼',
    'Malaysia': '🇲🇾',
    'Maldives': '🇲🇻',
    'Mali': '🇲🇱',
    'Malta': '🇲🇹',
    'Marshall Islands': '🇲🇭',
    'Mauritania': '🇲🇷',
    'Mauritius': '🇲🇺',
    'Mexico': '🇲🇽',
    'Micronesia': '🇫🇲',
    'Moldova': '🇲🇩',
    'Monaco': '🇲🇨',
    'Mongolia': '🇲🇳',
    'Montenegro': '🇲🇪',
    'Morocco': '🇲🇦',
    'Mozambique': '🇲🇿',
    'Myanmar': '🇲🇲',
    'Namibia': '🇳🇦',
    'Nauru': '🇳🇷',
    'Nepal': '🇳🇵',
    'Netherlands': '🇳🇱',
    'New Zealand': '🇳🇿',
    'Nicaragua': '🇳🇮',
    'Niger': '🇳🇪',
    'Nigeria': '🇳🇬',
    'North Macedonia': '🇲🇰',
    'Norway': '🇳🇴',
    'Oman': '🇴🇲',
    'Pakistan': '🇵🇰',
    'Palau': '🇵🇼',
    'Palestine': '🇵🇸',
    'Panama': '🇵🇦',
    'Papua New Guinea': '🇵🇬',
    'Paraguay': '🇵🇾',
    'Peru': '🇵🇪',
    'Philippines': '🇵🇭',
    'Poland': '🇵🇱',
    'Portugal': '🇵🇹',
    'Qatar': '🇶🇦',
    'Romania': '🇷🇴',
    'Russian Federation': '🇷🇺',
    'Rwanda': '🇷🇼',
    'Saint Kitts & Nevis': '🇰🇳',
    'Saint Lucia': '🇱🇨',
    'Saint Vincent & Grenadines': '🇻🇨',
    'Samoa': '🇼🇸',
    'San Marino': '🇸🇲',
    'Sao Tome & Principe': '🇸🇹',
    'Saudi Arabia': '🇸🇦',
    'Senegal': '🇸🇳',
    'Serbia': '🇷🇸',
    'Seychelles': '🇸🇨',
    'Sierra Leone': '🇸🇱',
    'Singapore': '🇸🇬',
    'Slovakia': '🇸🇰',
    'Slovenia': '🇸🇮',
    'Solomon Islands': '🇸🇧',
    'Somalia': '🇸🇴',
    'South Africa': '🇿🇦',
    'South Sudan': '🇸🇸',
    'Spain': '🇪🇸',
    'Sri Lanka': '🇱🇰',
    'Sudan': '🇸🇩',
    'Suriname': '🇸🇷',
    'Sweden': '🇸🇪',
    'Switzerland': '🇨🇭',
    'Syria': '🇸🇾',
    'Taiwan': '🇹🇼',
    'Tajikistan': '🇹🇯',
    'Tanzania': '🇹🇿',
    'Thailand': '🇹🇭',
    'Timor-Leste': '🇹🇱',
    'Togo': '🇹🇬',
    'Tonga': '🇹🇴',
    'Trinidad & Tobago': '🇹🇹',
    'Tunisia': '🇹🇳',
    'Turkey': '🇹🇷',
    'Turkmenistan': '🇹🇲',
    'Tuvalu': '🇹🇻',
    'Uganda': '🇺🇬',
    'Ukraine': '🇺🇦',
    'United Arab Emirates': '🇦🇪',
    'United Kingdom': '🇬🇧',
    'United States': '🇺🇸',
    'Uruguay': '🇺🇾',
    'Uzbekistan': '🇺🇿',
    'Vanuatu': '🇻🇺',
    'Vatican City': '🇻🇦',
    'Venezuela': '🇻🇪',
    'Vietnam': '🇻🇳',
    'Yemen': '🇾🇪',
    'Zambia': '🇿🇲',
    'Zimbabwe': '🇿🇼',
};

const funFacts = [
    "These fun facts are updated every 5 minutes",
    "I've visited over 10 countries in the past year.",
    "I'm learning to play the guitar.",
    "The colour scheme for this website was originally based off of Star War's Republic Commandos.",
  ];

const tripsData = {
    "China": [
        {
            "country": "China",
            "name": "1",
            "date": "November 2023",
            "cities": "Shanghai, Guangzhou",
            "description": "Went on a trip with my mum for two weeks to visit family and do some light sight seeing. It had been nearly 10 years since I had been to China. Some places to went to included Shanghai, Anhui (hometown), Guangzhou, Hangzhou, and Huangshan. We climbed up Huangshan, which was one of the highlights of the trip. It took around 6 hours, and it was really cold once we got up to the top!",
            "photos": ["images/media/mountains.jpg", "images/media/hanfu.jpg"]
        },
        {
            "country": "China",
            "name": "2",
            "date": "August 2015",
            "cities": "Beijing, Anhui",
            "description": "Visited my family, and saw the Great Wall! We walked along it for a bit, before getting tired and returning.",
            "photos": []
        }
    ],
    "Italy": [
        {
            "country": "Italy",
            "name": "1",
            "date": "July 2023",
            "cities": "Venice, Florence, Cinque Terre, Milan, Rome",
            "description": "We went to Italy after my short exchange at LSE in London prior. We took trains the entire way, and stayed in each place for only a couple days. We did 2 nights in Venice, 1 night in Florence, 3 nights in Cinque Terre (rest point in the trip!) 1 night in Milan, and 3 nights in Rome. It was peak tourist season, so it was incredibly busy, and there was also a heatwave at the same time. We had to wake up really early and do most of the touring very early in the morning! In Cinque Terre, we stayed in Riomaggiore, at the top of the hill (600 steps to where we were staying or - according to Google Maps - a 6 minute walk: if you could fly'). ",
            "photos": ["images/media/venice.jpg"]
        }
    ],
    "Peru": [
        {
            "country": "Peru",
            "name": "1",
            "date": "December 2019",
            "cities": "Cusco, Lima, Arequipa",
            "description": "Went to Peru with Antipodeans during high school - fantastic experience! We went for three weeks and did a three day Lares Trek hike. It was stunning, and very different to any other country I had been to before. The people and the culture was really cool to be immersed in.",
            "photos": []
        }
    ],
    "United Kingdom": [
        {
            "country": "United Kingdom",
            "name": "1",
            "date": "June 2010",
            "cities": "London, Stonehenge",
            "description": "Travelled with Europe with my family. In London, visited Big Ben, and the Cathedral. I was quite young so I don't remember too much of it.",
            "photos": []
        },
        {
            "country": "United Kingdom",
            "name": "2",
            "date": "June-July 2023",
            "cities": "London, Windsor",
            "description": "Attended London School of Economics (LSE) for a short exchange during university. Was a fun trip with friends. I visited all the main attractions, and also got to do a weekend trip out to Amsterdam and Windsor Castle. There was also a mid-exchange boat party on the Thames River hosted by LSE, which was a lot of fun. Other highlights included watching Phantom of the Opera at the King's Theatre.",
            "photos": []
        }
    ]
};
