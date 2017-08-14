console.log(Backbone)



var container = document.querySelector("#currentTemp"),
	buttonContainerNode = document.querySelector(".buttons")

// var currentWeather = function(positionObj) {
// 	var lat = positionObj.coords.latitude,
// 		long = positionObj.coords.longitude
// 	var fullUrl = baseUrl + "/" + lat + "," + long,
// 		currentPromise = $.getJSON(fullUrl)
// 	currentPromise.then(currentHTML)
// }

// var currentHTML = function(response){
// 	var htmlString = "<div class='currentTempStyles'>"
// 		htmlString += "<h2>The current temperature is </h2>"
// 		htmlString +=   "<h2>" + Math.round(response.currently.temperature) + "&deg; F</h2>"
// 		htmlString +=   "<h2>" + response.currently.summary + "</h2>"
// 		htmlString += "</div>"
// 	container.innerHTML = htmlString
// }


// var dailyWeather = function(positionObj) {
// 	var lat = positionObj.coords.latitude,
// 		long = positionObj.coords.longitude
// 	var fullUrl = baseUrl + "/" + lat + "," + long,
// 		dailyPromise = $.getJSON(fullUrl)
// 	dailyPromise.then(dailyHTML)
// }

// var dailyHTML = function(jsonData) {
// 	var daysArray = jsonData.daily.data
// 	var totalHtmlString = ''
// 	for(var i = 0; i < daysArray.length; i++){
// 		var soloDay = daysArray[i]
// 		totalHtmlString += newDayHTML(soloDay)
// 	}
// 	container.innerHTML = totalHtmlString
// }

// var newDayHTML = function(response){
// 	var timeValue = response.time
// 	var nowDate = new Date(timeValue * 1000)
// 	var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
// 	var day = days[nowDate.getDay()]
// 	var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov"]
// 	var month = months[nowDate.getMonth()]
// 	var date = nowDate.getDate()
// 	var dateString = day + ", " + month + " " + date
// 	var htmlString = "<div class='dailyTempStyles'>"
// 		htmlString +=   "<p>" + dateString + "</p>"
// 		htmlString +=   "<p>High " + Math.round(response.apparentTemperatureMax) + "&deg; F</p>"
// 		htmlString +=   "<p>Low " + Math.round(response.apparentTemperatureMin) + "&deg; F</p>"
// 		htmlString +=   "<p>" + response.summary + "</p>"
// 		htmlString += "</div>"
// 	return htmlString
// }


// var hourlyWeather = function(positionObj) {
// 	var lat = positionObj.coords.latitude,
// 		long = positionObj.coords.longitude
// 	var fullUrl = baseUrl + "/" + lat + "," + long,
// 		hourlyPromise = $.getJSON(fullUrl)
// 	hourlyPromise.then(generateHourlyHTML)
// }

// var generateHourlyHTML = function(jsonData) {
// 	var hourlyArray = jsonData.hourly.data
// 	var totalHtmlString = ''
// 	for(var i = 0; i < 9; i++){
// 		var soloHour = hourlyArray[i]
// 		totalHtmlString += generateHourHTML(soloHour)
// 	}
// 	container.innerHTML = totalHtmlString
// }

// var generateHourHTML = function(response){
// 	console.log(response)
// 	var time = response.time
// 		time = time * 1000
// 	var d = new Date(time)
// 	var hours = (d.getHours() < 12) ? "0" + d.getHours() : d.getHours()
// 	var minutes = (d.getMinutes() < 12) ? "0" + d.getMinutes() : d.getMinutes()
// 	var formattedTime = hours + ":" + minutes
// 	var htmlString = "<div class='hourlyTempStyles'>"
// 		htmlString +=   "<p>" + formattedTime + " hrs</p>"
// 		htmlString +=   "<p>" + Math.round(response.apparentTemperature) + "&deg; F</p>"
// 		htmlString +=   "<p>" + response.summary + "</p>"
// 		htmlString += "</div>"
// 	return htmlString
// }





var	STATE = {
	lat: null,
	lng: null
}

var geolocate = function() {
	// get current latitude and longitude
	// default the view type to current
	var successFunc = function(positionObject) {
		var lat = positionObject.coords.latitude,
			lng = positionObject.coords.longitude
		location.hash = lat + '/' + lng + '/current'
	}
}

var WeatherModel = Backbone.Model.extend({
	url: function(){
		return 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/96ab661803308b77c76d52c469759b92' + this.lat + '/' + this.lng
	},
	initialize: function (inputLat, inputLng){
		this.lat = inputLat
		this.lng = inputLng
	}
})

var addAllEventListeners = function() {
	var switchViewType = function(eventObj) {
		var buttonNode = eventObj.target,
			viewType = buttonNode.value
		location.hash = STATE.lat + '/' + STATE.lng + '/' + viewType
	}
	buttonContainerNode.addEventListener('click',switchViewType)
}

var WeatherRouter = Backbone.Router.extend({
	routes: {
		":lat/:long/current":"ShowCurrent",
		":lat/:long/daily":"ShowDaily",
		":lat/:long/hourly":"ShowHourly",
		"*default":"handleDefault"
	},
	ShowCurrent: function(lat, lng){
		STATE.lat = lat
		STATE.lng = lng

		var wm = new WeatherModel(lat, lng)
		wm.fetch().then(renderCurrentWeather)
	},
	ShowDaily: function(lat, lng){
		STATE.lat = lat
		STATE.lng = lng

		var wm = new WeatherModel(lat, lng)
		wm.fetch().then(renderDailyWeather)
	},

	ShowHourly: function(lat, lng){
		STATE.lat = lat
		STATE.lng = lng

		var wm = new WeatherModel(lat, lng)
		wm.fetch().then(renderHourlyWeather)
	},

	handleDefault: function(){
		geolocate()
	},
	initialize: function() {
		Backbone.history.start()
		addAllEventListeners()
	}
})

var rtr = new WeatherRouter()
