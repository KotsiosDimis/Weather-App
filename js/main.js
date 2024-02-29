document.addEventListener("DOMContentLoaded", function () {
    const citySelect = document.getElementById('city-select');
    const weatherDataDiv = document.getElementById('weather-data');

    // Fetching cities from CSV 
    fetch('city_coordinates.csv')
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n');
            // Skip the first line as it contains headers
            for (let i = 1; i < lines.length; i++) {
                const [latitude, longitude, city, country] = lines[i].split(',');
                const option = document.createElement('option');
                option.value = latitude.trim() + '|' + longitude.trim(); // Store latitude and longitude together
                option.textContent = city.trim() + ', ' + country.trim();
                citySelect.appendChild(option);
            }
        })
        .catch(error => console.error('Error fetching cities:', error));

    // Event listener for dropdown change
    citySelect.addEventListener('change', function () {
        const selectedOption = this.value;
        if (selectedOption) {
            const [latitude, longitude] = selectedOption.split('|');
            weatherDataDiv.textContent = `Fetching weather data...`;
            fetchWeather(latitude, longitude);
        } else {
            weatherDataDiv.textContent = ''; // Clear weather data if no city selected
        }
    });

    // Function to fetch weather data based on selected city
    function fetchWeather(latitude, longitude) {
        const apiUrl = `http://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=civillight&output=json`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Process the weather data
                displayWeatherData(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherDataDiv.textContent = 'Error fetching weather data';
            });
    }

    // Function to display weather data on the webpage
    function displayWeatherData(weatherData) {
        // Clear previous weather data
        weatherDataDiv.innerHTML = '';

        // Loop through the forecast data for today and the next six days
        for (let i = 0; i < 7; i++) {
            const forecast = weatherData.dataseries[i];
            const date = new Date(forecast.date);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            const temperature = forecast.temp2m.max + '°C / ' + forecast.temp2m.min + '°C';
            const weatherDescription = forecast.weather;
            const windSpeed = forecast.wind10m_max + ' m/s';
            const weatherImage = getWeatherImage(weatherDescription); // Get the image path for the weather description

            // Create a div for each day's weather information
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('weather-day');

            // Create HTML elements to display weather information for each day
            const dayElement = document.createElement('p');
            dayElement.textContent = day;

            const temperatureElement = document.createElement('p');
            temperatureElement.textContent = 'Temperature: ' + temperature;

            const weatherImageElement = document.createElement('img');
            weatherImageElement.src = weatherImage; // Set the src attribute to the weather image path
            weatherImageElement.alt = weatherDescription; // Set the alt attribute for accessibility

            const weatherDescriptionElement = document.createElement('p');
            weatherDescriptionElement.textContent = 'Weather: ' + weatherDescription;

            

            const windSpeedElement = document.createElement('p');
            windSpeedElement.textContent = 'Wind Speed: ' + windSpeed;

            // Append weather information for each day to the dayDiv
            dayDiv.appendChild(dayElement);
            dayDiv.appendChild(temperatureElement);
            dayDiv.appendChild(weatherDescriptionElement);
            dayDiv.appendChild(windSpeedElement);
            dayDiv.appendChild(weatherImageElement);


            // Append the dayDiv to the weatherDataDiv
            weatherDataDiv.appendChild(dayDiv);
        }
    }

    // Function to get the image path based on weather description
    function getWeatherImage(weatherDescription) {
        // Construct the image filename based on the weather description
        const imageName = weatherDescription.toLowerCase() + '.png';
        // Return the path to the corresponding image
        return 'images/' + imageName;
    }


    /*
    function getWeatherImage(weatherDescription) {
        switch (weatherDescription) {
            case 'clear':
                return 'images/clear.png';
            case 'fog':
                return 'images/fog.png';
            case 'rain':
                return 'images/rain.png';
            // Add more cases for other weather descriptions if needed
            default:
                return 'images/default.png'; // Default image for unknown weather descriptions
        }
    }
    */
});

