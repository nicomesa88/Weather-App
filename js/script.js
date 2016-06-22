console.log(Backbone)

// desired Url format: https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
var apiKey = "96ab661803308b77c76d52c469759b92"
var baseUrl = "https://api.forecast.io/forecast/" + apiKey


var container = document.querySelector("#currentTemp"),
	currentViewButton = document.querySelector(".buttons button[value='current']"),
	dailyViewButton = document.querySelector(".buttons button[value='daily']"),
	hourlyViewButton = document.querySelector(".buttons button[value='hourly']")

var currentWeather = function(positionObj) {
	var lat = positionObj.coords.latitude,
		lng = positionObj.coords.longitude
	var fullUrl = baseUrl + "/" + lat + "," + lng,
		currentPromise = $.getJSON(fullUrl)
	currentPromise.then(currentHTML)
}

var currentHTML = function(response){
	var htmlString = "<div class='currentTempStyles'>"
		htmlString += "<h2>The current temperature is </h2>"
		htmlString +=   "<h2>" + Math.round(response.currently.temperature) + "&deg; F</h2>"
		htmlString +=   "<h2>" + response.currently.summary + "</h2>"
		htmlString += "</div>"
	container.innerHTML = htmlString
}


var dailyWeather = function(positionObj) {
	var lat = positionObj.coords.latitude,
		lng = positionObj.coords.longitude
	var fullUrl = baseUrl + "/" + lat + "," + lng,
		dailyPromise = $.getJSON(fullUrl)
	dailyPromise.then(dailyHTML)
}

var dailyHTML = function(jsonData) {
	var daysArray = jsonData.daily.data
	var totalHtmlString = ''
	for(var i = 0; i < daysArray.length; i++){
		var soloDay = daysArray[i]
		totalHtmlString += newDayHTML(soloDay)
	}
	container.innerHTML = totalHtmlString
}

var newDayHTML = function(response){
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
		lng = positionObj.coords.longitude
	var fullUrl = baseUrl + "/" + lat + "," + lng,
		hourlyPromise = $.getJSON(fullUrl)
	hourlyPromise.then(generateHourlyHTML)
}

var generateHourlyHTML = function(jsonData) {
	var hourlyArray = jsonData.hourly.data
	var totalHtmlString = ''
	for(var i = 0; i < 9; i++){
		var soloHour = hourlyArray[i]
		totalHtmlString += generateHourHTML(soloHour)
	}
	container.innerHTML = totalHtmlString
}

var generateHourHTML = function(response){
	console.log(response)
	var time = response.time
		time = time * 1000
	var d = new Date(time)
	var hours = (d.getHours() < 12) ? "0" + d.getHours() : d.getHours()
	var minutes = (d.getMinutes() < 12) ? "0" + d.getMinutes() : d.getMinutes()
	var formattedTime = hours + ":" + minutes
	var htmlString = "<div class='hourlyTempStyles'>"
		htmlString +=   "<p>" + formattedTime + " hrs</p>"
		htmlString +=   "<p>" + Math.round(response.apparentTemperature) + "&deg; F</p>"
		htmlString +=   "<p>" + response.summary + "</p>"
		htmlString += "</div>"
	return htmlString
}


var viewChange = function(event) {
	var buttonPress = event.target
	window.location.hash = buttonPress.value
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


if (window.location.hash === ''){ window.location.hash = "current"
}
controller()


window.addEventListener('hashchange', controller)
currentViewButton.addEventListener('click', viewChange)
dailyViewButton.addEventListener('click', viewChange)
hourlyViewButton.addEventListener('click', viewChange)

var WeatherRouter = Backbone.Router.extend({
	routes: {
		":lat/:lng/current":"ShowCurrent",
		":lat/:lng/daily":"ShowDaily",
		":lat/:lng/hourly":"ShowHourly",
		"*default":"redirectToHome",
		"home": "showHomePage"
	},

	showHomePage: function() {
		renderCurrentView()
	},

	// redirectToHome: function () {
	// 	location.hash = "home"
	// },

	ShowCurrent: function(lat, lng){
		console.log("checking on current route")
		currentWeather(lat, lng).then(currentHTML)
	},

	ShowDaily: function(lat, lng){

	},

	ShowHourly: function(lat, lng){

	}
})

// var rtr = new WeatherRouter()
// Backbone.history.start()