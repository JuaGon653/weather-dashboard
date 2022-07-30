var historyListEl = $('#history-list');
var cityInput = $('#city-name');
var searchBtnEl = $('#search');
var cardTitleEl = $('#card-title');
var cardTempEl = $('#card-temp');
var cardWindEl = $('#card-wind');
var cardHumidityEl = $('#card-humidity');
var cardUVIndexEl = $('#card-uv-index');
var cardDateEl = $('#card-date');
var cardIconEl = $('#card-icon');

searchBtnEl.on('click', function(event) {
    event.preventDefault();
    addToHistory();
    getWeather();
})

function addToHistory() {
    var liEl = $('<li></li>');
    liEl.html(cityInput.val());
    historyListEl.append(liEl);
}

String.prototype.replaceAt = function(index, replacement) {
        return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function getWeather() {
    var inputCityName = cityInput.eq(0).val().trim();
    var linkName = inputCityName;
    for(var i = 0; i < linkName.length; i++){
        if(linkName.charAt(i) == ' '){
            linkName = linkName.replaceAt(i+1,  linkName.charAt(i+1).toLowerCase());
            linkName = linkName.replaceAt(i, '-');
        }
    }

    // fetchs the input city's latitude and longitude from the openweather geocoding API and plugs it into the openweather one call API that uses the 
    // longitude and latitude to find the weather of the given area
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + linkName + ',USA&limit=1&appid=be494bca977f23d851a98891f453fb89')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            inputCityName = data[0].name;
            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + data[0].lat + '&lon=' + data[0].lon + '&units=imperial&appid=be494bca977f23d851a98891f453fb89')
                .then(function (response) {
                    return response.json();
                })
                .then (function (data) {
                    console.log(data);
                    showWeather(data);
                });
        });

    function showWeather(data) {
        cardTitleEl.html(inputCityName);
        cardDateEl.html(moment().format('M/D/YYYY'));
        cardIconEl.attr('src', 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png')
        cardTempEl.html(data.current.temp);
        cardWindEl.html(data.current.wind_speed);
        cardHumidityEl.html(data.current.humidity);
        cardUVIndexEl.html(data.current.uvi);
        if(data.current.uvi >= 8){
            cardUVIndexEl.css('background-color', 'red');
        } else if (data.current.uvi >= 3){
            cardUVIndexEl.css('background-color', 'yellow');
        } else {
            cardUVIndexEl.css('background-color', 'green');
        }
    }
}



