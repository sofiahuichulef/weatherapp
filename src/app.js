// This file contains the JavaScript code for the application. It handles user input, fetches weather data from the Open-Meteo API, and updates the HTML to display the weather information.

const apiKey = 'YOUR_API_KEY'; // Replace with your Open-Meteo API key
const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = cityInput.value;
    if (city) {
        await fetchWeatherData(city);
    }
});

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current_weather=true`);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherDisplay.innerHTML = 'Error fetching weather data. Please try again.';
    }
}

function displayWeather(data) {
    const weather = data.current_weather;
    weatherDisplay.innerHTML = `
        <h2>Weather in ${data.city}</h2>
        <p>Temperature: ${weather.temperature}°C</p>
        <p>Condition: ${weather.weathercode}</p>
    `;
}