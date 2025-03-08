const apiKey = "9afd8abc3856f72416463be47783bca4"; // Replace with your OpenWeather API Key

// Automatically fetch weather for user's location
window.onload = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            },
            (error) => {
                console.error("Location access denied:", error);
                alert("Location access denied! Please search for a city manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};

// Fetch weather using coordinates
async function fetchWeatherByCoords(lat, lon) {
    try {
        const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
        const reverseGeoResponse = await fetch(reverseGeoUrl);
        const reverseGeoData = await reverseGeoResponse.json();

        if (!reverseGeoData || reverseGeoData.length === 0) {
            alert("Unable to detect city!");
            return;
        }

        const city = reverseGeoData[0].name;
        console.log(`Detected City: ${city}`);
        fetchWeather(city, lat, lon);
    } catch (error) {
        console.error("Error fetching location:", error);
    }
}

// Fetch weather by city name
async function fetchWeather(city, lat = null, lon = null) {
    try {
        if (!lat || !lon) {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            console.log("Geocoding Response:", geoData);

            if (!geoData || geoData.length === 0) {
                alert("City not found! Please enter a valid city.");
                return;
            }

            lat = geoData[0].lat;
            lon = geoData[0].lon;
        }

        console.log(`Fetching weather for ${city} at (${lat}, ${lon})`);

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        console.log("Weather Data:", weatherData);

        if (weatherData.cod !== 200) {
            alert("Error fetching weather data.");
            return;
        }

        document.getElementById("temperature").innerText = `${weatherData.main.temp}°C`;
        document.getElementById("feelsLike").innerText = `${weatherData.main.feels_like}°C`;
        document.getElementById("humidity").innerText = `${weatherData.main.humidity}%`;
        document.getElementById("pressure").innerText = `${weatherData.main.pressure} hPa`;
        document.getElementById("windSpeed").innerText = `${weatherData.wind.speed} m/s`;
        document.getElementById("visibility").innerText = `${weatherData.visibility / 1000} km`;
        document.getElementById("condition").innerText = weatherData.weather[0].description;
        document.getElementById("sunrise").innerText = formatTime(weatherData.sys.sunrise);
        document.getElementById("sunset").innerText = formatTime(weatherData.sys.sunset);

        fetchForecast(lat, lon);
        updateMap(lat, lon, city);
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

// Fetch 5-day forecast
async function fetchForecast(lat, lon) {
    try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        console.log("Forecast Data:", forecastData);

        const forecastContainer = document.getElementById("forecastContainer");
        forecastContainer.innerHTML = "";

        if (!forecastData.list || forecastData.list.length === 0) {
            forecastContainer.innerHTML = "<p>No forecast data available.</p>";
            return;
        }

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
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

// Convert UNIX timestamp to readable time
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
}

// Initialize map
var map = L.map("map").setView([20, 78], 4);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

var marker = L.marker([20, 78]).addTo(map);

// Update map location
function updateMap(lat, lon, city) {
    map.setView([lat, lon], 10);
    marker.setLatLng([lat, lon]).bindPopup(`Weather in ${city}`).openPopup();
}

// Handle city search
document.querySelector(".search-container button").addEventListener("click", function () {
    const cityInput = document.getElementById("searchInput").value.trim();
    if (cityInput) {
        fetchWeather(cityInput);
    }
});
