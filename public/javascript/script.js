const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const cityHide = document.querySelector('.city-hide')

function fetchAPI() {
    const APIKey = '98740f4ebc0d63bc0f8ba70090e5a091';
    const city = document.querySelector('.search-box input').value;

    if (city == '') {
        return;
    }
    fetchWeather(city);
}

const fetchWeather = async (city) => {
    try {
        const response = await fetch(`http://localhost:3001/api/getWeather?city=${city}`);
        const data = await response.json().then(json => {
            if(json.cod == '404') {
                cityHide.textContent = city;
                container.style.height = '400px';
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                error404.classList.add('active');
                return;
            }
    
            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');
            
            if(cityHide.textContent == city)
                return;
            else{
                cityHide.textContent = city;
    
                container.style.height = '555px';
                container.classList.add('active');
                weatherBox.classList.add('active');
                weatherDetails.classList.add('active');
                error404.classList.remove('active');
    
                setTimeout(() => {
                    container.classList.remove('active');
                },2500);
    
                switch (json.weather[0].main) {
                    case 'Clear':
                        image.src = '/images/clear.png';
                        break;
        
                    case 'Rain':
                        image.src = '/images/rain.png';
                        break;
        
                    case 'Snow':
                        image.src = '/images/snow.png';
                        break;
        
                    case 'Clouds':
                        image.src = '/images/cloud.png';
                        break;
        
                    case 'Mist':
                        image.src = '/images/mist.png';
                        break;
        
                    case 'Haze':
                        image.src = '/images/haze.png';
                        break;
        
                    default:
                        image.src = '/images/cloud.png'
                }
                
                temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
                description.innerHTML = `${json.weather[0].description}`;
                humidity.innerHTML = `${json.main.humidity}%`;
                wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;
    
                const infoWeather = document.querySelector('.info-weather');
                const infoHumidity = document.querySelector('.info-humidity');
                const infoWind = document.querySelector('.info-wind');
    
                const elCloneInfoWeather = infoWeather.cloneNode(true);
                const elCloneinfoHumidity = infoHumidity.cloneNode(true);
                const elCloneinfoWind = infoWind.cloneNode(true);
    
                elCloneInfoWeather.id = 'clone-info-weather';
                elCloneInfoWeather.classList.add('active-clone');
    
                elCloneinfoHumidity.id = 'clone-info-humidity';
                elCloneinfoHumidity.classList.add('active-clone');
                
                elCloneinfoWind.id = 'clone-info-wind';
                elCloneinfoWind.classList.add('active-clone');
    
                setTimeout(() => {
                    infoWeather.insertAdjacentElement("afterend", elCloneInfoWeather);
                    infoHumidity.insertAdjacentElement("afterend", elCloneinfoHumidity);
                    infoWind.insertAdjacentElement("afterend", elCloneinfoWind);
                }, 2200);
    
                const cloneInfoWeather = document.querySelectorAll('.info-weather.active-clone');
                const totalCloneInfoWeather = cloneInfoWeather.length;
                const cloneInfoWeatherFrist = cloneInfoWeather[0];
    
                const cloneInfoHumidity = document.querySelectorAll('.info-humidity.active-clone');
                const cloneInfoHumidityFrist = cloneInfoHumidity[0];
    
                const cloneInfoWind = document.querySelectorAll('.info-wind.active-clone');
                const cloneInfoWindFrist = cloneInfoWind[0];
    
                if(totalCloneInfoWeather > 0) {
                    cloneInfoWeatherFrist.classList.remove('active-clone');
                    cloneInfoHumidityFrist.classList.remove('active-clone');
                    cloneInfoWindFrist.classList.remove('active-clone');
    
                    setTimeout(() => {
                        cloneInfoWeatherFrist.remove();
                        cloneInfoHumidityFrist.remove();
                        cloneInfoWindFrist.remove();
                    }, 2200)
    
                }
            }
        })
    } catch (error) {
        console.log(error);   
    }
}