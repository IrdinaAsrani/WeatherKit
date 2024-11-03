const apiKey = '02d742af3cf444c5a0525828240111'; // Your WeatherAPI key
const currentWeatherUrl = 'https://api.weatherapi.com/v1/current.json';
const forecastUrl = 'https://api.weatherapi.com/v1/forecast.json'; // Corrected URL for forecast data

function fetchWeatherData(cityInput) {
  // URL encode the city input for safe usage in the API request
  const encodedCityInput = encodeURIComponent(cityInput);

  // Fetch current weather data
  fetch(`${currentWeatherUrl}?key=${apiKey}&q=${encodedCityInput}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);

      // Populate HTML elements with fetched current weather data
      document.getElementById("temp").innerHTML = data.current.temp_c + "&#176;";
      document.getElementById("conditionOutput").innerHTML = data.current.condition.text;

      const date = data.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const m = parseInt(date.substr(5, 2));
      const d = parseInt(date.substr(8, 2));
      const time = date.substr(11);

      document.getElementById("dateOutput").innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m}, ${y}`;
      document.getElementById("timeOutput").innerHTML = time;
      document.getElementById("nameOutput").innerHTML = data.location.name;

      const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
      document.getElementById("icon").src = "./icons/" + iconId;

      document.getElementById("cloudOutput").innerHTML = data.current.cloud + "%";
      document.getElementById("humidityOutput").innerHTML = data.current.humidity + "%";
      document.getElementById("windOutput").innerHTML = data.current.wind_kph + "km/h";

      let timeOfDay = data.current.is_day ? "day" : "night";
      const code = data.current.condition.code;

      // Background and button styling based on weather condition code
      const appElement = document.getElementById("app");
      const btnElement = document.getElementById("btn");

      // Set background and button styles based on the weather condition
      if (code == 1000) {
        appElement.style.backgroundImage = `url(${timeOfDay}/clear.jpg)`;
        btnElement.style.background = timeOfDay === "night" ? "#181e27" : "#e5ba92";
      } else if ([1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(code)) {
        appElement.style.backgroundImage = `url(${timeOfDay}/cloudy.jpg)`;
        btnElement.style.background = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
      } else if ([1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)) {
        appElement.style.backgroundImage = `url(${timeOfDay}/rain.jpg)`;
        btnElement.style.background = timeOfDay === "night" ? "#325c80" : "#647d75";
      } else {
        appElement.style.backgroundImage = `url(${timeOfDay}/snow.jpeg)`;
        btnElement.style.background = timeOfDay === "night" ? "#1b1b1b" : "#4d72aa";
      }

      appElement.style.opacity = "1";

      // Now fetch the 5-day forecast
      return fetch(`${forecastUrl}?key=${apiKey}&q=${encodedCityInput}&days=5`);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(forecastData => {
      console.log("Forecast data:", forecastData);

      // Display the 5-day forecast
      const forecastContainer = document.getElementById("forecast");
      forecastContainer.innerHTML = ""; // Clear previous forecasts

      forecastData.forecast.forecastday.forEach(day => {
        const forecastDayElement = document.createElement("div");
        forecastDayElement.classList.add("forecast-day");
        forecastDayElement.innerHTML = `
          <div>Date: ${day.date}</div>
          <div>Max Temp: ${day.day.maxtemp_c}°C</div>
          <div>Min Temp: ${day.day.mintemp_c}°C</div>
          <div>Condition: ${day.day.condition.text}</div>
        `;
        forecastContainer.appendChild(forecastDayElement);
      });
    })
    .catch(error => {
      console.error('Error fetching weather data:', error.message);
      alert('City not found, or an error occurred. Please try again.');
      document.getElementById("app").style.opacity = "1";
    });
}

// Example usage of fetchWeatherData with a user-provided city name
const cityInput = "London"; // Replace this with dynamic user input if needed
fetchWeatherData(cityInput);

// Utility function to get day of the week
function dayOfTheWeek(d, m, y) {
  const date = new Date(y, m - 1, d);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}
