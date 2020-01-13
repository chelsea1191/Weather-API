const weatherAPI = "http://api.openweathermap.org/data/2.5/weather?"
const forecastAPI = "http://api.openweathermap.org/data/2.5/forecast?"
const APIkey = "APPID=1a1644cb3b6b6e3bedf9f2e2f345f4cd"

const button = document.getElementById("content");
const input = document.getElementById("text");


function selector(event) { //select query using radio
  //console.log("made it to selector")
  if (event.target.classList.contains("radio")) {
    document.getElementById("text").placeholder = event.target.id;
    input.value = ""; //reset
  }
}

function loadData(event) {
  //console.log("made it to loadData")
  event.preventDefault();
  let item;
  const info = document.querySelector("#information"); //might need to do getElementById

  if(input.placeholder === "Zip") {
    console.log("clicked zipcode")
    item = `zip=${input.value},us&units=imperial&`; //assume US
  }
  if(input.placeholder === "City") {
    //console.log("clicked city")
    item = `q=${input.value}&units=imperial&`
  }
  if(input.placeholder === "Longitude, Latitude") {
    //console.log("clicked lat/long")
    item = `lat=${value[0]}&lon=${value[1]}&units=imperial&`
  }

  const arrayOfDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

  axios.all([weatherAPI + item + APIkey, forecastAPI + item + APIkey].map(item => axios.get(item))).then(axios.spread(function(weatherRaw, forecastRaw) {
    let weather = weatherRaw.data;
    let forecast = forecastRaw.data;
    //console.log(typeof forecast)


    function displayForecast(forecast) {
      return forecast.list.filter((elem, i) => i % 8 === 0).map((item) => {
        //
        let date = new Date(item.dt * 1000)
        const dayOfWeek = date.getDay()
        return `
            <div class='col-2 mx-auto container'>
                        <h4 class='mx-auto'>${arrayOfDays[dayOfWeek]}</h4>
                        <p><img class='mx-auto' src='http://openweathermap.org/img/wn/${item.weather[0].icon}.png'></p>
                        <p><h5>Min: ${item.main.temp_min.toFixed(1)}&degF</h5></p>
                        <p><h5>Max: ${item.main.temp_max.toFixed(1)}&degF</h5></p>
                    </div>
        `
      }).join("");
    }

    displayForecast(forecast);
    let currentDateAndTime = new Date();
    let hour = getHoursWithLeadingZeros(currentDateAndTime)
    //let minute = currentDateAndTime.getMinutes()
    function getHoursWithLeadingZeros (currentDateAndTime) {
      return (currentDateAndTime.getHours() < 10 ? "0" : "") + currentDateAndTime.getHours()
    }
    function getMinutesWithLeadingZeros(currentDateAndTime) {
      return (currentDateAndTime.getMinutes() < 10 ? "0" : "") + currentDateAndTime.getMinutes()
    }
    let minute = getMinutesWithLeadingZeros(currentDateAndTime)
    let day = currentDateAndTime.getDay();
    //console.log(arrayOfDays[day])
    //console.log(currentDateAndTime)

    let html = `
    <div>
    <div class="display">
    <div class='row' form-inline>
      <div><h3 class="display-4">Current Weather in: ${weather.name}</h3></div>
      <hr class="my-4">
      <div><p class="lead">As of: ${arrayOfDays[day]} ${hour}:${minute}</p></div>
    </div>
    <div class='row form-inline'>
        <div class='col-7'><h1><img src='http://openweathermap.org/img/wn/${weather.weather[0].icon}.png'>${weather.main.temp}&degF</h1></div>
        <div class='col-4'>
            <p>
                <h5>Condition: ${weather.weather[0].description}</h5>
                <h5>Feels Like: ${weather.main.feels_like.toFixed(1)}&degF</h5>
                <h5>Today's Low: ${weather.main.temp_min.toFixed(1)}&degF</h5>
                <h5>Today's High: ${weather.main.temp_max.toFixed(1)}&degF</h5>
            </p>
        </div>
    </div>
    </div>
    <div class="displayForecast">
    <div class='row form-inline'>
        <h2 class='col-7'>5-day Forecast:</h2>
    </div>
    <div class='row'>
        ${displayForecast(forecast)}
    </div>
    </div>
    </div>
        `
    info.innerHTML = html
}))

input.value = ''
}

button.addEventListener('click', selector)
button.addEventListener('submit', loadData)
