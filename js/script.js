
// desired Url format: https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
var apiKey = "96ab661803308b77c76d52c469759b92"
var baseUrl = "https://api.forecast.io/forecast/" + apiKey

var containerEl = document.querySelector("#currentTemp"),
    currentViewButton = document.querySelector(".buttons button[value='current']"),
    dailyViewButton = document.querySelector(".buttons button[value='daily']"),
    hourlyViewButton = document.querySelector(".buttons button[value='hourly']")

var currentWeather = function(positionObj) {
    var lat = positionObj.coords.latitude,
        long = positionObj.coords.longitude
    var fullUrl = baseUrl + "/" + lat + "," + long
    $.getJSON(fullUrl).then(generateCurrentHTML)
}

var generateCurrentHTML = function(response){
    var htmlString = "<div class='currentTempStyles'>"
        htmlString +=   "<h2>" + Math.round(response.currently.temperature) + "&deg; F</h2>"
        htmlString += "</div>"
    containerEl.innerHTML = htmlString
}


var dailyWeather = function(positionObj) {
    var lat = positionObj.coords.latitude,
        long = positionObj.coords.longitude
    var fullUrl = baseUrl + "/" + lat + "," + long
    $.getJSON(fullUrl).then(generateDailyHTML)
}

var generateDailyHTML = function(jsonData) {
    var daysArray = jsonData.daily.data
    var totalHtmlString = ''
    for(var i = 0; i < daysArray.length; i++){
        var soloDay = daysArray[i]
        totalHtmlString += generateDayHTML(soloDay)
    }
    containerEl.innerHTML = totalHtmlString
}

var generateDayHTML = function(response){
    var timeValue = response.time
    var nowDate = new Date(timeValue * 1000)
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    var day = days[nowDate.getDay()]
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov"]
    var month = months[nowDate.getMonth()]
    var date = nowDate.getDate()
    var dateString = day + ", " + month + " " + date
    var htmlString = "<div class='dailyTempStyles'>"
        htmlString +=   "<p>" + dateString + "</p>"
        htmlString +=   "<p>High " + Math.round(response.apparentTemperatureMax) + "&deg; F</p>"
        htmlString +=   "<p>Low " + Math.round(response.apparentTemperatureMin) + "&deg; F</p>"
        htmlString +=   "<p>" + response.summary + "</p>"
        htmlString += "</div>"
    return htmlString
}


var hourlyWeather = function(positionObj) {
    var lat = positionObj.coords.latitude,
        long = positionObj.coords.longitude
    var fullUrl = baseUrl + "/" + lat + "," + long
    $.getJSON(fullUrl).then(generateHourlyHTML)
}

var generateHourlyHTML = function(jsonData) {
    var hourlyArray = jsonData.hourly.data
    var totalHtmlString = ''
    for(var i = 0; i < 12; i++){
        var soloHour = hourlyArray[i]
        totalHtmlString += generateHourHTML(soloHour)
    }
    containerEl.innerHTML = totalHtmlString
}

var generateHourHTML = function(response){
    console.log(response)
    var time = response.time
        time = time * 1000
    var d = new Date(time)
    var hours = (d.getHours() < 8) ? "0" + d.getHours() : d.getHours()
    var minutes = (d.getMinutes() < 8) ? "0" + d.getMinutes() : d.getMinutes()
    var formattedTime = hours + ":" + minutes
    var htmlString = "<div class='hourlyTempStyles'>"
        htmlString +=   "<p>" + formattedTime + " hrs</p>"
        htmlString +=   "<p>" + Math.round(response.apparentTemperature) + "&deg; F</p>"
        htmlString +=   "<p>" + response.summary + "</p>"
        htmlString += "</div>"
    return htmlString
}


var viewChange = function(event) {
    var buttonEl = event.target
    window.location.hash = buttonEl.value
}


var controller = function() {
    var viewType = window.location.hash.substring(1)
    if (viewType === "current") {
        navigator.geolocation.getCurrentPosition(currentWeather)
    }
    else if (viewType === "daily") {
        navigator.geolocation.getCurrentPosition(dailyWeather)
    }
    else if (viewType === "hourly") {
        navigator.geolocation.getCurrentPosition(hourlyWeather)
    }
}


if (window.location.hash === '') window.location.hash = "current"
else controller()


window.addEventListener('hashchange', controller)
currentViewButton.addEventListener('click', viewChange)
dailyViewButton.addEventListener('click', viewChange)
hourlyViewButton.addEventListener('click', viewChange)