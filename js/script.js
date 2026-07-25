const arrayIcon = ['01d', '01n', '02d', '02n', '03d', '04d', '03n', '04n', '09d', '09n', '10d', '10n', '11d', '11n', '13d', '13n', '50d', '50n'];

const [form] = document.forms;

const cityInput = document.getElementById('location');
const locationCloseIcon = document.querySelector('.close-icon');
const container = document.querySelector('.container-weather');
const containerWeatherCloseIcon = document.querySelector('.container-weather-close');

const weatherTime = document.querySelector('.container-time h2');
const messageTimezone = document.querySelector('.container-time p');
const weatherIcon = document.querySelector('.container-icon img');
const temperature = document.querySelector('.temperature');
const country = document.querySelector('.country');
const humidity = document.querySelector('.humidity-percent');
const wind = document.querySelector('.wind-km');

const loader = document.getElementById('loader');
const staticElements = document.querySelectorAll('.static-element');

const containerError = document.getElementById('error');
const refreshButton = document.getElementById('refreshButton');


async function getWeather(value) { 

    showLoading(true);
    staticElements.forEach(e => e.classList.remove('show'));

    try {
        const response = await fetch(`/api/weather?city=${value}`);
        const data = await response.json();

        if (data.error || response.status !== 200) {
            throw new Error(data.error || `Failed to fetch data with status: ${response.status}`);
        }
        
        const timezoneOffsetSeconds = data.timezone;
        const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
        const cityLocalTime = new Date(utcTime + timezoneOffsetSeconds * 1000);
        const time = cityLocalTime.getHours().toString().padStart(2, "0") +  ":" +  cityLocalTime.getMinutes().toString().padStart(2, "0");

        setFadeContent(weatherTime, time);

        setFadeContent(messageTimezone, `${data.name} time zone`);

        const iconCode = data.weather[0].icon;
        if (arrayIcon.includes(iconCode)) {
            const iconSrc = `./img/${iconCode}.svg`;
            setFadeContent(weatherIcon, iconSrc);
        }else {
            const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            setFadeContent(weatherIcon, iconSrc);
        }

        setFadeContent(temperature, `${data.main.temp}°C`);
        setFadeContent(country, data.name);
        setFadeContent(humidity, `${data.main.humidity}%`);

        const windSpeedMS = data.wind.speed;
        const windSpeedKMH = (windSpeedMS * 3.6).toFixed(2);
        setFadeContent(wind, `${windSpeedKMH} km/h`);

        staticElements.forEach(e => e.classList.add('show'));
        containerError.classList.remove('error');

    } catch(error) {
        staticElements.forEach(e=> e.classList.remove('show'));
        closeWeatherContent();
        containerError.classList.add('error');
        console.error(error.message);
    } finally {
        showLoading(false);
    }
}

function showLoading(isLoading) {
    if (isLoading) {
        loader.style.display = 'block';
    } else {
        loader.style.display = 'none';
    }
}

function setFadeContent(element, content){
    element.classList.remove('show');
    if(element.nodeName !== 'IMG'){
        element.textContent = content;
    }else {
        element.src = content;
    }
    requestAnimationFrame(() => { element.classList.add('show') });
}

function inputFunction(e){
    if(e.target.value === ''){
        locationCloseIcon.classList.remove('active');
        containerWeatherCloseIcon.classList.add('active');
    }else {
        locationCloseIcon.classList.add('active');
        containerWeatherCloseIcon.classList.remove('active');
    }
}

function clickInputClose(e) {
    cityInput.value = '';
    e.target.classList.remove('active');
    containerWeatherCloseIcon.classList.add('active');
}

function weatherCloseIcon() {
    container.classList.remove('open');
    container.classList.add('close');
    closeWeatherContent();
}

function formSubmit(e) {
    e.preventDefault();
    const {location} = e.target;
    closeWeatherContent();
    getWeather(location.value.trim());
    container.classList.add('open');
    container.classList.remove('close');
}

function closeWeatherContent(){
    weatherTime.textContent = '';
    messageTimezone.textContent = '';
    weatherIcon.src = '';
    temperature.textContent = '';
    country.textContent = '';
    humidity.textContent = '';
    wind.textContent = '';
}

function refresh() {
    cityInput.value = 'Yerevan';
    locationCloseIcon.classList.add('active');
    containerWeatherCloseIcon.classList.remove('active');
    closeWeatherContent();
    getWeather(cityInput.value.trim());
}

refreshButton.addEventListener('click', refresh);

cityInput.addEventListener('input', inputFunction);

locationCloseIcon.addEventListener('click', clickInputClose);

containerWeatherCloseIcon.addEventListener('click', weatherCloseIcon);

form.addEventListener('submit', formSubmit);

getWeather(cityInput.value.trim());