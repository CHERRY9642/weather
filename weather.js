const apiKey = "9afd8abc3856f72416463be47783bca4"; // OpenWeather API Key

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

        // Fetch current weather data
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        document.getElementById("temperature").innerText = `${weatherData.main.temp}°C`;
        document.getElementById("feelsLike").innerText = `${weatherData.main.feels_like}°C`;
        document.getElementById("humidity").innerText = `${weatherData.main.humidity}%`;
        document.getElementById("pressure").innerText = `${weatherData.main.pressure} hPa`;
        document.getElementById("windSpeed").innerText = `${weatherData.wind.speed} m/s`;
        document.getElementById("visibility").innerText = `${weatherData.visibility / 1000} km`;
        document.getElementById("condition").innerText = weatherData.weather[0].description;
        document.getElementById("sunrise").innerText = formatTime(weatherData.sys.sunrise);
        document.getElementById("sunset").innerText = formatTime(weatherData.sys.sunset);

        // Fetch 5-Day Forecast
        fetchForecast(lat, lon);

        // Update Map
        updateMap(lat, lon, name);

    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching weather data!");
    }
}

// Fetch 5-day forecast
async function fetchForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";

    // Group forecast by day
    const dailyForecast = {};
    forecastData.list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];
        if (!dailyForecast[date]) {
            dailyForecast[date] = entry;
        }
    });

    Object.values(dailyForecast).slice(0, 5).forEach((day) => {
        const forecastElement = document.createElement("div");
        forecastElement.classList.add("forecast-card");
        forecastElement.innerHTML = `
            <h3>${new Date(day.dt * 1000).toDateString()}</h3>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon">
            <p>${day.weather[0].description}</p>
            <p>Temp: ${day.main.temp_min}°C - ${day.main.temp_max}°C</p>
            <p>Humidity: ${day.main.humidity}%</p>
            <p>Wind: ${day.wind.speed} m/s</p>
        `;
        forecastContainer.appendChild(forecastElement);
    });
}

// Convert UNIX timestamp to readable time
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
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
