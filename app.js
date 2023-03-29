
const url = "https://api.openweathermap.org/data/2.5/onecall?"

const appKey = "b24405e11d45ba218fa8ba7a0f532e4f";

var results = [];

var additionalInfos = document.getElementsByClassName("additional-infos")[0];
let currentSection = document.getElementsByClassName("current-section")[0];

var links = document.getElementsByClassName("link");
for (let i = 0; i < links.length; i++) {
    const link = links[i];
    link.addEventListener("click", () => {
        for (let j = 0; j < links.length; j++) {
            links[j].style.opacity = "0.3";
        }
        link.style.opacity = "1";
        link.style.transition = "all ease 0.6s"
    })
}
setTimeout(() => {
    fetch(`${url}lat=33.44&lon=-94.04&appid=${appKey}&units=metric`).
        then((response) => {
            if (response.ok) {
                requestSuccess = true;
            }
            return response.json();
        }).
        then((data) => {
            results = data;
            let timezone = data.timezone;
            let { temp, dt, humidity, wind_speed, weather } = data.current;
            let date = new Date();
            date.setTime(dt * 1000);

            let { description, icon } = weather[0];
            currentSection.innerHTML = `<div class="gen-infos">
            <h1 class="city">${timezone} </h1>
            <h4 class="date">${date.toDateString()}</h4>
            <img class="current-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-icon">
            <p class="description">${description} </p>
        </div>
        <div class="temp-infos">
            <p class="temp">${temp}°</p>
            <p class="temps"><span class="humidity">${humidity}%</span> | <span class="wind">${wind_speed}Km/h</span></p>
        </div>`
        }).catch((err) => {
            throw new Error(err)
        });
}, 2500)
// when the page loads (initial render)
currentSection.innerHTML = `<h1 class="loading">LOADING...</h1>`

const ConvertDay = (dayNum) => { // days dictionnary
    switch (dayNum) {
        case 0:
            return "Sat"
            break;
        case 1:
            return "Sun"
            break
        case 2:
            return "Mon"
            break
        case 3:
            return "Tue"
            break
        case 4:
            return "Wed"
            break
        case 5:
            return "Thu"
            break
        case 6:
            return "Fri"
            break
        default:
            break;
    }
}

/* ************************************** */

// handling the "submit" (search) event
document.querySelector(".search-section").addEventListener("submit", (event) => {
    additionalInfos.innerHTML = "";
    event.preventDefault();
    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        element.style.opacity = "0.3"
    }
    let longitude = document.getElementById("longitude-search-field").value;
    let latitude = document.getElementById("latitude-search-field").value;
    fetch(`${url}lat=${latitude}&lon=${longitude}&appid=${appKey}&units=metric`).
        then((response) => {
            if (response.ok) {
                requestSuccess = true;
            }
            return response.json();
        }).
        then((data) => { // the heavy lifting goes here...
            results = data;
            let timezone = data.timezone;
            let { temp, dt, humidity, wind_speed, weather } = data.current;
            let date = new Date();
            date.setTime(dt * 1000);

            let { description, icon } = weather[0];
            currentSection.innerHTML = `<div class="gen-infos">
                <h1 class="city">${timezone} </h1>
                <h4 class="date">${date.toDateString()}</h4>
                <img class="current-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-icon">
                <p class="description">${description} </p>
            </div>
            <div class="temp-infos">
                <p class="temp">${temp}°</p>
                <p class="temps"><span class="humidity">${humidity}%</span> | <span class="wind">${wind_speed}Km/h</span></p>
            </div>`
        }).catch((err) => {
            throw new Error(err)
        })
})

/* ************************************** */

// displaying the "hourly" infos
document.querySelector(".hourly").addEventListener("click", () => {


    additionalInfos.innerHTML = "";
    additionalInfos.style.display = "flex";
    for (let i = 0; i < 8; i++) {
        let { dt, temp, weather } = results.hourly[i];
        let { icon, description } = weather[0];
        var item = document.createElement("div");
        item.className = "hourly-item";
        let d = new Date();
        d.setTime(dt * 1000);
        let hour = d.getHours();

        item.innerHTML = `<p class="hour">${hour}${hour >= 12 ? "PM" : "AM"} </p>
            <img class="icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-icon" />
            <p class="desc">${description}</p>
            <p class="tmp">${temp}°</p>`;
        additionalInfos.appendChild(item);
    }
});

