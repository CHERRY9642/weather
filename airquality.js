const apiKey = "9afd8abc3856f72416463be47783bca4"; // Replace with your OpenWeather API Key

async function fetchWeather() {
    const city = document.getElementById("searchInput").value.trim();
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.length) {
            alert("City not found!");
            return;
        }

        const { lat, lon, name } = geoData[0];
        fetchAirPollution(lat, lon, name);
    } catch (error) {
        alert("Error fetching city data.");
    }
}

async function fetchAirPollution(lat, lon, cityName) {
    const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const response = await fetch(pollutionUrl);
        const data = await response.json();

        if (!data.list.length) {
            alert("No pollution data available.");
            return;
        }

        const pollution = data.list[0].components;
        displayPollutionData(pollution, cityName);
    } catch (error) {
        alert("Error fetching pollution data.");
    }
}

function displayPollutionData(pollution, cityName) {
    document.getElementById("cityName").textContent = `Air Quality in ${cityName}`;
    document.getElementById("co").textContent = pollution.co + " ppm";
    document.getElementById("no").textContent = pollution.no + " ppm";
    document.getElementById("no2").textContent = pollution.no2 + " ppm";
    document.getElementById("o3").textContent = pollution.o3 + " ppm";
    document.getElementById("so2").textContent = pollution.so2 + " ppm";
    document.getElementById("pm2_5").textContent = pollution.pm2_5 + " µg/m³";
    document.getElementById("pm10").textContent = pollution.pm10 + " µg/m³";
    document.getElementById("nh3").textContent = pollution.nh3 + " ppm";
}

// Replace with your OpenWeather API Key
let map;

// Initialize Map
function initMap() {
    map = L.map("temperatureMap").setView([20, 78], 4); // Default center: India

    // OpenStreetMap Base Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // Add OpenWeatherMap Temperature Layer
    L.tileLayer(`https://maps.openweathermap.org/maps/2.0/weather/1h/TA2/{z}/{x}/{y}?appid=${apiKey}&fill_bound=true&opacity=0.6&palette=-65:821692;-55:821692;-45:821692;-40:821692;-30:8257db;-20:208cec;-10:20c4e8;0:23dddd;10:c2ff28;20:fff028;25:ffc228;30:fc8014`, {
        attribution: "Weather data &copy; OpenWeatherMap"
    }).addTo(map);
}

// Call initMap when the page loads
window.onload = initMap;
