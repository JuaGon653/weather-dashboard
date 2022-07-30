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
var dayListEl = $('#day-list');
var historyItemEl;
var historyArray = [];
var linkName;

if(JSON.parse(localStorage.getItem('history')) != null){
    historyArray = JSON.parse(localStorage.getItem('history'));
    for(var i = 0; i < historyArray.length; i = i + 2){
        var liEl = $('<li class="history-item" id="' + historyArray[i+1] + '"></li>');
        liEl.html(historyArray[i]);
        historyListEl.append(liEl);
        historyItemEl = $('.history-item');
    }
}



searchBtnEl.on('click', function(event) {
    event.preventDefault();
    getWeather(cityInput.eq(0).val().trim());
    addToHistory(cityInput.val().trim());
    cityInput.val('');
})
historyItemEl.on('click', function(event) {
        event.preventDefault();
        getWeather(this.id);
})

function addToHistory(name) {
    var liEl = $('<li class="history-item" id="' + linkName + '"></li>');
    liEl.html(name);

    if(historyArray.includes(name)){
        return;
    } else {
        historyListEl.append(liEl);
        historyItemEl = $('.history-item');
        historyArray.push(name);
        historyArray.push(linkName);
        localStorage.setItem('history', JSON.stringify(historyArray));
    }
}



String.prototype.replaceAt = function(index, replacement) {
        return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function getWeather(inputCityName) {
    linkName = inputCityName;
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
                    showFutureWeather(data);
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

    function showFutureWeather(data) {
        dayListEl.html('');
        for(var i = 1; i < 6; i++){
            var liEl = $('<li id="a-future-day"></li>');
            var date = data.daily[i].sunset;
            liEl.append('<h2>' + moment(date, 'X').format('M/D/YYYY') + '</h2>')
            liEl.append('<img id="five-icon" src="http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png">')
            liEl.append('<h3>Temp: ' + data.daily[i].temp.day + '<span>&#8457;</span></h3>')
            liEl.append('<h3>Wind: ' + data.daily[i].wind_speed + ' MPH</h3>')
            liEl.append('<h3>Humidity: ' + data.daily[i].humidity + '%</h3>')
            dayListEl.append(liEl);
        }
        $('.custom-col').css('height', 'fit-content');
    }
}