/* ************************************** */

//displaying the "daily" infos
document.querySelector(".daily").addEventListener("click", () => {

    additionalInfos.innerHTML = "";
    additionalInfos.style.display = "flex";
    for (let i = 0; i < results.daily.length; i++) {
        let { dt, sunrise, sunset, temp, weather } = results.daily[i];
        let { day, night } = temp;
        let { icon } = weather[0];

        var item = document.createElement("div");
        item.className = "daily-item";

        let d = new Date();
        d.setTime(dt * 1000);
        let dayName = ConvertDay(d.getDay());

        let sr = new Date();
        sr.setTime(sunrise * 1000);
        sunrise_hr = sr.getHours()
        sunrise_mn = sr.getMinutes();

        let ss = new Date();
        ss.setTime(sunset * 1000);
        sunset_hr = ss.getHours();
        sunset_mn = ss.getMinutes();

        item.innerHTML = `<img class="icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-icon" />
        <p class="day">${dayName} </p>
        <p>Day : ${day}° </p>
        <p>Night : ${night}° </p>
        <p>Sunrise : ${sunrise_hr}:${sunrise_mn}AM </p>
        <p>Sunset : ${sunset_hr}:${sunset_mn}PM</p>
        <button class="btn-details">Details</button>`;

        additionalInfos.appendChild(item);
    }

    // daily details section 
    let detailsBtns = document.getElementsByClassName("btn-details");
    for (let i = 0; i < detailsBtns.length; i++) {
        detailsBtns[i].addEventListener("click", () => {

            additionalInfos.style.display = "unset";
            additionalInfos.innerHTML = "";
            let info = results.daily[i];
            // destructuring the info object
            let { min, max, morn, eve } = info.temp;
            let { pressure, humidity, wind_speed, uvi, weather } = info;
            let { icon, description } = weather[0];
            var detailsSection = document.createElement("div");
            detailsSection.className = "details-section";
            detailsSection.innerHTML = `<div class="temp-section">
                <p>max-tempurature : ${max}°C </p>
                <p>min-tempurature : ${min}°C</p>
                <p>evening : ${eve}°C</p>
                <p>morning : ${morn}°C</p>
            </div>
            <div class="other-infos">
                <p>pressure : ${pressure}hPa</p>
                <p>humidity : ${humidity}%</p>
                <p>wind_speed : ${wind_speed}Km/h</p>
                <p>UV index : ${uvi}</p>
            </div>
            <div class="weather">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-icon" />
                <p>${description}</p>
            </div>` ;
            additionalInfos.appendChild(detailsSection);
        })
    }
})


/* ***********************************/
// turning on the location services
document.querySelector(".location-btn").addEventListener("click", () => {
    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        element.style.opacity = "0.3"
    }
    additionalInfos.innerHTML = "";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => { // if success
                let longitude = position.coords.longitude;
                let latitude = position.coords.latitude;
                fetch(`${url}lat=${latitude}&lon=${longitude}&appid=${appKey}&units=metric`).
                    then((response) => response.json()).
                    then((data) => {
                        results = data;
                        let timezone = data.timezone;
                        let { temp, dt, humidity, wind_speed, weather } = data.current;
                        let date = new Date();
                        date.setTime(dt * 1000);

                        let { description, icon } = weather[0];
                        currentSection.innerHTML = `<div class="gen-infos">
                            <h1 class="city">${timezone} </h1>
                            <h4 class="date">${date.toDateString()}</h4>
                            <img class="current-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-icon">
                            <p class="description">${description} </p>
                         </div>
                        <div class="temp-infos">
                            <p class="temp">${temp}°</p>
                            <p class="temps"><span class="humidity">${humidity}%</span> | <span class="wind">${wind_speed}Km/h</span></p>
                        </div>`;
                    }).catch(err => {
                        throw new Error(err)
                    })
            },
            err => { //if failure
                throw new Error(err);
            }
        )
    }
    else {
        alert("err : location services are not supported by this browser!")
    }
})

/* *****************************************/

// displaying the details section
document.querySelector(".details").addEventListener("click", () => {

    additionalInfos.innerHTML = "";
    let alert = document.createElement("h4");
    alert.className = "alert";
    alert.innerText = "No available alerts to show.";
    additionalInfos.appendChild(alert);
});


