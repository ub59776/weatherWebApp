
    const apiKey = 'a5bb4718b30b6f58f58697997567fffa'; 

    const userLocation = document.getElementById('userLocation');
    const temperature = document.querySelector('.temperature');
    const feelsLike = document.querySelector('.feelsLike');
    const description = document.getElementById('desrciption');
    const date = document.querySelector('.date');
    const city = document.querySelector('.city');
    const humidity = document.getElementById('HValue');
    const windSpeed = document.getElementById('WValue');
    const sunrise = document.getElementById('SRValue');
    const sunset = document.getElementById('SSValue');
    const clouds = document.getElementById('CValue');
    const uvIndex = document.getElementById('UVValue');
    const pressure = document.getElementById('PValue');
    const weatherIcon = document.querySelector('.weatherIcon');
    const forecast = document.querySelector('.forecast');
    const converter = document.getElementById('converter');

    const WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=`;
    const WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}&exclude=minutely&units=metric&`;


    function findUserLocation() {
        forecast.innerHTML="";
        const location = userLocation.value.trim();
        if (location) {
            fetch(WEATHER_API_ENDPOINT + location)
                .then(response => response.json())
                .then(data => {
                    if (data.cod !== 200) {
                        alert(data.message);
                        return;
                    }
                     console.log(data);
                    city.innerHTML = `${data.name}, ${data.sys.country}`;
                    weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
                    fetchWeatherData(data.coord.lat, data.coord.lon);
                })
                .catch(error => {
                    alert(error.message);
                });
        } else {
            alert('Please enter a location');
        }
    }

    function fetchWeatherData(lat, lon) {
        const apiUrl = `${WEATHER_DATA_ENDPOINT}lat=${lat}&lon=${lon}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                updateWeatherUI(data);
            })
            .catch(error => {
                alert(error.message);
            });
    }

    function updateWeatherUI(data) {
        const temp = data.current.temp;
        const feels_like = data.current.feels_like;
        const weatherDescription = data.current.weather[0].description;
        const humidityValue = data.current.humidity;
        const windSpeedValue = data.current.wind_speed;
        const cloudsValue = data.current.clouds;
        const pressureValue = data.current.pressure;
        const uvIndexValue = data.current.uvi;

        temperature.innerHTML = TempConverter(data.current.temp);
        feelsLike.textContent = `Feels like: ${feels_like}°`;
        description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;${weatherDescription}`;

       
        const options={
            weekday:"long",
            month:"long",
            day:"numeric",
            hour:"numeric",
            minute:"numeric",
            second:"numeric",
            hour12:true,
        }

        date.innerHTML = getLongFormatDateTime(
            data.current.dt,
            data.timezone_offset,
            options
        );
        


        humidity.innerHTML = `${humidityValue}<span>%</span>`;
        windSpeed.innerHTML = `${windSpeedValue}<span>m/s</span>`;
        const options1={
            hour:"numeric",
            minute:"numeric",
            hour12:true,
        }
        sunrise.textContent = getLongFormatDateTime(data.current.sunrise,data.timezone_offset,options1);
        sunset.textContent = getLongFormatDateTime(data.current.sunset,data.timezone_offset,options1);
        clouds.innerHTML = `${cloudsValue}<span>%</span>`;
        uvIndex.textContent = uvIndexValue;
        pressure.innerHTML = `${pressureValue}<span>hPa</span>`;

        data.daily.forEach((weather) => {
            let div=document.createElement("div");
            const options={
                weekday:"long",
                month:"long",
                day:"numeric",
            };

            let daily=getLongFormatDateTime(weather.dt,0,options).split(" at ");
            div.innerHTML=daily[0];
            div.innerHTML+=`<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">`
            div.innerHTML+=`<p class="forecast-desc">${weather.weather[0].description}</p>`
            div.innerHTML+=`<span><span>${TempConverter(
                weather.temp.max
            )}</span>&nbsp<span>${TempConverter(
                weather.temp.min
            )}</span></span>`;

            forecast.append(div);
        });

        function formatUnixTime(dtValue,offSet,options={}){
            const date=new Date((dtValue+offSet)*1000);
            return date.toLocaleTimeString([],{timeZone:"UTC",...options});
        }

        function getLongFormatDateTime(dtValue,offSet,options){
            return formatUnixTime(dtValue,offSet,options);
        }

        function TempConverter(temp){
            let tempValue=Math.round(temp);
            let message="";
            if(converter.value=="°C"){
                message=tempValue+"<span>"+"\xB0C</span>";    
            }
            else{
                let ctof=(tempValue*9)/5+32;
                message=ctof+"<span>"+"\xB0F</span>";
            }
            return message;
        }
    }

    window.onload = function() {
        userLocation.value = "Visakhapatnam";
        findUserLocation();
    };