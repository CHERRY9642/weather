const apiKey = "9afd8abc3856f72416463be47783bca4"; // OpenWeather API Key

// Fetch weather data
async function fetchWeather() {
    const city = document.getElementById("searchInput").value.trim();
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    try {
        // Get latitude & longitude
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.length) {
            alert("City not found!");
            return;
        }

        const { lat, lon, name } = geoData[0];

        // Fetch weather data
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // Update UI
        document.getElementById("temperature").innerText = `${weatherData.main.temp}°C`;
        document.getElementById("humidity").innerText = `${weatherData.main.humidity}%`;
        document.getElementById("windSpeed").innerText = `${weatherData.wind.speed} m/s`;
        document.getElementById("condition").innerText = weatherData.weather[0].description;

        // Update Map
        updateMap(lat, lon, name);

    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching weather data!");
    }
}

// Initialize map
var map = L.map('map').setView([20, 78], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var marker = L.marker([20, 78]).addTo(map);

// Update map location
function updateMap(lat, lon, city) {
    map.setView([lat, lon], 10);
    marker.setLatLng([lat, lon]).bindPopup(`Weather in ${city}`).openPopup();
}
