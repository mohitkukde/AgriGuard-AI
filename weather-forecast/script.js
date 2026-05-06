const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');

const location_not_found = document.querySelector('.location-not-found');

const weather_body = document.querySelector('.weather-body');

/* ✅ ADDED: crop input */
const cropInput = document.getElementById("crop");


async function checkWeather(city){
    const api_key = "4c4286de4f6a3794841e570fd8bc4a0b";

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`;

    const weather_data = await fetch(`${url}`).then(response => response.json());

    if(weather_data.cod === `404`){
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        console.log("error");
        return;
    }

    location_not_found.style.display = "none";
    weather_body.style.display = "flex";

    const current = weather_data.list[0];

    temperature.innerHTML = `${Math.round(current.main.temp - 273.15)}°C`;
    description.innerHTML = `${current.weather[0].description}`;

    humidity.innerHTML = `${current.main.humidity}%`;
    wind_speed.innerHTML = `${current.wind.speed}Km/H`;

    switch(current.weather[0].main){
        case 'Clouds':
            weather_img.src = "img/cloud.png";
            break;
        case 'Clear':
            weather_img.src = "img/clear-sky.png";
            break;
        case 'Rain':
            weather_img.src = "img/rain.png";
            break;
        case 'Haze':
            weather_img.src = "img/haze.png";
            break;
        case 'Lightning':
            weather_img.src = "img/lightning.png";
            break;
        case 'Snow':
            weather_img.src = "img/snow.png";
            break;
        case 'Storm':
            weather_img.src = "img/storm.png";
            break;
        case 'Thunderstorm':
            weather_img.src = "img/thunderstorm.png";
            break;
        case 'Mist':
            weather_img.src = "img/mist.png";
            break;
    }

    // forecast (existing)
    const forecastContainer = document.getElementById("forecast");

    if (forecastContainer) {
        forecastContainer.innerHTML = "";

        for (let i = 8; i <= 24; i += 8) {
            const day = weather_data.list[i];

            const temp = Math.round(day.main.temp - 273.15);
            const wind = day.wind.speed;

            const div = document.createElement("div");

            div.innerHTML = `
                <p><b>Day ${i/8}</b></p>
                <p>Temp: ${temp}°C</p>
                <p>Wind: ${wind} Km/H</p>
                <hr>
            `;

            forecastContainer.appendChild(div);
        }
    }

    /* ✅ ADDED: CROP RISK LOGIC */
    const crop = cropInput.value.toLowerCase();

    let risk = "";
    let cropAdvice = "";

    const tempVal = current.main.temp - 273.15;
    const humidityVal = current.main.humidity;

    if (crop === "rice") {
        if (tempVal > 35) {
            risk = "High Risk";
            cropAdvice = "Increase irrigation for rice";
        } else {
            risk = "Low Risk";
            cropAdvice = "Good condition for rice";
        }
    }
    else if (crop === "wheat") {
        if (humidityVal > 80) {
            risk = "Medium Risk";
            cropAdvice = "High humidity may cause fungal disease";
        } else {
            risk = "Low Risk";
            cropAdvice = "Good condition for wheat";
        }
    }
    else if (crop === "maize") {
        if (tempVal > 32) {
            risk = "Medium Risk";
            cropAdvice = "Ensure proper watering for maize";
        } else {
            risk = "Low Risk";
            cropAdvice = "Suitable condition for maize";
        }
    }
    else {
        risk = "Unknown";
        cropAdvice = "Crop data not available";
    }

    const riskBox = document.getElementById("risk");

    if (riskBox) {
        riskBox.innerHTML = `
            <h3>Risk: ${risk}</h3>
            <p>${cropAdvice}</p>
        `;
    }
    /* ✅ END ADD */

    console.log(weather_data);
}


searchBtn.addEventListener('click', ()=>{
    checkWeather(inputBox.value);
});